export interface Batch {
  id: string;
  year: number;
  semester: number;
}

export interface Student {
  id: string;
  name: string;
  usn: string;
  batchId: string;
}

export interface Faculty {
  id:string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  batchId: string;
}

export interface SubjectAllotment {
  id: string;
  facultyId: string;
  subjectId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent';
}