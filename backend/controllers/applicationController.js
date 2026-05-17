const db = require("../config/db");


// ======================================================
// APPLY JOB
// ======================================================

exports.applyJob = async (req, res) => {
  const candidate_id = req.user.id;

  const {
    job_id,
    cover_letter,
  } = req.body;

  if (!job_id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu job_id",
    });
  }

  try {

    // =========================
    // CHECK PROFILE
    // =========================

    const [profiles] = await db.execute(
      `
      SELECT cv_url
      FROM Profiles
      WHERE user_id = ?
      `,
      [candidate_id]
    );

    if (profiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng tạo profile trước",
      });
    }

    if (!profiles[0].cv_url) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng upload CV trước",
      });
    }

    const cv_url = profiles[0].cv_url;

    // =========================
    // CHECK JOB
    // =========================

    const [jobs] = await db.execute(
      `
      SELECT id, status
      FROM Jobs
      WHERE id = ?
      `,
      [job_id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy công việc",
      });
    }

    if (jobs[0].status !== "approved") {
  return res.status(400).json({
    success: false,
    message: "Công việc chưa khả dụng",
  });
}

    // =========================
    // CHECK DUPLICATE
    // =========================

    const [existing] = await db.execute(
      `
      SELECT id
      FROM Applications
      WHERE candidate_id = ?
      AND job_id = ?
      `,
      [candidate_id, job_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã ứng tuyển rồi!",
      });
    }

    // =========================
    // INSERT APPLICATION
    // =========================

    await db.execute(
      `
      INSERT INTO Applications
      (
        candidate_id,
        job_id,
        cover_letter,
        cv_snapshot_url,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        candidate_id,
        job_id,
        cover_letter || "",
        cv_url,
        "pending",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Ứng tuyển thành công!",
    });

  } catch (error) {

    console.error("APPLY ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// MY APPLICATIONS
// ======================================================
exports.getMyApplications = async (req, res) => {

  const candidate_id = req.user.id;

  try {

    const [applications] = await db.execute(
      `
      SELECT
        a.id AS application_id,
        a.status,
        a.applied_at,
        a.cover_letter,

        j.id AS job_id,
        j.title AS job_title,
        j.job_type,
        j.salary_min,
        j.salary_max,

        c.name AS company_name,
        c.logo_url,

        l.name AS location

      FROM Applications a

      JOIN Jobs j
        ON a.job_id = j.id

      LEFT JOIN Companies c
        ON j.company_id = c.id

      LEFT JOIN Locations l
        ON j.location_id = l.id

      WHERE a.candidate_id = ?

      ORDER BY a.applied_at DESC
      `,
      [candidate_id]
    );

    res.json({
      success: true,
      data: applications,
    });

  } catch (error) {

    console.error(
      "GET MY APPLICATIONS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================================
// WITHDRAW APPLICATION
// ======================================================

exports.withdrawApplication = async (req, res) => {

  const candidate_id = req.user.id;

  const application_id = req.params.id;

  try {

    const [applications] = await db.execute(
      `
      SELECT id, status
      FROM Applications
      WHERE id = ?
      AND candidate_id = ?
      `,
      [application_id, candidate_id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn ứng tuyển",
      });
    }

    // Chỉ cho rút khi pending
    if (applications[0].status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể rút hồ sơ đang pending",
      });
    }

    await db.execute(
      `
      DELETE FROM Applications
      WHERE id = ?
      `,
      [application_id]
    );

    res.json({
      success: true,
      message: "Đã rút hồ sơ ứng tuyển",
    });

  } catch (error) {

    console.error(
      "WITHDRAW APPLICATION ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// EMPLOYER APPLICATIONS
// ======================================================

exports.getEmployerApplications = async (req, res) => {

  const employer_id = req.user.id;

  try {

    const [applications] = await db.execute(
      `
      SELECT

        a.id AS application_id,
        a.status,
        a.applied_at,

        u.id AS candidate_id,
        u.email,

        p.full_name,
        p.phone,
        p.cv_url,

        j.id AS job_id,
        j.title

      FROM Applications a

      JOIN Jobs j
        ON a.job_id = j.id

      JOIN Users u
        ON a.candidate_id = u.id

      LEFT JOIN Profiles p
        ON u.id = p.user_id

      WHERE j.posted_by = ?

      ORDER BY a.applied_at DESC
      `,
      [employer_id]
    );

    res.json({
      success: true,
      data: applications,
    });

  } catch (error) {

    console.error(
      "EMPLOYER APPLICATIONS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// APPLICATION DETAIL
// ======================================================

exports.getApplicationById = async (req, res) => {

  const employer_id = req.user.id;

  const application_id = req.params.id;

  try {

    const [rows] = await db.execute(
      `
      SELECT

        a.id AS application_id,
        a.status,
        a.applied_at,
        a.cover_letter,
        a.cv_snapshot_url,

        u.email,

        p.full_name,
        p.phone,

        j.title

      FROM Applications a

      JOIN Users u
        ON a.candidate_id = u.id

      LEFT JOIN Profiles p
        ON u.id = p.user_id

      JOIN Jobs j
        ON a.job_id = j.id

      WHERE a.id = ?
      AND j.posted_by = ?
      `,
      [application_id, employer_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn ứng tuyển",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {

    console.error(
      "GET APPLICATION DETAIL ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

exports.updateApplicationStatus = async (req, res) => {

  const employer_id = req.user.id;

  const {
    application_id,
    status,
  } = req.body;

  const allowedStatuses = [
  "pending",
  "reviewed",
  "interviewing",
  "accepted",
  "rejected",
];

  if (!application_id || !status) {
    return res.status(400).json({
      success: false,
      message: "Thiếu application_id hoặc status",
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status không hợp lệ",
    });
  }

  try {

    // CHECK OWNER

    const [applications] = await db.execute(
      `
      SELECT a.id
      FROM Applications a
      JOIN Jobs j
        ON a.job_id = j.id
      WHERE a.id = ?
      AND j.posted_by = ?
      `,
      [application_id, employer_id]
    );

    if (applications.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền cập nhật",
      });
    }

    await db.execute(
      `
      UPDATE Applications
      SET status = ?
      WHERE id = ?
      `,
      [status, application_id]
    );

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
    });

  } catch (error) {

    console.error(
      "UPDATE STATUS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// EMPLOYER JOBS
// ======================================================

exports.getEmployerJobs = async (req, res) => {

  const employer_id = req.user.id;

  try {

    const [jobs] = await db.execute(
      `
      SELECT

        j.id AS job_id,
        j.title,
        j.status,
        j.created_at,

        COUNT(a.id) AS total_applications

      FROM Jobs j

      LEFT JOIN Applications a
        ON j.id = a.job_id

      WHERE j.posted_by = ?

      GROUP BY j.id

      ORDER BY j.created_at DESC
      `,
      [employer_id]
    );

    res.json({
      success: true,
      data: jobs,
    });

  } catch (error) {

    console.error(
      "EMPLOYER JOBS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// NOTES
// ======================================================

exports.getNotes = async (req, res) => {

  const { application_id } = req.params;

  try {

    const [rows] = await db.execute(
      `
      SELECT

        n.id,
        n.content,
        n.created_at,

        u.username

      FROM Application_Notes n

      JOIN Users u
        ON n.author_id = u.id

      WHERE n.application_id = ?

      ORDER BY n.created_at ASC
      `,
      [application_id]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.addNote = async (req, res) => {

  const {
    application_id,
    content,
  } = req.body;

  const author_id = req.user.id;

  if (!content?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Nội dung ghi chú không được trống",
    });
  }

  try {

    const [result] = await db.execute(
      `
      INSERT INTO Application_Notes
      (
        application_id,
        author_id,
        content
      )
      VALUES (?, ?, ?)
      `,
      [
        application_id,
        author_id,
        content.trim(),
      ]
    );

    const [newNote] = await db.execute(
      `
      SELECT

        n.id,
        n.content,
        n.created_at,

        u.username

      FROM Application_Notes n

      JOIN Users u
        ON n.author_id = u.id

      WHERE n.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: newNote[0],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteNote = async (req, res) => {

  const { note_id } = req.params;

  const author_id = req.user.id;

  try {

    const [result] = await db.execute(
      `
      DELETE FROM Application_Notes
      WHERE id = ?
      AND author_id = ?
      `,
      [note_id, author_id]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa ghi chú này",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa ghi chú",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// TOGGLE JOB STATUS
// ======================================================

exports.toggleJobStatus = async (req, res) => {

  const employer_id = req.user.id;

  const { job_id } = req.body;

  try {

    const [jobs] = await db.execute(
      `
      SELECT id, status
      FROM Jobs
      WHERE id = ?
      AND posted_by = ?
      `,
      [job_id, employer_id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy job",
      });
    }

    const currentStatus = jobs[0].status;

    const newStatus =
      currentStatus === "closed"
        ? "approved"
        : "closed";

    await db.execute(
      `
      UPDATE Jobs
      SET status = ?
      WHERE id = ?
      `,
      [newStatus, job_id]
    );

    res.status(200).json({
      success: true,
      message:
        newStatus === "closed"
          ? "Đã đóng tin tuyển dụng"
          : "Đã mở lại tin tuyển dụng",
      new_status: newStatus,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

