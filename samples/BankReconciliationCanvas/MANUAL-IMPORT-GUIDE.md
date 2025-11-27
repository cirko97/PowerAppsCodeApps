# 📱 Bank Reconciliation Canvas App - Manual Import Guide

Since `pac canvas pack` is deprecated and failing with JSON errors, here's how to manually create the app in Power Apps Studio.

## ⚡ Quick Start (10 minutes)

### **Step 1: Create Blank Canvas App**
1. Go to https://make.powerapps.com
2. Click **+ Create** → **Blank canvas app**
3. Choose **Tablet format** (1366x768)
4. Name it: **Bank Reconciliation**

---

## 📋 App Initialization (Copy Once)

### **Set App.OnStart Formula**

1. Click **App** in tree view (top item)
2. Select **OnStart** property
3. **Paste this entire formula:**

```powerappsfx
// Initialize theme colors
Set(ColorBank, RGBA(0, 120, 212, 1));
Set(ColorSage, RGBA(139, 92, 246, 1));
Set(ColorAI, RGBA(20, 184, 166, 1));
Set(ColorSuccess, RGBA(16, 185, 129, 1));
Set(ColorDanger, RGBA(239, 68, 68, 1));
Set(ColorWarning, RGBA(245, 158, 11, 1));

// Initialize current user
Set(CurrentUserProfile, {name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Finance Manager", avatar: "SJ"});

// Initialize navigation
Set(CurrentTab, "Dashboard");
Set(SelectedTransaction, Blank());
Set(ShowReviewModal, false);
Set(ShowSettingsModal, false);

// Mock Notifications
ClearCollect(Notifications,
    {id: 1, type: "warning", message: "5 transactions need manual review", timestamp: Now() - Time(0, 30, 0), isRead: false},
    {id: 2, type: "success", message: "Daily reconciliation completed successfully", timestamp: Now() - Time(2, 0, 0), isRead: false},
    {id: 3, type: "info", message: "New bank statement uploaded", timestamp: Now() - Time(5, 15, 0), isRead: true}
);

// Mock Matched Transactions
ClearCollect(MatchedTransactions,
    {id: "MT-2024-001", status: "Pending Review", confidence: "High", confidenceScore: 0.95, bankTransaction: {date: Date(2024, 3, 15), description: "VENDOR PAYMENT - ACME CORP", amount: -1250.00, reference: "BP-2024-0315", balance: 45230.50}, sageTransaction: {date: Date(2024, 3, 15), vendor: "ACME Corporation", invoiceNumber: "INV-2024-0847", amount: 1250.00, reference: "SP-0315-001"}, notes: "", lastModified: Now() - Time(0, 30, 0)},
    {id: "MT-2024-002", status: "Accepted", confidence: "High", confidenceScore: 0.98, bankTransaction: {date: Date(2024, 3, 14), description: "CUSTOMER PAYMENT - SMITH LLC", amount: 3500.00, reference: "BP-2024-0314", balance: 46480.50}, sageTransaction: {date: Date(2024, 3, 14), vendor: "Smith LLC", invoiceNumber: "INV-2024-0835", amount: 3500.00, reference: "SR-0314-002"}, notes: "Verified with customer", lastModified: Now() - Time(24, 0, 0)},
    {id: "MT-2024-003", status: "Needs Review", confidence: "Medium", confidenceScore: 0.72, bankTransaction: {date: Date(2024, 3, 13), description: "PAYMENT TO SUPPLIER", amount: -890.50, reference: "BP-2024-0313", balance: 42980.50}, sageTransaction: {date: Date(2024, 3, 13), vendor: "Generic Supplies Ltd", invoiceNumber: "INV-2024-0820", amount: 890.50, reference: "SP-0313-005"}, notes: "", lastModified: Now() - Time(48, 0, 0)},
    {id: "MT-2024-004", status: "Rejected", confidence: "Low", confidenceScore: 0.45, bankTransaction: {date: Date(2024, 3, 12), description: "MISC TRANSACTION", amount: -150.00, reference: "BP-2024-0312", balance: 43871.00}, sageTransaction: {date: Date(2024, 3, 10), vendor: "Unknown Vendor", invoiceNumber: "INV-2024-0801", amount: 155.00, reference: "SP-0312-010"}, notes: "Amount and date mismatch", lastModified: Now() - Time(72, 0, 0)},
    {id: "MT-2024-005", status: "Pending Review", confidence: "High", confidenceScore: 0.88, bankTransaction: {date: Date(2024, 3, 11), description: "SALARY PAYMENT BATCH", amount: -12500.00, reference: "BP-2024-0311", balance: 44021.00}, sageTransaction: {date: Date(2024, 3, 11), vendor: "Payroll Processing", invoiceNumber: "PAY-2024-03", amount: 12500.00, reference: "SP-0311-PAY"}, notes: "", lastModified: Now() - Time(96, 0, 0)}
);

// Mock Audit Log
ClearCollect(AuditLog,
    {id: 1, timestamp: Now() - Time(0, 15, 0), actor: "Sarah Johnson", actorEmail: "sarah.johnson@company.com", action: "Approved Match", category: "Transaction", severity: "Info", details: "Matched transaction MT-2024-002 approved", transactionId: "MT-2024-002"},
    {id: 2, timestamp: Now() - Time(1, 30, 0), actor: "System", actorEmail: "system@company.com", action: "AI Match Created", category: "System", severity: "Info", details: "AI matched 5 new transactions with 92% average confidence", transactionId: ""},
    {id: 3, timestamp: Now() - Time(3, 0, 0), actor: "Sarah Johnson", actorEmail: "sarah.johnson@company.com", action: "Rejected Match", category: "Transaction", severity: "Warning", details: "Match rejected due to amount discrepancy", transactionId: "MT-2024-004"},
    {id: 4, timestamp: Now() - Time(24, 0, 0), actor: "John Smith", actorEmail: "john.smith@company.com", action: "Bank Statement Upload", category: "Data", severity: "Info", details: "Uploaded March 2024 bank statement (250 transactions)", transactionId: ""},
    {id: 5, timestamp: Now() - Time(48, 0, 0), actor: "System", actorEmail: "system@company.com", action: "Reconciliation Complete", category: "System", severity: "Info", details: "Daily reconciliation completed - 45 matches processed", transactionId: ""}
);

// Dashboard Stats
Set(DashboardStats, {totalTransactions: 1247, matchedTransactions: 1198, pendingReview: 35, exceptions: 14, matchRate: 96.1, avgConfidence: 87.5, totalAmount: 2847392.50, reconciledAmount: 2731450.75});

// Initialize filters
Set(FilterStatus, "All");
Set(FilterConfidence, "All");
Set(FilterSearchText, "");
ClearCollect(SelectedTransactionIds, []);

Navigate(SplashScreen, ScreenTransition.None)
```

