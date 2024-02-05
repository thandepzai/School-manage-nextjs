import { SubjectType } from "./subject.type";
import { TeacherType } from "./teacher.type";

export interface SubjectClassPostType {
  id:string;
  teacherId: string;
  subjectId: string;
  maxQuantity: number;
  minQuantity: number;
  startAt: Date;
  endAt: Date;
  classRoom: string;
  academicYear: number;
  classStatus: string;
}

export interface SubjectClassGetType {
  id: string;
  teacher: TeacherType;
  subject: SubjectType;
  maxQuantity: number;
  minQuantity: number;
  startAt: Date;
  endAt: Date;
  classRoom: string;
  academicYear: number;
  classStatus: string;
}