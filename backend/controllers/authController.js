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

    // 1. Lấy thông tin Profile cơ bản (bao gồm bio, location, title...)
    const [profiles] = await db.query(
      "SELECT id, full_name, title, location, bio, cv_url FROM Profiles WHERE user_id = ?",
      [userId]
    );

    // Nếu chưa có profile trong DB
    if (profiles.length === 0) {
      return res.json({
        success: true, // Thêm flag success để frontend dễ check
        profile: null,
        experience: [],
        skills: [],
      });
    }

    const profile = profiles[0];

    // 2. Lấy danh sách kinh nghiệm làm việc
    // Chỉnh sửa alias (as) để khớp chính xác với state của Frontend
    const [experience] = await db.query(
      "SELECT company_name as company, position as role, description FROM Work_Experience WHERE profile_id = ?",
      [profile.id]
    );

    // 3. Lấy danh sách kỹ năng
    const [skillsRows] = await db.query(
      `
      SELECT s.name
      FROM User_Skills us
      JOIN Skills s ON us.skill_id = s.id
      WHERE us.profile_id = ?
      `,
      [profile.id]
    );

    // Chuyển mảng object [{name: 'React'}, {name: 'Node'}] thành mảng string ['React', 'Node']
    // Điều này giúp Frontend dễ dàng hiển thị bằng hàm .map()
    const skills = skillsRows.map(s => s.name);

    // 4. Trả về kết quả cuối cùng
    res.json({
      success: true,
      profile: {
        ...profile,
        // Đảm bảo bio không bị null để tránh lỗi hiển thị trên UI
        bio: profile.bio || "No bio available. Tell us something about yourself!"
      },
      experience: experience || [],
      skills: skills || [],
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

    // 1. Lấy dữ liệu từ body
    let { full_name, title, location, bio, experience, skills } = req.body;

    // MẸO: Nếu gửi qua FormData, experience và skills thường là String. Cần parse về Array.
    if (typeof experience === "string") {
      try { experience = JSON.parse(experience); } catch (e) { experience = []; }
    }
    if (typeof skills === "string") {
      try { skills = JSON.parse(skills); } catch (e) { skills = []; }
    }

    // Xử lý file CV nếu có
    let cv_url = req.file ? `/uploads/cvs/${req.file.filename}` : null;

    // 2. Kiểm tra/Cập nhật bảng Profiles
    const [profiles] = await connection.query(
      "SELECT id, cv_url FROM Profiles WHERE user_id = ?",
      [userId]
    );

    let profileId;
    if (profiles.length === 0) {
      const [result] = await connection.query(
        "INSERT INTO Profiles (user_id, full_name, title, bio, cv_url) VALUES (?, ?, ?, ?, ?)",
        [userId, full_name, title, bio, cv_url]
      );
      profileId = result.insertId;
    } else {
      profileId = profiles[0].id;
      const final_cv_url = cv_url || profiles[0].cv_url;
      await connection.query(
        "UPDATE Profiles SET full_name = ?, title = ?, bio = ?, cv_url = ? WHERE id = ?",
        [full_name, title, bio, final_cv_url, profileId]
      );
    }

    // 3. Lưu Work Experience (Quan trọng: Kiểm tra mảng trước khi lặp)
    await connection.query("DELETE FROM Work_Experience WHERE profile_id = ?", [profileId]);
    if (Array.isArray(experience) && experience.length > 0) {
      for (const exp of experience) {
        if (exp.company || exp.role) { // Chỉ lưu nếu có dữ liệu
          await connection.query(
            "INSERT INTO Work_Experience (profile_id, company_name, position, description) VALUES (?, ?, ?, ?)",
            [profileId, exp.company, exp.role, exp.description || ""]
          );
        }
      }
    }

    // 4. Lưu Skills
    await connection.query("DELETE FROM User_Skills WHERE profile_id = ?", [profileId]);
    if (Array.isArray(skills) && skills.length > 0) {
      for (const skillName of skills) {
        if (!skillName) continue;

        let [skillRows] = await connection.query("SELECT id FROM Skills WHERE name = ?", [skillName]);
        let skillId;
        if (skillRows.length === 0) {
          const [newSkill] = await connection.query("INSERT INTO Skills (name) VALUES (?)", [skillName]);
          skillId = newSkill.insertId;
        } else {
          skillId = skillRows[0].id;
        }
        await connection.query("INSERT INTO User_Skills (profile_id, skill_id) VALUES (?, ?)", [profileId, skillId]);
      }
    }

    await connection.commit();
    console.log(">>> Đã lưu thành công Profile cho User ID:", userId);
    res.json({ success: true, message: "Cập nhật hồ sơ thành công!" });

  } catch (error) {
    await connection.rollback();
    console.error("LỖI KHI LƯU PROFILE:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
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

    const autoUsername = email.split("@")[0];

    const [users] = await db.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    let user = users[0];

    if (!user) {

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

      user = {
        id: result.insertId,
        username: autoUsername,
        email,
        role: role || "candidate",
        avatar_url: picture,
      };
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
      user,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
        message: "OTP không chính xác!",
      });
    }

    const user = users[0];

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
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};