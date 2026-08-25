import React from 'react';

function App() {
    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            fontFamily: 'Arial, sans-serif',
            background: '#f0f4f8',
            minHeight: '100vh'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                maxWidth: '600px',
                margin: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ fontSize: '48px', color: '#0a1628' }}>
                    🏦 AdaptiveTrust
                </h1>
                <p style={{ fontSize: '20px', color: '#4a6a7f' }}>
                    Fintech Underwriting Platform
                </p>
                <p style={{ color: '#00e676', fontWeight: 'bold' }}>
                    ✅ Successfully Deployed on Vercel!
                </p>
                <p style={{ color: '#888', marginTop: '20px' }}>
                    Full application coming soon...
                </p>
            </div>
        </div>
    );
}

export default App;
