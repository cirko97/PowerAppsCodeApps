import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  pageLayout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    ...shorthands.padding('24px'),
  },
});

interface PageLayoutProps {
  header: React.ReactNode;
  navigation: React.ReactNode;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ header, navigation, children }) => {
  const styles = useStyles();

  return (
    <div className={styles.pageLayout}>
      {header}
      {navigation}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};
