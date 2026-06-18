import { faker } from "@faker-js/faker";

type SeedReference = {
  id: string;
};

// --------------------
// LOCATIONS
// --------------------
export const generateLocations = (count = 5) => {
  const commonLocations = [
    { name: "Mountain Retreat", city: "Pokhara", country: "Nepal", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
    { name: "Lakeside Haven", city: "Phewa Lake", country: "Nepal", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80" },
    { name: "Forest Sanctuary", city: "Chitwan", country: "Nepal", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=80" },
    { name: "Snowy Peaks", city: "Mustang", country: "Nepal", img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=500&q=80" },
    { name: "Tropical Paradise", city: "Baliya", country: "Nepal", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80" }
  ];

  return Array.from({ length: count }).map((_, i) => {
    const loc = commonLocations[i % commonLocations.length];
    return {
      id: faker.string.uuid(),
      name: loc.name,
      city: loc.city,
      country: loc.country,
      description: faker.lorem.sentence(),
      image_url: loc.img,
      hero_image_url: loc.img,
      created_at: new Date().toISOString()
    };
  });
};

// --------------------
// OFFERS
// --------------------
export const generateOffers = (count = 4) => {
  const commonOffers = [
    { title: "Early Bird", pct: 15, badge: "SALE", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
    { title: "Weekend Special", pct: 20, badge: "VIP", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80" },
    { title: "Family Package", pct: 25, badge: "FREE", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80" },
    { title: "Honeymoon Deal", pct: 30, badge: "VIP", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80" }
  ];

  return Array.from({ length: count }).map((_, i) => {
    const offer = commonOffers[i % commonOffers.length];
    return {
      id: faker.string.uuid(),
      title: offer.title,
      description: faker.lorem.sentence(),
      badge: offer.badge,
      discount_percent: offer.pct,
      spend_threshold: faker.number.int({ min: 1000, max: 5000 }),
      image_url: offer.img,
      icon: "tag",
      is_featured: faker.datatype.boolean(),
      created_at: new Date().toISOString()
    };
  });
};

// --------------------
// ACTIVITIES
// --------------------
export const generateActivities = (count = 6) => {
  const commonActivities = [
    { name: "Hiking", icon: "mountain", img: "https://images.unsplash.com/photo-1551632432-c7d419d0a4fb?w=500&q=80" },
    { name: "Skiing", icon: "snowflake", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80" },
    { name: "Fishing", icon: "fish", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80" },
    { name: "Kayaking", icon: "waves", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80" },
    { name: "Biking", icon: "bike", img: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?w=500&q=80" },
    { name: "Campfires", icon: "flame", img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=500&q=80" }
  ];

  return Array.from({ length: count }).map((_, i) => {
    const act = commonActivities[i % commonActivities.length];
    return {
      id: faker.string.uuid(),
      name: act.name,
      description: faker.lorem.sentence(),
      image_url: act.img,
      icon: act.icon,
      created_at: new Date().toISOString()
    };
  });
};

// --------------------
// GUESTS
// --------------------
export const generateGuests = (count = 100) => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    full_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    avatar_url: faker.image.avatar(),
    created_at: new Date().toISOString()
  }));
};

// --------------------
// CABINS
// --------------------
export const generateCabins = (locations: SeedReference[], count = 10) => {
  const cabinNames = [
    "Aurora Glass Igloo", "Pinecone Loft", "The Nest", "Riverwood Cabin", 
    "Summit Peak Lodge", "Mist Valley Villa", "Cedar Creek Hideaway",
    "Golden Leaf Cottage", "Blue Spruce Chalet", "Echo Rock Cabin"
  ];

  return Array.from({ length: count }).map((_, i) => {
    id: faker.string.uuid(),
    name: cabinNames[i % cabinNames.length],
    capacity: faker.number.int({ min: 2, max: 10 }),
    price_per_night: faker.number.int({ min: 120, max: 850 }),
    discount: faker.number.int({ min: 0, max: 20 }),
    image_url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&q=80`,
    description: faker.lorem.paragraph(),
    location_id: faker.helpers.arrayElement(locations).id,
    created_at: new Date().toISOString()
  }));
};

// --------------------
// BOOKINGS
// --------------------
export const generateBookings = (
  guests: SeedReference[],
  cabins: any[],
  count = 100
) => {
  return Array.from({ length: count }).map(() => {
    const start = faker.date.between({
      from: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });
    const duration = faker.number.int({ min: 1, max: 14 });
    const end = new Date(start);
    end.setDate(start.getDate() + duration);

    const cabin = faker.helpers.arrayElement(cabins);
    const guest = faker.helpers.arrayElement(guests);
    const has_breakfast = faker.datatype.boolean(0.4);
    const status = faker.helpers.arrayElement([
      "booked",
      "checked-in",
      "checked-out",
      "cancelled"
    ]);

    const num_guests = faker.number.int({ min: 1, max: cabin.capacity || 4 });
    const breakfast_price = 15;
    const extra_price = has_breakfast ? breakfast_price * num_guests * duration : 0;
    const cabin_price = (cabin.price_per_night || 200) * duration;
    const total_price = cabin_price + extra_price;

    const payment_status = status === "checked-out" ? "paid" : faker.helpers.arrayElement(["paid", "unpaid", "pending"]);
    
    return {
      guest_id: guest.id,
      cabin_id: cabin.id,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      status,
      total_price,
      has_breakfast,
      payment_status,
      payment_method: faker.helpers.arrayElement(["credit_card", "cash", "bank_transfer"]),
      num_guests,
      created_at: faker.date.past().toISOString()
    };
  });
};

// --------------------
// SETTINGS
// --------------------
export const generateSettings = () => {
  return {
    min_booking_length: 3,
    max_booking_length: 30,
    max_guests_per_booking: 10,
    breakfast_price: 15,
    updated_at: new Date().toISOString()
  };
};

// --------------------
// REVIEWS
// --------------------
export const generateReviews = (
  guests: SeedReference[],
  cabins: SeedReference[],
  count = 50
) => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    guest_id: faker.helpers.arrayElement(guests).id,
    cabin_id: faker.helpers.arrayElement(cabins).id,
    rating: faker.number.int({ min: 4, max: 5 }),
    comment: faker.lorem.sentences(2),
    created_at: faker.date.past().toISOString()
  }));
};
