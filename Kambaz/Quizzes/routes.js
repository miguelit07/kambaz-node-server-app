import QuizzesDao from "./dao.js";
import { submitQuizAttempt, getStudentQuizAttempts, getLatestAttempt, canTakeQuiz } from "./attempts-dao.js";

export default function QuizzesRoutes(app, db) {
  const dao = QuizzesDao(db);

  // Authorization middleware
  const requireAuth = (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    req.currentUser = currentUser;
    next();
  };

  const requireFaculty = (req, res, next) => {
    const currentUser = req.currentUser || req.session["currentUser"];
    if (!currentUser || (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")) {
      res.status(403).json({ message: "Faculty access required" });
      return;
    }
    next();
  };

  // Get all quizzes for a course (Faculty sees all, Students see published only)
  const findQuizzesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session["currentUser"];
      
      let quizzes;
      if (currentUser && (currentUser.role === "FACULTY" || currentUser.role === "ADMIN")) {
        quizzes = await dao.findQuizzesForCourse(courseId);
      } else {
        quizzes = await dao.findPublishedQuizzesForCourse(courseId);
      }
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quizzes", error: error.message });
    }
  };

  // Get a specific quiz by ID
  const findQuizById = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await dao.findQuizById(quizId);
      
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      const currentUser = req.session["currentUser"];
      // Students can only view published quizzes
      if (currentUser && currentUser.role === "STUDENT" && !quiz.published) {
        res.status(403).json({ message: "Quiz not available" });
        return;
      }

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz", error: error.message });
    }
  };

  // Create a new quiz (Faculty only)
  const createQuiz = async (req, res) => {
    try {
      const { courseId } = req.params;
      const quizData = {
        ...req.body,
        course: courseId,
      };
      const newQuiz = await dao.createQuiz(quizData);
      res.json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to create quiz", error: error.message });
    }
  };

  // Update a quiz (Faculty only)
  const updateQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quizUpdates = req.body;
      const updatedQuiz = await dao.updateQuiz(quizId, quizUpdates);
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quiz", error: error.message });
    }
  };

  // Delete a quiz (Faculty only)
  const deleteQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const result = await dao.deleteQuiz(quizId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quiz", error: error.message });
    }
  };

  // Publish a quiz (Faculty only)
  const publishQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await dao.publishQuiz(quizId);
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to publish quiz", error: error.message });
    }
  };

  // Unpublish a quiz (Faculty only)
  const unpublishQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await dao.unpublishQuiz(quizId);
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to unpublish quiz", error: error.message });
    }
  };

  // Routes
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  
  // Student quiz attempt routes
  app.post("/api/quizzes/:quizId/attempts", requireAuth, submitQuizAttempt);
  app.get("/api/quizzes/:quizId/attempts/:studentId", requireAuth, getStudentQuizAttempts);
  app.get("/api/quizzes/:quizId/attempts/:studentId/latest", requireAuth, getLatestAttempt);
  app.get("/api/quizzes/:quizId/can-take/:studentId", requireAuth, canTakeQuiz);
  
  // Faculty-only routes
  app.post("/api/courses/:courseId/quizzes", requireAuth, requireFaculty, createQuiz);
  app.put("/api/quizzes/:quizId", requireAuth, requireFaculty, updateQuiz);
  app.delete("/api/quizzes/:quizId", requireAuth, requireFaculty, deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", requireAuth, requireFaculty, publishQuiz);
  app.put("/api/quizzes/:quizId/unpublish", requireAuth, requireFaculty, unpublishQuiz);
}