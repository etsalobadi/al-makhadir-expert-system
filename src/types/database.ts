
// Core database types and enums
export const EXPERT_SPECIALTIES = {
  ENGINEERING: 'engineering',
  ACCOUNTING: 'accounting', 
  MEDICAL: 'medical',
  IT: 'it',
  REAL_ESTATE: 'real_estate',
  INHERITANCE: 'inheritance'
} as const;

export const EXPERT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired'
} as const;

export const CASE_STATUS = {
  REGISTERED: 'registered',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CLOSED: 'closed',
  CANCELLED: 'cancelled'
} as const;

export const CASE_TYPES = {
  INHERITANCE: 'inheritance',
  ESTATE_DIVISION: 'estate_division',
  PROPERTY_DISPUTE: 'property_dispute'
} as const;

export const SESSION_TYPES = {
  HEARING: 'hearing',
  REVIEW: 'review',
  DECISION: 'decision',
  CONSULTATION: 'consultation'
} as const;

export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  POSTPONED: 'postponed',
  CANCELLED: 'cancelled'
} as const;

export const ATTACHMENT_TYPES = {
  CERTIFICATE: 'certificate',
  ID_DOCUMENT: 'id_document',
  CV: 'cv',
  LICENSE: 'license',
  OTHER: 'other'
} as const;

export const COMPLAINT_TYPES = {
  TECHNICAL: 'technical',
  ADMINISTRATIVE: 'administrative',
  LEGAL: 'legal',
  OTHER: 'other'
} as const;

export const COMPLAINT_STATUS = {
  OPEN: 'open',
  PROCESSING: 'processing',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

// Type definitions
export type ExpertSpecialty = typeof EXPERT_SPECIALTIES[keyof typeof EXPERT_SPECIALTIES];
export type ExpertStatus = typeof EXPERT_STATUS[keyof typeof EXPERT_STATUS];
export type CaseStatus = typeof CASE_STATUS[keyof typeof CASE_STATUS];
export type CaseType = typeof CASE_TYPES[keyof typeof CASE_TYPES];
export type SessionType = typeof SESSION_TYPES[keyof typeof SESSION_TYPES];
export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
export type AttachmentType = typeof ATTACHMENT_TYPES[keyof typeof ATTACHMENT_TYPES];
export type ComplaintType = typeof COMPLAINT_TYPES[keyof typeof COMPLAINT_TYPES];
export type ComplaintStatus = typeof COMPLAINT_STATUS[keyof typeof COMPLAINT_STATUS];
export type PriorityLevel = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS];

// Base database record interface
export interface BaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

// Core entity interfaces
export interface Expert extends BaseRecord {
  name: string;
  email: string;
  phone: string;
  national_id?: string;
  specialty: ExpertSpecialty;
  qualification?: string;
  university?: string;
  graduation_year?: string;
  experience_years?: number;
  status: ExpertStatus;
  previous_cases: number;
}

export interface ExpertAttachment extends BaseRecord {
  expert_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  attachment_type: AttachmentType;
  description?: string;
}

export interface InheritanceCase extends BaseRecord {
  case_number: string;
  court_number: string;
  deceased_name: string;
  death_date: string;
  death_certificate_number?: string;
  case_type: CaseType;
  status: CaseStatus;
  assigned_expert: string;
  total_estate_value?: number;
  comments?: string;
}

export interface CaseSession extends BaseRecord {
  case_id: string;
  session_date: string;
  session_type: SessionType;
  status: SessionStatus;
  location?: string;
  notes?: string;
}

export interface Complaint extends BaseRecord {
  title: string;
  description: string;
  type: ComplaintType;
  status: ComplaintStatus;
  priority: PriorityLevel;
  submitted_by: string;
  submitted_date: string;
  assigned_to?: string;
  resolution?: string;
  attachments: any[];
}
