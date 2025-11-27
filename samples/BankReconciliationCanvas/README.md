# Bank Reconciliation Canvas App - Deployment Guide

## 📋 Overview

This is a **Canvas App POC** for Bank Reconciliation built with **YAML** format. It demonstrates automated transaction matching between Bank statements and Sage accounting transactions with AI confidence scoring.

## ✨ Features

### 🎯 Core Functionality
- ✅ **Dashboard** - Real-time statistics and performance metrics
- ✅ **Transaction Matching** - View and filter matched transactions with confidence scores
- ✅ **Batch Operations** - Approve/reject multiple transactions at once
- ✅ **Reconciliation Workflow** - Process accepted transactions
- ✅ **Audit Trail** - Complete activity log with filtering
- ✅ **Mock Data** - Pre-loaded sample transactions for testing

### 🎨 UI Components
- Color-coded transactions (Bank: Blue, Sage: Purple, AI: Teal)
- Status badges (Pending, Accepted, Rejected, Needs Review)
- Confidence indicators (High, Medium, Low with percentages)
- Responsive galleries with filtering
- Empty states for better UX

### 📊 Data Collections
All data is **in-memory** for this POC:
- `MatchedTransactions` - 5 sample matched transactions
- `AuditLog` - 5 sample audit entries
- `Notifications` - 3 sample notifications
- `DashboardStats` - Aggregated statistics

---

## 🚀 How to Import & Publish

### **Step 1: Prepare the Files**

Ensure you have all YAML files in the `Src/` folder:
```
BankReconciliationCanvas/
├── CanvasManifest.json
└── Src/
    ├── App.fx.yaml
    ├── SplashScreen.fx.yaml
    ├── DashboardScreen.fx.yaml
    ├── MatchingScreen.fx.yaml
    ├── ReconciliationScreen.fx.yaml
    └── AuditTrailScreen.fx.yaml
```

---

### **Step 2: Pack the App Using Power Apps CLI**

#### **Option A: Using PAC CLI (Recommended)**

1. **Install Power Platform CLI** (if not already installed):
   ```powershell
   # Install via MSI from:
   # https://aka.ms/PowerAppsCLI
   
   # Or via PowerShell
   Install-Module -Name Microsoft.PowerApps.CLI.PowerPlatform
   ```

2. **Navigate to the Canvas App folder**:
   ```powershell
   cd PowerAppsCodeApps/samples/BankReconciliationCanvas
   ```

3. **Pack the YAML files into .msapp**:
   ```powershell
   pac canvas pack --sources ./Src --msapp BankReconciliation.msapp
   ```

   This creates `BankReconciliation.msapp` file.

---

### **Step 3: Import to Power Apps Environment**

#### **Option A: Via Power Apps Web Portal**

1. **Go to Power Apps**: https://make.powerapps.com

2. **Select your environment** (top-right corner)

3. **Click "Apps"** in left navigation

4. **Click "Import canvas app"**

5. **Click "Upload"** and select `BankReconciliation.msapp`

6. **Click "Import"**

7. **Wait for import to complete** (30-60 seconds)

8. **Click "Open"** to view the app

---

#### **Option B: Via PAC CLI (Advanced)**

1. **Authenticate to your environment**:
   ```powershell
   pac auth create --url https://yourorg.crm.dynamics.com
   ```

2. **Import the .msapp file**:
   ```powershell
   pac canvas import --path BankReconciliation.msapp --environment <environment-id>
   ```

---

### **Step 4: Test the App**

1. **Open the imported app** in Power Apps Studio

2. **Click "Play"** (▶️) or press **F5**

3. **You'll see**:
   - 2-second splash screen
   - Auto-navigate to Dashboard
   - Pre-loaded mock data (5 transactions, stats, audit log)

4. **Test features**:
   - Navigate between tabs (Dashboard, Matching, Reconciliation, Audit)
   - Use filters on Matching screen
   - Select transactions and use batch operations
   - View accepted transactions in Reconciliation tab
   - Check Audit Trail for activity log

---

### **Step 5: Publish to Production**

1. **In Power Apps Studio**, click **"File" → "Save"**

2. **Click "Publish"**

3. **Click "Publish this version"**

4. **Click "Share"** to assign users:
   - Add individual users or groups
   - Set permissions (Can use, Can edit)

5. **Get the app URL**:
   - Click "Details" → Copy "Web link"
   - Share with users: `https://apps.powerapps.com/play/...`

---

## 🔧 Customization Guide

### **Change Color Scheme**

Edit `App.fx.yaml` OnStart section:
```yaml
Set(ColorBank, RGBA(0, 120, 212, 1));      # Blue
Set(ColorSage, RGBA(139, 92, 246, 1));     # Purple
Set(ColorAI, RGBA(20, 184, 166, 1));       # Teal
Set(ColorSuccess, RGBA(16, 185, 129, 1));  # Green
Set(ColorDanger, RGBA(239, 68, 68, 1));    # Red
Set(ColorWarning, RGBA(245, 158, 11, 1));  # Orange
```

---

### **Add More Mock Transactions**

