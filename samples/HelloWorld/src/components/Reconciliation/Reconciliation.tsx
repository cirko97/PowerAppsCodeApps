import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Title3,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Checkbox,
} from '@fluentui/react-components';
import {
  CheckmarkCircleRegular,
  ArrowSortRegular,
} from '@fluentui/react-icons';
import { MatchedTransaction } from '../../types';

const useStyles = makeStyles({
  reconciliationContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  pageTitle: {
    color: tokens.colorNeutralForeground1,
  },
  headerActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  summaryCard: {
    ...shorthands.padding('24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    ...shorthands.gap('24px'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
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
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
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
  },
  tableCellAmount: {
    fontFamily: 'Consolas, monospace',
    textAlign: 'right',
    fontWeight: tokens.fontWeightSemibold,
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
});

interface ReconciliationProps {
  transactions: MatchedTransaction[];
  onTransactionUpdate: (transactions: MatchedTransaction[]) => void;
  onOpenDetailModal: (transaction: MatchedTransaction) => void;
}

export const Reconciliation: React.FC<ReconciliationProps> = ({
  transactions,
  onTransactionUpdate,
  onOpenDetailModal,
}) => {
  const styles = useStyles();

  // Filter only accepted transactions for reconciliation
  const acceptedTransactions = transactions.filter(t => t.status === 'Accepted');
  const selectedCount = acceptedTransactions.filter(t => t.isSelected).length;
  const allSelected = acceptedTransactions.length > 0 && selectedCount === acceptedTransactions.length;

  // Calculate summary
  const totalAmount = acceptedTransactions.reduce((sum, t) => sum + t.bankTransaction.amount, 0);
  const reconciledCount = acceptedTransactions.filter(t => t.status === 'Reconciled').length;

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
    const updatedTransactions = transactions.map((t) =>
      t.status === 'Accepted' ? { ...t, isSelected: checked } : t
    );
    onTransactionUpdate(updatedTransactions);
  };

  const handleTransactionSelect = (id: string, selected: boolean) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === id ? { ...t, isSelected: selected } : t
    );
    onTransactionUpdate(updatedTransactions);
  };

  const handleBatchReconcile = () => {
    const updatedTransactions = transactions.map((t) =>
      t.isSelected ? { ...t, status: 'Reconciled' as const, isSelected: false } : t
    );
    onTransactionUpdate(updatedTransactions);
    // TODO: PowerApps SDK - Batch reconcile transactions
    // Example:
    // const selectedIds = transactions.filter(t => t.isSelected).map(t => t.id);
    // await Promise.all(selectedIds.map(id =>
    //   context.webAPI.updateRecord("cr9d2_matchedtransaction", id, {
    //     cr9d2_status: 'Reconciled',
    //     cr9d2_reconciledate: new Date().toISOString()
    //   })
    // ));
  };

  return (
    <div className={styles.reconciliationContainer}>
      <div className={styles.pageHeader}>
        <Title3 className={styles.pageTitle}>Reconciliation</Title3>
        <div className={styles.headerActions}>
          <Button
            appearance="primary"
            icon={<CheckmarkCircleRegular />}
            disabled={selectedCount === 0}
            onClick={handleBatchReconcile}
          >
            Reconcile Selected ({selectedCount})
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className={styles.summaryCard}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Ready for Reconciliation</div>
            <div className={styles.summaryValue}>{acceptedTransactions.length}</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Total Amount</div>
            <div className={styles.summaryValue}>{formatCurrency(totalAmount)}</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Reconciled</div>
            <div className={styles.summaryValue} style={{ color: tokens.colorPaletteGreenForeground1 }}>
              {reconciledCount}
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Pending</div>
            <div className={styles.summaryValue} style={{ color: tokens.colorPaletteYellowForeground1 }}>
              {acceptedTransactions.length - reconciledCount}
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction Table */}
      <div className={styles.tableWrapper}>
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
              <Button appearance="primary" size="small" onClick={handleBatchReconcile}>
                Reconcile Selected
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
              <TableHeaderCell className={styles.headerCell}>
                <div className={styles.headerLabel}>
                  Reference
                  <ArrowSortRegular fontSize={16} />
                </div>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>
                <div className={styles.headerLabel}>
                  Date
                  <ArrowSortRegular fontSize={16} />
                </div>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>
                Bank Description
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>
                Sage Vendor
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>
                Sage Invoice
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>
                <div className={styles.headerLabel}>
                  Amount
                  <ArrowSortRegular fontSize={16} />
                </div>
              </TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>
                Status
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acceptedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                  No transactions ready for reconciliation. Accept matched transactions first.
                </TableCell>
              </TableRow>
            ) : (
              acceptedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={`${styles.tableRow} ${transaction.isSelected ? styles.tableRowSelected : ''}`}
                  onClick={() => handleTransactionSelect(transaction.id, !transaction.isSelected)}
                  onDoubleClick={() => onOpenDetailModal(transaction)}
                >
                  <TableCell className={styles.tableCell}>
                    <Checkbox
                      checked={transaction.isSelected || false}
                      onChange={(_, data) => handleTransactionSelect(transaction.id, data.checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <strong>{transaction.id}</strong>
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    {formatDate(transaction.bankTransaction.date)}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    {transaction.bankTransaction.description}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    {transaction.sageTransaction?.vendor || '—'}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    {transaction.sageTransaction?.invoiceNumber || '—'}
                  </TableCell>
                  <TableCell className={`${styles.tableCell} ${styles.tableCellAmount}`}>
                    {formatCurrency(transaction.bankTransaction.amount)}
                  </TableCell>
                  <TableCell className={styles.tableCell}>
                    <Badge appearance="filled" color="success">
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* TODO: PowerApps SDK Integration
       * Add reconciliation features:
       * - Generate reconciliation reports using Power BI embedded
       * - Export to Excel using context.webAPI with custom actions
       * - Schedule automated reconciliation with Power Automate
       * - Send email notifications on completion
       */}
    </div>
  );
};