4. Click **Run OnStart** (three dots menu on App) to test

---

## 🖥️ Screen Setup

### **Create 5 Screens:**

1. Rename **Screen1** → **SplashScreen**
2. Add **New screen** → **Blank** → Name: **DashboardScreen**
3. Add **New screen** → **Blank** → Name: **MatchingScreen**
4. Add **New screen** → **Blank** → Name: **ReconciliationScreen**
5. Add **New screen** → **Blank** → Name: **AuditTrailScreen**

---

## 🎨 Screen 1: SplashScreen (5 controls)

### **Screen Properties:**
- **Fill:** `RGBA(0, 120, 212, 1)`

### **1. Icon (Money)**
**Insert → Icon → Money**
- **Name:** `imgLogo`
- **Color:** `RGBA(255, 255, 255, 1)`
- **Height:** `120`
- **Width:** `120`
- **X:** `(Parent.Width - Self.Width) / 2`
- **Y:** `Parent.Height / 2 - 100`

### **2. Label (Title)**
**Insert → Label**
- **Name:** `lblAppTitle`
- **Text:** `"Bank Reconciliation"`
- **FontWeight:** `FontWeight.Bold`
- **Size:** `24`
- **Color:** `RGBA(255, 255, 255, 1)`
- **Align:** `Align.Center`
- **X:** `0`
- **Y:** `imgLogo.Y + imgLogo.Height + 20`
- **Width:** `Parent.Width`
- **Height:** `40`

