import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Checkbox,
  Button,
  Tooltip,
} from '@fluentui/react-components';
import {
  ArrowSortRegular,
  InfoRegular,
} from '@fluentui/react-icons';
import { MatchedTransaction, TransactionStatus } from '../../types';

const useStyles = makeStyles({
  tableWrapper: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.overflow('hidden'),
    boxShadow: tokens.shadow4,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding('12px'),
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  headerCellBank: {
    borderLeft: `3px solid #0078D4`,
  },
  headerCellSage: {
    borderLeft: `3px solid #8B5CF6`,
  },
  headerCellAI: {
    borderLeft: `3px solid #14B8A6`,
  },
  headerLabel: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  tableRow: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  tableRowSelected: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  tableCell: {
    ...shorthands.padding('12px'),
    verticalAlign: 'middle',
  },
  tableCellAmount: {
    fontFamily: 'Consolas, monospace',
    textAlign: 'right',
    fontWeight: tokens.fontWeightSemibold,
  },
  tableCellBank: {
    borderLeft: `3px solid #0078D4`,
    backgroundColor: '#E3F2FD',
  },
  tableCellSage: {
    borderLeft: `3px solid #8B5CF6`,
    backgroundColor: '#F3E8FF',
  },
  tableCellAI: {
    borderLeft: `3px solid #14B8A6`,
    backgroundColor: '#CCFBF1',
  },
  statusBadge: {
    cursor: 'pointer',
  },
  confidenceBadge: {
    marginLeft: '8px',
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('40px'),
    color: tokens.colorNeutralForeground3,
  },
  batchToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('12px', '20px'),
    backgroundColor: tokens.colorBrandBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  batchInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  batchActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  tableHint: {
    ...shorthands.padding('8px', '12px'),
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
});

interface TransactionTableProps {
  transactions: MatchedTransaction[];
  onTransactionSelect: (id: string, selected: boolean) => void;
  onTransactionDoubleClick: (transaction: MatchedTransaction) => void;
  onBatchApprove?: () => void;
  onBatchReject?: () => void;
  onBatchReanalyze?: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onTransactionSelect,
  onTransactionDoubleClick,
  onBatchApprove,
  onBatchReject,
  onBatchReanalyze,
}) => {
  const styles = useStyles();
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const selectedCount = transactions.filter(t => t.isSelected).length;
  const allSelected = transactions.length > 0 && selectedCount === transactions.length;

  const getStatusBadgeColor = (status: TransactionStatus) => {
    switch (status) {
      case 'Auto-Matched': return 'success';
      case 'Review Required': return 'warning';
      case 'Exception': return 'danger';
      case 'Accepted': return 'success';
      case 'Rejected': return 'danger';
      case 'Rematched': return 'informative';
      default: return 'subtle';
    }
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'danger';
      default: return 'subtle';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSelectAll = (checked: boolean) => {
    transactions.forEach(t => onTransactionSelect(t.id, checked));
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHint}>
        <InfoRegular fontSize={16} />
        Double-click on any row to review transaction details
      </div>

      {selectedCount > 0 && (
        <div className={styles.batchToolbar}>
          <div className={styles.batchInfo}>
            <Checkbox
              checked={allSelected}
              onChange={(_, data) => handleSelectAll(data.checked as boolean)}
            />
            <span>{selectedCount} transaction{selectedCount !== 1 ? 's' : ''} selected</span>
          </div>
          <div className={styles.batchActions}>
            <Button appearance="primary" size="small" onClick={onBatchApprove}>
              Approve Selected
            </Button>
            <Button appearance="secondary" size="small" onClick={onBatchReject}>
              Reject Selected
            </Button>
            <Button appearance="subtle" size="small" onClick={onBatchReanalyze}>
              Re-analyze Selected
            </Button>
          </div>
        </div>
      )}

      <Table className={styles.table}>
        <TableHeader className={styles.tableHeader}>
          <TableRow>
            <TableHeaderCell className={styles.headerCell}>
              <Checkbox
                checked={allSelected}
                onChange={(_, data) => handleSelectAll(data.checked as boolean)}
              />
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCell} onClick={() => handleSort('id')}>
              <div className={styles.headerLabel}>
                Reference
                <ArrowSortRegular fontSize={16} />
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellBank}`} onClick={() => handleSort('bankDate')}>
              <div className={styles.headerLabel}>
                Bank Date
                <ArrowSortRegular fontSize={16} />
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellBank}`}>
              <div className={styles.headerLabel}>
                Bank Description
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellBank}`} onClick={() => handleSort('bankAmount')}>
              <div className={styles.headerLabel}>
                Bank Amount
                <ArrowSortRegular fontSize={16} />
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellSage}`}>
              <div className={styles.headerLabel}>
                Sage Vendor
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellSage}`}>
              <div className={styles.headerLabel}>
                Sage Invoice
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellSage}`} onClick={() => handleSort('sageAmount')}>
              <div className={styles.headerLabel}>
                Sage Amount
                <ArrowSortRegular fontSize={16} />
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellAI}`} onClick={() => handleSort('status')}>
              <div className={styles.headerLabel}>
                Status
                <ArrowSortRegular fontSize={16} />
              </div>
            </TableHeaderCell>
            <TableHeaderCell className={`${styles.headerCell} ${styles.headerCellAI}`} onClick={() => handleSort('confidence')}>
              <div className={styles.headerLabel}>
                AI Match
                <ArrowSortRegular fontSize={16} />
              </div>
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className={styles.emptyState}>
                No transactions found. Adjust your filters or upload a bank statement.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className={`${styles.tableRow} ${transaction.isSelected ? styles.tableRowSelected : ''}`}
                onClick={() => onTransactionSelect(transaction.id, !transaction.isSelected)}
                onDoubleClick={() => onTransactionDoubleClick(transaction)}
              >
                <TableCell className={styles.tableCell}>
                  <Checkbox
                    checked={transaction.isSelected || false}
                    onChange={(_, data) => onTransactionSelect(transaction.id, data.checked as boolean)}
                  />
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <strong>{transaction.id}</strong>
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellBank}`}>
                  {formatDate(transaction.bankTransaction.date)}
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellBank}`}>
                  {transaction.bankTransaction.description}
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellBank} ${styles.tableCellAmount}`}>
                  {formatCurrency(transaction.bankTransaction.amount)}
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellSage}`}>
                  {transaction.sageTransaction?.vendor || '—'}
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellSage}`}>
                  {transaction.sageTransaction?.invoiceNumber || '—'}
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellSage} ${styles.tableCellAmount}`}>
                  {transaction.sageTransaction ? formatCurrency(transaction.sageTransaction.amount) : '—'}
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellAI}`}>
                  <Badge
                    appearance="filled"
                    color={getStatusBadgeColor(transaction.status)}
                    className={styles.statusBadge}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellAI}`}>
                  <Tooltip content={`Confidence: ${transaction.confidenceScore}%`} relationship="label">
                    <Badge
                      appearance="outline"
                      color={getConfidenceBadgeColor(transaction.confidence)}
                      className={styles.confidenceBadge}
                    >
                      {transaction.confidence} ({transaction.confidenceScore}%)
                    </Badge>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* TODO: PowerApps SDK Integration
       * Replace static table with Dataverse data:
       * - Use context.webAPI.retrieveMultipleRecords() to fetch transactions
       * - Implement server-side filtering and sorting for better performance
       * - Add pagination for large datasets
       * - Example:
       *   const result = await context.webAPI.retrieveMultipleRecords(
       *     "cr9d2_matchedtransaction",
       *     "?$select=cr9d2_name,cr9d2_status,cr9d2_confidence&$expand=cr9d2_BankTransaction,cr9d2_SageTransaction"
       *   );
       */}
    </div>
  );
};
