const db = require('../config/db');

// --- 1. Lấy thông tin hồ sơ (Dùng để hiển thị lên UI khi load trang) ---
exports.getProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        // Lấy thông tin cơ bản
        const [profiles] = await db.query(`SELECT * FROM Profiles WHERE user_id = ?`, [userId]);
        if (profiles.length === 0) return res.status(404).json({ message: "Chưa có hồ sơ" });

        const profileId = profiles[0].id;

        // Lấy dữ liệu từ các bảng liên quan
        const [experiences] = await db.query(`SELECT * FROM Work_Experience WHERE profile_id = ?`, [profileId]);
        const [education] = await db.query(`SELECT * FROM Education WHERE profile_id = ?`, [profileId]);
        const [skills] = await db.query(`
            SELECT s.name FROM Skills s 
            JOIN User_Skills us ON s.id = us.skill_id 
            WHERE us.profile_id = ?`, [profileId]);

        res.status(200).json({
            success: true,
            personalInfo: profiles[0],
            experiences,
            education,
            skills: skills.map(s => s.name)
        });
    } catch (error) {
        console.error("Lỗi lấy Profile:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 2. Cập nhật thông tin hồ sơ (Lưu từ Frontend) ---
exports.updateProfile = async (req, res) => {
    const { userId, personalInfo, experiences, education, skills } = req.body;
    
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Cập nhật bảng Profiles
        // Lưu ý: Cột title, avatar_url, cover_url đã được bạn thêm bằng lệnh ALTER
        await connection.query(
            `UPDATE Profiles SET 
                full_name = ?, 
                title = ?, 
                bio = ?, 
                cv_url = ?, 
                avatar_url = ?, 
                cover_url = ?,
                phone = ?,
                gender = ?,
                dob = ?
             WHERE user_id = ?`,
            [
                personalInfo.full_name || null,
                personalInfo.title || null,
                personalInfo.bio || null,
                personalInfo.cv_url || null,
                personalInfo.avatar_url || null,
                personalInfo.cover_url || null,
                personalInfo.phone || null,
                personalInfo.gender || null,
                personalInfo.dob || null,
                userId
            ]
        );

        // Lấy profile_id
        const [profileRows] = await connection.query(`SELECT id FROM Profiles WHERE user_id = ?`, [userId]);
        if (profileRows.length === 0) throw new Error("Không tìm thấy hồ sơ người dùng!");
        const profileId = profileRows[0].id;

        // 2. Xử lý Kinh nghiệm (Work_Experience)
        await connection.query(`DELETE FROM Work_Experience WHERE profile_id = ?`, [profileId]);
        if (experiences && experiences.length > 0) {
            for (const exp of experiences) {
                await connection.query(
                    `INSERT INTO Work_Experience (profile_id, company_name, position, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)`,
                    [profileId, exp.company_name, exp.position, exp.description, exp.start_date || null, exp.end_date || null]
                );
            }
        }

        // 3. Xử lý Học vấn (Education) - PHẦN MỚI CẬP NHẬT
        await connection.query(`DELETE FROM Education WHERE profile_id = ?`, [profileId]);
        if (education && education.length > 0) {
            for (const edu of education) {
                await connection.query(
                    `INSERT INTO Education (profile_id, school_name, major, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)`,
                    [profileId, edu.school_name, edu.major, edu.start_date || null, edu.end_date || null, edu.description]
                );
            }
        }

        // 4. Xử lý Kỹ năng (User_Skills)
        await connection.query(`DELETE FROM User_Skills WHERE profile_id = ?`, [profileId]);
        if (skills && skills.length > 0) {
            for (const skillName of skills) {
                let [skillRows] = await connection.query(`SELECT id FROM Skills WHERE name = ?`, [skillName]);
                let skillId;
                if (skillRows.length === 0) {
                    const [resSkill] = await connection.query(`INSERT INTO Skills (name) VALUES (?)`, [skillName]);
                    skillId = resSkill.insertId;
                } else {
                    skillId = skillRows[0].id;
                }
                await connection.query(`INSERT INTO User_Skills (profile_id, skill_id) VALUES (?, ?)`, [profileId, skillId]);
            }
        }

        await connection.commit();
        res.status(200).json({ success: true, message: "Toàn bộ hồ sơ đã được lưu thành công!" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("LỖI CẬP NHẬT PROFILE:", error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};