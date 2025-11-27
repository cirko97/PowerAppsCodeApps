import React, { useState, useMemo } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Title3,
} from '@fluentui/react-components';
import {
  ArrowUploadRegular,
  QuestionCircleRegular,
} from '@fluentui/react-icons';
import { FilterPanel } from './FilterPanel';
import { TransactionTable } from './TransactionTable';
import { MatchedTransaction, FilterState } from '../../types';

const useStyles = makeStyles({
  matchingContainer: {
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
});

interface TransactionMatchingProps {
  transactions: MatchedTransaction[];
  onTransactionUpdate: (transactions: MatchedTransaction[]) => void;
  onOpenReviewModal: (transaction: MatchedTransaction) => void;
  onOpenUploadModal: () => void;
  onOpenHelpModal: () => void;
}

export const TransactionMatching: React.FC<TransactionMatchingProps> = ({
  transactions,
  onTransactionUpdate,
  onOpenReviewModal,
  onOpenUploadModal,
  onOpenHelpModal,
}) => {
  const styles = useStyles();

  const [filters, setFilters] = useState<FilterState>({
    status: [],
    confidenceLevel: [],
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    searchQuery: '',
  });

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(transaction.status)) {
        return false;
      }

      // Confidence filter
      if (filters.confidenceLevel.length > 0 && !filters.confidenceLevel.includes(transaction.confidence)) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && transaction.bankTransaction.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && transaction.bankTransaction.date > filters.dateTo) {
        return false;
      }

      // Amount range filter
      if (filters.amountMin && transaction.bankTransaction.amount < parseFloat(filters.amountMin)) {
        return false;
      }
      if (filters.amountMax && transaction.bankTransaction.amount > parseFloat(filters.amountMax)) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const bankDesc = transaction.bankTransaction.description.toLowerCase();
        const bankRef = transaction.bankTransaction.reference.toLowerCase();
        const sageVendor = transaction.sageTransaction?.vendor.toLowerCase() || '';
        const sageInvoice = transaction.sageTransaction?.invoiceNumber.toLowerCase() || '';
        
        if (!bankDesc.includes(query) && 
            !bankRef.includes(query) && 
            !sageVendor.includes(query) && 
            !sageInvoice.includes(query) &&
            !transaction.id.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filters]);

  const handleClearFilters = () => {
    setFilters({
      status: [],
      confidenceLevel: [],
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      searchQuery: '',
    });
  };

  const handleTransactionSelect = (id: string, selected: boolean) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === id ? { ...t, isSelected: selected } : t
    );
    onTransactionUpdate(updatedTransactions);
  };

  const handleBatchApprove = () => {
    const updatedTransactions = transactions.map((t) =>
      t.isSelected ? { ...t, status: 'Accepted' as const, isSelected: false } : t
    );
    onTransactionUpdate(updatedTransactions);
    // TODO: PowerApps SDK - Batch update records in Dataverse
    // Example:
    // const selectedIds = transactions.filter(t => t.isSelected).map(t => t.id);
    // await Promise.all(selectedIds.map(id => 
    //   context.webAPI.updateRecord("cr9d2_matchedtransaction", id, { cr9d2_status: 'Accepted' })
    // ));
  };

  const handleBatchReject = () => {
    const updatedTransactions = transactions.map((t) =>
      t.isSelected ? { ...t, status: 'Rejected' as const, isSelected: false } : t
    );
    onTransactionUpdate(updatedTransactions);
    // TODO: PowerApps SDK - Batch update records in Dataverse
  };

  const handleBatchReanalyze = () => {
    const updatedTransactions = transactions.map((t) =>
      t.isSelected ? { ...t, status: 'Rematched' as const, isSelected: false } : t
    );
    onTransactionUpdate(updatedTransactions);
    // TODO: PowerApps SDK - Trigger re-analysis workflow or Power Automate flow
    // Example:
    // await context.webAPI.executeAction("cr9d2_ReanalyzeTransactions", {
    //   transactionIds: selectedIds
    // });
  };

  return (
    <div className={styles.matchingContainer}>
      <div className={styles.pageHeader}>
        <Title3 className={styles.pageTitle}>Transaction Matching</Title3>
        <div className={styles.headerActions}>
          <Button
            appearance="subtle"
            icon={<QuestionCircleRegular />}
            onClick={onOpenHelpModal}
          >
            How AI Matching Works
          </Button>
          <Button
            appearance="primary"
            icon={<ArrowUploadRegular />}
            onClick={onOpenUploadModal}
          >
            Upload Bank Statement
          </Button>
        </div>
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      <TransactionTable
        transactions={filteredTransactions}
        onTransactionSelect={handleTransactionSelect}
        onTransactionDoubleClick={onOpenReviewModal}
        onBatchApprove={handleBatchApprove}
        onBatchReject={handleBatchReject}
        onBatchReanalyze={handleBatchReanalyze}
      />

      {/* TODO: PowerApps SDK Integration
       * Add pagination component using Dataverse paging:
       * - Use pagingCookie for server-side pagination
       * - Implement fetchXml queries for complex filtering
       * - Add export functionality using Power Automate flows
       */}
    </div>
  );
};
