import { Resend } from "resend";
import { getPool } from "./dbPool.js"; // adjust path if your pool helper lives elsewhere

// Load environment variables
// NOTE: uses RESEND_API_KEY (not RESEND_API_Keys) to match your .env setup
const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.BOOKING_EMAIL_FROM || "CabinHub <booking@mahigyadahal.com.np>";

if (!apiKey) {
  console.warn("⚠️ Resend API Key is missing. Email notifications will be disabled.");
}

const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sends a booking notification email to the guest.
 * @param {string} bookingId - The database ID of the booking.
 * @param {'create' | 'cancel_request' | 'cancel_confirm' | 'reschedule'} type - The type of email.
 * @param {object} [options] - Extra context (e.g. oldStartDate/oldEndDate for reschedule).
 */
export async function sendBookingEmail(bookingId, type, options = {}) {
  if (!resend) {
    console.warn(`[Email Service] Skipped sending ${type} email for booking ${bookingId} (Resend not initialized)`);
    return;
  }

  const db = getPool();
  try {
    // 1. Fetch complete booking details
    const { rows } = await db.query(
      `SELECT b.id, b.start_date, b.end_date, b.total_price, b.status, b.payment_status,
              g.email as guest_email, g.full_name as guest_name,
              c.name as cabin_name
       FROM bookings b
       JOIN guests g ON b.guest_id = g.id
       JOIN cabins c ON b.cabin_id = c.id
       WHERE b.id = $1`,
      [bookingId]
    );

    if (rows.length === 0) {
      console.error(`[Email Service] Booking ${bookingId} not found in database.`);
      return;
    }

    const booking = rows[0];
    const guestEmail = booking.guest_email;
    const guestName = booking.guest_name || "Valued Guest";
    const cabinName = booking.cabin_name;
    const startStr = new Date(booking.start_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const endStr = new Date(booking.end_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const shortId = booking.id.slice(0, 8).toUpperCase();

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.round((new Date(booking.end_date) - new Date(booking.start_date)) / msPerDay);
    const nightsLabel = `${nights} night${nights === 1 ? "" : "s"}`;

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "create": {
        subject = `Booking Confirmed: #${shortId} at ${cabinName}`;
        htmlContent = `
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">Booking Confirmed! 🏨</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; font-weight: 600;">Your retreat to ${cabinName} is secured.</p>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <p style="font-size: 16px; margin-top: 0;">Dear <strong>${guestName}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
                Thank you for reserving <strong>${cabinName}</strong> for <strong>${nightsLabel}</strong> at a total of
                <strong>Rs. ${booking.total_price.toLocaleString()}</strong>. We're excited to host you!
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #94a3b8; font-weight: 750; text-transform: uppercase;">Booking ID</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 800; color: #0f172a; text-align: right; font-family: monospace;">#${shortId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #94a3b8; font-weight: 750; text-transform: uppercase;">Cabin</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 800; color: #0f172a; text-align: right;">${cabinName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #94a3b8; font-weight: 750; text-transform: uppercase;">Check-In</td>
                    <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #334155; text-align: right;">${startStr}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #94a3b8; font-weight: 750; text-transform: uppercase;">Check-Out</td>
                    <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #334155; text-align: right;">${endStr}</td>
                  </tr>
                  <tr style="border-top: 1px dashed #e2e8f0;">
                    <td style="padding: 12px 0 0 0; font-size: 14px; font-weight: 800; color: #0ea5e9;">Total Price</td>
                    <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: 900; color: #10b981; text-align: right;">Rs. ${booking.total_price.toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 16px; padding: 18px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #854d0e; font-weight: 700;">🔑 Door Access</p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #713f12; line-height: 1.5;">
                  Your cabin's door password will be sent to you the day before your check-in date. Please check your email again closer to arrival.
                </p>
              </div>

              <h3 style="font-size: 14px; color: #0f172a; margin: 24px 0 10px 0;">Cancellation & Refund Policy</h3>
              <ul style="font-size: 13px; line-height: 1.7; color: #64748b; padding-left: 18px; margin: 0;">
                <li>You may cancel as late as your arrival date and receive a <strong>full refund</strong>, provided you have your payment receipt.</li>
                <li>If you do not cancel and do not show up (no-show), <strong>no refund</strong> will be issued.</li>
                <li>If you'd like to cut your stay short, you can request a refund for the <strong>remaining unused nights</strong> of your reservation.</li>
              </ul>

              <h3 style="font-size: 14px; color: #0f172a; margin: 24px 0 10px 0;">Property Damage & Amenities</h3>
              <ul style="font-size: 13px; line-height: 1.7; color: #64748b; padding-left: 18px; margin: 0;">
                <li>Any damage caused during your stay will be considered property damage and charged accordingly.</li>
                <li>Any missing amenities that are not marked as complimentary will also be charged.</li>
                <li>Complimentary amenities for this specific cabin are listed on your cabin's page and will be clearly noted at check-in to avoid confusion.</li>
              </ul>

              <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 20px 0 0 0;">
                If you need to make updates or cancellations, please log in to your account dashboard or contact us at
                <a href="mailto:contact@cabinhub.com" style="color: #6366f1; text-decoration: none; font-weight: 600;">contact@cabinhub.com</a>.
              </p>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 600; border-top: 1px solid #e2e8f0;">
              &copy; ${new Date().getFullYear()} CabinHub Retreats. All rights reserved.
            </div>
          </div>
        `;
        break;
      }
      case "cancel_request": {
        subject = `Cancellation Requested: #${shortId} at ${cabinName}`;
        htmlContent = `
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: linear-gradient(135deg, #f43f5e, #fda4af); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">Cancellation Requested ⚠️</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; font-weight: 600;">Your cancellation request is pending review.</p>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <p style="font-size: 16px; margin-top: 0;">Dear <strong>${guestName}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">We have received your request to cancel reservation <strong>#${shortId}</strong> at <strong>${cabinName}</strong>.</p>
              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">An administrator will review the request and issue refunds as per the property policy. You will receive another notification once the review is completed.</p>

              <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 16px; padding: 20px; margin: 25px 0; color: #be123c; font-size: 13px; font-weight: 700;">
                ⚠️ Please note: refunds are only guaranteed if cancelled by your arrival date and a payment receipt is on file.
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 600; border-top: 1px solid #e2e8f0;">
              &copy; ${new Date().getFullYear()} CabinHub Retreats. All rights reserved.
            </div>
          </div>
        `;
        break;
      }
      case "cancel_confirm": {
        subject = `Booking Cancelled & Refunded: #${shortId}`;
        htmlContent = `
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: linear-gradient(135deg, #e11d48, #f43f5e); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">Booking Cancelled 💸</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; font-weight: 600;">Refunds have been processed successfully.</p>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <p style="font-size: 16px; margin-top: 0;">Dear <strong>${guestName}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">This email confirms that your booking <strong>#${shortId}</strong> at <strong>${cabinName}</strong> has been cancelled.</p>
              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">Any payments paid have been refunded back to your original payment method (eSewa or cash receipt settlement). Depending on your account, the refunded amount should reflect within a few business days.</p>

              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">We hope to host you on another journey soon!</p>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 600; border-top: 1px solid #e2e8f0;">
              &copy; ${new Date().getFullYear()} CabinHub Retreats. All rights reserved.
            </div>
          </div>
        `;
        break;
      }
      case "reschedule": {
        const oldStart = options.oldStartDate ? new Date(options.oldStartDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
        const oldEnd = options.oldEndDate ? new Date(options.oldEndDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

        subject = `Booking Dates Updated: #${shortId} at ${cabinName}`;
        htmlContent = `
          <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: linear-gradient(135deg, #6366f1, #818cf8); padding: 40px 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">Reservation Dates Updated 🗓️</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; font-weight: 600;">Your check-in schedule has changed.</p>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <p style="font-size: 16px; margin-top: 0;">Dear <strong>${guestName}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">Your dates for booking <strong>#${shortId}</strong> at <strong>${cabinName}</strong> have been successfully updated.</p>

              ${oldStart && oldEnd ? `
              <div style="padding: 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 13px; color: #64748b; margin: 20px 0;">
                <span style="font-weight: 700; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 4px; color: #94a3b8;">Previous Dates</span>
                ${oldStart} — ${oldEnd}
              </div>
              ` : ""}

              <div style="background-color: #e0f2fe; border: 1px solid #bae6fd; border-radius: 16px; padding: 20px; margin: 25px 0;">
                <span style="font-weight: 800; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 6px; color: #0284c7;">New Stay Schedule</span>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #0369a1; font-weight: 700;">Check-In</td>
                    <td style="padding: 4px 0; font-size: 13px; font-weight: 800; color: #0f172a; text-align: right;">${startStr}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #0369a1; font-weight: 700;">Check-Out</td>
                    <td style="padding: 4px 0; font-size: 13px; font-weight: 800; color: #0f172a; text-align: right;">${endStr}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin-bottom: 0;">If you did not request this reschedule, or have questions about the update, please contact us immediately at <a href="mailto:contact@cabinhub.com" style="color: #6366f1; text-decoration: none; font-weight: 600;">contact@cabinhub.com</a>.</p>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 600; border-top: 1px solid #e2e8f0;">
              &copy; ${new Date().getFullYear()} CabinHub Retreats. All rights reserved.
            </div>
          </div>
        `;
        break;
      }
      default:
        console.warn(`[Email Service] Unknown email notification type: ${type}`);
        return;
    }

    console.log(`[Email Service] Sending ${type} email to ${guestEmail} via Resend...`);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [guestEmail],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error(`[Email Service] Failed to send email via Resend:`, error);
    } else {
      console.log(`[Email Service] Email sent successfully. Resend ID: ${data?.id}`);
    }
  } catch (err) {
    console.error(`[Email Service] Error in sendBookingEmail:`, err);
  }
}