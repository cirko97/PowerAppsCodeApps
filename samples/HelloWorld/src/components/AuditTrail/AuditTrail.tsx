import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Title3,
  Card,
  Input,
  Button,
  Label,
  Checkbox,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Avatar,
} from '@fluentui/react-components';
import {
  ChevronRightRegular,
  PersonRegular,
  BotRegular,
  SettingsRegular,
} from '@fluentui/react-icons';
import { AuditLogEntry, AuditFilterState, AuditCategory, AuditSeverity } from '../../types';

const useStyles = makeStyles({
  auditContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  pageHeader: {
    marginBottom: '8px',
  },
  pageTitle: {
    color: tokens.colorNeutralForeground1,
  },
  filterCard: {
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap('16px'),
    marginBottom: '16px',
  },
  filterActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
    justifyContent: 'flex-end',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
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
  },
  tableRow: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  tableCell: {
    ...shorthands.padding('12px'),
    verticalAlign: 'middle',
  },
  expandableRow: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  detailsContent: {
    ...shorthands.padding('16px', '48px'),
  },
  actorCell: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  expandIcon: {
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  expandIconRotated: {
    transform: 'rotate(90deg)',
  },
  categoryBadge: {
    cursor: 'pointer',
  },
  severityBadge: {
    cursor: 'pointer',
  },
});

interface AuditTrailProps {
  auditLog: AuditLogEntry[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ auditLog }) => {
  const styles = useStyles();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<AuditFilterState>({
    category: [],
    action: [],
    severity: [],
    actorType: [],
    dateFrom: '',
    dateTo: '',
    searchQuery: '',
  });

  const handleClearFilters = () => {
    setFilters({
      category: [],
      action: [],
      severity: [],
      actorType: [],
      dateFrom: '',
      dateTo: '',
      searchQuery: '',
    });
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Filter audit log
  const filteredLog = auditLog.filter((entry) => {
    if (filters.category.length > 0 && !filters.category.includes(entry.category)) return false;
    if (filters.action.length > 0 && !filters.action.includes(entry.action)) return false;
    if (filters.severity.length > 0 && !filters.severity.includes(entry.severity)) return false;
    if (filters.actorType.length > 0 && !filters.actorType.includes(entry.actorType)) return false;
    
    if (filters.dateFrom && entry.timestamp < filters.dateFrom) return false;
    if (filters.dateTo && entry.timestamp > filters.dateTo) return false;
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        entry.actor.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.details?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'upload': return 'brand';
      case 'matching': return 'success';
      case 'reconciliation': return 'informative';
      case 'config': return 'warning';
      case 'auth': return 'danger';
      default: return 'subtle';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'informative';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      case 'critical': return 'danger';
      default: return 'subtle';
    }
  };

  const getActorIcon = (actorType: string) => {
    switch (actorType) {
      case 'user': return <PersonRegular />;
      case 'ai': return <BotRegular />;
      case 'system': return <SettingsRegular />;
      default: return <PersonRegular />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.auditContainer}>
      <div className={styles.pageHeader}>
        <Title3 className={styles.pageTitle}>Audit Trail</Title3>
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div>
            <Label>Category</Label>
            <div className={styles.checkboxGroup}>
              {['upload', 'matching', 'reconciliation', 'config', 'auth'].map((cat) => (
                <Checkbox
                  key={cat}
                  label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  checked={filters.category.includes(cat as AuditCategory)}
                  onChange={(_, data) => {
                    const newCategories = data.checked
                      ? [...filters.category, cat as AuditCategory]
                      : filters.category.filter(c => c !== cat);
                    setFilters({ ...filters, category: newCategories });
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Severity</Label>
            <div className={styles.checkboxGroup}>
              {['info', 'warning', 'error', 'critical'].map((sev) => (
                <Checkbox
                  key={sev}
                  label={sev.charAt(0).toUpperCase() + sev.slice(1)}
                  checked={filters.severity.includes(sev as AuditSeverity)}
                  onChange={(_, data) => {
                    const newSeverity = data.checked
                      ? [...filters.severity, sev as AuditSeverity]
                      : filters.severity.filter(s => s !== sev);
                    setFilters({ ...filters, severity: newSeverity });
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Date Range</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(_, data) => setFilters({ ...filters, dateFrom: data.value })}
              style={{ marginBottom: '8px' }}
            />
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(_, data) => setFilters({ ...filters, dateTo: data.value })}
            />
          </div>

          <div>
            <Label>Search</Label>
            <Input
              type="search"
              value={filters.searchQuery}
              onChange={(_, data) => setFilters({ ...filters, searchQuery: data.value })}
              placeholder="Search audit logs..."
            />
          </div>
        </div>

        <div className={styles.filterActions}>
          <Button appearance="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button appearance="primary">Export Audit Log</Button>
        </div>
      </Card>

      {/* Audit Table */}
      <div className={styles.tableWrapper}>
        <Table className={styles.table}>
          <TableHeader className={styles.tableHeader}>
            <TableRow>
              <TableHeaderCell className={styles.headerCell} style={{ width: '40px' }}></TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>Timestamp</TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>Actor</TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>Category</TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>Action</TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>Description</TableHeaderCell>
              <TableHeaderCell className={styles.headerCell}>Severity</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLog.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                  No audit log entries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLog.map((entry) => (
                <React.Fragment key={entry.id}>
                  <TableRow
                    className={styles.tableRow}
                    onClick={() => toggleRowExpansion(entry.id)}
                  >
                    <TableCell className={styles.tableCell}>
                      <div
                        className={`${styles.expandIcon} ${expandedRows.has(entry.id) ? styles.expandIconRotated : ''}`}
                      >
                        <ChevronRightRegular fontSize={16} />
                      </div>
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {formatTimestamp(entry.timestamp)}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <div className={styles.actorCell}>
                        <Avatar
                          size={24}
                          icon={getActorIcon(entry.actorType)}
                          color={entry.actorType === 'ai' ? 'brand' : 'neutral'}
                        />
                        {entry.actor}
                      </div>
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Badge
                        appearance="filled"
                        color={getCategoryColor(entry.category)}
                        className={styles.categoryBadge}
                      >
                        {entry.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {entry.action}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {entry.description}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Badge
                        appearance="outline"
                        color={getSeverityColor(entry.severity)}
                        className={styles.severityBadge}
                      >
                        {entry.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(entry.id) && (
                    <TableRow className={styles.expandableRow}>
                      <TableCell colSpan={7} className={styles.detailsContent}>
                        <div><strong>Details:</strong> {entry.details || 'No additional details'}</div>
                        {entry.ipAddress && <div><strong>IP Address:</strong> {entry.ipAddress}</div>}
                        {entry.beforeState && (
                          <div>
                            <strong>Before:</strong>
                            <pre>{JSON.stringify(entry.beforeState, null, 2)}</pre>
                          </div>
                        )}
                        {entry.afterState && (
                          <div>
                            <strong>After:</strong>
                            <pre>{JSON.stringify(entry.afterState, null, 2)}</pre>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* TODO: PowerApps SDK Integration
       * Implement audit logging with Dataverse:
       * - Use Audit Log entity in Dataverse to track all changes
       * - Enable auditing on custom entities
       * - Query audit history: context.webAPI.retrieveMultipleRecords("audit", ...)
       * - Export audit logs using Power Automate flows
       * - Integrate with Azure Monitor for advanced analytics
       */}
    </div>
  );
};
