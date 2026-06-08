import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("🚀 Starting comprehensive seeding...");

  // 1. CREATE AUTH USERS & GUESTS
  console.log("Creating fake users...");
  const newGuests = [];
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const { data: authUser, error: aErr } = await supabase.auth.admin.createUser({
      email,
      password: 'password123',
      email_confirm: true,
      user_metadata: { full_name: faker.person.fullName() }
    });

    if (aErr) {
      console.error(`Error creating auth user: ${aErr.message}`);
      continue;
    }

    const { data: guest, error: gErr } = await supabase.from("guests").insert([{
      id: authUser.user.id,
      full_name: authUser.user.user_metadata.full_name,
      email: authUser.user.email,
      phone: faker.phone.number()
    }]).select().single();

    if (gErr) {
      console.error(`Error creating guest record: ${gErr.message}`);
    } else {
      newGuests.push(guest);
    }
  }
  console.log(`✅ Created ${newGuests.length} guests`);

  if (newGuests.length === 0) {
    console.error("No guests created, skipping dependent tables.");
    return;
  }

  // 2. LOCATIONS
  const commonLocations = [
    { name: "Pokhara Lakeside", city: "Pokhara", country: "Nepal", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80" },
    { name: "Annapurna Base Camp", city: "Ghandruk", country: "Nepal", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
    { name: "Chitwan National Park", city: "Sauraha", country: "Nepal", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" },
    { name: "Everest View Lodge", city: "Namche Bazaar", country: "Nepal", img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80" },
    { name: "Lumbini Garden Retreat", city: "Lumbini", country: "Nepal", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" }
  ];

  const locationsToInsert = commonLocations.map(loc => ({
    name: loc.name,
    city: loc.city,
    country: loc.country,
    description: faker.lorem.sentence(),
    image_url: loc.img
  }));

  const { data: locations, error: lErr } = await supabase.from("locations").insert(locationsToInsert).select();
  if (lErr) console.error("Error seeding locations:", lErr.message);
  else console.log(`✅ Seeded ${locations.length} locations`);

  // 3. OFFERS
  const commonOffers = [
    { title: "Free Breakfast", badge: "FREE", pct: 0 },
    { title: "Early Bird 20%", badge: "SALE", pct: 20 },
    { title: "Weekend Special", badge: "VIP", pct: 15 },
    { title: "Seasonal Discount", badge: "SALE", pct: 30 }
  ];

  const offersToInsert = commonOffers.map(offer => ({
    title: offer.title,
    description: faker.lorem.sentence(),
    badge: offer.badge,
    discount_percent: offer.pct,
    spend_threshold: faker.number.int({ min: 1000, max: 5000 }),
    image_url: faker.image.url({ category: 'hotel' }),
    is_featured: faker.datatype.boolean()
  }));

  const { data: offers, error: oErr } = await supabase.from("offers").insert(offersToInsert).select();
  if (oErr) console.error("Error seeding offers:", oErr.message);
  else console.log(`✅ Seeded ${offers.length} offers`);

  // 4. ACTIVITIES
  const commonActivities = [
    { name: "Paragliding" },
    { name: "Boating" },
    { name: "Jungle Safari" },
    { name: "Trekking" },
    { name: "Bungee Jumping" },
    { name: "Cycling" }
  ];

  const activitiesToInsert = commonActivities.map(act => ({
    name: act.name,
    image_url: faker.image.url({ category: 'adventure' })
  }));

  const { data: activities, error: aErr } = await supabase.from("activities").insert(activitiesToInsert).select();
  if (aErr) console.error("Error seeding activities:", aErr.message);
  else console.log(`✅ Seeded ${activities.length} activities`);

  // 5. CABINS
  const cabinNames = ["Himalayan View", "Phewa Suite", "Forest Cabin", "Riverside Hut", "Everest Loft", "Serene Villa", "Luxury Nest", "Alpine Lodge"];
  const cabinsToInsert = cabinNames.map(name => ({
    name,
    capacity: faker.number.int({ min: 2, max: 8 }),
    price_per_night: faker.number.int({ min: 100, max: 1000 }),
    discount: faker.number.int({ min: 0, max: 20 }),
    image_url: faker.image.url({ category: 'cabin' }),
    description: faker.lorem.paragraph(),
    location_id: faker.helpers.arrayElement(locations).id
  }));

  const { data: cabins, error: cErr } = await supabase.from("cabins").insert(cabinsToInsert).select();
  if (cErr) console.error("Error seeding cabins:", cErr.message);
  else console.log(`✅ Seeded ${cabins.length} cabins`);

  // 6. JUNCTION TABLES
  if (cabins && offers) {
    const cabinOffers = cabins.flatMap(cabin => {
      const selected = faker.helpers.arrayElements(offers, { min: 0, max: 2 });
      return selected.map(offer => ({ cabin_id: cabin.id, offer_id: offer.id }));
    });
    const { error: coErr } = await supabase.from("cabin_offers").insert(cabinOffers);
    if (coErr) console.error("Error seeding cabin_offers:", coErr.message);
    else console.log(`✅ Seeded cabin_offers associations`);
  }

  if (cabins && activities) {
    const cabinActivities = cabins.flatMap(cabin => {
      const selected = faker.helpers.arrayElements(activities, { min: 1, max: 3 });
      return selected.map(act => ({ cabin_id: cabin.id, activity_id: act.id }));
    });
    const { error: caErr } = await supabase.from("cabin_activities").insert(cabinActivities);
    if (caErr) console.error("Error seeding cabin_activities:", caErr.message);
    else console.log(`✅ Seeded cabin_activities associations`);
  }

  // 7. BOOKINGS
  if (cabins && newGuests) {
    const bookingsToInsert = Array.from({ length: 30 }).map(() => {
      const start = faker.date.between({ from: '2026-01-01', to: '2026-12-31' });
      const duration = faker.number.int({ min: 1, max: 7 });
      const end = new Date(start);
      end.setDate(start.getDate() + duration);
      
      const cabin = faker.helpers.arrayElement(cabins);
      const guest = faker.helpers.arrayElement(newGuests);
      
      return {
        guest_id: guest.id,
        cabin_id: cabin.id,
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        status: faker.helpers.arrayElement(['booked', 'checked-in', 'checked-out', 'cancelled']),
        total_price: cabin.price_per_night * duration,
        has_breakfast: faker.datatype.boolean(),
        payment_status: faker.helpers.arrayElement(['paid', 'unpaid', 'pending']),
        payment_method: faker.helpers.arrayElement(['esewa', 'khalti', 'cash', 'card']),
        created_by: guest.id,
        is_admin_booking: faker.datatype.boolean(0.1)
      };
    });
    const { data: bookings, error: bErr } = await supabase.from("bookings").insert(bookingsToInsert).select();
    if (bErr) console.error("Error seeding bookings:", bErr.message);
    else console.log(`✅ Seeded ${bookings.length} bookings`);
  }

  // 8. REVIEWS
  if (cabins && newGuests) {
    const reviewsToInsert = Array.from({ length: 40 }).map(() => ({
      guest_id: faker.helpers.arrayElement(newGuests).id,
      cabin_id: faker.helpers.arrayElement(cabins).id,
      rating: faker.number.int({ min: 3, max: 5 }),
      comment: faker.lorem.sentences(2)
    }));
    const { data: reviews, error: rErr } = await supabase.from("reviews").insert(reviewsToInsert).select();
    if (rErr) console.error("Error seeding reviews:", rErr.message);
    else console.log(`✅ Seeded ${reviews.length} reviews`);
  }

  console.log("🏁 Seeding complete!");
}

seed();
