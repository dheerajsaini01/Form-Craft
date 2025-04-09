
export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'date';

export interface FieldOption {
  id: string;
  value: string;
  label: string;
}

export interface FieldCondition {
  id: string;
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  description?: string;
  conditions?: FieldCondition[];
}

export interface FormStyle {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: number;
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  fields: FormField[];
  style: FormStyle;
  expiresAt?: number;
  isTemplate?: boolean;
  isPublic?: boolean;
  shareUrl?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: number;
  data: Record<string, any>;
}
