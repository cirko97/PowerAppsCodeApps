import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Input,
  Button,
  Checkbox,
  Label,
} from '@fluentui/react-components';
import {
  FilterRegular,
  DismissRegular,
  ChevronDownRegular,
  ChevronUpRegular,
} from '@fluentui/react-icons';
import { FilterState, TransactionStatus, ConfidenceLevel } from '../../types';

const useStyles = makeStyles({
  filterSection: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginBottom: '16px',
    boxShadow: tokens.shadow4,
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('16px', '20px'),
    cursor: 'pointer',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  filterActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  filterContent: {
    ...shorthands.padding('20px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
  },
  filterContentCollapsed: {
    display: 'none',
  },
  filterGroups: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    ...shorthands.gap('24px'),
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  filterGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterGroupTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  dateRangeInputs: {
    display: 'flex',
    ...shorthands.gap('12px'),
    alignItems: 'center',
  },
  filterInput: {
    flex: 1,
  },
  statusBadge: {
    display: 'inline-block',
    ...shorthands.padding('2px', '8px'),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    marginLeft: '8px',
  },
  badgeMatched: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  badgeReview: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  badgeException: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  badgeAccepted: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
});

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const styles = useStyles();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const statusOptions: { value: TransactionStatus; label: string; badgeClass: string }[] = [
    { value: 'Auto-Matched', label: 'Auto-Matched', badgeClass: styles.badgeMatched },
    { value: 'Review Required', label: 'Review Required', badgeClass: styles.badgeReview },
    { value: 'Exception', label: 'Exception', badgeClass: styles.badgeException },
    { value: 'Accepted', label: 'Accepted', badgeClass: styles.badgeAccepted },
    { value: 'Rejected', label: 'Rejected', badgeClass: styles.badgeException },
    { value: 'Rematched', label: 'Rematched', badgeClass: styles.badgeMatched },
  ];

  const confidenceOptions: ConfidenceLevel[] = ['High', 'Medium', 'Low'];

  const handleStatusChange = (status: TransactionStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFilterChange({ ...filters, status: newStatuses });
  };

  const handleConfidenceChange = (confidence: ConfidenceLevel, checked: boolean) => {
    const newConfidence = checked
      ? [...filters.confidenceLevel, confidence]
      : filters.confidenceLevel.filter(c => c !== confidence);
    onFilterChange({ ...filters, confidenceLevel: newConfidence });
  };

  const clearGroupFilter = (group: 'status' | 'confidence') => {
    if (group === 'status') {
      onFilterChange({ ...filters, status: [] });
    } else {
      onFilterChange({ ...filters, confidenceLevel: [] });
    }
  };

  return (
    <Card className={styles.filterSection}>
      <div className={styles.filterHeader} onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className={styles.filterTitle}>
          <FilterRegular fontSize={20} />
          Filters
          {(filters.status.length > 0 || filters.confidenceLevel.length > 0) && (
            <span className={`${styles.statusBadge} ${styles.badgeMatched}`}>
              {filters.status.length + filters.confidenceLevel.length} active
            </span>
          )}
        </div>
        <div className={styles.filterActions}>
          <Button
            appearance="subtle"
            size="small"
            icon={<DismissRegular />}
            onClick={(e) => {
              e.stopPropagation();
              onClearFilters();
            }}
          >
            Clear All
          </Button>
          {isCollapsed ? <ChevronDownRegular /> : <ChevronUpRegular />}
        </div>
      </div>

      <div className={isCollapsed ? styles.filterContentCollapsed : styles.filterContent}>
        <div className={styles.filterGroups}>
          {/* Status Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <Label className={styles.filterGroupTitle}>Status</Label>
              {filters.status.length > 0 && (
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={() => clearGroupFilter('status')}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className={styles.checkboxList}>
              {statusOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  label={
                    <span>
                      {option.label}
                      <span className={`${styles.statusBadge} ${option.badgeClass}`}>●</span>
                    </span>
                  }
                  checked={filters.status.includes(option.value)}
                  onChange={(_, data) => handleStatusChange(option.value, data.checked as boolean)}
                />
              ))}
            </div>
          </div>

          {/* Confidence Level Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeader}>
              <Label className={styles.filterGroupTitle}>Confidence Level</Label>
              {filters.confidenceLevel.length > 0 && (
                <Button
                  appearance="subtle"
                  size="small"
                  onClick={() => clearGroupFilter('confidence')}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className={styles.checkboxList}>
              {confidenceOptions.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={filters.confidenceLevel.includes(option)}
                  onChange={(_, data) => handleConfidenceChange(option, data.checked as boolean)}
                />
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className={styles.filterGroup}>
            <Label className={styles.filterGroupTitle}>Date Range</Label>
            <div className={styles.dateRangeInputs}>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(_, data) => onFilterChange({ ...filters, dateFrom: data.value })}
                className={styles.filterInput}
                placeholder="From"
              />
              <span>to</span>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(_, data) => onFilterChange({ ...filters, dateTo: data.value })}
                className={styles.filterInput}
                placeholder="To"
              />
            </div>
          </div>

          {/* Amount Range Filter */}
          <div className={styles.filterGroup}>
            <Label className={styles.filterGroupTitle}>Amount Range</Label>
            <div className={styles.dateRangeInputs}>
              <Input
                type="number"
                value={filters.amountMin}
                onChange={(_, data) => onFilterChange({ ...filters, amountMin: data.value })}
                className={styles.filterInput}
                placeholder="Min"
                contentBefore="$"
              />
              <span>to</span>
              <Input
                type="number"
                value={filters.amountMax}
                onChange={(_, data) => onFilterChange({ ...filters, amountMax: data.value })}
                className={styles.filterInput}
                placeholder="Max"
                contentBefore="$"
              />
            </div>
          </div>

          {/* Search Filter */}
          <div className={styles.filterGroup}>
            <Label className={styles.filterGroupTitle}>Search</Label>
            <Input
              type="search"
              value={filters.searchQuery}
              onChange={(_, data) => onFilterChange({ ...filters, searchQuery: data.value })}
              placeholder="Search transactions..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
