import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
} from '@fluentui/react-components';
import {
  CheckmarkCircleRegular,
  ArrowTrendingRegular,
  DocumentBulletListRegular,
} from '@fluentui/react-icons';
import { DashboardStats } from '../../types';

const useStyles = makeStyles({
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap('16px'),
  },
  statCard: {
    ...shorthands.padding('20px'),
    position: 'relative',
    ...shorthands.overflow('hidden'),
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
    transition: 'all 0.2s ease',
  },
  statCardSuccess: {
    borderLeft: `4px solid ${tokens.colorPaletteGreenBorder2}`,
  },
  statCardWarning: {
    borderLeft: `4px solid ${tokens.colorPaletteYellowBorder2}`,
  },
  statCardError: {
    borderLeft: `4px solid ${tokens.colorPaletteRedBorder2}`,
  },
  statCardInfo: {
    borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  statValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statMeta: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    marginTop: '8px',
  },
  dashboardSections: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('24px'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  dashboardSection: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding('24px'),
    boxShadow: tokens.shadow4,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  miniStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('12px'),
  },
  miniStatsThree: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  miniStat: {
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      transform: 'scale(1.05)',
    },
  },
  miniStatValue: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  miniStatLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  balanceDisplay: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    ...shorthands.padding('24px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginTop: '16px',
  },
  balanceItem: {
    textAlign: 'center',
  },
  balanceLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  balanceValue: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  balanceDivider: {
    width: '1px',
    height: '60px',
    backgroundColor: tokens.colorNeutralStroke2,
  },
  fullWidthSection: {
    gridColumn: '1 / -1',
  },
});

interface DashboardProps {
  stats: DashboardStats;
  onViewMatching?: () => void;
  onViewReconciliation?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onViewMatching }) => {
  const styles = useStyles();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <Card className={`${styles.statCard} ${styles.statCardSuccess}`}>
          <div className={styles.statLabel}>Total Transactions</div>
          <div className={styles.statValue}>{stats.totalTransactions}</div>
          <div className={styles.statMeta}>Current period</div>
        </Card>

        <Card className={`${styles.statCard} ${styles.statCardSuccess}`}>
          <div className={styles.statLabel}>Auto-Matched</div>
          <div className={styles.statValue}>{stats.autoMatched}</div>
          <div className={styles.statMeta}>{formatPercentage((stats.autoMatched / stats.totalTransactions) * 100)} success rate</div>
        </Card>

        <Card className={`${styles.statCard} ${styles.statCardWarning}`}>
          <div className={styles.statLabel}>Needs Review</div>
          <div className={styles.statValue}>{stats.needsReview}</div>
          <div className={styles.statMeta}>Requires attention</div>
        </Card>

        <Card className={`${styles.statCard} ${styles.statCardError}`}>
          <div className={styles.statLabel}>Exceptions</div>
          <div className={styles.statValue}>{stats.exceptions}</div>
          <div className={styles.statMeta}>Manual handling required</div>
        </Card>
      </div>

      {/* Dashboard Sections */}
      <div className={styles.dashboardSections}>
        {/* Balance Overview - Full Width */}
        <div className={`${styles.dashboardSection} ${styles.fullWidthSection}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <DocumentBulletListRegular fontSize={20} />
              Balance Overview
            </div>
            <Button appearance="subtle" size="small">
              View Details
            </Button>
          </div>

          <div className={styles.balanceDisplay}>
            <div className={styles.balanceItem}>
              <div className={styles.balanceLabel}>Bank Balance</div>
              <div className={styles.balanceValue}>{formatCurrency(stats.bankBalance)}</div>
            </div>

            <div className={styles.balanceDivider} />

            <div className={styles.balanceItem}>
              <div className={styles.balanceLabel}>Sage Balance</div>
              <div className={styles.balanceValue}>{formatCurrency(stats.sageBalance)}</div>
            </div>

            <div className={styles.balanceDivider} />

            <div className={styles.balanceItem}>
              <div className={styles.balanceLabel}>Variance</div>
              <div className={styles.balanceValue} style={{ color: stats.variance === 0 ? tokens.colorPaletteGreenForeground1 : tokens.colorPaletteRedForeground1 }}>
                {formatCurrency(Math.abs(stats.variance))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <CheckmarkCircleRegular fontSize={20} />
              Matching Status
            </div>
            <Button appearance="subtle" size="small" onClick={onViewMatching}>
              View All
            </Button>
          </div>

          <div className={`${styles.miniStats} ${styles.miniStatsThree}`}>
            <div className={styles.miniStat}>
              <div className={styles.miniStatValue} style={{ color: tokens.colorPaletteGreenForeground1 }}>
                {stats.autoMatched}
              </div>
              <div className={styles.miniStatLabel}>Matched</div>
            </div>
            <div className={styles.miniStat}>
              <div className={styles.miniStatValue} style={{ color: tokens.colorPaletteYellowForeground1 }}>
                {stats.needsReview}
              </div>
              <div className={styles.miniStatLabel}>Review</div>
            </div>
            <div className={styles.miniStat}>
              <div className={styles.miniStatValue} style={{ color: tokens.colorPaletteRedForeground1 }}>
                {stats.exceptions}
              </div>
              <div className={styles.miniStatLabel}>Exceptions</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <ArrowTrendingRegular fontSize={20} />
              Performance Metrics
            </div>
            <Button appearance="subtle" size="small">
              View Details
            </Button>
          </div>

          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <div className={styles.miniStatValue} style={{ color: tokens.colorBrandForeground1 }}>
                {formatPercentage(stats.reconciliationRate)}
              </div>
              <div className={styles.miniStatLabel}>Reconciliation Rate</div>
            </div>
            <div className={styles.miniStat}>
              <div className={styles.miniStatValue} style={{ color: tokens.colorBrandForeground1 }}>
                {formatPercentage(stats.avgConfidence)}
              </div>
              <div className={styles.miniStatLabel}>Avg Confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: PowerApps SDK Integration
       * Replace mock stats with real data from Dataverse:
       * - Use context.webAPI.retrieveMultipleRecords() to fetch transaction statistics
       * - Create custom views/queries for aggregated data
       * - Example:
       *   const stats = await context.webAPI.retrieveMultipleRecords(
       *     "cr9d2_banktransaction",
       *     "?$select=cr9d2_status&$count=true"
       *   );
       */}
    </div>
  );
};
