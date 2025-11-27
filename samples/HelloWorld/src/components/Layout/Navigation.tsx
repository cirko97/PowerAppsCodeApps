import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  TabList,
  Tab,
} from '@fluentui/react-components';
import {
  HomeRegular,
  CheckmarkCircleRegular,
  DocumentCheckmarkRegular,
  HistoryRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  navigation: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.padding('0', '24px'),
  },
  tabList: {
    minHeight: '48px',
  },
});

type TabValue = 'dashboard' | 'matching' | 'reconciliation' | 'audit';

interface NavigationProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const styles = useStyles();

  return (
    <nav className={styles.navigation}>
      <TabList
        selectedValue={activeTab}
        onTabSelect={(_, data) => onTabChange(data.value as TabValue)}
        className={styles.tabList}
      >
        <Tab value="dashboard" icon={<HomeRegular />}>
          Dashboard
        </Tab>
        <Tab value="matching" icon={<CheckmarkCircleRegular />}>
          Transaction Matching
        </Tab>
        <Tab value="reconciliation" icon={<DocumentCheckmarkRegular />}>
          Reconciliation
        </Tab>
        <Tab value="audit" icon={<HistoryRegular />}>
          Audit Trail
        </Tab>
      </TabList>
    </nav>
  );
};

export type { TabValue };
