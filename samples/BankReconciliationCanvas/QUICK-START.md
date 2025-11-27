# 🚀 Quick Start - Pack & Publish Canvas App

## ⚡ 3-Step Deployment

### **1️⃣ Pack the App**
```powershell
cd PowerAppsCodeApps/samples/BankReconciliationCanvas
pac canvas pack --sources ./Src --msapp BankReconciliation.msapp
```

### **2️⃣ Import to Power Apps**
1. Go to https://make.powerapps.com
2. Click **Apps** → **Import canvas app**
3. Upload `BankReconciliation.msapp`
4. Click **Import**

### **3️⃣ Test & Publish**
1. Open app in Power Apps Studio
2. Press **F5** to test
3. **File** → **Publish** → **Publish this version**
4. **Share** with users

---

## 📦 What's Included

```
BankReconciliationCanvas/
├── README.md                      # Full deployment guide
├── QUICK-START.md                 # This file
├── CanvasManifest.json            # App metadata
└── Src/
    ├── App.fx.yaml                # Main app with OnStart data
    ├── SplashScreen.fx.yaml       # Loading screen
    ├── DashboardScreen.fx.yaml    # Stats & metrics
    ├── MatchingScreen.fx.yaml     # Transaction matching
    ├── ReconciliationScreen.fx.yaml  # Batch reconcile
    └── AuditTrailScreen.fx.yaml   # Activity log
```

---

## ✅ Features Ready to Test

- ✅ **5 Sample Transactions** - Preloaded with different statuses
- ✅ **Dashboard Stats** - Match rate, confidence, amounts
- ✅ **Filtering** - Status, confidence, search
- ✅ **Batch Operations** - Select multiple → Approve/Reject
- ✅ **Reconciliation** - Process accepted transactions
- ✅ **Audit Trail** - Activity log with filtering
- ✅ **Color Coding** - Bank (Blue), Sage (Purple), AI (Teal)

---

## 🎨 Customization

### Change Colors
Edit `Src/App.fx.yaml` line ~7-12:
```yaml
Set(ColorBank, RGBA(0, 120, 212, 1));    # Your brand color
Set(ColorSage, RGBA(139, 92, 246, 1));   # Your secondary color
```

### Add Transactions
Edit `Src/App.fx.yaml` line ~50-150 in `ClearCollect(MatchedTransactions, ...)` block.

---

## 🔗 Connect to Real Data

### Option 1: Dataverse (Recommended)
1. Create tables in Dataverse:
   - `cr9d2_matchedtransaction`
   - `cr9d2_auditlog`
2. Add data sources in Power Apps Studio
3. Replace collection names in formulas

### Option 2: SharePoint Lists
1. Create SharePoint lists
2. Add as data sources
3. Update gallery Items formulas

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **Pack fails** | Check YAML syntax, ensure all files in `Src/` |
| **Blank screen** | Check `App.fx.yaml` OnStart, verify timer in SplashScreen |
| **Filters don't work** | Check dropdown `OnChange` handlers |
| **Batch toolbar hidden** | Verify `SelectedTransactionIds` collection |

---

## 📊 Canvas vs Code App

| Aspect | Canvas App (This) | Code App (HelloWorld) |
|--------|------------------|----------------------|
| Build Time | 3-6 weeks | 2-3 days ✅ |
| Mobile Offline | ✅ Yes | No |
| Complex UI | Manual | CSS/Flexbox ✅ |
| Type Safety | None | TypeScript ✅ |
| Debugging | Monitor | DevTools ✅ |

**Recommendation**: Use **Code App** for web-first, complex UIs. Use **Canvas App** for mobile-first, offline scenarios.

---

## 📚 Learn More

- **Full Guide**: See `README.md` in this folder
- **Code App**: See `../HelloWorld/` for comparison
- **Power Apps Docs**: https://learn.microsoft.com/power-apps/

---

## ⏱️ Time Estimates

- **Pack & Import**: 5 minutes
- **Testing**: 10 minutes
- **Customization**: 30-60 minutes
- **Dataverse Integration**: 2-4 hours
- **Production-Ready**: 1-2 weeks

---

**Good luck with your deployment! 🎉**
