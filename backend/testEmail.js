import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  try {
    // Initialize EmailJS only when sending
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    });

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: process.env.EMAIL_FROM,
        to_name: 'Test User',
        service_name: 'Test Service',
        slot_formatted: 'Test Slot',
        html_content: '<h1>If you see this, EmailJS is working!</h1>',
        from_email: process.env.EMAIL_FROM,
      }
    );

    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    console.error('Full error:', error);
  }
};

testEmail();
