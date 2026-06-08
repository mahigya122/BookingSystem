import { supabase } from "../lib/supabase.js";
import { getPool } from "./dbPool.js";

const ACTIVE_BOOKING_STATUSES = ["booked", "checked-in"];

export async function getAllBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      created_at,
      cabin_id,
      start_date,
      end_date,
      status,
      total_price,
      has_breakfast,
      payment_status,
      payment_method,
      guests (full_name, email),
      cabins (name, price_per_night)
    `)
    .order("start_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Failed to fetch bookings from Supabase");
  }

  return data;
}

const toIsoDate = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("A valid date is required.");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return value.slice(0, 10);
};

const normalizeDate = (value) => new Date(`${toIsoDate(value)}T00:00:00.000Z`);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

const expandNights = (startDate, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  const finalDate = new Date(endDate);

  while (current < finalDate) {
    dates.push(formatDate(current));
    current = addDays(current, 1);
  }

  return dates;
};

export async function getCabinAvailability(cabinId) {
  const db = getPool();
  const { rows } = await db.query(
    `SELECT id, guest_id, cabin_id, start_date, end_date, status
     FROM bookings
     WHERE cabin_id = $1
       AND status = ANY($2::text[])
     ORDER BY start_date ASC, created_at ASC`,
    [cabinId, ACTIVE_BOOKING_STATUSES]
  );

  const bookedDates = [];

  for (const booking of rows) {
    const bookingStart = normalizeDate(booking.start_date);
    const bookingEnd = normalizeDate(booking.end_date);
    bookedDates.push(...expandNights(bookingStart, bookingEnd));
  }

  return {
    cabin_id: cabinId,
    booked_dates: Array.from(new Set(bookedDates)).sort(),
    bookings: rows.map((booking) => ({
      id: booking.id,
      guest_id: booking.guest_id,
      cabin_id: booking.cabin_id,
      start_date: formatDate(normalizeDate(booking.start_date)),
      end_date: formatDate(normalizeDate(booking.end_date)),
      status: booking.status,
    })),
  };
}

export async function createBookingReservation(input) {
  const cabinId = typeof input.cabin_id === "string" ? input.cabin_id.trim() : "";
  const guestIdInput = typeof input.guest_id === "string" ? input.guest_id.trim() : "";
  const guestFullName = typeof input.guest_full_name === "string" ? input.guest_full_name.trim() : "";
  const guestEmail = typeof input.guest_email === "string" ? input.guest_email.trim().toLowerCase() : "";
  const guestPhone = typeof input.guest_phone === "string" ? input.guest_phone.trim() : "";
  const startDateValue = toIsoDate(input.start_date);
  const endDateValue = toIsoDate(input.end_date);
  const totalPrice = Number(input.total_price);
  const hasBreakfast = Boolean(input.has_breakfast);
  const paymentStatus = input.payment_status || "pending";
  const paymentMethod = input.payment_method || "arrival";
  const paidAt = input.paid_at || null;
  const transactionId = input.transaction_id || null;

  if (!cabinId) {
    throw new Error("Cabin id is required.");
  }

  if (!guestIdInput && (!guestFullName || !guestEmail || !guestPhone)) {
    throw new Error("Guest information or guest id is required.");
  }

  if (!Number.isFinite(totalPrice) || totalPrice < 0) {
    throw new Error("Total price must be a valid number.");
  }

  if (startDateValue >= endDateValue) {
    throw new Error("End date must be after the start date.");
  }

  const db = getPool();
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [cabinId]);

    const overlapResult = await client.query(
      `SELECT id
       FROM bookings
       WHERE cabin_id = $1
         AND status = ANY($2::text[])
         AND start_date < $4::date
         AND end_date > $3::date
       LIMIT 1`,
      [cabinId, ACTIVE_BOOKING_STATUSES, startDateValue, endDateValue]
    );

    if (overlapResult.rowCount > 0) {
      const error = new Error(
        "This cabin is already booked for one or more of the selected dates. Please choose another cabin or change the dates."
      );
      error.status = 409;
      throw error;
    }

    let guestId = guestIdInput;

    if (!guestId) {
      const guestResult = await client.query(
        `SELECT id
         FROM guests
         WHERE lower(email) = lower($1)
         LIMIT 1`,
        [guestEmail]
      );

      guestId = guestResult.rows[0]?.id;

      if (!guestId) {
        const insertedGuest = await client.query(
          `INSERT INTO guests (full_name, email, phone)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [guestFullName, guestEmail, guestPhone]
        );
        guestId = insertedGuest.rows[0].id;
      }
    }

    const bookingResult = await client.query(
      `INSERT INTO bookings (guest_id, cabin_id, start_date, end_date, total_price, status, has_breakfast, payment_status, payment_method, paid_at, transaction_id)
       VALUES ($1, $2, $3::date, $4::date, $5, 'booked', $6, $7, $8, $9, $10)
       RETURNING id, guest_id, cabin_id, start_date, end_date, total_price, status, has_breakfast, payment_status, payment_method, paid_at, transaction_id, created_at`,
      [guestId, cabinId, startDateValue, endDateValue, totalPrice, hasBreakfast, paymentStatus, paymentMethod, paidAt, transactionId]
    );

    await client.query("COMMIT");

    return bookingResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateBookingReservation(bookingId, input) {
  const startDateValue = toIsoDate(input.start_date);
  const endDateValue = toIsoDate(input.end_date);
  const totalPrice = Number(input.total_price);
  const hasBreakfast = Boolean(input.has_breakfast);
  const status = typeof input.status === "string" ? input.status.trim() : "";
  const paymentStatus = input.payment_status;
  const paymentMethod = input.payment_method;

  if (startDateValue >= endDateValue) {
    throw new Error("End date must be after the start date.");
  }

  const db = getPool();
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Fetch the cabin_id for this booking
    const bookingResult = await client.query(
      "SELECT cabin_id FROM bookings WHERE id = $1 LIMIT 1",
      [bookingId]
    );

    if (bookingResult.rowCount === 0) {
      const error = new Error("Booking not found");
      error.status = 404;
      throw error;
    }

    const cabinId = bookingResult.rows[0].cabin_id;

    // Acquire lock
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [cabinId]);

    // Check overlap with OTHER bookings of the same cabin (only if setting to an active status)
    const checkOverlap = ACTIVE_BOOKING_STATUSES.includes(status);
    if (checkOverlap) {
      const overlapResult = await client.query(
        `SELECT id
         FROM bookings
         WHERE cabin_id = $1
           AND id <> $2
           AND status = ANY($3::text[])
           AND start_date < $5::date
           AND end_date > $4::date
         LIMIT 1`,
        [cabinId, bookingId, ACTIVE_BOOKING_STATUSES, startDateValue, endDateValue]
      );

      if (overlapResult.rowCount > 0) {
        const error = new Error(
          "This cabin is already booked for one or more of the selected dates. Please choose other dates."
        );
        error.status = 409;
        throw error;
      }
    }

    // Perform UPDATE
    const updateResult = await client.query(
      `UPDATE bookings
       SET start_date = $1::date,
           end_date = $2::date,
           total_price = $3,
           status = $4,
           has_breakfast = $5,
           payment_status = COALESCE($7, payment_status),
           payment_method = COALESCE($8, payment_method)
       WHERE id = $6
       RETURNING id, guest_id, cabin_id, start_date, end_date, total_price, status, has_breakfast, payment_status, payment_method, created_at`,
      [startDateValue, endDateValue, totalPrice, status, hasBreakfast, bookingId, paymentStatus, paymentMethod]
    );

    await client.query("COMMIT");
    return updateResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function patchBookingReservation(bookingId, updates) {
  const db = getPool();
  const fields = Object.keys(updates);
  if (fields.length === 0) return null;

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");
  const values = fields.map((field) => updates[field]);

  const query = `
    UPDATE bookings
    SET ${setClause}
    WHERE id = $1
    RETURNING id, guest_id, cabin_id, start_date, end_date, total_price, status, has_breakfast, created_at
  `;

  const { rows } = await db.query(query, [bookingId, ...values]);

  if (rows.length === 0) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  return rows[0];
}

export async function deleteBookingReservation(bookingId) {
  const db = getPool();
  const { rowCount } = await db.query(
    "DELETE FROM bookings WHERE id = $1",
    [bookingId]
  );
  if (rowCount === 0) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }
  return { success: true };
}