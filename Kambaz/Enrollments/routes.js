import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  
  // Enroll current user in a course
  const enrollInCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const enrollment = await dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(enrollment);
  };

  // Unenroll current user from a course
  const unenrollFromCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const removedEnrollment = await dao.unenrollUserFromCourse(currentUser._id, courseId);
    if (removedEnrollment) {
      res.json(removedEnrollment);
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  };

  // Get courses for current user
  const findMyEnrollments = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const courses = await dao.findCoursesForUser(currentUser._id);
    res.json(courses);
  };

  // Get courses for a specific user (for admin/faculty)
  const findCoursesForUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await dao.findCoursesForUser(userId);
    res.json(courses);
  };

  // Get users for a specific course
  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await dao.findUsersForCourse(courseId);
    res.json(users);
  };

  app.post("/api/courses/:courseId/enrollments", enrollInCourse);
  app.delete("/api/courses/:courseId/enrollments", unenrollFromCourse);
  app.get("/api/users/current/enrollments", findMyEnrollments);
  app.get("/api/users/:userId/enrollments", findCoursesForUser);
  app.get("/api/courses/:courseId/enrollments", findUsersForCourse);
}