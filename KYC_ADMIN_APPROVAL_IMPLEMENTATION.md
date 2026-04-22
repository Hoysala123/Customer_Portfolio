# Customer KYC Admin Approval System - Implementation Guide

## Overview
This document outlines the complete KYC approval workflow where:
1. Customer submits KYC form
2. Customer verifies OTP
3. Admin sees pending KYC requests in notification dashboard
4. Admin approves/declines KYC
5. KYC status updates in database and customer view

---

## Backend Architecture

### 1. **Data Models**

#### KycRequest Model
```csharp
Location: backend/Models/KycRequest.cs
- Id (Guid)
- CustomerId (Guid) - FK to Customer
- Name, Phone, Email
- Status: "Pending" | "Approved" | "Declined"
- OtpCode (nullable)
- OtpGeneratedAt (nullable)
- IsOtpVerified (bool)
```

#### Customer Model
```csharp
Location: backend/Models/Customer.cs
- KycStatus: "NotSubmitted" | "Pending" | "Approved" | "Declined"
```

---

### 2. **API Endpoints**

#### Customer KYC Submission Flow

**POST /api/kyc/submit**
- Customer submits initial KYC form (Name, Phone, Email)
- Creates KycRequest with Status = "Pending"
- Updates Customer.KycStatus = "Pending"

**POST /api/kyc/send-otp**
- Generates and sends OTP to customer email
- Stores OtpCode and OtpGeneratedAt

**POST /api/kyc/verify-otp**
- Verifies OTP code
- Sets IsOtpVerified = true
- Status remains "Pending" (awaiting admin approval)
- Customer.KycStatus = "Pending"

---

#### Admin KYC Approval Flow

**GET /api/admin/kyc/requests**
- Returns all pending KYC requests (Status = "Pending")
- Fields: Id, CustomerName, Phone, Email, Status
- Displayed in Admin Notification Dashboard

**POST /api/admin/kyc/{id}/approve**
- Updates KycRequest.Status = "Approved"
- Updates Customer.KycStatus = "Approved"
- Removes from pending list

**POST /api/admin/kyc/{id}/decline**
- Updates KycRequest.Status = "Declined"
- Updates Customer.KycStatus = "Declined"
- Removes from pending list

---

### 3. **Database Schema**

#### KycRequests Table
```sql
CREATE TABLE KycRequests (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(255),
    Phone NVARCHAR(20),
    Email NVARCHAR(255),
    Status NVARCHAR(50) DEFAULT 'Pending',
    OtpCode NVARCHAR(10) NULL,
    OtpGeneratedAt DATETIME NULL,
    IsOtpVerified BIT DEFAULT 0,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);
```

#### Customers Table (Updated)
```sql
ALTER TABLE Customers ADD KycStatus NVARCHAR(50) DEFAULT 'Pending';
```

---

## Frontend Implementation

### 1. **Customer KYC Component**

**Location:** `frontend/src/app/auth/kyc/`

**Workflow:**
1. Customer enters Name, Phone, Email
2. Clicks "Submit KYC" → Calls `KycService.submitKyc()`
3. After submission, OTP is sent automatically
4. Customer enters OTP and clicks "Verify OTP"
5. On successful verification → Redirects to `/dashboard`

**KycService Methods:**
```typescript
submitKyc(data): Observable<any>
sendOtp(): Observable<any>
verifyOtp(otp: string): Observable<any>
```

---

### 2. **Admin Notification Component**

**Location:** `frontend/src/app/admin/notification/admin-notification.component`

**Key Features:**
- Displays table of pending KYC requests
- Shows: Customer Name, Phone, Email, Status
- Action buttons: "Approve" and "Decline"
- Automatically reloads list after action

**Component Methods:**
```typescript
loadKycRequests(): void
approveKyc(kycRequestId: string): void
declineKyc(kycRequestId: string): void
```

**Template Features:**
- *ngFor loop through kycRequests array
- Click handlers for approve/decline buttons
- Empty state message when no requests
- Responsive table design

---

### 3. **Admin API Service**

**Location:** `frontend/src/app/admin/api/admin-api.service.ts`

**KYC Methods:**
```typescript
getKycRequests(): Observable<KycRequest[]>
approveKyc(kycRequestId: string): Observable<void>
declineKyc(kycRequestId: string): Observable<void>
```

---

## Status Flow Diagram

```
Customer Signs Up
    ↓
Customer submits KYC form (Name, Phone, Email)
    ↓
Customer receives OTP via email
    ↓
Customer verifies OTP
    ↓
KycRequest.Status = "Pending" (awaiting admin)
Customer.KycStatus = "Pending"
    ↓
✓ KYC appears in Admin Notification Dashboard
    ↓
Admin clicks "Approve" or "Decline"
    ↓
KycRequest.Status = "Approved" / "Declined"
Customer.KycStatus = "Approved" / "Declined"
    ↓
KYC removed from pending list
Customer can view their KYC status in dashboard
```

---

## Database Migrations

### Migration File
```
Migrations/[DateStamp]_AddKycOtpFields.cs
- Adds OtpCode, OtpGeneratedAt, IsOtpVerified to KycRequests
- Adds KycStatus to Customers
```

---

## Testing Workflow

### Customer KYC Submission Test

