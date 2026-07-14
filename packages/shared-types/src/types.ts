export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  codiceFiscale: string;
  birthDate: string;
  birthPlace?: string;
  nationality: string;
  maritalStatus: string;
  dependents: number;
  phone: string;
  email: string;
  idDocType?: string;
  idDocNumber?: string;
  idDocExpiry?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  housingStatus: string;
  yearsAtAddress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  id: string;
  status: string;
  loanType: string;
  requestedAmount: number;
  loanPurpose: string;
  durationMonths: number;
  monthlyInstallment?: number;
  disbursementDate?: string;
  urgency: string;
  notes?: string;
  googleDocId?: string;
  googleFileId?: string;
  linkedAt?: string;
  createdAt: string;
  updatedAt: string;
  applicant: Applicant;
  employment?: EmploymentInfo;
  financialProfile?: FinancialProfile;
  guarantors: Guarantor[];
  collaterals: Collateral[];
  documents: UploadedDocument[];
  notes: InternalNote[];
  assignments: ApplicationAssignment[];
  statusHistory: StatusHistory[];
  linkedGoogleDocs?: LinkedGoogleDocument[];
  consents: ConsentRecord[];
  missingDocumentTypes: string[];
  _count: {
    documents: number;
    internalNotes: number;
    notifications: number;
  };
}

export interface EmploymentInfo {
  id: string;
  status: string;
  employer?: string;
  jobTitle?: string;
  contractType?: string;
  startDate?: string;
  monthsEmployed?: number;
  monthlyNetIncome?: number;
  monthlyGrossIncome?: number;
  otherIncome?: number;
  isSelfEmployed: boolean;
  vatNumber?: string;
}

export interface FinancialProfile {
  id: string;
  monthlyHousingCost?: number;
  monthlyExpenses?: number;
  existingLoans?: number;
  totalMonthlyDebt?: number;
  totalExistingDebt?: number;
  bankName?: string;
  iban?: string;
  savings?: number;
  notes?: string;
}

export interface Guarantor {
  id: string;
  fullName: string;
  codiceFiscale?: string;
  phone?: string;
  email?: string;
  address?: string;
  relationship?: string;
  employment?: string;
  income?: number;
}

export interface Collateral {
  id: string;
  type: string;
  description?: string;
  estimatedValue?: number;
  ownershipStatus?: string;
  registrationNumber?: string;
  insuranceInfo?: string;
}

export interface UploadedDocument {
  id: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  uploadedBy: { id: string; firstName: string; lastName: string };
}

export interface InternalNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; firstName: string; lastName: string };
}

export interface ApplicationAssignment {
  id: string;
  assignedAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; role: string };
}

export interface StatusHistory {
  id: string;
  fromStatus?: string;
  toStatus: string;
  reason?: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string };
}

export interface LinkedGoogleDocument {
  id: string;
  googleDocId: string;
  googleFileId: string;
  lastSyncedAt?: string;
  linkedAt?: string;
  linkedBy: { id: string; firstName: string; lastName: string };
  watchChannels: DocumentWatchChannel[];
}

export interface DocumentWatchChannel {
  id: string;
  channelId: string;
  resourceId?: string;
  expiration: string;
  active: boolean;
}

export interface ConsentRecord {
  id: string;
  consentType: string;
  granted: boolean;
  createdAt: string;
  recordedBy: { id: string; firstName: string; lastName: string };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: unknown;
  createdAt: string;
  application?: {
    id: string;
    applicant: { firstName: string; lastName: string };
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  details?: Record<string, unknown>;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string };
  application?: {
    id: string;
    applicant: { firstName: string; lastName: string };
  };
}

export interface DashboardStats {
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
  recentApplications: LoanApplication[];
  totalApplicants: number;
  pendingDocuments: number;
  recentNotifications: Notification[];
  totalValue: number;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data?: T[];
  users?: T[];
  applicants?: T[];
  applications?: T[];
}
