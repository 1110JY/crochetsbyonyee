import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Check for RESEND_API_KEY at runtime
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email service not configured',
          details: 'RESEND_API_KEY is not defined'
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const body = await request.json();
    const { to, subject, message, inquiryId } = body;

    console.log('Attempting to send email:', {
      to,
      subject,
      messageLength: message.length,
    });

    // Send email with HTML template instead of React component
    const emailResult = await resend.emails.send({
      from: 'onboarding@resend.dev', // Using the default Resend sender for testing
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #713f12; margin-bottom: 24px; font-size: 24px; font-weight: bold;">
            Crochets by On-Yee
          </h1>
          <p style="color: #444; font-size: 16px; margin-bottom: 16px;">
            ${message}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px; font-style: italic;">
            Thank you for your interest in our handmade crochet items!
          </p>
        </div>
      `,
    });

    console.log('Email sending result:', emailResult);

    // Update inquiry status in database
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from('contact_inquiries')
      .update({ 
        replied: true, 
        replied_at: new Date().toISOString(),
        reply_message: message,
      })
      .eq('id', inquiryId);

    if (dbError) throw dbError;

    return NextResponse.json({ 
      success: true, 
      data: emailResult 
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send reply',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
