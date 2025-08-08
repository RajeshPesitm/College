export interface Batch {
  id: number;
  year: number;
  semester: number;
}

export interface Student {
  id: number;
  name: string;
  usn: string;
  batch: number;
}

export interface Faculty {
  id:string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  batch: number;
}

export interface SubjectAllotment {
  id: number;
  faculty: string;
  subject: string;
}

export interface AttendanceRecord {
  id: number;
  student: number;
  subject: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent';
}
