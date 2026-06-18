export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "REMOTE";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string;
  salaryMin: number | null;
  salaryMax: number | null;
  contactEmail: string;
  postDate: Date;
  deletedAt: Date | null;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: Date;
}

export type CreateListingInput = Pick<
  JobListing,
  | "title"
  | "company"
  | "location"
  | "type"
  | "description"
  | "requirements"
  | "salaryMin"
  | "salaryMax"
  | "contactEmail"
>;

export type UpdateListingInput = Partial<CreateListingInput>;
