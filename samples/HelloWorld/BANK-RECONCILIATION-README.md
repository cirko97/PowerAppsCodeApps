# Operation Smile - Bank Reconciliation System

Power Apps Code App implementacija kompletnog sistema za bankovnu rekoncilijaciju sa AI-driven matching funkcionalnostima.

## 📋 Pregled

Ova aplikacija pruža kompletan sistem za:
- 🏦 Automatsko matchovanje bankovnih transakcija sa Sage ERP sistemom
- 🤖 AI-driven confidence scoring
- ✅ Reconciliation workflow sa batch operations
- 📊 Dashboard sa real-time statistikama
- 🔍 Napredni filtering i search
- 📝 Audit trail za sve akcije
- 📤 Upload bankovnih izvoda (CSV)

## 🚀 Pokretanje Aplikacije

### Preduslov
```bash
# Instalacija zavisnosti
npm install

# Pokretanje development servera
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`

### Build za produkciju
```bash
npm run build
```

## 🏗️ Struktura Projekta

```
src/
├── components/
│   ├── Layout/           # Header, Navigation, PageLayout
│   ├── Dashboard/        # Dashboard sa statistikama
│   ├── Matching/         # Transaction matching komponente
│   ├── Reconciliation/   # Reconciliation flow
│   ├── AuditTrail/       # Audit log prikaz
│   └── Modals/           # Modali (Review, Upload, Settings)
├── data/
│   └── mockData.ts       # Mock podaci za frontend
├── types/
│   └── index.ts          # TypeScript tipovi
├── App.tsx               # Glavni App component
└── main.tsx              # Entry point
```

## 🎯 Glavne Funkcionalnosti

### Dashboard
- Pregled svih transakcija i statistika
- Real-time metrics (Total, Auto-Matched, Needs Review, Exceptions)
- Balance overview (Bank, Sage, Variance)
- Performance metrics (Reconciliation Rate, Avg Confidence)

### Transaction Matching
- Napredni filtering po statusu, confidence level, datumu, iznosu
- Batch operacije (Approve, Reject, Re-analyze)
- Sortiranje po svim kolonama
- Double-click za detaljan review
- Color-coded kolone (Bank - plava, Sage - ljubičasta, AI - teal)

### Reconciliation
- Prikaz samo accepted transakcija spremnih za reconciliation
- Batch reconcile funkcionalnost
- Summary statistike

### Audit Trail
- Kompletna istorija svih akcija
- Filtering po category, severity, actor type
- Expandable rows za detalje
- Export funkcionalnost (placeholder)

### Modali
- **Transaction Review**: Detaljan prikaz transakcije sa approval/reject opcijama
- **Upload**: Drag & drop ili click-to-upload sa progress tracking
- **Settings**: Notification preferences

## 🔌 PowerApps SDK Integracija

Kroz celu aplikaciju postoje **TODO komentari** koji označavaju gde treba dodati PowerApps SDK pozive za integraciju sa Dataverse-om.

### Primer Integracije - Učitavanje Transakcija

```typescript
// U App.tsx - useEffect za inicijalno učitavanje
useEffect(() => {
  const loadTransactions = async () => {
    try {
      const result = await context.webAPI.retrieveMultipleRecords(
        "cr9d2_matchedtransaction",
        `?$select=cr9d2_name,cr9d2_status,cr9d2_confidence,cr9d2_confidencescore
         &$expand=cr9d2_BankTransaction($select=cr9d2_date,cr9d2_description,cr9d2_amount,cr9d2_reference),
                  cr9d2_SageTransaction($select=cr9d2_date,cr9d2_vendor,cr9d2_invoicenumber,cr9d2_amount)
         &$orderby=cr9d2_createdon desc`
      );
      
      const transactions = result.entities.map(entity => ({
        id: entity.cr9d2_name,
        bankTransaction: {
          id: entity.cr9d2_BankTransaction?.cr9d2_banktransactionid,
          date: entity.cr9d2_BankTransaction?.cr9d2_date,
          description: entity.cr9d2_BankTransaction?.cr9d2_description,
          amount: entity.cr9d2_BankTransaction?.cr9d2_amount,
          reference: entity.cr9d2_BankTransaction?.cr9d2_reference,
        },
        sageTransaction: entity.cr9d2_SageTransaction ? {
          id: entity.cr9d2_SageTransaction.cr9d2_sagetransactionid,
          date: entity.cr9d2_SageTransaction.cr9d2_date,
          vendor: entity.cr9d2_SageTransaction.cr9d2_vendor,
          invoiceNumber: entity.cr9d2_SageTransaction.cr9d2_invoicenumber,
          amount: entity.cr9d2_SageTransaction.cr9d2_amount,
        } : null,
        status: entity.cr9d2_status,
        confidence: entity.cr9d2_confidence,
        confidenceScore: entity.cr9d2_confidencescore,
      }));
      
      setTransactions(transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Show error message to user
    }
  };
  
  loadTransactions();
}, []);
```

### Primer Integracije - Update Transakcije

```typescript
const handleApproveTransaction = async (transaction: MatchedTransaction, note: string) => {
  try {
    await context.webAPI.updateRecord(
      "cr9d2_matchedtransaction",
      transaction.id,
      {
        cr9d2_status: 'Accepted',
        cr9d2_notes: note,
        cr9d2_approvedby: context.userSettings.userId,
        cr9d2_approveddate: new Date().toISOString()
      }
    );
    
    // Update local state
    setTransactions(transactions.map(t => 
      t.id === transaction.id 
        ? { ...t, status: 'Accepted', notes: note }
        : t
    ));
    
    // Show success message
  } catch (error) {
    console.error('Error approving transaction:', error);
    // Show error message
  }
};
```

