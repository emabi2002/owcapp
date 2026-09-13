export type ClaimStatus =
  | "Received"
  | "Under Assessment"
  | "Awaiting Documents"
  | "Approved"
  | "Paid"
  | "Declined";

export interface ClaimProgressStep {
  label: string;
  done: boolean;
  date?: string;
}

export interface ClaimUpdate {
  date: string;
  text: string;
}

export interface ClaimTrackResponse {
  reference: string;
  status: ClaimStatus;
  type: string;
  employer: string;
  lodged: string;
  injuryDate: string;
  worker: string;
  steps: ClaimProgressStep[];
  pending?: string[];
  updates?: ClaimUpdate[];
}

export interface ClaimLodgeRequest {
  name: string;
  dob?: string;
  phone: string;
  email?: string;
  nid?: string;
  employer: string;
  occupation?: string;
  province?: string;
  wage?: string;
  injuryDate: string;
  injuryType?: string;
  location?: string;
  description: string;
}

export interface ClaimLodgeResponse {
  reference: string;
  status?: ClaimStatus;
  message?: string;
}

export interface EmployerVerifyResponse {
  registered: boolean;
  registrationNumber?: string;
  employerName?: string;
  status?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  category?: string;
  href?: string;
}

export interface FormItem {
  id: string;
  code?: string;
  title: string;
  description?: string;
  href?: string;
}
