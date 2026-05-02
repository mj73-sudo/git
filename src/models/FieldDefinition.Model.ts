export interface FieldDefinition<T = unknown> {
  type: 'text' | 'combo' | 'date' | 'select' | 'checkbox' | 'password' | 'data' | 'multi' | 'create' | 'number' | 'info' | 'textarea' | 'type' | 'file';
  name: keyof T | string;
  title: string;
  items?: unknown[];
  itemTitle?: string;
  description?: string;
  itemValue?: string;
  options?: string[];
  error?: () => boolean;
  md?: number;
  errorMessage?: string;
  placeholder?: string;
  content?: string;
  rules?: ((value: unknown) => boolean | string)[];
  onUpdate?: (value: string | number | string[] | null) => void;
  onClick?: () => void; // فقط برای type = 'create'
  visibleIf?: { field: string; equals: unknown }[];
  enabledIf?: { field: string; equals: unknown }[];
  defaultValue?: unknown;
  hint?: string;
  maxFiles?: number;
  allowedFileTypes?: string[];
  permissions?: FieldPermissions;
  step?: number; // مشخص می‌کنه این فیلد در کدام مرحله است

}

export interface FieldPermissions {
  canCreate?: string[];
  canEdit?: string[];
  canDelete?: string[];
  visibility?: string[];
}