### Potrebni Dataverse Entiteti

Potrebno je kreirati sledeće custom entities u Dataverse-u:

1. **Bank Transaction** (`cr9d2_banktransaction`)
   - cr9d2_date (Date)
   - cr9d2_description (Text)
   - cr9d2_amount (Currency)
   - cr9d2_reference (Text)
   - cr9d2_balance (Currency)

2. **Sage Transaction** (`cr9d2_sagetransaction`)
   - cr9d2_date (Date)
   - cr9d2_vendor (Text)
   - cr9d2_invoicenumber (Text)
   - cr9d2_amount (Currency)
   - cr9d2_reference (Text)

3. **Matched Transaction** (`cr9d2_matchedtransaction`)
   - cr9d2_name (Text) - Auto-number
   - cr9d2_banktransaction (Lookup to Bank Transaction)
   - cr9d2_sagetransaction (Lookup to Sage Transaction)
   - cr9d2_status (Choice: Auto-Matched, Review Required, Exception, etc.)
   - cr9d2_confidence (Choice: High, Medium, Low)
   - cr9d2_confidencescore (Decimal)
   - cr9d2_notes (Multiline Text)
   - cr9d2_matchedby (Lookup to User)
   - cr9d2_matcheddate (DateTime)

4. **Audit Log** - Može se koristiti built-in Dataverse Audit ili custom entity

## 🎨 Design System

Aplikacija koristi **Fluent UI v9** komponente:
- Fluent Design System za konzistentan UI
- Responsive design sa breakpoints
- Accessibility compliance
- Dark/Light theme support (placeholder za implementaciju)

### Color Coding
- 🔵 **Bank kolone**: Plava (`colorPaletteBlueBorder2`)
- 🟣 **Sage kolone**: Ljubičasta (`colorPalettePurpleBorder2`)
- 🟢 **AI Match kolone**: Teal (`colorPaletteTealBorder2`)
- ✅ **Success**: Zelena
- ⚠️ **Warning**: Žuta
- ❌ **Error**: Crvena

## 📱 Responsive Design

Aplikacija je potpuno responsive:
- Desktop: Full feature set sa side-by-side panels
- Tablet: Adjusted grid layouts
- Mobile: Stacked layout sa prioritizovanim funkcijama

## 🔐 Security Considerations

1. **Row-Level Security**: Implementirati kroz Dataverse security roles
2. **Field-Level Security**: Osetljiva polja (iznosi) ograničiti po rolama
3. **Audit Logging**: Sve akcije se loguju sa user ID, timestamp, IP adresom
4. **Data Validation**: Server-side validacija kroz Business Rules ili Plugins

## 🚀 Deployment

### Power Apps Environment
1. Build aplikaciju: `npm run build`
2. Upload build fajlove u Power Apps
3. Configure PowerApps SDK connection
4. Set up Dataverse entities i security roles
5. Configure Power Automate flows za:
   - File processing (CSV upload)
   - Email notifications
   - Scheduled reconciliation reports

### Environment Variables
Kreirati u Power Apps environment settings:
- `SAGE_API_ENDPOINT`: Sage API URL
- `AI_CONFIDENCE_THRESHOLD`: Minimum confidence za auto-match (default: 85%)
- `NOTIFICATION_EMAIL`: Admin email za exception alerts

## 📊 Power Automate Flows

Preporučeni flows:

1. **Process Bank Statement Upload**
   - Trigger: File uploaded to SharePoint/Dataverse
   - Actions: Parse CSV, Create Bank Transactions, Trigger AI Matching

2. **AI Matching Engine**
   - Trigger: New Bank Transaction created
   - Actions: Query Sage Transactions, Calculate confidence, Create Matched Transaction

3. **Daily Reconciliation Report**
   - Trigger: Scheduled (daily)
   - Actions: Generate summary, Send email to stakeholders

4. **Exception Alert**
   - Trigger: Transaction status = Exception
   - Actions: Send immediate notification to finance team

## 🧪 Testing

Mock data je već uključena za frontend testiranje. Za integraciju testiranje:

1. Kreirati test Dataverse environment
2. Popuniti sa sample data
3. Testirati sve CRUD operacije
4. Testirati batch operations
5. Testirati error handling

## 📝 Mock Data

Trenutno aplikacija koristi mock data iz `src/data/mockData.ts`:
- 5 sample transakcija sa različitim statusima
- Mock user profile
- Mock notifications
- Mock audit log entries

## 🔄 Next Steps

1. ✅ Frontend struktura - **KOMPLETNO**
2. ⏳ PowerApps SDK integracija - **TODO**
3. ⏳ Dataverse entities kreiranje - **TODO**
4. ⏳ Power Automate flows - **TODO**
5. ⏳ Testing & QA - **TODO**
6. ⏳ Deployment - **TODO**

## 📞 Support

Za pitanja i podršku:
- Proveri TODO komentare u kodu
- Konsultuj PowerApps SDK dokumentaciju
- Dataverse Entity Reference

## 📄 License

Ova aplikacija je deo Operation Smile projekta.

---

**Built with ❤️ using Power Apps Code Apps + React + TypeScript + Fluent UI v9**
