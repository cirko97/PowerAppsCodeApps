import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Avatar,
  Badge,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@fluentui/react-components';
import {
  AlertRegular,
  PersonRegular,
  SettingsRegular,
  SignOutRegular,
  DismissRegular,
  CheckmarkRegular
} from '@fluentui/react-icons';
import { UserProfile, NotificationItem } from '../../types';

const useStyles = makeStyles({
  header: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.padding('16px', '24px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  headerTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    ...shorthands.margin(0),
  },
  headerSubtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    ...shorthands.margin(0),
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    cursor: 'pointer',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  userRole: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  notificationList: {
    maxHeight: '400px',
    overflowY: 'auto',
    width: '350px',
  },
  notificationItem: {
    display: 'flex',
    ...shorthands.padding('12px'),
    ...shorthands.gap('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  notificationUnread: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  notificationMessage: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginBottom: '4px',
  },
  notificationTime: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  notificationActions: {
    display: 'flex',
    ...shorthands.gap('4px'),
  },
});

interface HeaderProps {
  user: UserProfile;
  notifications: NotificationItem[];
  onNotificationRead?: (id: string) => void;
  onNotificationDismiss?: (id: string) => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  onNotificationRead,
  onNotificationDismiss,
  onOpenSettings,
  onLogout,
}) => {
  const styles = useStyles();
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.headerTitle}>Operation Smile - Bank Reconciliation</h1>
        <p className={styles.headerSubtitle}>Powered by AI-driven transaction matching</p>
      </div>

      <div className={styles.headerRight}>
        {/* Notifications Menu */}
        <Menu
          open={notificationMenuOpen}
          onOpenChange={(_, data) => setNotificationMenuOpen(data.open)}
        >
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              icon={<AlertRegular />}
              className={styles.notificationButton}
            >
              {unreadCount > 0 && (
                <Badge
                  appearance="filled"
                  color="danger"
                  size="small"
                  className={styles.notificationBadge}
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </MenuTrigger>

          <MenuPopover>
            <div className={styles.notificationList}>
              <div style={{ padding: '12px', fontWeight: 600, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
                Notifications ({unreadCount} unread)
              </div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.notificationUnread : ''}`}
                >
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>{notification.title}</div>
                    <div className={styles.notificationMessage}>{notification.message}</div>
                    <div className={styles.notificationTime}>{notification.time}</div>
                  </div>
                  <div className={styles.notificationActions}>
                    {!notification.isRead && (
                      <Button
                        size="small"
                        appearance="subtle"
                        icon={<CheckmarkRegular />}
                        onClick={() => onNotificationRead?.(notification.id)}
                      />
                    )}
                    <Button
                      size="small"
                      appearance="subtle"
                      icon={<DismissRegular />}
                      onClick={() => onNotificationDismiss?.(notification.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MenuPopover>
        </Menu>

        {/* User Menu */}
        <Menu
          open={userMenuOpen}
          onOpenChange={(_, data) => setUserMenuOpen(data.open)}
        >
          <MenuTrigger disableButtonEnhancement>
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userRole}>{user.role}</div>
              </div>
              <Avatar
                name={user.name}
                color="brand"
              />
            </div>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem icon={<PersonRegular />}>Profile</MenuItem>
              <MenuItem icon={<SettingsRegular />} onClick={onOpenSettings}>
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<SignOutRegular />} onClick={onLogout}>
                Sign Out
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </header>
  );
};
