# Advisor Dashboard - Portfolio Performance Reports Implementation

## Overview

The Advisor Reports page now displays:
1. **Total Assets Under Management** - Sum of all customer assets
2. **Portfolio Performance (Monthly)** - Assets & investments grouped by purchase date month
3. **Overall Analysis** - Asset allocation breakdown by type (Bonds, Fixed Deposits, Loans)
4. **Customer Summary Table** - Detailed customer assets, liabilities, and risk levels

---

## Features Implemented

### 1. Total Assets Summary Card
- **Position**: Top-left corner of reports page
- **Shows**: Total rupees value of all assets under advisor
- **Updates**: Auto-calculated from customer reports
- **Styling**: Blue gradient card with prominent display

### 2. Portfolio Performance Chart (Enhanced)
- **Type**: Bar chart with multiple datasets
- **Data Grouping**: By purchase date (monthly aggregation)
- **Includes**: 
  - Assets (from Assets table)
  - Investments (from Investments table, excluding "Portfolio Created" entries)
- **Legend**: Shows each data series
- **Tooltips**: Display rupee values on hover
- **Responsive**: Adjusts to screen size

### 3. Overall Analysis Chart
- **Type**: Pie/Donut chart
- **Shows**: Asset allocation percentages
- **Categories**:
  - Bonds (actual amount sum)
  - Fixed Deposits (actual amount sum)
  - Loans (actual amount sum)
- **Legend**: Color-coded indicators

### 4. Customer Summary Table
- **Columns**: S.No, Name, Assets, Liabilities, Risk, Report
- **Assets**: Sum of customer's assets
- **Liabilities**: Sum of customer's loans
- **Risk Level**: From latest audit log
- **Actions**: Download individual customer report

---

## Backend Implementation

### Enhanced Endpoints

#### 1. GET `/api/advisor/reports/portfolio-performance`
**Purpose**: Get monthly portfolio performance data

**Logic**:
- Filters assets by advisor's customers (AdvisorId match)
- Groups Assets by purchase date (month/year)
- Groups Investments by date (month/year)
- Merges both sources
- Sums amounts for each month
- Sorts chronologically

**Response**:
```json
[
  {
    "month": "Jan 2026",
    "value": 80000
  },
  {
    "month": "Feb 2026",
    "value": 125000
  },
  {
    "month": "Mar 2026",
    "value": 185000
  }
]
```

**Key Features**:
- Combines Assets table (PurchaseDate) and Investments table (Date)
- Filters out "Portfolio Created" marker entries
- Handles empty months gracefully
- Sorted by actual chronological order

---

#### 2. GET `/api/advisor/reports/overall-analysis`
**Purpose**: Get asset breakdown by type

**Logic**:
- Sums Bond assets by type
- Sums Fixed Deposit assets by type
- Sums Loan values
- Returns actual amounts (not counts)

**Response**:
```json
[
  {
    "label": "Bonds",
    "value": 50000
  },
  {
    "label": "Fixed Deposit",
    "value": 75000
  },
  {
    "label": "Loans",
    "value": 30000
  }
]
```

**Key Features**:
- Checks multiple type names ("Bond"/"Bonds", "Fixed Deposit"/"FD")
- Shows actual rupee amounts
- Pie chart automatically calculates percentages

---

#### 3. GET `/api/advisor/reports/customers` (Existing, Enhanced)
**Purpose**: Customer summary with assets/liabilities

**Response**:
```json
[
  {
    "id": "guid",
    "name": "John Doe",
    "assets": 125000,
    "liabilities": 30000,
    "risk": "Medium"
  }
]
```

---

## Frontend Implementation

### 1. Component TypeScript
**File**: `advisor-reports.component.ts`

**Key Properties**:
```typescript
barChartData: ChartConfiguration<'bar'>['data']      // Chart data
barChartOptions: ChartConfiguration<'bar'>['options']  // Chart config
pieChartData: ChartConfiguration<'pie'>['data']       // Pie data
totalAssets: number                                    // Total sum
customerReports: any[]                                 // Customer list
```

**Key Methods**:
```typescript
loadPortfolioPerformance()   // Load monthly data
loadOverallAnalysis()        // Load asset breakdown
loadCustomerReports()        // Load customer data + calc total
getChartColor(index)         // Color palette for datasets
getChartBorderColor(index)   // Border color palette
```

**Enhancements**:
- Calculates total assets from customer reports
- Supports both simple and detailed data formats
- Color-codes multiple datasets
- Formats currency in tooltips

---

### 2. Component HTML Template
**File**: `advisor-reports.component.html`

**Layout**:
```
Top Row (3 columns):
├─ Total Assets Summary Card (1 col)
└─ Portfolio Performance Chart (2 cols)

Middle Row:
├─ Overall Analysis Pie Chart (1 col)
└─ Empty space (1 col)

Bottom Row:
└─ Customer Summary Table (full width)
```

**Features**:
- Responsive grid layout
- Color-coded summary card
- Chart legends and descriptions
- Download buttons for each customer report
- Empty state messaging

---

### 3. API Service
**File**: `advisor-api.service.ts`

**Methods**:
```typescript
getPortfolioPerformance(): Observable<any[]>
getOverallAnalysis(): Observable<any[]>
getCustomerReports(): Observable<any[]>
downloadCustomerReport(customerId): Observable<Blob>
```

---

## Data Flow

