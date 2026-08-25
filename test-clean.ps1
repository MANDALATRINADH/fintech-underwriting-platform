Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "FINAL API TEST" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get fresh token
Write-Host "[1] Getting fresh token..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/demo" -Method POST -UseBasicParsing
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "  Token obtained" -ForegroundColor Green
} catch {
    Write-Host "  Server not responding. Make sure backend is running!" -ForegroundColor Red
    exit
}

$headers = @{"Content-Type"="application/json"; "Authorization"="Bearer $token"}

# 1. Health Check
Write-Host ""
Write-Host "[2] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Server: $($data.status)" -ForegroundColor Green
} catch {
    Write-Host "  Failed" -ForegroundColor Red
}

# 2. PAN Verification
Write-Host ""
Write-Host "[3] PAN Verification..." -ForegroundColor Yellow
try {
    $body = '{"panNumber":"ABCDE1234F","name":"Rahul Sharma","dob":"1990-05-15"}'
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/verification/pan/verify" -Method POST -Headers $headers -Body $body -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    if ($data.verified) {
        Write-Host "  PAN Verified: $($data.data.name)" -ForegroundColor Green
    } else {
        Write-Host "  Failed: $($data.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "  Error" -ForegroundColor Red
}

# 3. Aadhaar OTP
Write-Host ""
Write-Host "[4] Aadhaar OTP..." -ForegroundColor Yellow
try {
    $body = '{"aadhaarNumber":"123456789012","phoneNumber":"9876543210"}'
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/verification/aadhaar/generate-otp" -Method POST -Headers $headers -Body $body -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "  OTP Generated!" -ForegroundColor Green
        Write-Host "  $($data.message)" -ForegroundColor Green
        $referenceId = $data.referenceId
    } else {
        Write-Host "  Failed: $($data.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "  Error" -ForegroundColor Red
}

# 4. Aadhaar Verify
Write-Host ""
Write-Host "[5] Aadhaar Verify..." -ForegroundColor Yellow
try {
    if ($referenceId) {
        $body = '{"referenceId":"' + $referenceId + '","otp":"123456"}'
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/verification/aadhaar/verify-otp" -Method POST -Headers $headers -Body $body -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        if ($data.verified) {
            Write-Host "  Aadhaar Verified!" -ForegroundColor Green
        } else {
            Write-Host "  Failed: $($data.error)" -ForegroundColor Red
        }
    } else {
        Write-Host "  Skipping - No reference ID" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  Error" -ForegroundColor Red
}

# 5. Credit Score
Write-Host ""
Write-Host "[6] Credit Score..." -ForegroundColor Yellow
try {
    $body = '{"bureauScore":680,"incomeStability":7,"employmentStability":8,"debtToIncome":30,"repaymentHistory":8,"digitalBehavior":7}'
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/verification/credit-score" -Method POST -Headers $headers -Body $body -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "  Credit Score: $($data.data.score)" -ForegroundColor Green
        Write-Host "  Risk Level: $($data.data.riskLevel)" -ForegroundColor Yellow
    } else {
        Write-Host "  Failed: $($data.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "  Error" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Tests completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
