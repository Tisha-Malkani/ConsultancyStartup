import emailjs from '@emailjs/nodejs';

/**
 * Sends a booking confirmation email to the client.
 */
export const sendBookingConfirmation = async ({ to, name, service, slotFormatted }) => {
  try {
    // Initialize EmailJS only when sending
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
      limitRate: {
        id: 'service',
        throttle: 1000,
      },
    });

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: to,
        to_name: name,
        service_name: service,
        slot_formatted: slotFormatted,
        from_email: process.env.EMAIL_FROM,
      }
    );
    console.log('✅ Booking confirmation email sent to:', to);
    return result;
  } catch (error) {
    console.error('❌ EmailJS Error:', error.message);
    throw error;
  }
};
