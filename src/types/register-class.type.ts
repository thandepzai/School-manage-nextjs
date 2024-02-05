import { StudentType } from "./student.type";
import { SubjectClassGetType } from "./subject-class.type";

export interface RegisterClassGetType {
  id: string;
  student: StudentType;
  subjectClass: SubjectClassGetType;
  status: string;
}

export interface RegisterClassPostType {
  id: string;
  studentId: string;
  subjectClassId: string;
  status: string;
}