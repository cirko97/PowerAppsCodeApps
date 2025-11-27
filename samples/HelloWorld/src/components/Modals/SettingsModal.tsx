import React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Switch,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogContent: {
    minWidth: '500px',
    '@media (max-width: 768px)': {
      minWidth: 'auto',
      maxWidth: '90vw',
    },
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('16px', '0'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    ':last-child': {
      borderBottom: 'none',
    },
  },
  settingLabel: {
    flex: 1,
  },
  settingTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  settingDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
});

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const styles = useStyles();

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
            Notification Settings
          </DialogTitle>
          <DialogContent>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <div className={styles.settingTitle}>Email Notifications</div>
                <div className={styles.settingDescription}>
                  Receive email alerts for important events
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <div className={styles.settingTitle}>New Transaction Alerts</div>
                <div className={styles.settingDescription}>
                  Get notified when new transactions need review
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <div className={styles.settingTitle}>Exception Alerts</div>
                <div className={styles.settingDescription}>
                  Immediate notification for exception cases
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <div className={styles.settingTitle}>Daily Summary</div>
                <div className={styles.settingDescription}>
                  Receive daily reconciliation summary report
                </div>
              </div>
              <Switch />
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <div className={styles.settingTitle}>Auto-Match Confidence Threshold</div>
                <div className={styles.settingDescription}>
                  Minimum confidence required for automatic matching (Current: 85%)
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={onClose}>
              Save Settings
            </Button>
          </DialogActions>

          {/* TODO: PowerApps SDK Integration
           * Store user preferences in Dataverse:
           * - Create user settings entity
           * - Use context.webAPI.updateRecord() to save preferences
           * - Retrieve settings on app load
           * - Configure Power Automate flows based on notification settings
           */}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
