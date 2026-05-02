import type { FileType } from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";

export type { FileType };

export interface Note {
  id: bigint;
  title: string;
  subject: string;
  description: string;
  fileType: FileType;
  fileKey: string;
  uploadDate: bigint;
  uploadedBy: Principal;
}

export interface Job {
  id: bigint;
  company: string;
  role: string;
  eligibility: string;
  deadline: string;
  description: string;
  pdfKey: string;
  postedDate: bigint;
  isActive: boolean;
}

export interface Internship {
  id: bigint;
  company: string;
  role: string;
  duration: string;
  stipend: string;
  requirements: string;
  deadline: string;
  description: string;
  pdfKey: string;
  applicationLink: string;
  postedDate: bigint;
  isActive: boolean;
}

export interface Profile {
  principal: Principal;
  name: string;
  rollNumber: string;
  course: string;
  year: bigint;
  semester: bigint;
  email: string;
  phone: string;
  enrollmentDate: bigint;
}

export type NavItem = {
  label: string;
  href: string;
  adminOnly?: boolean;
};
