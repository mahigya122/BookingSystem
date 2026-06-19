import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import { pathToFileURL } from "url";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function seedFullData() {
  console.log("Checking if seeding is necessary...");
  const { count, error: countErr } = await supabase
    .from("cabins")
    .select("*", { count: "exact", head: true });

  if (countErr) {
    console.error("Error checking cabins count:", countErr.message);
  } else if (count > 0) {
    console.log(`✅ Database already seeded (${count} cabins found). Skipping.`);
    return;
  }

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
  const cabinTypes = ["Lodge", "Cabin", "Villa", "Retreat", "Suite", "Hut", "Cottage", "Chalet", "Bungalow", "Loft"];
  const cabinQualities = ["Luxury", "Serene", "Himalayan", "Riverside", "Alpine", "Forest", "Mountain", "Royal", "Eco", "Wild"];
  
  const cabinsToInsert = [];
  locations.forEach(loc => {
    let targetCount = 10;
    if (loc.name.toLowerCase().includes("chitwan")) targetCount = 15;
    else if (loc.name.toLowerCase().includes("pokhara")) targetCount = 12;
    else if (loc.name.toLowerCase().includes("everest")) targetCount = 15;
    else if (loc.name.toLowerCase().includes("annapurna")) targetCount = 12;
    else if (loc.name.toLowerCase().includes("lumbini")) targetCount = 10;
    
    for (let i = 0; i < targetCount; i++) {
      const type = faker.helpers.arrayElement(cabinTypes);
      const quality = faker.helpers.arrayElement(cabinQualities);
      cabinsToInsert.push({
        name: `${quality} ${type} ${i + 1}`,
        capacity: faker.number.int({ min: 2, max: 10 }),
        price_per_night: faker.number.int({ min: 120, max: 1200 }),
        discount: faker.number.int({ min: 0, max: 25 }),
        image_url: faker.image.url({ category: 'cabin' }),
        description: faker.lorem.paragraphs(2),
        location_id: loc.id
      });
    }
  });

  const { data: cabins, error: cErr } = await supabase.from("cabins").insert(cabinsToInsert).select();
  if (cErr) console.error("Error seeding cabins:", cErr.message);
  else console.log(`✅ Seeded ${cabins.length} cabins`);

  // 6. CABIN OFFERS & ACTIVITIES (1-to-many relationship)
  if (cabins) {
    if (offers && offers.length > 0) {
      for (const offer of offers) {
        const randomCabin = faker.helpers.arrayElement(cabins);
        const { error: uErr } = await supabase
          .from("offers")
          .update({ 
            cabin_id: randomCabin.id,
            cabin_name: randomCabin.name 
          })
          .eq("id", offer.id);
        if (uErr) console.error(`Error linking offer ${offer.id} to cabin:`, uErr.message);
      }
      console.log(`✅ Seeded offers cabin links`);
    }

    if (activities && activities.length > 0) {
      for (const activity of activities) {
        const randomCabin = faker.helpers.arrayElement(cabins);
        const { error: uErr } = await supabase
          .from("activities")
          .update({ 
            cabin_id: randomCabin.id,
            cabin_name: randomCabin.name
          })
          .eq("id", activity.id);
        if (uErr) console.error(`Error linking activity ${activity.id} to cabin:`, uErr.message);
      }
      console.log(`✅ Seeded activities cabin links`);
    }

    // NEW: Link locations to a random cabin (or the first one associated with it)
    if (locations && locations.length > 0) {
      for (const loc of locations) {
        // Find a cabin that uses this location
        const cabinForLoc = cabins.find(c => c.location_id === loc.id);
        if (cabinForLoc) {
          const { error: uErr } = await supabase
            .from("locations")
            .update({ 
              cabin_id: cabinForLoc.id,
              cabin_name: cabinForLoc.name
            })
            .eq("id", loc.id);
          if (uErr) console.error(`Error linking location ${loc.id} to cabin:`, uErr.message);
        }
      }
      console.log(`✅ Seeded locations cabin links`);
    }
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
        payment_status: faker.helpers.arrayElement(['paid', 'pending', 'refunded']),
        payment_method: faker.helpers.arrayElement(['esewa', 'khalti', 'arrival', 'visa', 'mastercard', 'fonepay']),
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
    const reviewsToInsert = Array.from({ length: 40 }).map(() => {
      const isApproved = faker.helpers.arrayElement([true, true, true, false, null]); // mostly approved/pending, some rejected
      const isModerated = isApproved !== null;
      const randomCabin = faker.helpers.arrayElement(cabins);
      return {
        guest_id: faker.helpers.arrayElement(newGuests).id,
        cabin_id: randomCabin.id,
        cabin_name: randomCabin.name,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentences(2),
        is_moderated: isModerated,
        is_approved: isApproved
      };
    });
    const { data: reviews, error: rErr } = await supabase.from("reviews").insert(reviewsToInsert).select();
    if (rErr) console.error("Error seeding reviews:", rErr.message);
    else console.log(`✅ Seeded ${reviews.length} reviews`);
  }

  console.log("🏁 Seeding complete!");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedFullData();
}
