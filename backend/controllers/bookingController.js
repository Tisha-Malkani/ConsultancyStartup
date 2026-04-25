import Booking from '../models/Booking.js';
import { findNextAvailableSlot, formatSlot } from '../utils/scheduler.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

export const createBooking = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, interestArea, message } = req.body;

    if (!firstName || !lastName || !email || !interestArea) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Find the next available slot
    const scheduledAt = await findNextAvailableSlot();

    if (!scheduledAt) {
      return res.status(500).json({ error: 'No available slots found in the next 30 days. Please contact us directly.' });
    }

    // If the request comes from a logged-in user, attach their userId
    const newBooking = new Booking({
      userId: req.user?._id || null,   // optional — works for guests too
      firstName,
      lastName,
      email,
      phone,
      interestArea,
      message,
      scheduledAt
    });

    await newBooking.save();

    // Send confirmation email
    const slotFormatted = formatSlot(scheduledAt);
    try {
      await sendBookingConfirmation({
        to: email,
        name: firstName,
        service: interestArea,
        slotFormatted
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // We still return success since the booking was created
      return res.status(201).json({ 
        message: 'Booking successfully created, but we had trouble sending the confirmation email.', 
        booking: newBooking,
        slotFormatted
      });
    }

    res.status(201).json({ 
      message: 'Booking successfully created. Confirmation email sent!', 
      booking: newBooking,
      slotFormatted
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ error: 'Server Error. Could not create booking.' });
  }
};
