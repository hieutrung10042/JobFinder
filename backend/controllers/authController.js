// ================= IMPORT =================
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

// ================= RATE LIMIT =================
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

// ================= REGISTER =================
exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { name, username, email, password, role } = req.body;

  const finalName = name || username;

  if (!finalName) {
    return res.status(400).json({
      success: false,
      message: "Tên không được để trống!",
    });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const [userResult] = await db.execute(
      `
      INSERT INTO Users
      (
        username,
        email,
        password,
        role,
        otp_code,
        otp_expires,
        is_verified
      )
      VALUES (?, ?, ?, ?, ?, ?, 0)
      `,
      [
        finalName,
        email,
        hashedPassword,
        role || "candidate",
        otp,
        otpExpires,
      ]
    );

    const userId = userResult.insertId;

    if (role === "employer") {
      await db.execute(
        "INSERT INTO Companies (name) VALUES (?)",
        [`Công ty của ${finalName}`]
      );
    } else {
      await db.execute(
        `
        INSERT INTO Profiles
        (user_id, full_name)
        VALUES (?, ?)
        `,
        [userId, finalName]
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"JobSpot" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Xác thực tài khoản mới",
      text: `Chào ${finalName}, mã xác thực của bạn là: ${otp}`,
    });

    res.status(201).json({
      success: true,
      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.",
    });

  } catch (error) {

    console.error("Lỗi Register:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {

  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ email và mật khẩu!",
    });
  }

  try {

    const [users] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    const user = users[0];

    if (role && user.role !== role) {

      const roleName =
        user.role === "employer"
          ? "Nhà tuyển dụng (Employer)"
          : "Ứng viên (Candidate)";

      return res.status(403).json({
        success: false,
        message: `Sai cổng đăng nhập! Tài khoản này là của ${roleName}.`,
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không chính xác!",
      });
    }

    if (user.is_verified === 0) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản chưa xác thực email!",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const [profiles] = await db.query(
      `
      SELECT
        id,
        full_name,
        title,
        location,
        bio,
        cv_url
      FROM Profiles
      WHERE user_id = ?
      `,
      [userId]
    );

    if (profiles.length === 0) {
      return res.json({
        success: true,
        profile: null,
        experience: [],
        skills: [],
      });
    }

    const profile = profiles[0];

    const [experience] = await db.query(
      `
      SELECT
        company_name as company,
        position as role,
        description,
        start_date,
        end_date
      FROM Work_Experience
      WHERE profile_id = ?
      `,
      [profile.id]
    );

    const [skillsRows] = await db.query(
      `
      SELECT s.name
      FROM User_Skills us
      JOIN Skills s ON us.skill_id = s.id
      WHERE us.profile_id = ?
      `,
      [profile.id]
    );

    const skills = skillsRows.map((s) => s.name);

    res.json({
      success: true,
      profile: {
        ...profile,
        bio: profile.bio || "",
      },
      experience,
      skills,
    });

  } catch (error) {

    console.error("Lỗi getProfile:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {

  const { email } = req.body;

  try {

    const [users] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại!",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await db.execute(
      `
      UPDATE Users
      SET otp_code = ?, otp_expires = ?
      WHERE email = ?
      `,
      [otp, expires, email]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"JobFinder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`,
    });

    res.status(200).json({
      success: true,
      message: "Đã gửi OTP về email!",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {

  const { email, otp, newPassword } = req.body;

  try {

    const [users] = await db.execute(
      `
      SELECT * FROM Users
      WHERE email = ? AND otp_code = ?
      `,
      [email, otp]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP không chính xác!",
      });
    }

    const user = users[0];

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({
        success: false,
        message: "OTP đã hết hạn!",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await db.execute(
      `
      UPDATE Users
      SET password = ?,
          otp_code = NULL,
          otp_expires = NULL
      WHERE email = ?
      `,
      [hashedPassword, email]
    );

    res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công!",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {

  const { email, otp } = req.body;

  try {

    const [users] = await db.execute(
      `
      SELECT * FROM Users
      WHERE email = ? AND otp_code = ?
      `,
      [email, otp]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP không đúng!",
      });
    }

    await db.execute(
      `
      UPDATE Users
      SET is_verified = 1,
          otp_code = NULL,
          otp_expires = NULL
      WHERE email = ?
      `,
      [email]
    );

    res.status(200).json({
      success: true,
      message: "Xác thực thành công!",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const userId = req.user.id;

    let {
      full_name,
      title,
      location,
      bio,
      experience,
      skills,
    } = req.body;

    if (typeof experience === "string") {
      experience = JSON.parse(experience);
    }

    if (typeof skills === "string") {
      skills = JSON.parse(skills);
    }

    let cv_url = null;

    if (req.file) {
      cv_url = `/uploads/cvs/${req.file.filename}`;
    }

    const [profiles] = await connection.query(
      "SELECT * FROM Profiles WHERE user_id = ?",
      [userId]
    );

    let profileId;

    if (profiles.length === 0) {

      const [result] = await connection.query(
        `
        INSERT INTO Profiles
        (
          user_id,
          full_name,
          title,
          location,
          bio,
          cv_url
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          full_name,
          title,
          location,
          bio,
          cv_url,
        ]
      );

      profileId = result.insertId;

    } else {

      profileId = profiles[0].id;

      if (!cv_url) {
        cv_url = profiles[0].cv_url;
      }

      await connection.query(
        `
        UPDATE Profiles
        SET
          full_name = ?,
          title = ?,
          location = ?,
          bio = ?,
          cv_url = ?
        WHERE id = ?
        `,
        [
          full_name,
          title,
          location,
          bio,
          cv_url,
          profileId,
        ]
      );
    }

    // ===== EXPERIENCE =====
    await connection.query(
      "DELETE FROM Work_Experience WHERE profile_id = ?",
      [profileId]
    );

    if (Array.isArray(experience)) {

      for (const exp of experience) {

        const formatDate = (date) => {
          if (!date) return null;
          return new Date(date)
            .toISOString()
            .split("T")[0];
        };

        await connection.query(
          `
          INSERT INTO Work_Experience
          (
            profile_id,
            company_name,
            position,
            description,
            start_date,
            end_date
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            profileId,
            exp.company,
            exp.role,
            exp.description || "",
            formatDate(exp.start_date),
            formatDate(exp.end_date),
          ]
        );
      }
    }

    // ===== SKILLS =====
    await connection.query(
      "DELETE FROM User_Skills WHERE profile_id = ?",
      [profileId]
    );

    if (Array.isArray(skills)) {

      for (const skillName of skills) {

        if (!skillName) continue;

        let [skillRows] = await connection.query(
          "SELECT * FROM Skills WHERE name = ?",
          [skillName]
        );

        let skillId;

        if (skillRows.length === 0) {

          const [newSkill] = await connection.query(
            "INSERT INTO Skills (name) VALUES (?)",
            [skillName]
          );

          skillId = newSkill.insertId;

        } else {

          skillId = skillRows[0].id;
        }

        await connection.query(
          `
          INSERT INTO User_Skills
          (profile_id, skill_id)
          VALUES (?, ?)
          `,
          [profileId, skillId]
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Profile updated",
    });

  } catch (error) {

    await connection.rollback();

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });

  } finally {

    connection.release();
  }
};

// ================= GOOGLE LOGIN =================
exports.googleLogin = async (req, res) => {

  const { accessToken, role } = req.body;

  try {

    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const {
      email,
      name,
      picture,
    } = googleResponse.data;

    const [users] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    let user = users[0];

    if (!user) {

      const autoUsername = email.split("@")[0];

      const [result] = await db.execute(
        `
        INSERT INTO Users
        (
          username,
          email,
          password,
          role,
          is_verified,
          avatar_url
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          autoUsername,
          email,
          "LOGIN_BY_GOOGLE",
          role || "candidate",
          1,
          picture || null,
        ]
      );

      const userId = result.insertId;

      if (role === "employer") {

        await db.execute(
          "INSERT INTO Companies (name) VALUES (?)",
          [`Công ty của ${name}`]
        );

      } else {

        await db.execute(
          `
          INSERT INTO Profiles
          (user_id, full_name)
          VALUES (?, ?)
          `,
          [userId, name]
        );
      }

      user = {
        id: userId,
        username: autoUsername,
        email,
        role: role || "candidate",
        avatar_url: picture,
      };

    } else {

      await db.execute(
        `
        UPDATE Users
        SET avatar_url = ?, is_verified = 1
        WHERE id = ?
        `,
        [picture || user.avatar_url, user.id]
      );

      user.avatar_url = picture || user.avatar_url;
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });

  } catch (error) {

    console.error("Lỗi Google Login:", error);

    res.status(500).json({
      success: false,
      message: "Lỗi kết nối Google: " + error.message,
    });
  }
};

// ================= ADMIN LOGIN =================
exports.adminLogin = async (req, res) => {

  const { email, password } = req.body;

  try {

    const [users] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user!",
      });
    }

    const user = users[0];

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Chỉ Admin mới được đăng nhập!",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Sai mật khẩu!",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await db.execute(
      `
      UPDATE Users
      SET otp_code = ?,
          otp_expires = ?
      WHERE email = ?
      `,
      [otp, expires, email]
    );

    res.status(200).json({
      success: true,
      message: "OTP đã gửi!",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY LOGIN OTP =================
exports.verifyLoginOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và OTP",
      });
    }

    const [users] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    const user = users[0];

    if (user.otp_code !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP không chính xác",
      });
    }

    if (
      !user.otp_expires ||
      new Date(user.otp_expires) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP đã hết hạn",
      });
    }

    await db.execute(
      `
      UPDATE Users
      SET otp_code = NULL,
          otp_expires = NULL
      WHERE email = ?
      `,
      [email]
    );

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });

  } catch (error) {

    console.error("Lỗi tại verifyLoginOTP:", error);

    return res.status(500).json({
      success: false,
      message:
        "Lỗi server khi xác thực OTP: " + error.message,
    });
  }
};