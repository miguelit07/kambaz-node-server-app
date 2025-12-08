import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao(db) {
  async function findQuizzesForCourse(courseId) {
    return await model.find({ course: courseId });
  }

  async function findQuizById(quizId) {
    return await model.findById(quizId);
  }

  async function createQuiz(quiz) {
    const newQuiz = { ...quiz, _id: uuidv4() };
    return await model.create(newQuiz);
  }

  async function updateQuiz(quizId, quizUpdates) {
    await model.updateOne({ _id: quizId }, { $set: quizUpdates });
    const updatedQuiz = await model.findById(quizId);
    return updatedQuiz;
  }

  async function deleteQuiz(quizId) {
    await model.deleteOne({ _id: quizId });
    return { status: "ok" };
  }

  async function publishQuiz(quizId) {
    await model.updateOne({ _id: quizId }, { $set: { published: true } });
    return await model.findById(quizId);
  }

  async function unpublishQuiz(quizId) {
    await model.updateOne({ _id: quizId }, { $set: { published: false } });
    return await model.findById(quizId);
  }

  // For student quiz taking
  async function findPublishedQuizzesForCourse(courseId) {
    return await model.find({ course: courseId, published: true });
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
    findPublishedQuizzesForCourse
  };
}