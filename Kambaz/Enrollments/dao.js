import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    // Check if enrollment already exists
    const existingEnrollment = enrollments.find(
      (enrollment) => enrollment.user === userId && enrollment.course === courseId
    );
    if (existingEnrollment) {
      return existingEnrollment; // Return existing enrollment
    }
    // Create new enrollment
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    enrollments.push(newEnrollment);
    return newEnrollment;
  }

  function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    const index = enrollments.findIndex(
      (enrollment) => enrollment.user === userId && enrollment.course === courseId
    );
    if (index > -1) {
      const removedEnrollment = enrollments[index];
      db.enrollments = enrollments.filter((_, i) => i !== index);
      return removedEnrollment;
    }
    return null;
  }

  function findEnrollmentsForUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.user === userId);
  }

  function findEnrollmentsForCourse(courseId) {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.course === courseId);
  }

  function findAllEnrollments() {
    return db.enrollments;
  }

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    findAllEnrollments,
  };
}