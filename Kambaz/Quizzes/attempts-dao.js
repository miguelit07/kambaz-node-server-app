import QuizAttemptModel from "./attempts-model.js";

// Submit a quiz attempt
export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { studentId, answers, totalScore, timeStarted, timeCompleted } = req.body;

    // Get current attempt count for this student
    const existingAttempts = await QuizAttemptModel.find({ quizId, studentId }).sort({ attemptNumber: -1 });
    const attemptNumber = existingAttempts.length > 0 ? existingAttempts[0].attemptNumber + 1 : 1;

    // Calculate time taken
    const timeTaken = Math.round((new Date(timeCompleted) - new Date(timeStarted)) / 1000);

    const attempt = new QuizAttemptModel({
      quizId,
      studentId,
      attemptNumber,
      answers,
      totalScore,
      timeStarted: new Date(timeStarted),
      timeCompleted: new Date(timeCompleted),
      timeTaken,
      isCompleted: true
    });

    const savedAttempt = await attempt.save();
    res.json(savedAttempt);
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get student's quiz attempts
export const getStudentQuizAttempts = async (req, res) => {
  try {
    const { quizId, studentId } = req.params;
    const attempts = await QuizAttemptModel.find({ quizId, studentId }).sort({ attemptNumber: -1 });
    res.json(attempts);
  } catch (error) {
    console.error("Error fetching student quiz attempts:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get latest attempt for student
export const getLatestAttempt = async (req, res) => {
  try {
    const { quizId, studentId } = req.params;
    const latestAttempt = await QuizAttemptModel.findOne({ quizId, studentId }).sort({ attemptNumber: -1 });
    res.json(latestAttempt);
  } catch (error) {
    console.error("Error fetching latest attempt:", error);
    res.status(500).json({ message: error.message });
  }
};

// Check if student can take quiz (based on attempts)
export const canTakeQuiz = async (req, res) => {
  try {
    const { quizId, studentId } = req.params;
    const attempts = await QuizAttemptModel.find({ quizId, studentId });
    
    // This will be checked against quiz.multipleAttempts and quiz.howManyAttempts
    // For now, return attempt count - the frontend will do the logic
    res.json({
      attemptCount: attempts.length,
      attempts: attempts.map(a => ({
        attemptNumber: a.attemptNumber,
        score: a.totalScore,
        timeCompleted: a.timeCompleted
      }))
    });
  } catch (error) {
    console.error("Error checking quiz availability:", error);
    res.status(500).json({ message: error.message });
  }
};