import React, { useState } from 'react';
import { 
  FluentProvider, 
  webLightTheme,
} from '@fluentui/react-components';

import './App.css';

// Layout Components
import { PageLayout } from './components/Layout/PageLayout';
import { Header } from './components/Layout/Header';
import { Navigation, TabValue } from './components/Layout/Navigation';

// Feature Components
import { Dashboard } from './components/Dashboard/Dashboard';
import { TransactionMatching } from './components/Matching/TransactionMatching';
import { Reconciliation } from './components/Reconciliation/Reconciliation';
import { AuditTrail } from './components/AuditTrail/AuditTrail';

// Modal Components
import { TransactionReviewModal } from './components/Modals/TransactionReviewModal';
import { UploadModal } from './components/Modals/UploadModal';
import { SettingsModal } from './components/Modals/SettingsModal';

// Data and Types
import { 
  mockUser, 
  mockNotifications, 
  mockStats, 
  mockMatchedTransactions,
  mockAuditLog 
} from './data/mockData';
import { MatchedTransaction, NotificationItem } from './types';

const App: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard');
  const [transactions, setTransactions] = useState<MatchedTransaction[]>(mockMatchedTransactions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  // Modal States
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<MatchedTransaction | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Notification Handlers
  const handleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    // TODO: PowerApps SDK - Update notification status in Dataverse
  };

  const handleNotificationDismiss = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    // TODO: PowerApps SDK - Delete notification from Dataverse
  };

  // Transaction Review Handlers
  const handleOpenReviewModal = (transaction: MatchedTransaction) => {
    setSelectedTransaction(transaction);
    setReviewModalOpen(true);
  };

  const handleApproveTransaction = (transaction: MatchedTransaction, note: string) => {
    setTransactions(transactions.map(t => 
      t.id === transaction.id 
        ? { ...t, status: 'Accepted', notes: note, matchedBy: mockUser.name, matchedDate: new Date().toISOString() }
        : t
    ));
    setReviewModalOpen(false);
    // TODO: PowerApps SDK - Update transaction in Dataverse
    // Example:
    // await context.webAPI.updateRecord("cr9d2_matchedtransaction", transaction.id, {
    //   cr9d2_status: 'Accepted',
    //   cr9d2_notes: note,
    //   cr9d2_approvedby: currentUserId,
    //   cr9d2_approveddate: new Date().toISOString()
    // });
  };

  const handleRejectTransaction = (transaction: MatchedTransaction, note: string) => {
    setTransactions(transactions.map(t => 
      t.id === transaction.id 
        ? { ...t, status: 'Rejected', notes: note, matchedBy: mockUser.name, matchedDate: new Date().toISOString() }
        : t
    ));
    setReviewModalOpen(false);
    // TODO: PowerApps SDK - Update transaction in Dataverse
  };

  const handleEditMatch = (transaction: MatchedTransaction) => {
    // TODO: Implement edit match modal
    console.log('Edit match for:', transaction.id);
    // This would open another modal where user can manually select a different Sage transaction
  };

  // Upload Handler
  const handleUploadComplete = () => {
    // TODO: PowerApps SDK - Refresh transactions from Dataverse
    console.log('Upload complete - refresh data');
    // Simulate adding new transactions
    setNotifications([
      {
        id: Date.now().toString(),
        title: 'Upload Complete',
        message: '150 new transactions processed',
        time: 'Just now',
        isRead: false,
        type: 'success'
      },
      ...notifications
    ]);
  };

  // Render Current Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={mockStats}
            onViewMatching={() => setActiveTab('matching')}
            onViewReconciliation={() => setActiveTab('reconciliation')}
          />
        );
      
      case 'matching':
        return (
          <TransactionMatching
            transactions={transactions}
            onTransactionUpdate={setTransactions}
            onOpenReviewModal={handleOpenReviewModal}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            onOpenHelpModal={() => alert('Help documentation would open here')}
          />
        );
      
      case 'reconciliation':
        return (
          <Reconciliation
            transactions={transactions}
            onTransactionUpdate={setTransactions}
            onOpenDetailModal={handleOpenReviewModal}
          />
        );
      
      case 'audit':
        return <AuditTrail auditLog={mockAuditLog} />;
      
      default:
        return <Dashboard stats={mockStats} />;
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <PageLayout
        header={
          <Header
            user={mockUser}
            notifications={notifications}
            onNotificationRead={handleNotificationRead}
            onNotificationDismiss={handleNotificationDismiss}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onLogout={() => alert('Logout functionality would be implemented here')}
          />
        }
        navigation={
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        }
      >
        {renderTabContent()}
      </PageLayout>

      {/* Modals */}
      <TransactionReviewModal
        open={reviewModalOpen}
        transaction={selectedTransaction}
        onClose={() => setReviewModalOpen(false)}
        onApprove={handleApproveTransaction}
        onReject={handleRejectTransaction}
        onEditMatch={handleEditMatch}
      />

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      <SettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* TODO: PowerApps SDK Integration - Main App Level
       * 
       * 1. Initialize PowerApps Context:
       *    import { usePowerApps } from './PowerProvider';
       *    const { context } = usePowerApps();
       * 
       * 2. Load Initial Data on Mount:
       *    useEffect(() => {
       *      loadTransactions();
       *      loadNotifications();
       *      loadUserProfile();
       *    }, []);
       * 
       * 3. Implement Real-time Updates:
       *    - Use Power Automate flows for notifications
       *    - Implement SignalR for real-time transaction updates
       *    - Poll for changes if needed: setInterval(() => refreshData(), 30000)
       * 
       * 4. Error Handling:
       *    - Implement try-catch blocks around all SDK calls
       *    - Show user-friendly error messages using Fluent UI MessageBar
       *    - Log errors to Application Insights
       * 
       * 5. Security:
       *    - Validate user permissions before showing sensitive data
       *    - Use context.userSettings to get current user info
       *    - Implement row-level security through Dataverse
       * 
       * 6. Performance:
       *    - Implement pagination for large datasets
       *    - Use lazy loading for components
       *    - Cache frequently accessed data in localStorage
       *    - Optimize queries with $select and $expand
       */}
    </FluentProvider>
  );
};

export default App;
