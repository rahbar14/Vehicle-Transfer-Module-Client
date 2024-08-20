import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const Layout = ({ children }) => {
    const token = cookies().get("accessToken");
    if (token) redirect("/dashboard")
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f0f2f5',
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
