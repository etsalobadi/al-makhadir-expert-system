
import { 
  Expert, 
  ExpertAttachment, 
  InheritanceCase, 
  CaseSession, 
  Complaint 
} from '@/types/database';
import {
  safeExpertSpecialty,
  safeExpertStatus,
  safeCaseStatus,
  safeCaseType,
  safeSessionType,
  safeSessionStatus,
  safeAttachmentType,
  safeComplaintType,
  safeComplaintStatus,
  safePriorityLevel
} from '@/utils/typeGuards';

// Transform database records to type-safe interfaces
export function transformExpertFromDB(dbRecord: any): Expert {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    email: dbRecord.email,
    phone: dbRecord.phone,
    national_id: dbRecord.national_id,
    specialty: safeExpertSpecialty(dbRecord.specialty),
    qualification: dbRecord.qualification,
    university: dbRecord.university,
    graduation_year: dbRecord.graduation_year,
    experience_years: dbRecord.experience_years,
    status: safeExpertStatus(dbRecord.status),
    previous_cases: dbRecord.previous_cases || 0,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at
  };
}

export function transformExpertAttachmentFromDB(dbRecord: any): ExpertAttachment {
  return {
    id: dbRecord.id,
    expert_id: dbRecord.expert_id,
    file_name: dbRecord.file_name,
    file_path: dbRecord.file_path,
    file_type: dbRecord.file_type,
    file_size: dbRecord.file_size,
    attachment_type: safeAttachmentType(dbRecord.attachment_type),
    description: dbRecord.description,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at
  };
}

export function transformInheritanceCaseFromDB(dbRecord: any): InheritanceCase {
  return {
    id: dbRecord.id,
    case_number: dbRecord.case_number,
    court_number: dbRecord.court_number,
    deceased_name: dbRecord.deceased_name,
    death_date: dbRecord.death_date,
    death_certificate_number: dbRecord.death_certificate_number,
    case_type: safeCaseType(dbRecord.case_type),
    status: safeCaseStatus(dbRecord.status),
    assigned_expert: dbRecord.assigned_expert,
    total_estate_value: dbRecord.total_estate_value,
    comments: dbRecord.comments,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at
  };
}

export function transformCaseSessionFromDB(dbRecord: any): CaseSession {
  return {
    id: dbRecord.id,
    case_id: dbRecord.case_id,
    session_date: dbRecord.session_date,
    session_type: safeSessionType(dbRecord.session_type),
    status: safeSessionStatus(dbRecord.status),
    location: dbRecord.location,
    notes: dbRecord.notes,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at
  };
}

export function transformComplaintFromDB(dbRecord: any): Complaint {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    description: dbRecord.description,
    type: safeComplaintType(dbRecord.type),
    status: safeComplaintStatus(dbRecord.status),
    priority: safePriorityLevel(dbRecord.priority),
    submitted_by: dbRecord.submitted_by,
    submitted_date: dbRecord.submitted_date,
    assigned_to: dbRecord.assigned_to,
    resolution: dbRecord.resolution,
    attachments: Array.isArray(dbRecord.attachments) ? dbRecord.attachments : [],
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at
  };
}

// Transform arrays of database records
export function transformExpertsFromDB(dbRecords: any[]): Expert[] {
  return dbRecords.map(transformExpertFromDB);
}

export function transformExpertAttachmentsFromDB(dbRecords: any[]): ExpertAttachment[] {
  return dbRecords.map(transformExpertAttachmentFromDB);
}

export function transformInheritanceCasesFromDB(dbRecords: any[]): InheritanceCase[] {
  return dbRecords.map(transformInheritanceCaseFromDB);
}

export function transformCaseSessionsFromDB(dbRecords: any[]): CaseSession[] {
  return dbRecords.map(transformCaseSessionFromDB);
}

export function transformComplaintsFromDB(dbRecords: any[]): Complaint[] {
  return dbRecords.map(transformComplaintFromDB);
}
