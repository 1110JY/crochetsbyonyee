import * as React from 'react';

interface EmailTemplateProps {
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ message }) => (
  <div style={{
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: '1.6',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  }}>
    <h1 style={{ 
      color: '#713f12',
      marginBottom: '24px',
      fontSize: '24px',
      fontWeight: 'bold',
    }}>
      Crochets by On-Yee
    </h1>
    <p style={{
      color: '#444',
      fontSize: '16px',
      marginBottom: '16px',
    }}>
      {message}
    </p>
    <hr style={{
      border: 'none',
      borderTop: '1px solid #eee',
      margin: '20px 0',
    }} />
    <p style={{
      color: '#666',
      fontSize: '14px',
      fontStyle: 'italic',
    }}>
      Thank you for your interest in our handmade crochet items!
    </p>
  </div>
);
