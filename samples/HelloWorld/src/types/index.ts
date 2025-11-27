// TypeScript types for Bank Reconciliation System

export type TransactionStatus = 
  | 'Auto-Matched' 
  | 'Review Required' 
  | 'Exception' 
  | 'Manual Handling' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Rematched'
  | 'Reconciled';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type AuditCategory = 'upload' | 'matching' | 'reconciliation' | 'config' | 'auth';
export type AuditAction = 'create' | 'update' | 'delete' | 'approve' | 'reject';
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ActorType = 'user' | 'system' | 'ai';

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  reference: string;
  balance?: number;
}

export interface SageTransaction {
  id: string;
  date: string;
  vendor: string;
  invoiceNumber: string;
  amount: number;
  reference: string;
  type?: string;
}

export interface MatchedTransaction {
  id: string;
  bankTransaction: BankTransaction;
  sageTransaction: SageTransaction | null;
  status: TransactionStatus;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  notes?: string;
  matchedBy?: string;
  matchedDate?: string;
  isSelected?: boolean;
}

export interface DashboardStats {
  totalTransactions: number;
  autoMatched: number;
  needsReview: number;
  exceptions: number;
  bankBalance: number;
  sageBalance: number;
  variance: number;
  reconciliationRate: number;
  avgConfidence: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: ActorType;
  category: AuditCategory;
  action: AuditAction;
  severity: AuditSeverity;
  description: string;
  details?: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface UserProfile {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

export interface NotesHistoryItem {
  id: string;
  action: 'accepted' | 'rejected' | 'review' | 'note' | 'ai';
  user: string;
  date: string;
  note?: string;
}

// Filter types
export interface FilterState {
  status: TransactionStatus[];
  confidenceLevel: ConfidenceLevel[];
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  searchQuery: string;
}

export interface AuditFilterState {
  category: AuditCategory[];
  action: AuditAction[];
  severity: AuditSeverity[];
  actorType: ActorType[];
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
}
