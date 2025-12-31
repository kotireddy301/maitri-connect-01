/**
 * Email Service Utility for MaitriConnect
 * 
 * NOTE: In a production environment, this file would interact with a secure backend API 
 * (e.g., Supabase Edge Functions, AWS Lambda) to send emails via SendGrid.
 * 
 * Storing SendGrid API keys directly in the frontend is insecure and strictly prohibited.
 * This service currently simulates the API call to demonstrate functionality.
 */

// Define SendGrid Template IDs (These would be configured in the SendGrid Dashboard)
export const EMAIL_TEMPLATES = {
  REGISTRATION_WELCOME: 'd-registration-template-id',
  EVENT_CONFIRMATION: 'd-event-confirmation-template-id',
};

/**
 * Simulates sending an email via a backend API
 * @param {string} type - 'registration' | 'event_registration'
 * @param {Object} data - Dynamic data for the email template
 */
export const sendConfirmationEmail = async (type, data) => {
  // 1. Prepare the payload that would be sent to the backend
  const payload = {
    to: data.email,
    from: 'noreply@maitriconnect.org',
    templateId: type === 'registration' 
      ? EMAIL_TEMPLATES.REGISTRATION_WELCOME 
      : EMAIL_TEMPLATES.EVENT_CONFIRMATION,
    dynamic_template_data: {
      first_name: data.firstName || data.name?.split(' ')[0],
      subject: type === 'registration' 
        ? 'Welcome to MaitriConnect!' 
        : `Registration Confirmed: ${data.event?.title}`,
      ...data
    }
  };

  console.log('------------------------------------------------');
  console.log(`[SendGrid Simulation] Sending ${type} email...`);
  console.log('Payload:', payload);
  console.log('------------------------------------------------');

  // 2. Simulate network delay and backend processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: 'Email queued successfully via SendGrid' 
      });
    }, 1500);
  });
};

/* 
 * BACKEND API MOCK REFERENCE
 * 
 * If you were to implement the backend endpoint (e.g., Supabase Edge Function),
 * it would look something like this:
 * 
 * import sgMail from '@sendgrid/mail';
 * sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 * 
 * Deno.serve(async (req) => {
 *   const { to, templateId, dynamic_template_data } = await req.json();
 *   
 *   await sgMail.send({
 *     to,
 *     from: 'noreply@yourdomain.com',
 *     templateId,
 *     dynamicTemplateData: dynamic_template_data
 *   });
 *   
 *   return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
 * });
 */