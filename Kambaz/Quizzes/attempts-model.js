import mongoose from "mongoose";

const attemptAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedChoiceId: String,
  textAnswer: String,
  correct: { type: Boolean, required: true },
  earnedPoints: { type: Number, required: true },
  maxPoints: { type: Number, required: true }
});

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  studentId: { type: String, required: true },
  attemptNumber: { type: Number, required: true },
  answers: [attemptAnswerSchema],
  totalScore: {
    earned: { type: Number, required: true },
    possible: { type: Number, required: true }
  },
  timeStarted: { type: Date, required: true },
  timeCompleted: { type: Date, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  isCompleted: { type: Boolean, default: true }
}, {
  collection: "quiz-attempts"
});

// Compound index to ensure uniqueness per student per attempt
quizAttemptSchema.index({ quizId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });

export default mongoose.model("QuizAttempt", quizAttemptSchema);