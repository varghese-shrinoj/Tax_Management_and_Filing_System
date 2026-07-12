export type Role = 'ADMIN' | 'TAXPAYER' | 'VERIFIER';
export type FilingType = 'INDIVIDUAL' | 'ORGANIZATION';
export type DocumentCategory = 'AADHAR' | 'GST' | 'PAN_CARD' | 'ORGANIZATION_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'OWNER_CERTIFICATE';

export interface User {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface TaxType {
  id?: number;
  taxName: string;
  description?: string;
}

export interface TaxFiling {
  id?: number;
  financialYear: string;
  annualIncome: number;
  taxAmount: number;
  filingDate: string;
  status: string;
  filingType?: FilingType;
  organizationName?: string;
  feedback?: string;
  user?: User;
  taxType?: TaxType;
}

export interface TaxFilingRequest {
  financialYear: string;
  annualIncome: number;
  taxAmount: number;
  filingDate: string;
  status: string;
  userId: number;
  taxTypeId: number;
  filingType?: FilingType;
  organizationName?: string;
  feedback?: string;
}

export interface Payment {
  id?: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  taxFiling?: TaxFiling;
}

export interface PaymentRequest {
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  taxFilingId: number;
}

export interface TaxDocument {
  id?: number;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadDate: string;
  documentCategory?: DocumentCategory;
  taxFiling?: TaxFiling;
}

export interface DocumentRequest {
  fileName: string;
  fileType: string;
  filePath: string;
  uploadDate: string;
  taxFilingId: number;
  documentCategory: DocumentCategory;
}

export interface DashboardResponse {
  totalUsers: number;
  totalTaxFilings: number;
  totalPayments: number;
  totalDocuments: number;
  totalIndividualFilings: number;
  totalOrganizationFilings: number;
  totalIndividualPayments: number;
  totalOrganizationPayments: number;
}

export interface ReportResponse {
  totalUsers: number;
  totalTaxFilings: number;
  totalPayments: number;
  totalDocuments: number;
  totalRevenue: number;
}

export interface AuthResponse {
  message: string;
  token?: string;
  userId?: number;
  fullName?: string;
  email?: string;
  role?: Role;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  token: string;
}

export interface ProfileUpdateRequest {
  fullName: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
}
