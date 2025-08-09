// This file is for global type definitions.

export interface Batch {
  id: number;
  year: number;
  semester: number;
  academic_year: string;
}

export interface Student {
  id: number;
  usn: string;
  name: string;
  batch: number; // batch id
}

export interface Faculty {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  batch: number; // batch id
}

export interface SubjectAllotment {
  id: number;
  faculty: Faculty;
  subject: Subject;
}

export interface AttendanceRecord {
    id?: number;
    student: number; // student id
    subject: string; // subject id
    date: string; // YYYY-MM-DD
    status: 'present' | 'absent';
}