Edit `App.fx.yaml` in the `ClearCollect(MatchedTransactions, ...)` section:
```yaml
{
    id: "MT-2024-006",
    status: "Pending Review",
    confidence: "High",
    confidenceScore: 0.91,
    bankTransaction: {
        date: Date(2024, 3, 16),
        description: "YOUR DESCRIPTION",
        amount: -500.00,
        reference: "BP-2024-0316",
        balance: 44730.50
    },
    sageTransaction: {
        date: Date(2024, 3, 16),
        vendor: "YOUR VENDOR",
        invoiceNumber: "INV-2024-0850",
        amount: 500.00,
        reference: "SP-0316-001"
    },
    notes: "",
    lastModified: Now()
}
```

---

### **Connect to Dataverse (Real Data)**

Replace collections with Dataverse connections:

1. **Create Dataverse Tables**:
   - `cr9d2_banktransaction`
   - `cr9d2_sagetransaction`
   - `cr9d2_matchedtransaction`
   - `cr9d2_auditlog`

2. **Add Data Sources in Power Apps Studio**:
   - Click "Data" → "Add data"
   - Search for your tables
   - Add them

3. **Replace Collection References**:
   - Change `MatchedTransactions` → `cr9d2_matchedtransactions`
   - Change `AuditLog` → `cr9d2_auditlogs`
   - Change `ClearCollect()` → Direct Dataverse queries

4. **Update Gallery Items**:
   ```
   # Before (Mock)
   Items: =Filter(MatchedTransactions, status = "Accepted")
   
   # After (Dataverse)
   Items: =Filter(cr9d2_matchedtransactions, cr9d2_status = "Accepted")
   ```

---

## 📱 Mobile Optimization

The app is designed for **Phone layout** but can be adapted:

1. **Switch to Tablet/Desktop**:
   - Go to "File" → "Settings" → "Screen size + orientation"
   - Change from "Phone" to "Tablet" or "Custom"

2. **Adjust Container Widths**:
   - Update `Width` properties in YAML files
   - Use responsive formulas: `Parent.Width - 40`

---

## 🐛 Troubleshooting

### **Import Fails**

**Error**: "Invalid .msapp file"
- **Fix**: Re-run `pac canvas pack` command
- Ensure all YAML files are in `Src/` folder
- Check for syntax errors in YAML

---

### **Blank Screen on Launch**

**Issue**: App opens but shows blank screen
- **Fix**: Check `App.fx.yaml` OnStart formula
- Ensure timer in `SplashScreen.fx.yaml` is set to navigate
- Check console for errors (F12 in browser)

---

### **Filters Not Working**

**Issue**: Dropdown filters don't filter transactions
- **Fix**: Check gallery `Items` formula
- Ensure filter variables are properly set
- Verify `OnChange` handlers in dropdowns

---

### **Batch Operations Fail**

**Issue**: Selecting transactions doesn't show batch toolbar
- **Fix**: Check `SelectedTransactionIds` collection
- Verify `chkSelect` OnCheck/OnUncheck handlers
- Ensure `containerBatchActions.Visible` formula is correct

---

## 📊 Performance Considerations

### **Canvas App Limits**
- **Max Collections**: 500 items (delegation limit)
- **Gallery Items**: Use delegation-friendly formulas
- **For large datasets**: Connect to Dataverse with proper indexing

### **Optimization Tips**
1. Use `Filter()` instead of nested `ForAll()` loops
2. Minimize calculated columns in galleries
3. Use `Concurrent()` for multiple data operations
4. Cache frequently accessed data in variables

---

## 🔐 Security Best Practices

1. **Row-Level Security**: 
   - Implement in Dataverse tables
   - Filter by `User().Email` in gallery Items

2. **Connection Security**:
   - Use service principals for production
   - Avoid storing credentials in app

3. **Audit Trail**:
   - Log all approve/reject actions
   - Include user, timestamp, before/after states

---

## 🆚 Canvas App vs Code App Comparison

| Feature | Canvas App (This) | Code App (HelloWorld) |
|---------|------------------|----------------------|
| **Development Time** | 3-6 weeks | 2-3 days ✅ |
| **Complex Layouts** | Manual positioning | CSS Flexbox ✅ |
| **Type Safety** | None | TypeScript ✅ |
| **Version Control** | Solutions | Git ✅ |
| **Animations** | Limited | Full CSS ✅ |
| **Mobile Offline** | Yes ✅ | No |
| **Licensing** | Per-user or per-app | Per-user |
| **Debugging** | Monitor | DevTools ✅ |

---

## 🎓 Learning Resources

- **Power Apps Canvas Docs**: https://learn.microsoft.com/power-apps/maker/canvas-apps/
- **PAC CLI Reference**: https://learn.microsoft.com/power-platform/developer/cli/reference/canvas
- **Formula Reference**: https://learn.microsoft.com/power-platform/power-fx/formula-reference
- **Dataverse Integration**: https://learn.microsoft.com/power-apps/maker/data-platform/

---

## 🤝 Next Steps

### **For POC/Demo**
✅ Use as-is with mock data
✅ Customize colors and branding
✅ Add more sample transactions

### **For Production**
1. Create Dataverse tables (see schema in BANK-RECONCILIATION-README.md)
2. Build Power Automate flows for AI matching
3. Integrate with SharePoint for file uploads
4. Implement security roles
5. Add error handling and logging
6. Create user documentation

---

## 📞 Support

- **Issues**: Check Troubleshooting section above
- **Questions**: Review Power Apps documentation
- **Enhancements**: Modify YAML files and re-pack

---

## 📄 License

This is a POC/Sample app. Customize as needed for your organization.

---

**Built with ❤️ using Power Apps Canvas + YAML**

Last Updated: November 27, 2025