**1. Submit KYC:**
```bash
POST /api/kyc/submit
Headers: Authorization: Bearer {customer_token}
Body: {
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com"
}
Response: { "message": "KYC Submitted Successfully" }
```

**2. Send OTP:**
```bash
POST /api/kyc/send-otp
Headers: Authorization: Bearer {customer_token}
Response: { "message": "OTP Sent to Email" }
```

**3. Verify OTP:**
```bash
POST /api/kyc/verify-otp
Headers: Authorization: Bearer {customer_token}
Body: { "otp": "123456" }
Response: { "message": "OTP Verified Successfully — Awaiting Admin Approval" }
```

### Admin Approval Test

**1. Get Pending KYC Requests:**
```bash
GET /api/admin/kyc/requests
Headers: Authorization: Bearer {admin_token}
Response: [
  {
    "id": "guid",
    "customerName": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "status": "Pending"
  }
]
```

**2. Approve KYC:**
```bash
POST /api/admin/kyc/{id}/approve
Headers: Authorization: Bearer {admin_token}
Response: { "message": "KYC Approved" }
```

**3. Decline KYC:**
```bash
POST /api/admin/kyc/{id}/decline
Headers: Authorization: Bearer {admin_token}
Response: { "message": "KYC Declined" }
```

---

## Integration Points

### 1. **Customer View - KYC Status**
- Endpoint: `GET /api/customer/kyc-status`
- Display customer's current KYC status
- Show in customer dashboard profile

### 2. **Admin Dashboard - Customer Management**
- Display KYC status in customer list
- Filter by KYC status (Pending, Approved, Declined)

### 3. **Login Flow**
- Check customer's KycStatus on login
- If "NotSubmitted" → Redirect to KYC form
- If "Pending" → Allow dashboard access but warn
- If "Approved" → Full access
- If "Declined" → Show error, allow resubmit

---

## Key Files Summary

| File | Purpose |
|------|---------|
| `backend/Models/KycRequest.cs` | KYC data model |
| `backend/Models/Customer.cs` | Customer with KycStatus |
| `backend/Controllers/KycController.cs` | Customer KYC endpoints |
| `backend/Controllers/AdminKycController.cs` | Admin approval endpoints |
| `backend/DTOs/Kyc/KycResponseDto.cs` | DTO for KYC requests |
| `frontend/src/app/auth/kyc/` | Customer KYC form |
| `frontend/src/app/admin/notification/` | Admin KYC notification table |
| `frontend/src/app/services/kyc.service.ts` | KYC API calls |
| `frontend/src/app/admin/api/admin-api.service.ts` | Admin API calls |

---

## Configuration

### appsettings.json (Backend)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=...;"
  },
  "Jwt": {
    "Secret": "...",
    "Issuer": "...",
    "Audience": "..."
  },
  "EmailService": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "..."
  }
}
```

### environment.ts (Frontend)
```typescript
export const environment = {
  apiUrl: 'http://localhost:5000/api'
};
```

---

## Future Enhancements

1. **KYC Document Upload**
   - Add file upload for Aadhar, PAN, etc.
   - Store in cloud storage (AWS S3, Azure Blob)

2. **Admin Comments**
   - Add rejection reason when declining KYC

3. **Email Notifications**
   - Notify customer when KYC is approved/declined

4. **Audit Trail**
   - Log all KYC actions for compliance

5. **Re-submission**
   - Allow customer to resubmit declined KYC

6. **Bulk KYC Approval**
   - Admin can approve multiple KYCs at once

7. **KYC Dashboard Analytics**
   - Show pending, approved, declined counts
   - Track KYC approval time

---

## Security Considerations

1. **JWT Authentication**
   - All endpoints require valid JWT token
   - Admin endpoints require Admin claim

2. **Authorization Policies**
   - `[Authorize(Policy = "AdminOnly")]` for admin endpoints
   - `[Authorize(Policy = "CustomerOnly")]` for customer endpoints

3. **Data Validation**
   - Email validation on submit
   - OTP validation (must match generated code)
   - Phone number format validation

4. **OTP Security**
   - OTP valid for 10 minutes
   - OTP can only be used once
   - Failed attempts should be logged

5. **Database**
   - KycRequest and Customer linked via CustomerId
   - Status enum prevents invalid states
   - Audit logs for all KYC actions

---

## Troubleshooting

### Issue: KYC not appearing in admin dashboard
**Solution:** Check if customer KycStatus is "Pending" in database

### Issue: OTP not sending
**Solution:** Verify email configuration in appsettings.json

### Issue: Admin approval not updating customer status
**Solution:** Ensure Customer.KycStatus is being updated in approval endpoint

### Issue: Customer can't submit KYC again after decline
**Solution:** Delete old KycRequest or allow status update to "Pending"

---

## Deployment Checklist

- [ ] Run database migrations
- [ ] Update appsettings.json with production values
- [ ] Configure email service credentials
- [ ] Update API URL in frontend environment.ts
- [ ] Test KYC workflow end-to-end
- [ ] Enable JWT authorization policies
- [ ] Set up HTTPS certificates
- [ ] Enable CORS for frontend domain
- [ ] Configure Docker/deployment platform
- [ ] Set up monitoring and logging

---

**Last Updated:** April 21, 2026
**Version:** 1.0