### **3. Label (Subtitle)**
**Insert → Label**
- **Name:** `lblSubtitle`
- **Text:** `"Automated Transaction Matching"`
- **Size:** `14`
- **Color:** `RGBA(255, 255, 255, 0.8)`
- **Align:** `Align.Center`
- **X:** `0`
- **Y:** `lblAppTitle.Y + lblAppTitle.Height + 10`
- **Width:** `Parent.Width`
- **Height:** `30`

### **4. Label (Loading)**
**Insert → Label**
- **Name:** `lblLoading`
- **Text:** `"Loading..."`
- **Size:** `12`
- **Color:** `RGBA(255, 255, 255, 0.6)`
- **Align:** `Align.Center`
- **X:** `0`
- **Y:** `Parent.Height - 80`
- **Width:** `Parent.Width`
- **Height:** `30`

### **5. Timer**
**Insert → Timer**
- **Name:** `timerNavigate`
- **Duration:** `2000`
- **Repeat:** `false`
- **AutoStart:** `true`
- **OnTimerEnd:** `Navigate(DashboardScreen, ScreenTransition.Fade)`
- **Visible:** `false`

---

## 📊 Screen 2: DashboardScreen (Simplified Version)

### **Screen Properties:**
- **Fill:** `RGBA(248, 250, 252, 1)`
- **OnVisible:** `Set(CurrentTab, "Dashboard")`

### **Quick Stats Display (Using Gallery)**

**Insert → Vertical Gallery**
- **Name:** `galStats`
- **Items:** 
```powerappsfx
Table(
    {Title: "Total Transactions", Value: Text(DashboardStats.totalTransactions), Icon: Icon.Money, Color: RGBA(0, 120, 212, 1)},
    {Title: "Matched", Value: Text(DashboardStats.matchedTransactions), Icon: Icon.CheckMark, Color: RGBA(16, 185, 129, 1)},
    {Title: "Pending Review", Value: Text(DashboardStats.pendingReview), Icon: Icon.Warning, Color: RGBA(245, 158, 11, 1)},
    {Title: "Exceptions", Value: Text(DashboardStats.exceptions), Icon: Icon.Cancel, Color: RGBA(239, 68, 68, 1)}
)
```
- **Width:** `Parent.Width - 40`
- **X:** `20`
- **Y:** `20`
- **TemplateSize:** `120`

**Inside Gallery Template:**
1. Add **Icon** - Set Icon: `ThisItem.Icon`, Color: `ThisItem.Color`
2. Add **Label** for Title - Text: `ThisItem.Title`
3. Add **Label** for Value - Text: `ThisItem.Value`, FontWeight: Bold, Size: 24

### **Navigation Buttons**

**Insert → Button** (4 times for tabs)

**Button 1: Dashboard**
- **Text:** `"Dashboard"`
- **Fill:** `RGBA(0, 120, 212, 0.1)`
- **OnSelect:** `Set(CurrentTab, "Dashboard")`

**Button 2: Matching**
- **Text:** `"Matching"`
- **OnSelect:** `Set(CurrentTab, "Matching"); Navigate(MatchingScreen)`

**Button 3: Reconciliation**
- **Text:** `"Reconciliation"`
- **OnSelect:** `Set(CurrentTab, "Reconciliation"); Navigate(ReconciliationScreen)`

**Button 4: Audit Trail**
- **Text:** `"Audit Trail"`
- **OnSelect:** `Set(CurrentTab, "Audit"); Navigate(AuditTrailScreen)`

---

