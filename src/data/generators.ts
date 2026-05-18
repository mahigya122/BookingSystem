import { faker } from "@faker-js/faker";

// --------------------
// GUESTS
// --------------------
export const generateGuests = () => {
  return Array.from({ length: 100 }).map(() => ({
    full_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }));
};

// --------------------
// CABINS
// --------------------
export const generateCabins = () => {
  return Array.from({ length: 20 }).map((_, i) => ({
    name: `Cabin ${i + 1}`,
    capacity: faker.number.int({ min: 2, max: 10 }),
    price_per_night: faker.number.int({ min: 80, max: 500 }),
    image_url: faker.image.urlPicsumPhotos(),
    description: faker.lorem.paragraph(),
  }));
};

// --------------------
// BOOKINGS (IMPORTANT FIX HERE)
// --------------------
export const generateBookings = (guests: any[], cabins: any[]) => {
  return Array.from({ length: 150 }).map(() => {
    const start = faker.date.soon({ days: 30 });
    const end = faker.date.soon({ days: 7, refDate: start });

    const cabin = faker.helpers.arrayElement(cabins);
    const guest = faker.helpers.arrayElement(guests);

    return {
      guest_id: guest.id,
      cabin_id: cabin.id,
      start_date: start,
      end_date: end,
      status: faker.helpers.arrayElement([
        "booked",
        "checked-in",
        "checked-out",
      ]),
      total_price: faker.number.int({ min: 200, max: 2000 }),
    };
  });
};