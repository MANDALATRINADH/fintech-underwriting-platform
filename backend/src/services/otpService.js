class OTPService {
    constructor() {
        this.otpStore = {};
    }

    createOTP(identifier) {
        const otp = '123456'; // Fixed OTP for demo
        const referenceId = 'REF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        
        this.otpStore[referenceId] = {
            otp: otp,
            expiresAt: Date.now() + 300000
        };

        console.log('📱 OTP for ' + identifier + ': ' + otp);

        return { otp, referenceId };
    }

    verifyOTP(referenceId, otp) {
        const stored = this.otpStore[referenceId];
        if (!stored) {
            return { success: false, error: 'Invalid request' };
        }

        if (Date.now() > stored.expiresAt) {
            delete this.otpStore[referenceId];
            return { success: false, error: 'OTP expired' };
        }

        if (stored.otp === otp) {
            delete this.otpStore[referenceId];
            return { success: true, verified: true };
        }

        return { success: false, error: 'Invalid OTP' };
    }
}

module.exports = new OTPService();
