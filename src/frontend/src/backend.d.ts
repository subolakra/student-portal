import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type NoteId = bigint;
export type Timestamp = bigint;
export interface Job {
    id: JobId;
    postedDate: Timestamp;
    role: string;
    description: string;
    deadline: string;
    isActive: boolean;
    eligibility: string;
    company: string;
    pdfKey: string;
}
export type InternshipId = bigint;
export interface Internship {
    id: InternshipId;
    duration: string;
    postedDate: Timestamp;
    role: string;
    description: string;
    deadline: string;
    isActive: boolean;
    company: string;
    pdfKey: string;
    requirements: string;
    stipend: string;
    applicationLink: string;
}
export type JobId = bigint;
export interface Profile {
    principal: Principal;
    semester: bigint;
    name: string;
    year: bigint;
    email: string;
    rollNumber: string;
    enrollmentDate: Timestamp;
    phone: string;
    course: string;
}
export interface Note {
    id: NoteId;
    title: string;
    subject: string;
    description: string;
    fileType: FileType;
    uploadDate: Timestamp;
    uploadedBy: Principal;
    fileKey: string;
}
export enum FileType {
    pdf = "pdf",
    text = "text"
}
export interface backendInterface {
    addInternship(input: {
        duration: string;
        role: string;
        description: string;
        deadline: string;
        company: string;
        pdfKey: string;
        requirements: string;
        stipend: string;
        applicationLink: string;
    }): Promise<bigint>;
    addJob(input: {
        role: string;
        description: string;
        deadline: string;
        eligibility: string;
        company: string;
        pdfKey: string;
    }): Promise<bigint>;
    addNote(input: {
        title: string;
        subject: string;
        description: string;
        fileType: FileType;
        fileKey: string;
    }): Promise<bigint>;
    deleteInternship(id: InternshipId): Promise<boolean>;
    deleteJob(id: JobId): Promise<boolean>;
    deleteNote(id: NoteId): Promise<boolean>;
    getInternshipById(id: InternshipId): Promise<Internship | null>;
    getInternships(): Promise<Array<Internship>>;
    getJobById(id: JobId): Promise<Job | null>;
    getJobs(): Promise<Array<Job>>;
    getMyProfile(): Promise<Profile>;
    getNoteById(id: NoteId): Promise<Note | null>;
    getNotes(): Promise<Array<Note>>;
    getStudentProfile(p: Principal): Promise<Profile | null>;
    isAdmin(): Promise<boolean>;
    listStudents(): Promise<Array<Profile>>;
    updateInternship(id: InternshipId, input: {
        duration: string;
        role: string;
        description: string;
        deadline: string;
        company: string;
        pdfKey: string;
        requirements: string;
        stipend: string;
        applicationLink: string;
    }): Promise<boolean>;
    updateJob(id: JobId, input: {
        role: string;
        description: string;
        deadline: string;
        eligibility: string;
        company: string;
        pdfKey: string;
    }): Promise<boolean>;
    updateMyProfile(input: {
        semester: bigint;
        name: string;
        year: bigint;
        email: string;
        rollNumber: string;
        phone: string;
        course: string;
    }): Promise<void>;
    updateNote(id: NoteId, input: {
        title: string;
        subject: string;
        description: string;
        fileType: FileType;
        fileKey: string;
    }): Promise<boolean>;
}
