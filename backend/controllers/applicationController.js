const db = require("../config/db");
exports.applyJob = async (req, res) => {
  const candidate_id = req.user.id;
  const { job_id, cover_letter } = req.body;

  if (!job_id) {
    return res.status(400).json({ success: false, message: "Thiếu job_id" });
  }

  try {
    const [existing] = await db.execute(
      "SELECT * FROM Applications WHERE candidate_id = ? AND job_id = ?",
      [candidate_id, job_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: true, message: "Bạn đã ứng tuyển rồi!" });
    }

    await db.execute(
      "INSERT INTO Applications (candidate_id, job_id, cover_letter, status) VALUES (?, ?, ?, ?)",
      [candidate_id, job_id, cover_letter || "", "pending"]
    );

    res.status(201).json({ success: true, message: "Ứng tuyển thành công!" });

  } catch (error) {
    console.error("APPLY ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  const candidate_id = req.user.id;

  try {
    const [applications] = await db.execute(
      `SELECT 
        a.id            AS application_id,
        a.status,
        a.applied_at,
        j.id            AS job_id,
        j.title         AS job_title,
        j.job_type,
        c.name          AS company_name,
        c.logo_url,
        l.name          AS location
      FROM Applications a
      JOIN Jobs j         ON a.job_id      = j.id
      LEFT JOIN Companies c ON j.company_id = c.id
      LEFT JOIN Locations l ON j.location_id = l.id
      WHERE a.candidate_id = ?
      ORDER BY a.applied_at DESC`,
      [candidate_id]
    );

    res.json({ success: true, data: applications });

  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployerApplications = async (req, res) => {
  const employer_id = req.user.id;

  try {
    const [applications] = await db.execute(
      `SELECT 
        a.id            AS application_id,
        a.status,
        a.applied_at,
        u.id            AS candidate_id,
        p.full_name,
        u.email,
        p.phone,
        j.id            AS job_id,
        j.title
      FROM Applications a
      JOIN Jobs j         ON a.job_id      = j.id
      JOIN Users u        ON a.candidate_id = u.id
      LEFT JOIN Profiles p ON u.id          = p.user_id
      WHERE j.posted_by = ?
      ORDER BY a.applied_at DESC`,
      [employer_id]
    );

    res.json({ success: true, data: applications });

  } catch (error) {
    console.error("EMPLOYER APPLICATIONS ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  const application_id = req.params.id;

  try {
    const [rows] = await db.execute(
      `SELECT 
        a.id AS application_id,
        a.status,
        a.applied_at,
        a.cover_letter,
        p.full_name,
        u.email,
        p.phone,
        j.title
      FROM Applications a
      JOIN Users u        ON a.candidate_id = u.id
      LEFT JOIN Profiles p ON u.id          = p.user_id
      JOIN Jobs j         ON a.job_id       = j.id
      WHERE a.id = ?`,
      [application_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn ứng tuyển" });
    }

    res.json({ success: true, data: rows[0] });

  } catch (error) {
    console.error("GET APPLICATION DETAIL ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { application_id, status } = req.body;

  if (!application_id || !status) {
    return res.status(400).json({ success: false, message: "Thiếu application_id hoặc status" });
  }

  try {
    await db.execute(
      "UPDATE Applications SET status = ? WHERE id = ?",  // id, không phải application_id
      [status, application_id]
    );

    res.json({ success: true, message: "Cập nhật trạng thái thành công" });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployerJobs = async (req, res) => {
  const employer_id = req.user.id;

  try {
    const [jobs] = await db.execute(
      `SELECT 
        j.id            AS job_id,
        j.title,
        j.status,
        j.created_at,
        COUNT(a.id)     AS total_applications
      FROM Jobs j
      LEFT JOIN Applications a ON j.id = a.job_id
      WHERE j.posted_by = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC`,
      [employer_id]
    );

    res.json({ success: true, data: jobs });

  } catch (error) {
    console.error("EMPLOYER JOBS ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};