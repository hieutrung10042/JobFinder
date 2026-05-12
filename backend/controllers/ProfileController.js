// backend/controllers/ProfileController.js
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const formatDate = (date) => {

    if (!date) return null;

    return new Date(date)
        .toISOString()
        .split("T")[0];
};

// ─── 1. GET /api/profile/:userId ──────────────────────────────────────────────
// Lấy toàn bộ profile: personalInfo + experiences + education + skills
exports.getProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const [profiles] = await db.query(`SELECT * FROM Profiles WHERE user_id = ?`, [userId]);
        if (profiles.length === 0)
            return res.status(404).json({ success: false, message: "Chưa có hồ sơ" });

        const profileId = profiles[0].id;

        const [experiences] = await db.query(
            `SELECT * FROM Work_Experience WHERE profile_id = ? ORDER BY start_date DESC`, [profileId]
        );
        const [education] = await db.query(
            `SELECT * FROM Education WHERE profile_id = ? ORDER BY start_date DESC`, [profileId]
        );
        const [skills] = await db.query(`
            SELECT s.id, s.name FROM Skills s
            JOIN User_Skills us ON s.id = us.skill_id
            WHERE us.profile_id = ?`, [profileId]
        );

        // Parse social_links nếu là string JSON
        const personalInfo = profiles[0];
        if (typeof personalInfo.social_links === 'string') {
            try { personalInfo.social_links = JSON.parse(personalInfo.social_links); }
            catch { personalInfo.social_links = {}; }
        }

        res.status(200).json({
            success: true,
            personalInfo,
            experiences,
            education,
            skills: skills.map(s => s.name)
        });
    } catch (error) {
        console.error("[getProfile]", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ─── 2. POST /api/profile/update ──────────────────────────────────────────────
// Lưu toàn bộ profile trong 1 request (transaction)
exports.updateProfile = async (req, res) => {
    const { userId, personalInfo, experiences, education, skills } = req.body;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Cập nhật bảng Profiles
        await connection.query(
            `UPDATE Profiles SET
                full_name    = ?,
                title        = ?,
                bio          = ?,
                cv_url       = ?,
                avatar_url   = ?,
                cover_url    = ?,
                phone        = ?,
                gender       = ?,
                dob          = ?,
                location     = ?,
                social_links = ?
             WHERE user_id = ?`,
            [
                personalInfo.full_name    || null,
                personalInfo.title        || null,
                personalInfo.bio          || null,
                personalInfo.cv_url       || null,
                personalInfo.avatar_url   || null,
                personalInfo.cover_url    || null,
                personalInfo.phone        || null,
                personalInfo.gender       || null,
                personalInfo.dob          || null,
                personalInfo.location     || null,
                personalInfo.social_links ? JSON.stringify(personalInfo.social_links) : null,
                userId
            ]
        );

        const [profileRows] = await connection.query(
            `SELECT id FROM Profiles WHERE user_id = ?`, [userId]
        );
        if (profileRows.length === 0) throw new Error("Không tìm thấy hồ sơ người dùng!");
        const profileId = profileRows[0].id;

        // 2. Work_Experience — delete-then-insert
        await connection.query(
    `DELETE FROM Work_Experience WHERE profile_id = ?`,
    [profileId]
);

if (experiences && experiences.length > 0) {

    for (const exp of experiences) {

        await connection.query(
            `
            INSERT INTO Work_Experience
            (
                profile_id,
                company_name,
                position,
                description,
                start_date,
                end_date,
                period_text
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                profileId,
                exp.company_name,
                exp.position,
                exp.description || null,

                formatDate(exp.start_date),
                formatDate(exp.end_date),

                `${formatDate(exp.start_date) || ''} - ${
                    formatDate(exp.end_date) || 'Present'
                }`
            ]
        );
    }
}

        // 3. Education — delete-then-insert
        await connection.query(
    `DELETE FROM Education WHERE profile_id = ?`,
    [profileId]
);

if (education && education.length > 0) {

    for (const edu of education) {

        await connection.query(
            `
            INSERT INTO Education
            (
                profile_id,
                school_name,
                major,
                gpa,
                start_date,
                end_date,
                description,
                period_text
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                profileId,

                edu.school_name,
                edu.major,
                edu.gpa || null,

                // FIX DATE
                formatDate(edu.start_date),
                formatDate(edu.end_date),

                edu.description || null,

                `${formatDate(edu.start_date) || ''} - ${
                    formatDate(edu.end_date) || 'Present'
                }`
            ]
        );
    }
}

        // 4. Skills — upsert vào bảng Skills, rồi link vào User_Skills
        await connection.query(`DELETE FROM User_Skills WHERE profile_id = ?`, [profileId]);
        if (skills && skills.length > 0) {
            for (const skillName of skills) {
                let [skillRows] = await connection.query(`SELECT id FROM Skills WHERE name = ?`, [skillName]);
                let skillId;
                if (skillRows.length === 0) {
                    const [newSkill] = await connection.query(`INSERT INTO Skills (name) VALUES (?)`, [skillName]);
                    skillId = newSkill.insertId;
                } else {
                    skillId = skillRows[0].id;
                }
                await connection.query(
                    `INSERT INTO User_Skills (profile_id, skill_id) VALUES (?, ?)`,
                    [profileId, skillId]
                );
            }
        }

        await connection.commit();
        res.status(200).json({ success: true, message: "Hồ sơ đã được lưu thành công!" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("[updateProfile]", error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// ─── 3. POST /api/profile/cv/upload ───────────────────────────────────────────
// Upload file CV (multer đã xử lý req.file trước khi vào đây)
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Không có file nào được upload" });
        }

        // req.user được set bởi verifyToken middleware
        const userId = req.user.id;
        const cvUrl = `/uploads/${req.file.filename}`;

        await db.query(
            `UPDATE Profiles SET cv_url = ?, updated_at = NOW() WHERE user_id = ?`,
            [cvUrl, userId]
        );

        res.status(200).json({
            success: true,
            message: "CV đã được upload thành công",
            data: {
                cv_url:        cvUrl,
                original_name: req.file.originalname,
                size:          req.file.size
            }
        });
    } catch (error) {
        console.error("[uploadCV]", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── 4. DELETE /api/profile/cv ────────────────────────────────────────────────
// Xóa CV: xóa file khỏi disk + set cv_url = NULL
exports.deleteCV = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(
            `SELECT cv_url FROM Profiles WHERE user_id = ?`, [userId]
        );
        if (rows.length === 0 || !rows[0].cv_url) {
            return res.status(404).json({ success: false, message: "Không tìm thấy CV" });
        }

        // Xóa file vật lý khỏi thư mục uploads/
        const filePath = path.join(__dirname, '..', rows[0].cv_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await db.query(
            `UPDATE Profiles SET cv_url = NULL, updated_at = NOW() WHERE user_id = ?`,
            [userId]
        );

        res.status(200).json({ success: true, message: "CV đã được xóa" });
    } catch (error) {
        console.error("[deleteCV]", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
