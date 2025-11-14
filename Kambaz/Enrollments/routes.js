import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  
  // Enroll current user in a course
  const enrollInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(enrollment);
  };

  // Unenroll current user from a course
  const unenrollFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const removedEnrollment = dao.unenrollUserFromCourse(currentUser._id, courseId);
    if (removedEnrollment) {
      res.json(removedEnrollment);
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  };

  // Get enrollments for current user
  const findMyEnrollments = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    res.json(enrollments);
  };

  // Get enrollments for a specific user (for admin/faculty)
  const findEnrollmentsForUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  // Get enrollments for a specific course
  const findEnrollmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  };

  // Get all enrollments
  const findAllEnrollments = (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  };

  app.post("/api/courses/:courseId/enrollments", enrollInCourse);
  app.delete("/api/courses/:courseId/enrollments", unenrollFromCourse);
  app.get("/api/users/current/enrollments", findMyEnrollments);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
  app.get("/api/enrollments", findAllEnrollments);
}