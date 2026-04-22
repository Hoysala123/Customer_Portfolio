# Backend Restart & Troubleshooting Guide

## Issue: "Http failure during parsing" Error on KYC Approve/Decline

This error occurs when the backend API response cannot be properly parsed as JSON. This is usually because:

1. **Backend hasn't been restarted with new code changes**
2. Backend is still running old code from before my fixes
3. Need a clean rebuild

---

## Solution: Restart Backend Properly

### Step 1: Stop the Running Backend

**Option A: Using VS Code Terminal**
- Find the terminal running the backend (should show `dotnet run`)
- Press `Ctrl+C` to stop it
- Wait 2-3 seconds for it to fully stop

**Option B: Kill the Process**
```bash
# Windows - you can run this in PowerShell
Get-Process dotnet | Stop-Process -Force

# Or find the backend terminal and click the trash icon
```

### Step 2: Clean Build

```bash
cd backend
dotnet clean
dotnet restore
dotnet build
```

### Step 3: Delete Compiled Output

```bash
# Optional but recommended
rmdir /S /Q bin
rmdir /S /Q obj
```

### Step 4: Restart Backend

```bash
cd backend
dotnet run
```

**Look for this message in the console:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5167
```

---

## Step 5: Clear Frontend Cache

### Option A: Hard Refresh
1. Open DevTools (F12)
2. Press `Ctrl+Shift+R` (or Cmd+Shift+R on Mac)
3. This clears the browser cache and reloads

### Option B: Clear localStorage
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find your localhost entry
4. Click it and delete all entries
5. Refresh the page

---

## Step 6: Test Again

1. **Login as admin:**
   - Email: `admin@finvista.com`
   - Password: `Admin@123`

2. **Go to Notifications:**
   - Click "Notifications" in sidebar

3. **Try Approve/Decline:**
   - Click "Approve" button
   - Should get success alert now
   - No more parsing error

---

## Verification Steps

### Test 1: Check API Directly
Open in browser:
```
http://localhost:5167/api/admin/kyc/requests
```

Should show KYC requests in JSON format

### Test 2: Check Response Format
1. Open DevTools (F12)
2. Go to Network tab
3. Click Approve button
4. Look for request to `/api/admin/kyc/.../approve`
5. Click on it and check the Response tab
6. Should see JSON like:
```json
{
  "success": true,
  "message": "KYC Approved successfully"
}
```

### Test 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Try Approve again
4. Should see logs like:
```
KYC approved response: {success: true, message: "KYC Approved successfully"}
```

If you see an error, post the full error message.

---

## Files Updated with Fixes

1. **Backend**
   - `backend/Controllers/AdminKycController.cs` - Added error handling
   - `backend/DTOs/Kyc/KycActionResponseDto.cs` - Proper response object
   - `[Produces("application/json")]` attribute added

2. **Frontend**
   - `frontend/src/app/admin/notification/admin-notification.component.ts` - Better error handling
   - `frontend/src/app/admin/api/admin-api.service.ts` - Updated return types

---

## If Error Still Persists

### Check Backend Console Output
When you click Approve, you should see in the backend terminal:
```
KYC Requests loaded: 
KYC approved response: {success: true, message: "KYC Approved successfully"}
```

If you see an error message, **post it** so I can help.

### Common Issues

**Issue 1: Port already in use**
```
error: listen EADDRINUSE: address already in use :::5167
```
**Solution:**
```bash
# Kill process on port 5167
netstat -ano | findstr :5167
taskkill /PID <PID> /F
```

**Issue 2: Build error**
```
error CS0246: The type or namespace name 'KycActionResponseDto' could not be found
```
**Solution:**
```bash
cd backend
dotnet clean
dotnet restore
dotnet build
```

**Issue 3: Still getting parsing error after restart**
```bash
# Run in backend folder
dotnet run --configuration Release
# This uses optimized build
```

---

## Quick Commands Cheat Sheet

```bash
# Stop backend (if still running)
Ctrl+C  # In the terminal running backend

# Clean rebuild
cd backend && dotnet clean && dotnet restore && dotnet build && dotnet run

# Hard refresh frontend
Ctrl+Shift+R  # In browser

# Check if backend is running
curl http://localhost:5167/api/admin/kyc/requests

# View backend logs in real-time
# (Already showing in terminal running Backend)
```

---

## Expected Behavior After Fix

1. **Click Approve →** Success alert "KYC Approved successfully" → Table refreshes
2. **Click Decline →** Success alert "KYC Declined successfully" → Table refreshes
3. **Database updates** → KycRequest.Status = "Approved/Declined"
4. **Customer status updates** → Customer.KycStatus = "Approved/Declined"

---

**If you're still having issues after these steps, please share:**
1. Backend terminal output/error messages
2. Browser DevTools Network tab screenshot of the request/response
3. Full error message from browser console

I'll be able to debug from there! 🔍
