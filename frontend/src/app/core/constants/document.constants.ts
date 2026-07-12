import { DocumentCategory } from '../models';

export interface RequiredDocument {
  category: DocumentCategory;
  label: string;
}

export const INDIVIDUAL_DOCUMENTS: RequiredDocument[] = [
  { category: 'AADHAR', label: 'Aadhar Card (PDF/Image)' },
  { category: 'PAN_CARD', label: 'PAN Card (PDF/Image)' },
  { category: 'GST', label: 'GST Certificate (PDF/Image)' }
];

export const ORGANIZATION_DOCUMENTS: RequiredDocument[] = [
  { category: 'ORGANIZATION_CERTIFICATE', label: 'Organisation Certificate (PDF/Image)' },
  { category: 'INCOME_CERTIFICATE', label: 'Income Certificate (PDF/Image)' },
  { category: 'OWNER_CERTIFICATE', label: 'Owner Certificate (PDF/Image)' }
];
