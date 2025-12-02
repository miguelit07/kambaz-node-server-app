import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    return await model.find({ course: courseId });
  }

  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return await model.create(newAssignment);
  }

  async function deleteAssignment(assignmentId) {
    await model.deleteOne({ _id: assignmentId });
    return { status: "ok" };
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    await model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
    const updatedAssignment = await model.findById(assignmentId);
    return updatedAssignment;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}