## 🔄 Screen 3: MatchingScreen

### **Screen Properties:**
- **Fill:** `RGBA(248, 250, 252, 1)`
- **OnVisible:** `Set(CurrentTab, "Matching")`

### **Transaction Gallery**

**Insert → Vertical Gallery**
- **Name:** `galTransactions`
- **Items:**
```powerappsfx
Filter(
    MatchedTransactions,
    (FilterStatus = "All" Or status = FilterStatus) And
    (FilterConfidence = "All" Or confidence = FilterConfidence) And
    (IsBlank(FilterSearchText) Or FilterSearchText in id Or FilterSearchText in bankTransaction.description Or FilterSearchText in sageTransaction.vendor)
)
```
- **Width:** `Parent.Width - 40`
- **X:** `20`
- **Y:** `180`
- **Height:** `Parent.Height - 220`
- **TemplateSize:** `180`

**Inside Gallery - Add these controls:**

1. **Label - Transaction ID**
   - **Text:** `ThisItem.id`
   - **FontWeight:** `FontWeight.Semibold`

2. **Label - Status Badge**
   - **Text:** `ThisItem.status`
   - **Fill:** `Switch(ThisItem.status, "Accepted", ColorSuccess, "Rejected", ColorDanger, "Needs Review", ColorWarning, ColorBank)`
   - **Color:** `RGBA(255, 255, 255, 1)`

3. **Label - Bank Description**
   - **Text:** `ThisItem.bankTransaction.description`

4. **Label - Bank Amount**
   - **Text:** `Text(ThisItem.bankTransaction.amount, "[$-en-US]$ #,##0.00")`
   - **Color:** `If(ThisItem.bankTransaction.amount < 0, ColorDanger, ColorSuccess)`

5. **Label - Sage Vendor**
   - **Text:** `ThisItem.sageTransaction.vendor`
   - **Color:** `ColorSage`

6. **Label - Confidence**
   - **Text:** `ThisItem.confidence & " (" & Text(ThisItem.confidenceScore * 100, "##0") & "%)"`
   - **Fill:** `Switch(ThisItem.confidence, "High", ColorAI, "Medium", ColorWarning, RGBA(148, 163, 184, 1))`

### **Filter Controls**

**Insert → Dropdown**
- **Name:** `ddStatusFilter`
- **Items:** `["All", "Pending Review", "Needs Review", "Accepted", "Rejected"]`
- **Default:** `"All"`
- **OnChange:** `Set(FilterStatus, Self.Selected.Value)`

**Insert → Dropdown**
- **Name:** `ddConfidenceFilter`
- **Items:** `["All", "High", "Medium", "Low"]`
- **Default:** `"All"`
- **OnChange:** `Set(FilterConfidence, Self.Selected.Value)`

**Insert → Text Input**
- **Name:** `txtSearchFilter`
- **HintText:** `"Search transactions..."`
- **OnChange:** `Set(FilterSearchText, Self.Text)`

**Insert → Button (Clear Filters)**
- **Text:** `"Clear Filters"`
- **OnSelect:**
```powerappsfx
Set(FilterStatus, "All"); Set(FilterConfidence, "All"); Set(FilterSearchText, ""); Reset(ddStatusFilter); Reset(ddConfidenceFilter); Reset(txtSearchFilter)
```

---

## ✅ Screen 4: ReconciliationScreen

### **Screen Properties:**
- **Fill:** `RGBA(248, 250, 252, 1)`
- **OnVisible:** `Set(CurrentTab, "Reconciliation")`

### **Accepted Transactions Gallery**

**Insert → Vertical Gallery**
- **Name:** `galAcceptedTransactions`
- **Items:** `Filter(MatchedTransactions, status = "Accepted")`
- **Width:** `Parent.Width - 40`
- **X:** `20`
- **Y:** `240`
- **Height:** `Parent.Height - 280`
- **TemplateSize:** `140`

