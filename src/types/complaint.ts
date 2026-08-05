export type ComplaintSeverity = 'Critical' | 'Major' | 'Minor' | 'Unassigned';
export type ComplaintPriority = 'High' | 'Medium' | 'Low' | 'Unassigned';
export type ComplaintStatus = 'Pending Triage' | 'Under Investigation' | 'Duplicate Review' | 'CAPA Initiated' | 'Closed' | 'Archived';

export interface ComplaintFormData {
  // 1. ORIGIN & CUSTOMER DETAILS
  complaintSource: string;
  customerName: string;
  customerContact?: string;
  reporterRole?: string;

  // 2. PRODUCT & BATCH IDENTIFICATION
  productName: string;
  productStrengthGrade: string;
  batchLotNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantityAffected: string;
  manufacturingSite?: string;

  // 3. COMPLAINT DETAILS
  complaintType: string;
  complaintDate: string;
  detailedDescription: string;
  defectCategory?: string;

  // 4. INITIAL ASSESSMENT & PRIORITY
  initialSeverity: ComplaintSeverity;
  priority: ComplaintPriority;
  status: ComplaintStatus;
}

export interface CompletenessIssue {
  field: string;
  section: string;
  severity: 'Mandatory' | 'Recommended';
  description: string;
  regulatoryCode?: string; // e.g. FDA 21 CFR 211.198, EU GMP Annex 1
}

export interface RiskAssessmentData {
  rpnScore: number; // Severity (1-5) x Occurrence (1-5) x Detectability (1-5)
  severityScore: number;
  occurrenceScore: number;
  detectabilityScore: number;
  riskCategory: 'Critical / High Risk' | 'Major Risk' | 'Minor / Acceptable Risk';
  patientSafetyImpact: string;
  regulatoryReportingRequired: boolean; // e.g., Field Alert Report (FAR) or MedWatch
  reportingDeadline?: string;
  rationale: string;
  recommendedActions: string[];
  suggestedNextAction?: string; // e.g. "Route to QA investigation and issue replacement"
}

export interface DuplicateMatch {
  id: string;
  complaintNumber: string;
  batchLotNumber: string;
  productName: string;
  similarityPercentage: number;
  incidentDate: string;
  summary: string;
  resolutionStatus: string;
}

export interface CapaRemediation {
  id: string;
  complaintId: string;
  rootCauseMethod: '5-Whys' | 'Fishbone (Ishikawa)' | 'FMEA';
  rootCauseAnalysis: {
    why1?: string;
    why2?: string;
    why3?: string;
    why4?: string;
    why5?: string;
    primaryRootCause: string;
  };
  immediateContainment: string[];
  correctiveActions: Array<{
    action: string;
    owner: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }>;
  preventiveActions: Array<{
    action: string;
    owner: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }>;
  effectivenessCheckCriteria: string;
  effectivenessDueDate: string;
  qaApprover?: string;
  signedOff: boolean;
}

export interface LangGraphNodeState {
  nodeName: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  timestamp: string;
  details: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  agentNode?: string;
  toolInvoked?: 'Log Complaint Tool' | 'Edit Complaint Tool' | 'Document Extraction Tool';
  extractedFields?: Record<string, string>;
  updatedFields?: Record<string, string>;
  documentName?: string;
  suggestedAction?: {
    type: 'apply_extraction' | 'run_risk' | 'check_duplicates' | 'generate_capa';
    payload?: any;
    label: string;
  };
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'INGESTION' | 'EXTRACTION' | 'RISK_ASSESSMENT' | 'CAPA' | 'DATABASE' | 'COMPLIANCE' | 'EXPORT' | 'REPORT';
  user: string;
  role: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'INFO' | 'FAILURE';
  cfrReference?: string; // e.g. "21 CFR 211.198(a)", "21 CFR Part 11.10", "ICH Q9"
}

export interface ComplaintRecord extends ComplaintFormData {
  id: string;
  complaintNumber: string;
  createdAt: string;
  riskAssessment?: RiskAssessmentData;
  duplicates?: DuplicateMatch[];
  capa?: CapaRemediation;
  rawText?: string;
  sourceDocumentName?: string;
}

export interface SamplePreset {
  id: string;
  title: string;
  fileName: string;
  category: string;
  rawText: string;
  parsedData: ComplaintFormData;
}
