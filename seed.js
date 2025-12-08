import "dotenv/config";
import mongoose from "mongoose";
import CourseModel from "./Kambaz/Courses/model.js";
import UserModel from "./Kambaz/Users/model.js";
import EnrollmentModel from "./Kambaz/Enrollments/model.js";
import QuizModel from "./Kambaz/Quizzes/model.js";
import courses from "./Kambaz/Database/courses.js";
import users from "./Kambaz/Database/users.js";
import enrollments from "./Kambaz/Database/enrollments.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

async function seedDatabase() {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB");

    // Clear existing data
    await CourseModel.deleteMany({});
    await UserModel.deleteMany({});
    await EnrollmentModel.deleteMany({});
    await QuizModel.deleteMany({});
    console.log("Cleared existing data");

    // Seed courses
    await CourseModel.insertMany(courses);
    console.log(`Seeded ${courses.length} courses`);

    // Seed users - fix any invalid roles
    const validUsers = users.map(user => ({
      ...user,
      role: user.role === "TA" ? "FACULTY" : user.role // Convert TA to FACULTY
    }));
    await UserModel.insertMany(validUsers);
    console.log(`Seeded ${validUsers.length} users`);

    // Seed enrollments
    await EnrollmentModel.insertMany(enrollments);
    console.log(`Seeded ${enrollments.length} enrollments`);

    // Sample quizzes data
    const sampleQuizzes = [
      {
        _id: "Q101",
        title: "Q1 - HTML",
        description: "Basic HTML knowledge assessment",
        course: "CS4550",
        quizType: "GRADED_QUIZ",
        points: 29,
        assignmentGroup: "QUIZZES",
        shuffleAnswers: false,
        timeLimit: 30,
        multipleAttempts: false,
        howManyAttempts: 1,
        showCorrectAnswers: "IMMEDIATELY",
        oneQuestionAtTime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: new Date("2024-09-21T17:00:00"),
        availableDate: new Date("2024-09-21T11:40:00"),
        untilDate: new Date("2024-09-21T17:00:00"),
        published: true,
        questions: [
          {
            _id: "Q101_1",
            title: "HTML Structure",
            points: 10,
            questionText: "What does HTML stand for?",
            questionType: "MULTIPLE_CHOICE",
            choices: [
              { text: "HyperText Markup Language", correct: true },
              { text: "High Tech Modern Language", correct: false },
              { text: "Home Tool Markup Language", correct: false },
              { text: "Hyperlink and Text Markup Language", correct: false }
            ]
          },
          {
            _id: "Q101_2",
            title: "HTML Tags",
            points: 9,
            questionText: "Which HTML tag is used for the largest heading?",
            questionType: "MULTIPLE_CHOICE",
            choices: [
              { text: "<h1>", correct: true },
              { text: "<h6>", correct: false },
              { text: "<header>", correct: false },
              { text: "<title>", correct: false }
            ]
          },
          {
            _id: "Q101_3",
            title: "HTML Attributes",
            points: 10,
            questionText: "HTML elements can have attributes.",
            questionType: "TRUE_FALSE",
            choices: [
              { text: "True", correct: true },
              { text: "False", correct: false }
            ]
          }
        ]
      },
      {
        _id: "Q102",
        title: "CSS Fundamentals",
        description: "Understanding CSS basics and styling",
        course: "CS4550",
        quizType: "PRACTICE_QUIZ",
        points: 25,
        assignmentGroup: "QUIZZES",
        shuffleAnswers: true,
        timeLimit: 25,
        multipleAttempts: true,
        howManyAttempts: 3,
        showCorrectAnswers: "AFTER_LAST_ATTEMPT",
        accessCode: "CSS123",
        oneQuestionAtTime: false,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: new Date("2024-09-28T23:59:00"),
        availableDate: new Date("2024-09-22T00:00:00"),
        untilDate: new Date("2024-09-30T23:59:00"),
        published: true,
        questions: [
          {
            _id: "Q102_1",
            title: "CSS Syntax",
            points: 15,
            questionText: "What does CSS stand for?",
            questionType: "MULTIPLE_CHOICE",
            choices: [
              { text: "Cascading Style Sheets", correct: true },
              { text: "Computer Style Sheets", correct: false },
              { text: "Creative Style Sheets", correct: false },
              { text: "Colorful Style Sheets", correct: false }
            ]
          },
          {
            _id: "Q102_2",
            title: "CSS Selectors",
            points: 10,
            questionText: "Which CSS property is used to change the text color?",
            questionType: "MULTIPLE_CHOICE",
            choices: [
              { text: "color", correct: true },
              { text: "text-color", correct: false },
              { text: "font-color", correct: false },
              { text: "text-style", correct: false }
            ]
          }
        ]
      },
      {
        _id: "Q103",
        title: "JavaScript Basics - Unpublished",
        description: "Basic JavaScript concepts and syntax",
        course: "CS4550",
        quizType: "GRADED_QUIZ",
        points: 35,
        assignmentGroup: "EXAMS",
        shuffleAnswers: true,
        timeLimit: 45,
        multipleAttempts: false,
        howManyAttempts: 1,
        showCorrectAnswers: "AFTER_DUE_DATE",
        oneQuestionAtTime: true,
        webcamRequired: true,
        lockQuestionsAfterAnswering: true,
        dueDate: new Date("2024-10-05T23:59:00"),
        availableDate: new Date("2024-10-01T00:00:00"),
        untilDate: new Date("2024-10-07T23:59:00"),
        published: false, // Unpublished quiz for testing
        questions: []
      }
    ];

    // Seed quizzes
    await QuizModel.insertMany(sampleQuizzes);
    console.log(`Seeded ${sampleQuizzes.length} quizzes`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();