**Inside Gallery:**
- Add **Icon** (CheckBadge) - Color: `ColorSuccess`
- Add **Label** for Transaction ID
- Add **Label** for Bank Description
- Add **Label** for Amount

### **Summary Stats**

**Insert → Label (Accepted Count)**
- **Text:** `"Accepted Transactions: " & CountRows(Filter(MatchedTransactions, status = "Accepted"))`
- **Size:** `20`
- **FontWeight:** `FontWeight.Bold`

**Insert → Label (Total Amount)**
- **Text:**
```powerappsfx
"Total Amount: " & Text(Sum(Filter(MatchedTransactions, status = "Accepted"), Abs(bankTransaction.amount)), "[$-en-US]$ #,##0.00")
```

### **Reconcile Button**

**Insert → Button**
- **Text:** `"Batch Reconcile All"`
- **Fill:** `ColorBank`
- **OnSelect:**
```powerappsfx
ForAll(
    Filter(MatchedTransactions, status = "Accepted"),
    Patch(MatchedTransactions, ThisRecord, {status: "Reconciled"})
);
Notify(CountRows(Filter(MatchedTransactions, status = "Accepted")) & " transactions reconciled successfully", NotificationType.Success)
```

---

## 📜 Screen 5: AuditTrailScreen

### **Screen Properties:**
- **Fill:** `RGBA(248, 250, 252, 1)`
- **OnVisible:** `Set(CurrentTab, "Audit")`

### **Audit Log Gallery**

**Insert → Vertical Gallery**
- **Name:** `galAuditLog`
- **Items:** `AuditLog`
- **Width:** `Parent.Width - 40`
- **X:** `20`
- **Y:** `180`
- **Height:** `Parent.Height - 220`
- **TemplateSize:** `120`

**Inside Gallery:**

1. **Icon (Severity)**
   - **Icon:** `Switch(ThisItem.severity, "Error", Icon.Cancel, "Warning", Icon.Warning, Icon.Info)`
   - **Color:** `Switch(ThisItem.severity, "Error", ColorDanger, "Warning", ColorWarning, ColorBank)`

2. **Label - Action**
   - **Text:** `ThisItem.action`
   - **FontWeight:** `FontWeight.Semibold`

3. **Label - Actor**
   - **Text:** `"By: " & ThisItem.actor`
   - **Size:** `11`

4. **Label - Timestamp**
   - **Text:** `Text(ThisItem.timestamp, "mmm dd, yyyy hh:mm AM/PM")`
   - **Align:** `Align.Right`

5. **Label - Details**
   - **Text:** `ThisItem.details`
   - **Size:** `11`

6. **Label - Category Badge**
   - **Text:** `ThisItem.category`
   - **Fill:** `Switch(ThisItem.category, "Transaction", ColorBank, "System", ColorAI, "Data", ColorSage, RGBA(100, 116, 139, 1))`
   - **Color:** `RGBA(255, 255, 255, 1)`

---

## 🎯 Testing Your App

1. **Click Play button** (top right)
2. App should start on SplashScreen
3. After 2 seconds, navigate to Dashboard
4. Test navigation buttons
5. Test filtering on Matching screen
6. Test reconciliation on Reconciliation screen
7. View audit log

---

## 💡 Next Steps

Once basic app works:

1. **Connect to Dataverse** - Replace collections with actual tables
2. **Add Power Automate flows** - For AI matching
3. **Add security** - Role-based access
4. **Publish the app**
5. **Share with users**

---

## ⚠️ Troubleshooting

**If OnStart fails:**
- Check for typos in collection names
- Ensure all curly braces match
- Test sections one at a time

**If navigation doesn't work:**
- Verify screen names are exact (case-sensitive)
- Check that all screens exist

**If galleries don't show data:**
- Click "Run OnStart" first
- Check Items property has correct collection name
- Verify collection was created successfully

---

## 📚 Resources

- All formulas are in the YAML files in `/Src` folder
- Use them as reference for any property
- Each control's properties are clearly marked in the YAML

**Good luck! 🚀**
