import dotenv from "dotenv";
import { getAllBookings } from "../services/bookingService.js";

dotenv.config({ path: "./server/.env" });

async function test() {
  try {
    const resultAll = await getAllBookings(1, 8, "all", "recent", "", "all", "admin@g.com");
    console.log("Bookings for admin@g.com with filter 'all':");
    console.log(resultAll);

    const resultUpcoming = await getAllBookings(1, 8, "upcoming", "recent", "", "all", "admin@g.com");
    console.log("\nBookings for admin@g.com with filter 'upcoming':");
    console.log(resultUpcoming);
  } catch (err) {
    console.error(err);
  }
}

test();
