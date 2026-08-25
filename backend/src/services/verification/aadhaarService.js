class AadhaarVerificationService {
    constructor() {
        this.otpStore = {};
    }

    async generateOTP(aadhaarNumber, phoneNumber) {
        // 1. STRICT Aadhaar Validation
        const cleaned = aadhaarNumber.replace(/[^0-9]/g, '');
        
        // Aadhaar must be exactly 12 digits
        if (cleaned.length !== 12) {
            return {
                success: false,
                error: 'Aadhaar must be exactly 12 digits'
            };
        }

        // First digit cannot be 0 or 1
        if (cleaned[0] === '0' || cleaned[0] === '1') {
            return {
                success: false,
                error: 'Aadhaar cannot start with 0 or 1'
            };
        }

        // Phone number must be 10 digits
        const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
        if (cleanedPhone.length !== 10) {
            return {
                success: false,
                error: 'Phone number must be 10 digits'
            };
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const referenceId = 'REF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        
        this.otpStore[referenceId] = {
            otp: otp,
            expiresAt: Date.now() + 300000
        };

        console.log('📱 OTP for Aadhaar ' + cleaned.slice(0,4) + '******' + cleaned.slice(-4) + ': ' + otp);

        return {
            success: true,
            referenceId: referenceId,
            message: 'OTP sent to ' + cleanedPhone.slice(0,4) + '******' + cleanedPhone.slice(-2),
            maskedAadhaar: 'XXXX-XXXX-' + cleaned.slice(-4),
            maskedPhone: cleanedPhone.slice(0,4) + '******' + cleanedPhone.slice(-2)
        };
    }

    async verifyOTP(referenceId, otp) {
        const stored = this.otpStore[referenceId];
        
        if (!stored) {
            return { success: false, verified: false, error: 'Invalid request' };
        }

        if (Date.now() > stored.expiresAt) {
            delete this.otpStore[referenceId];
            return { success: false, verified: false, error: 'OTP expired' };
        }

        if (stored.otp === otp) {
            delete this.otpStore[referenceId];
            return {
                success: true,
                verified: true,
                data: {
                    name: 'Verified User',
                    aadhaarNumber: 'XXXX-XXXX-XXXX'
                }
            };
        }

        return { success: false, verified: false, error: 'Invalid OTP' };
    }
}

module.exports = new AadhaarVerificationService();
