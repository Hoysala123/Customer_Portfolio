# KYC Admin Approval System - Setup Instructions

## Overview
This guide will help you set up and test the Customer KYC Admin Approval system where:
- Customers submit KYC forms
- Admin approves or declines KYC requests
- Status updates in real-time on dashboard

---

## Prerequisites

- SQL Server running
- .NET 8 SDK installed
- Node.js / npm installed
- Angular CLI installed

---

## Step 1: Backend Setup

### 1.1 Database Reset (If Needed)
If you have existing data and want a fresh start:

```bash
cd backend
# Open Package Manager Console in Visual Studio and run:
# Drop-Database -Force

# Or delete the database from SQL Server Management Studio
```

### 1.2 Apply Migrations
```bash
cd backend
dotnet ef database update
```

This will:
- Create all tables (Customers, KycRequests, etc.)
- Run all migrations
- Apply DbInitializer to seed test data

### 1.3 Verify Seeding
After running, the database should have:
- **Admin**: admin@finvista.com / Admin@123
- **Advisors**: 2 test advisors
- **Customers**: 3 test customers
- **KYC Requests**: 2 pending KYC requests (for testing)

---

## Step 2: Start Backend

### 2.1 Run the API
```bash
cd backend
dotnet run
```

Expected output:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5167
```

### 2.2 Verify API is Running
Open browser and visit:
- **Swagger**: http://localhost:5167/swagger/ui/index.html
- **Health check**: http://localhost:5167/weatherforecast/

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

### 3.2 Verify API URL
Check `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5167/api'
};
```

Should match your backend port.

### 3.3 Start Frontend
```bash
npm start
```

or

```bash
ng serve
```

Expected output:
```
✔ Compiled successfully.
Application bundle generated successfully.

** Angular Live Development Server is listening on localhost:4200 **
```

---

## Step 4: Test the Admin KYC Dashboard

### 4.1 Login as Admin

1. Open browser: http://localhost:4200/login
2. Enter credentials:
   - Email: `admin@finvista.com`
   - Password: `Admin@123`
3. Click "Login"

### 4.2 Navigate to Notifications
1. From admin dashboard, click **Notifications** in the sidebar
2. You should see the **Customer KYC Table** with test data

Expected display:
```
Customer Name | Phone Number | Email | Action
John Doe      | 1234567890   | ... | [Approve] [Decline]
Jane Smith    | 0987654321   | ... | [Approve] [Decline]
```

### 4.3 Test Approve Action
1. Click **Approve** button for a customer
2. Should get success alert: "KYC approved successfully"
3. Table should refresh and KYC disappear (no longer pending)

### 4.4 Test Decline Action
1. Click **Decline** button for a customer
2. Should get prompt for decline reason (optional)
3. Should get success alert: "KYC declined successfully"
4. Table should refresh and KYC disappear

---

## Step 5: Verify Database Updates

After approving/declining KYC, check that database was updated:

### 5.1 Check KycRequest Table
```sql
SELECT * FROM KycRequests WHERE Status = 'Pending';
-- Should have fewer records after approval/decline
```

### 5.2 Check Customer Table
```sql
SELECT Id, Name, Email, KycStatus FROM Customers;
-- KycStatus should be 'Approved' or 'Declined' for updated customers
```

---

## Testing with Real Customer Flow

If you want to test the complete flow (without seeded data):

### 6.1 Login as Customer
1. Go to http://localhost:4200/signup
2. Create new account with credentials:
   - Username: `testcustomer`
   - Email: `test@example.com`
   - Phone: `9876543210`
   - Password: `Test@123`
3. Login with new credentials

### 6.2 Submit KYC Form
1. You'll be redirected to KYC page
2. Fill in:
   - Name: `Test Customer`
   - Phone: `9876543210`
   - Email: `test@example.com`
3. Click **Submit KYC**
4. You'll get: "OTP sent to your email"

### 6.3 Verify OTP
1. For testing, the OTP is sent to console/logs
2. Or check the OtpCode in database at: `SELECT OtpCode FROM KycRequests WHERE CustomerId = ...`
3. Enter OTP and click **Verify OTP**
4. You should get: "OTP Verified Successfully!"
5. Redirected to dashboard

### 6.4 Check Admin Dashboard
1. Login as admin: admin@finvista.com / Admin@123
2. Go to Notifications
3. New KYC request should appear in table
4. Approve or Decline it

---

## Troubleshooting

### Issue: "No KYC requests available" in admin dashboard

**Possible Causes:**
1. Backend not running
2. Database not seeded
3. No pending KYC requests in database
4. API URL incorrect in environment.ts

**Solutions:**
```bash
# 1. Verify backend is running
curl http://localhost:5167/api/admin/kyc/requests

