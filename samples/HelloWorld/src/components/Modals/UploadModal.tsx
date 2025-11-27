import React, { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  ProgressBar,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  DismissRegular,
  ArrowUploadRegular,
  DocumentRegular,
  CheckmarkCircleRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogContent: {
    minWidth: '600px',
    '@media (max-width: 768px)': {
      minWidth: 'auto',
      maxWidth: '90vw',
    },
  },
  dropZone: {
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding('48px', '24px'),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      ...shorthands.border('2px', 'dashed', '#0078D4'),
      backgroundColor: tokens.colorBrandBackground2,
    },
  },
  dropZoneDragging: {
    ...shorthands.border('2px', 'dashed', '#0078D4'),
    backgroundColor: tokens.colorBrandBackground2,
  },
  uploadIcon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '16px',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginTop: '16px',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  fileSize: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  progressContainer: {
    marginTop: '16px',
  },
  processingSteps: {
    marginTop: '24px',
  },
  processingStep: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px'),
    marginBottom: '8px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  stepComplete: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  stepIcon: {
    fontSize: '24px',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  stepDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  successIcon: {
    fontSize: '64px',
    color: tokens.colorPaletteGreenForeground1,
    marginBottom: '16px',
  },
  completionStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    ...shorthands.gap('16px'),
    marginTop: '24px',
  },
  completionStat: {
    textAlign: 'center',
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  completionNumber: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  completionLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
});

type UploadStage = 'select' | 'uploading' | 'processing' | 'complete';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, onUploadComplete }) => {
  const styles = useStyles();
  const [stage, setStage] = useState<UploadStage>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);

  const handleFileSelect = (file: File | null) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setStage('uploading');
    
    // Simulate upload
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setStage('processing');
          startProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startProcessing = () => {
    const steps = ['Validating file...', 'Parsing transactions...', 'Running AI matching...', 'Finalizing...'];
    let currentStep = 0;

    const processingInterval = setInterval(() => {
      currentStep++;
      setProcessingStep(currentStep);
      
      if (currentStep >= steps.length) {
        clearInterval(processingInterval);
        setTimeout(() => {
          setStage('complete');
          onUploadComplete();
        }, 500);
      }
    }, 1500);
  };

  const handleClose = () => {
    setStage('select');
    setSelectedFile(null);
    setUploadProgress(0);
    setProcessingStep(0);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && handleClose()}>
      <DialogSurface className={styles.dialogContent}>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                icon={<DismissRegular />}
                onClick={handleClose}
              />
            }
          >
            Upload Bank Statement
          </DialogTitle>
          <DialogContent>
            {stage === 'select' && (
              <>
                <div
                  className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      handleFileSelect(file || null);
                    };
                    input.click();
                  }}
                >
                  <div className={styles.uploadIcon}>
                    <ArrowUploadRegular />
                  </div>
                  <div>
                    <strong>Click to upload</strong> or drag and drop
                  </div>
                  <div style={{ marginTop: '8px', fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 }}>
                    CSV files only (max 10MB)
                  </div>
                </div>

                {selectedFile && (
                  <div className={styles.fileInfo}>
                    <DocumentRegular fontSize={32} />
                    <div className={styles.fileDetails}>
                      <div className={styles.fileName}>{selectedFile.name}</div>
                      <div className={styles.fileSize}>{formatFileSize(selectedFile.size)}</div>
                    </div>
                    <Button
                      appearance="subtle"
                      icon={<DismissRegular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {stage === 'uploading' && (
              <div className={styles.progressContainer}>
                <div className={styles.fileName}>{selectedFile?.name}</div>
                <ProgressBar value={uploadProgress / 100} style={{ marginTop: '16px' }} />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  Uploading... {uploadProgress}%
                </div>
              </div>
            )}

            {stage === 'processing' && (
              <div className={styles.processingSteps}>
                <ProcessingStep
                  icon="📄"
                  title="Validating file"
                  description="Checking file format and integrity"
                  completed={processingStep >= 1}
                />
                <ProcessingStep
                  icon="🔍"
                  title="Parsing transactions"
                  description="Extracting transaction data"
                  completed={processingStep >= 2}
                />
                <ProcessingStep
                  icon="🤖"
                  title="Running AI matching"
                  description="Matching with Sage transactions"
                  completed={processingStep >= 3}
                />
                <ProcessingStep
                  icon="✅"
                  title="Finalizing"
                  description="Saving results to database"
                  completed={processingStep >= 4}
                />
              </div>
            )}

            {stage === 'complete' && (
              <div style={{ textAlign: 'center' }}>
                <div className={styles.successIcon}>
                  <CheckmarkCircleRegular />
                </div>
                <h3>Upload Complete!</h3>
                <p>Your bank statement has been processed successfully.</p>
                
                <div className={styles.completionStats}>
                  <div className={styles.completionStat}>
                    <div className={styles.completionNumber}>150</div>
                    <div className={styles.completionLabel}>Transactions</div>
                  </div>
                  <div className={styles.completionStat}>
                    <div className={styles.completionNumber}>142</div>
                    <div className={styles.completionLabel}>Auto-Matched</div>
                  </div>
                  <div className={styles.completionStat}>
                    <div className={styles.completionNumber}>8</div>
                    <div className={styles.completionLabel}>Need Review</div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            {stage === 'select' && (
              <>
                <Button appearance="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  disabled={!selectedFile}
                  onClick={handleUpload}
                >
                  Upload & Process
                </Button>
              </>
            )}
            {stage === 'complete' && (
              <Button appearance="primary" onClick={handleClose}>
                View Transactions
              </Button>
            )}
          </DialogActions>

          {/* TODO: PowerApps SDK Integration
           * Implement file upload to SharePoint/Dataverse:
           * - Use context.webAPI.createRecord() to create upload record
           * - Upload file to SharePoint using Microsoft Graph API
           * - Trigger Power Automate flow for processing
           * - Parse CSV and create transaction records in Dataverse
           * - Update UI with real-time progress using SignalR or polling
           */}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

interface ProcessingStepProps {
  icon: string;
  title: string;
  description: string;
  completed: boolean;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ icon, title, description, completed }) => {
  const styles = useStyles();
  
  return (
    <div className={`${styles.processingStep} ${completed ? styles.stepComplete : ''}`}>
      <div className={styles.stepIcon}>{icon}</div>
      <div className={styles.stepContent}>
        <div className={styles.stepTitle}>{title}</div>
        <div className={styles.stepDescription}>{description}</div>
      </div>
      {completed && <CheckmarkCircleRegular fontSize={24} color={tokens.colorPaletteGreenForeground1} />}
    </div>
  );
};
