import React, { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Badge,
  Textarea,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  DismissRegular,
  CheckmarkRegular,
  EditRegular,
  ChevronDownRegular,
  ChevronUpRegular,
} from '@fluentui/react-icons';
import { MatchedTransaction, NotesHistoryItem } from '../../types';

const useStyles = makeStyles({
  dialogContent: {
    minWidth: '900px',
    maxWidth: '1200px',
    '@media (max-width: 1024px)': {
      minWidth: 'auto',
      maxWidth: '90vw',
    },
  },
  confidenceBanner: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerHigh: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  bannerMedium: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  bannerLow: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  confidenceScore: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
  },
  comparisonContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
    marginBottom: '20px',
  },
  panel: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('2px', 'solid'),
  },
  panelBank: {
    ...shorthands.border('2px', 'solid', '#0078D4'),
    backgroundColor: '#E3F2FD',
  },
  panelSage: {
    ...shorthands.border('2px', 'solid', '#8B5CF6'),
    backgroundColor: '#F3E8FF',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  panelTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  field: {
    marginBottom: '12px',
    ':last-child': {
      marginBottom: 0,
    },
  },
  fieldLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '4px',
  },
  fieldValue: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  fieldValueAmount: {
    fontFamily: 'Consolas, monospace',
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightBold,
  },
  matchIndicator: {
    textAlign: 'center',
    ...shorthands.padding('16px'),
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  detailsSection: {
    marginTop: '20px',
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  detailsTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '12px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('12px'),
  },
  notesSection: {
    marginTop: '20px',
  },
  notesHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  notesHistory: {
    marginTop: '16px',
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    maxHeight: '200px',
    overflowY: 'auto',
  },
  historyItem: {
    ...shorthands.padding('8px'),
    marginBottom: '8px',
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.borderLeft('3px', 'solid'),
  },
  historyItemAccepted: {
    ...shorthands.borderLeft('3px', 'solid', '#10B981'),
    backgroundColor: '#D1FAE5',
  },
  historyItemRejected: {
    ...shorthands.borderLeft('3px', 'solid', '#EF4444'),
    backgroundColor: '#FEE2E2',
  },
  historyItemNote: {
    ...shorthands.borderLeft('3px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

interface TransactionReviewModalProps {
  open: boolean;
  transaction: MatchedTransaction | null;
  onClose: () => void;
  onApprove: (transaction: MatchedTransaction, note: string) => void;
  onReject: (transaction: MatchedTransaction, note: string) => void;
  onEditMatch: (transaction: MatchedTransaction) => void;
}

export const TransactionReviewModal: React.FC<TransactionReviewModalProps> = ({
  open,
  transaction,
  onClose,
  onApprove,
  onReject,
  onEditMatch,
}) => {
  const styles = useStyles();
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Mock history - TODO: Replace with actual data from Dataverse
  const mockHistory: NotesHistoryItem[] = [
    {
      id: '1',
      action: 'ai',
      user: 'AI Matching Engine',
      date: '2024-01-15 10:30',
      note: 'Auto-matched with 98.5% confidence based on amount and date proximity',
    },
  ];

  if (!transaction) return null;

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
      month: 'long',
      day: 'numeric',
    });
  };

  const getBannerClass = () => {
    switch (transaction.confidence) {
      case 'High': return styles.bannerHigh;
      case 'Medium': return styles.bannerMedium;
      case 'Low': return styles.bannerLow;
      default: return styles.bannerHigh;
    }
  };

  const amountsMatch = transaction.sageTransaction && 
    Math.abs(transaction.bankTransaction.amount - transaction.sageTransaction.amount) < 0.01;

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogContent}>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                icon={<DismissRegular />}
                onClick={onClose}
              />
            }
          >
            Review Transaction Match
          </DialogTitle>
          <DialogContent>
            {/* Confidence Banner */}
            <div className={`${styles.confidenceBanner} ${getBannerClass()}`}>
              <div>
                <div>AI Confidence Match</div>
                <div className={styles.confidenceScore}>
                  {transaction.confidenceScore}%
                </div>
              </div>
              <Badge appearance="filled" color="success" size="large">
                {transaction.confidence} Confidence
              </Badge>
            </div>

            {/* Comparison Panels */}
            <div className={styles.comparisonContainer}>
              {/* Bank Transaction Panel */}
              <div className={`${styles.panel} ${styles.panelBank}`}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitle}>Bank Transaction</div>
                  <Badge appearance="filled" color="brand">BANK</Badge>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Date</div>
                  <div className={styles.fieldValue}>{formatDate(transaction.bankTransaction.date)}</div>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Description</div>
                  <div className={styles.fieldValue}>{transaction.bankTransaction.description}</div>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Reference</div>
                  <div className={styles.fieldValue}>{transaction.bankTransaction.reference}</div>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Amount</div>
                  <div className={`${styles.fieldValue} ${styles.fieldValueAmount}`}>
                    {formatCurrency(transaction.bankTransaction.amount)}
                  </div>
                </div>
              </div>

              {/* Sage Transaction Panel */}
              <div className={`${styles.panel} ${styles.panelSage}`}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitle}>Sage Transaction</div>
                  <Badge appearance="filled" color="important">SAGE</Badge>
                </div>
                {transaction.sageTransaction ? (
                  <>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Date</div>
                      <div className={styles.fieldValue}>{formatDate(transaction.sageTransaction.date)}</div>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Vendor</div>
                      <div className={styles.fieldValue}>{transaction.sageTransaction.vendor}</div>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Invoice Number</div>
                      <div className={styles.fieldValue}>{transaction.sageTransaction.invoiceNumber}</div>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Amount</div>
                      <div className={`${styles.fieldValue} ${styles.fieldValueAmount}`}>
                        {formatCurrency(transaction.sageTransaction.amount)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
                    No matching Sage transaction found
                  </div>
                )}
              </div>
            </div>

            {/* Match Indicator */}
            <div className={styles.matchIndicator}>
              {amountsMatch ? '✓ Amounts Match' : '⚠ Amount Discrepancy Detected'}
            </div>

            {/* Additional Details */}
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsTitle}>Match Details</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Transaction ID</div>
                  <div className={styles.fieldValue}>{transaction.id}</div>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Status</div>
                  <Badge appearance="filled" color="success">{transaction.status}</Badge>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Matched By</div>
                  <div className={styles.fieldValue}>{transaction.matchedBy || 'Pending'}</div>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Match Date</div>
                  <div className={styles.fieldValue}>
                    {transaction.matchedDate ? new Date(transaction.matchedDate).toLocaleString() : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className={styles.notesSection}>
              <div className={styles.notesHeader} onClick={() => setShowHistory(!showHistory)}>
                <h4 className={styles.detailsTitle}>
                  Notes & History
                  {showHistory ? <ChevronUpRegular /> : <ChevronDownRegular />}
                </h4>
              </div>
              <Textarea
                value={note}
                onChange={(_, data) => setNote(data.value)}
                placeholder="Add a note about this transaction..."
                rows={3}
              />
              {showHistory && mockHistory.length > 0 && (
                <div className={styles.notesHistory}>
                  {mockHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.historyItem} ${
                        item.action === 'accepted' ? styles.historyItemAccepted :
                        item.action === 'rejected' ? styles.historyItemRejected :
                        styles.historyItemNote
                      }`}
                    >
                      <div><strong>{item.user}</strong> - {item.date}</div>
                      <div>{item.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => onReject(transaction, note)}
            >
              Reject Match
            </Button>
            <Button
              appearance="subtle"
              icon={<EditRegular />}
              onClick={() => {
                onEditMatch(transaction);
                onClose();
              }}
            >
              Edit Match Manually
            </Button>
            <Button
              appearance="primary"
              icon={<CheckmarkRegular />}
              onClick={() => onApprove(transaction, note)}
            >
              Approve Match
            </Button>
          </DialogActions>

          {/* TODO: PowerApps SDK Integration
           * Fetch transaction details and history from Dataverse:
           * - Load related notes and audit history
           * - context.webAPI.retrieveRecord() for full transaction details
           * - Save notes back to Dataverse on approve/reject
           * - Trigger Power Automate flows for approval workflows
           */}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