# 2. Check API response in browser console
# Open DevTools (F12) → Network tab → check /api/admin/kyc/requests

# 3. Verify database has pending KYC requests
# SQL: SELECT * FROM KycRequests WHERE Status = 'Pending';

# 4. Check environment.ts has correct API URL
# Should be: http://localhost:5167/api
```

### Issue: "Error loading KYC requests" message

**Possible Causes:**
1. CORS issue
2. JWT token expired
3. Admin not logged in
4. Backend error

**Solutions:**
```bash
# 1. Check browser console (F12) for error details
# 2. Verify JWT token in localStorage:
# localStorage.getItem('token')

# 3. Check backend logs for error messages
# 4. Logout and login again to refresh token
```

### Issue: OTP not sending to email

**Possible Causes:**
1. Email service not configured
2. SMTP credentials invalid
3. Email domain blocked

**Solutions:**
```bash
# Check appsettings.Development.json:
# Ensure EmailService.SmtpServer and credentials are set

# For testing, OTP is logged to console
# Check backend console output for OTP code
```

### Issue: Approval/Decline button not working

**Possible Causes:**
1. Button is disabled (showing loading state)
2. Authorization error
3. Backend error

**Solutions:**
```bash
# 1. Wait for loading to complete
# 2. Check browser console for error details
# 3. Check backend logs
# 4. Verify JWT token has Admin role in claims
```

---

## API Endpoints for Testing

### Get Pending KYC Requests
```bash
GET http://localhost:5167/api/admin/kyc/requests

# Response:
[
  {
    "id": "guid",
    "customerName": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "status": "Pending"
  }
]
```

### Approve KYC Request
```bash
POST http://localhost:5167/api/admin/kyc/{id}/approve
Content-Type: application/json

{}

# Response:
{ "message": "KYC Approved" }
```

### Decline KYC Request
```bash
POST http://localhost:5167/api/admin/kyc/{id}/decline
Content-Type: application/json

{}

# Response:
{ "message": "KYC Declined" }
```

---

## Using REST Client (VS Code)

You can test APIs directly from VS Code using the REST Client extension:

1. Install "REST Client" extension by Huachao Mao
2. Open `backend/backend.http`
3. Click "Send Request" above each endpoint
4. View response

Test endpoints:
```http
# Get pending KYC requests
GET http://localhost:5167/api/admin/kyc/requests

# Approve (replace {id} with actual KYC request ID)
POST http://localhost:5167/api/admin/kyc/{id}/approve
Content-Type: application/json

{}

# Decline (replace {id} with actual KYC request ID)
POST http://localhost:5167/api/admin/kyc/{id}/decline
Content-Type: application/json

{}
```

---

## Database Connection String

Check in `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=YOUR_DB;Integrated Security=true;"
  }
}
```

Update the server name and database name as needed.

---

## Key Files Updated

| File | Changes |
|------|---------|
| `backend/Data/DbInitializer.cs` | Added seeding for KycRequest test data |
| `backend/Controllers/AdminKycController.cs` | Handles approval/decline |
| `backend/Controllers/KycController.cs` | Handles customer KYC submission |
| `frontend/src/app/admin/notification/` | Enhanced error handling and logging |
| `frontend/src/app/admin/api/admin-api.service.ts` | API calls for KYC endpoints |
| `backend/backend.http` | Added test endpoints |

---

## Quick Start Summary

```bash
# Terminal 1: Backend
cd backend
dotnet ef database update    # Apply migrations
dotnet run                   # Start backend on http://localhost:5167

# Terminal 2: Frontend
cd frontend
npm install                   # One-time setup
npm start                     # Start frontend on http://localhost:4200

# Browser
# 1. Go to http://localhost:4200/login
# 2. Login: admin@finvista.com / Admin@123
# 3. Click Notifications → Should see KYC table with test data
# 4. Click Approve/Decline to test
```

---

## Features Implemented

✅ Customer KYC submission with form  
✅ OTP verification before admin review  
✅ Admin KYC notification dashboard  
✅ Approve/Decline functionality  
✅ Real-time database updates  
✅ Status tracking (Pending → Approved/Declined)  
✅ Error handling and logging  
✅ Test data seeding  

---

**Last Updated:** April 21, 2026  
**Version:** 1.0
