import { faker } from "@faker-js/faker";

type SeedGuest = {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
};

type SeedCabin = {
  id?: string;
  name: string;
};

// --------------------
// GUESTS
// --------------------
export const generateGuests = () => {
  return Array.from({ length: 50 }).map(() => ({
    full_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }));
};

// --------------------
// CABINS
// --------------------
export const generateCabins = () => {
  return Array.from({ length: 10 }).map((_, i) => ({
    name: `Cabin ${i + 1}`,
    capacity: faker.number.int({ min: 2, max: 10 }),
    price_per_night: faker.number.int({ min: 80, max: 500 }),
    discount: faker.number.int({ min: 0, max: 30 }),
    image_url: faker.image.urlPicsumPhotos(),
    description: faker.lorem.paragraph(),
  }));
};

// --------------------
// BOOKINGS
// --------------------
export const generateBookings = (guests: SeedGuest[], cabins: SeedCabin[]) => {
  return Array.from({ length: 50 }).map(() => {
    const start = faker.date.between({
      from: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      to: new Date(),
    });
    const end = faker.date.soon({ days: faker.number.int({ min: 2, max: 14 }), refDate: start });

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