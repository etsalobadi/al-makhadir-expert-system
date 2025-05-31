
import {
  EXPERT_SPECIALTIES,
  EXPERT_STATUS,
  CASE_STATUS,
  CASE_TYPES,
  SESSION_TYPES,
  SESSION_STATUS,
  ATTACHMENT_TYPES,
  COMPLAINT_TYPES,
  COMPLAINT_STATUS,
  PRIORITY_LEVELS,
  type ExpertSpecialty,
  type ExpertStatus,
  type CaseStatus,
  type CaseType,
  type SessionType,
  type SessionStatus,
  type AttachmentType,
  type ComplaintType,
  type ComplaintStatus,
  type PriorityLevel
} from '@/types/database';

// Type guard functions for runtime validation
export function isExpertSpecialty(value: string): value is ExpertSpecialty {
  return Object.values(EXPERT_SPECIALTIES).includes(value as ExpertSpecialty);
}

export function isExpertStatus(value: string): value is ExpertStatus {
  return Object.values(EXPERT_STATUS).includes(value as ExpertStatus);
}

export function isCaseStatus(value: string): value is CaseStatus {
  return Object.values(CASE_STATUS).includes(value as CaseStatus);
}

export function isCaseType(value: string): value is CaseType {
  return Object.values(CASE_TYPES).includes(value as CaseType);
}

export function isSessionType(value: string): value is SessionType {
  return Object.values(SESSION_TYPES).includes(value as SessionType);
}

export function isSessionStatus(value: string): value is SessionStatus {
  return Object.values(SESSION_STATUS).includes(value as SessionStatus);
}

export function isAttachmentType(value: string): value is AttachmentType {
  return Object.values(ATTACHMENT_TYPES).includes(value as AttachmentType);
}

export function isComplaintType(value: string): value is ComplaintType {
  return Object.values(COMPLAINT_TYPES).includes(value as ComplaintType);
}

export function isComplaintStatus(value: string): value is ComplaintStatus {
  return Object.values(COMPLAINT_STATUS).includes(value as ComplaintStatus);
}

export function isPriorityLevel(value: string): value is PriorityLevel {
  return Object.values(PRIORITY_LEVELS).includes(value as PriorityLevel);
}

// Validation function that throws if type is invalid
export function validateAndCast<T>(
  value: string,
  validator: (val: string) => val is T,
  fieldName: string
): T {
  if (!validator(value)) {
    throw new Error(`Invalid ${fieldName}: ${value}`);
  }
  return value as T;
}

// Safe casting functions with fallbacks
export function safeExpertSpecialty(value: string, fallback: ExpertSpecialty = EXPERT_SPECIALTIES.ENGINEERING): ExpertSpecialty {
  return isExpertSpecialty(value) ? value : fallback;
}

export function safeExpertStatus(value: string, fallback: ExpertStatus = EXPERT_STATUS.PENDING): ExpertStatus {
  return isExpertStatus(value) ? value : fallback;
}

export function safeCaseStatus(value: string, fallback: CaseStatus = CASE_STATUS.REGISTERED): CaseStatus {
  return isCaseStatus(value) ? value : fallback;
}

export function safeCaseType(value: string, fallback: CaseType = CASE_TYPES.INHERITANCE): CaseType {
  return isCaseType(value) ? value : fallback;
}

export function safeSessionType(value: string, fallback: SessionType = SESSION_TYPES.HEARING): SessionType {
  return isSessionType(value) ? value : fallback;
}

export function safeSessionStatus(value: string, fallback: SessionStatus = SESSION_STATUS.SCHEDULED): SessionStatus {
  return isSessionStatus(value) ? value : fallback;
}

export function safeAttachmentType(value: string, fallback: AttachmentType = ATTACHMENT_TYPES.OTHER): AttachmentType {
  return isAttachmentType(value) ? value : fallback;
}

export function safeComplaintType(value: string, fallback: ComplaintType = COMPLAINT_TYPES.OTHER): ComplaintType {
  return isComplaintType(value) ? value : fallback;
}

export function safeComplaintStatus(value: string, fallback: ComplaintStatus = COMPLAINT_STATUS.OPEN): ComplaintStatus {
  return isComplaintStatus(value) ? value : fallback;
}

export function safePriorityLevel(value: string, fallback: PriorityLevel = PRIORITY_LEVELS.MEDIUM): PriorityLevel {
  return isPriorityLevel(value) ? value : fallback;
}