```
┌─────────────────────────────────────────────┐
│ Advisor Dashboard - Reports Page            │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ AdvisorReportsComponent.ngOnInit()          │
└─────────────────────────────────────────────┘
   ↓              ↓              ↓
   │              │              │
   ↓              ↓              ↓
[1] Load       [2] Load        [3] Load
Portfolio      Overall         Customer
Performance    Analysis        Reports
   │              │              │
   └──────────────┼──────────────┘
                  ↓
         ┌────────────────────┐
         │ AdvisorApiService  │
         └────────────────────┘
          ↓      ↓      ↓      ↓
          │      │      │      │
GET /api/advisor/reports/portfolio-performance
GET /api/advisor/reports/overall-analysis
GET /api/advisor/reports/customers
          │      │      │      │
          └──────────────┬──────┘
                         ↓
        ┌────────────────────────────┐
        │ AdvisorController (Backend)│
        └────────────────────────────┘
         ↓      ↓      ↓      ↓
         │      │      │      │
Query Assets & Investments Tables
Group by Date/Month
Calculate Totals
Filter by Advisor's Customers
         │      │      │      │
         └──────────────┬──────┘
                        ↓
           ┌─────────────────────┐
           │ JSON Response       │
           └─────────────────────┘
                └─ Back to Component
                   Display on Charts
```

---

## Database Queries

### Assets Query (Portfolio Performance)
```sql
SELECT 
    YEAR(PurchaseDate) AS Year,
    MONTH(PurchaseDate) AS Month,
    SUM(Amount) AS TotalAmount
FROM Assets
WHERE CustomerId IN (
    SELECT Id FROM Customers 
    WHERE AdvisorId = @advisorId
)
GROUP BY YEAR(PurchaseDate), MONTH(PurchaseDate)
ORDER BY Year, Month
```

### Investments Query (Portfolio Performance)
```sql
SELECT 
    YEAR([Date]) AS Year,
    MONTH([Date]) AS Month,
    SUM(Amount) AS TotalAmount
FROM Investments
WHERE Type != 'Portfolio Created'
  AND CustomerId IN (
    SELECT Id FROM Customers 
    WHERE AdvisorId = @advisorId
)
GROUP BY YEAR([Date]), MONTH([Date])
ORDER BY Year, Month
```

### Assets by Type (Overall Analysis)
```sql
SELECT 
    SUM(CASE WHEN Type IN ('Bond', 'Bonds') THEN Amount ELSE 0 END) AS BondValue,
    SUM(CASE WHEN Type IN ('Fixed Deposit', 'FD') THEN Amount ELSE 0 END) AS FDValue,
    SUM(CASE WHEN Type = 'Loans' THEN Amount ELSE 0 END) AS LoanValue
FROM Assets
WHERE CustomerId IN (
    SELECT Id FROM Customers 
    WHERE AdvisorId = @advisorId
)
```

---

## Testing

### Test Scenario 1: Verify Portfolio Performance Data
1. Advisor logs in
2. Navigate to Reports page
3. Bar chart should show monthly data
4. Hover over bars to see rupee values
5. Data includes both Assets and Investments

### Test Scenario 2: Verify Total Assets
1. Look at top-left card
2. Total should equal sum of all customer Assets column
3. Value should update as customer reports load

### Test Scenario 3: Verify Overall Analysis
1. Pie chart should display 3 segments
2. Colors: Blue (Bonds), Green (Fixed Deposits), Orange (Loans)
3. Segments sized proportional to amounts

### Test Scenario 4: Customer Summary Table
1. Table shows all customers under advisor
2. Assets = sum of their Assets
3. Liabilities = sum of their Loans
4. Risk = latest risk level from audit logs
5. Download buttons work for each customer

### Test Scenario 5: Empty Data Handle
1. If advisor has no customers, page should still load
2. Charts show empty/zero state
3. Table shows "No reports available"

---

## Sample Data Display

**Total Assets Card:**
```
Total Assets Under Management
₹3,85,000
All customers
```

**Portfolio Performance Chart:**
```
Bar Chart:
Jan 2026: 80,000
Feb 2026: 125,000
Mar 2026: 185,000
```

**Overall Analysis Pie:**
```
Bonds: 50,000 (36%)
Fixed Deposit: 75,000 (54%)
Loans: 30,000 (10%)
```

**Customer Summary:**
```
S.No | Name      | Assets  | Liabilities | Risk   | Report
1    | John Doe  | 125,000 | 30,000      | Medium | Download
2    | Jane Smith| 185,000 | 0           | Low    | Download
3    | Bob Jones | 75,000  | 15,000      | High   | Download
```

---

## Key Improvements Over Previous Version

| Feature | Before | After |
|---------|--------|-------|
| Portfolio Performance | Investments only | Assets + Investments |
| Data Grouping | By investment date | By purchase/investment month |
| Overall Analysis | Count of items | Actual rupee amounts |
| Total Assets | Not displayed | Prominent card shown |
| Customer Assets | Shown in grid | + calculated total |
| Chart Labels | Generic "Performance" | Descriptive labels |
| Tooltips | No values shown | Currency formatted values |

---

## Performance Considerations

- **Database Queries**: Indexed on CustomerId and Dates
- **Grouping**: Performed in database, not frontend
- **Caching**: Can be added for static advisor data
- **Refresh**: Real-time on page load
- **Load Time**: Typically < 100ms for small datasets

---

## Future Enhancements

1. **Date Range Filter** - Select specific month/year range
2. **Customer Comparison** - Compare assets between customers
3. **Trend Analysis** - Show growth/decline percentages
4. **Export Reports** - PDF/Excel generation
5. **Alerts** - Notify when customer assets cross thresholds
6. **Forecasting** - Predict portfolio growth
7. **Risk Analysis** - Color-code by risk level

---

**Last Updated**: April 21, 2026  
**Version**: 1.0
