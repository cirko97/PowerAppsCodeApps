// Mock data for frontend demonstration
// TODO: Replace with Power Apps SDK data fetching from Dataverse

import { 
  MatchedTransaction, 
  DashboardStats, 
  AuditLogEntry, 
  NotificationItem,
  UserProfile,
  SageTransaction 
} from '../types';

export const mockUser: UserProfile = {
  name: 'Sarah Johnson',
  role: 'Finance Manager',
  email: 'sarah.johnson@operationsmile.org'
};

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: '12 new transactions',
    message: 'Require your review',
    time: '5 min ago',
    isRead: false,
    type: 'warning'
  },
  {
    id: '2',
    title: 'Bank statement uploaded',
    message: 'Processing complete',
    time: '1 hour ago',
    isRead: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'Exception flagged',
    message: 'TR-2024-089 needs attention',
    time: '2 hours ago',
    isRead: true,
    type: 'error'
  }
];

export const mockStats: DashboardStats = {
  totalTransactions: 847,
  autoMatched: 784,
  needsReview: 42,
  exceptions: 21,
  bankBalance: 2847293.45,
  sageBalance: 2847293.45,
  variance: 0.00,
  reconciliationRate: 92.6,
  avgConfidence: 94.2
};

export const mockMatchedTransactions: MatchedTransaction[] = [
  {
    id: 'TR-2024-001',
    bankTransaction: {
      id: 'BNK-001',
      date: '2024-01-15',
      description: 'ACME Medical Supplies',
      amount: 15840.00,
      reference: 'TRF20240115001',
      balance: 2847293.45
    },
    sageTransaction: {
      id: 'SGE-001',
      date: '2024-01-15',
      vendor: 'ACME Medical Supplies',
      invoiceNumber: 'INV-2024-0156',
      amount: 15840.00,
      reference: 'PO-2024-0089'
    },
    status: 'Auto-Matched',
    confidence: 'High',
    confidenceScore: 98.5,
    matchedBy: 'AI System',
    matchedDate: '2024-01-15T10:30:00Z'
  },
  {
    id: 'TR-2024-002',
    bankTransaction: {
      id: 'BNK-002',
      date: '2024-01-16',
      description: 'Global Health Donors',
      amount: 50000.00,
      reference: 'DON20240116',
      balance: 2897293.45
    },
    sageTransaction: {
      id: 'SGE-002',
      date: '2024-01-16',
      vendor: 'Global Health Donors',
      invoiceNumber: 'DON-2024-0012',
      amount: 50000.00,
      reference: 'GRANT-2024-Q1'
    },
    status: 'Auto-Matched',
    confidence: 'High',
    confidenceScore: 99.2,
    matchedBy: 'AI System',
    matchedDate: '2024-01-16T09:15:00Z'
  },
  {
    id: 'TR-2024-003',
    bankTransaction: {
      id: 'BNK-003',
      date: '2024-01-17',
      description: 'Medical Equipment LLC',
      amount: 8450.00,
      reference: 'TRF20240117003',
      balance: 2888843.45
    },
    sageTransaction: {
      id: 'SGE-003',
      date: '2024-01-17',
      vendor: 'Medical Equipment LLC',
      invoiceNumber: 'INV-2024-0178',
      amount: 8500.00,
      reference: 'PO-2024-0091'
    },
    status: 'Review Required',
    confidence: 'Medium',
    confidenceScore: 75.3,
    notes: 'Amount discrepancy: $50 difference'
  },
  {
    id: 'TR-2024-004',
    bankTransaction: {
      id: 'BNK-004',
      date: '2024-01-18',
      description: 'UNKNOWN VENDOR',
      amount: 2340.00,
      reference: 'TRF20240118004',
      balance: 2886503.45
    },
    sageTransaction: null,
    status: 'Exception',
    confidence: 'Low',
    confidenceScore: 25.0,
    notes: 'No matching vendor found in Sage'
  },
  {
    id: 'TR-2024-005',
    bankTransaction: {
      id: 'BNK-005',
      date: '2024-01-19',
      description: 'Pharmaceutical Supplies Inc',
      amount: 23500.00,
      reference: 'TRF20240119005',
      balance: 2863003.45
    },
    sageTransaction: {
      id: 'SGE-005',
      date: '2024-01-19',
      vendor: 'Pharmaceutical Supplies Inc',
      invoiceNumber: 'INV-2024-0201',
      amount: 23500.00,
      reference: 'PO-2024-0095'
    },
    status: 'Accepted',
    confidence: 'High',
    confidenceScore: 97.8,
    matchedBy: 'Sarah Johnson',
    matchedDate: '2024-01-19T14:20:00Z',
    notes: 'Manually verified and approved'
  }
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2024-01-20T10:30:00Z',
    actor: 'Sarah Johnson',
    actorType: 'user',
    category: 'matching',
    action: 'approve',
    severity: 'info',
    description: 'Approved transaction match',
    details: 'Transaction TR-2024-005 approved',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'AUD-002',
    timestamp: '2024-01-20T09:15:00Z',
    actor: 'AI Matching Engine',
    actorType: 'ai',
    category: 'matching',
    action: 'create',
    severity: 'info',
    description: 'Auto-matched transactions',
    details: 'Processed 50 transactions with 95% confidence',
    ipAddress: 'system'
  },
  {
    id: 'AUD-003',
    timestamp: '2024-01-19T16:45:00Z',
    actor: 'System',
    actorType: 'system',
    category: 'upload',
    action: 'create',
    severity: 'info',
    description: 'Bank statement uploaded',
    details: 'January 2024 statement - 150 transactions',
    ipAddress: '192.168.1.50'
  },
  {
    id: 'AUD-004',
    timestamp: '2024-01-19T14:30:00Z',
    actor: 'Sarah Johnson',
    actorType: 'user',
    category: 'matching',
    action: 'reject',
    severity: 'warning',
    description: 'Rejected transaction match',
    details: 'Transaction TR-2024-089 rejected due to amount mismatch',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'AUD-005',
    timestamp: '2024-01-18T11:20:00Z',
    actor: 'John Doe',
    actorType: 'user',
    category: 'config',
    action: 'update',
    severity: 'info',
    description: 'Updated matching rules',
    details: 'Changed confidence threshold from 85% to 90%',
    ipAddress: '192.168.1.105'
  }
];

// Available Sage transactions for manual matching
export const mockAvailableSageTransactions: SageTransaction[] = [
  {
    id: 'SGE-100',
    date: '2024-01-17',
    vendor: 'Medical Equipment LLC',
    invoiceNumber: 'INV-2024-0178',
    amount: 8500.00,
    reference: 'PO-2024-0091',
    type: 'Invoice'
  },
  {
    id: 'SGE-101',
    date: '2024-01-17',
    vendor: 'Healthcare Supplies Co',
    invoiceNumber: 'INV-2024-0180',
    amount: 8450.00,
    reference: 'PO-2024-0092',
    type: 'Invoice'
  },
  {
    id: 'SGE-102',
    date: '2024-01-16',
    vendor: 'Medical Instruments Inc',
    invoiceNumber: 'INV-2024-0175',
    amount: 8400.00,
    reference: 'PO-2024-0090',
    type: 'Invoice'
  }
];
