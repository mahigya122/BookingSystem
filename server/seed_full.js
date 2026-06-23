import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import { pathToFileURL, fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
  path.resolve(process.cwd(), "server/.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../.env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cabinUnsplashIds = [
  "1508739773434-c26b3d09e071",
  "1470770841072-f978cf4d019e",
  "1501785888041-af3ef285b470",
  "1449034446853-66c86144b0ad",
  "1464822759023-fed622ff2c3b",
  "1510798831971-661eb04b3739",
  "1504280390367-361c6d9f38f4",
  "1470071459604-3b5ec3a7fe05",
  "1441974231531-c6227db76b6e",
  "1520250497591-112f2f40a3f4",
  "1472214222541-d510753a4707",
  "1488085061387-422e29b40080",
  "1506744038136-46273834b3fb",
  "1426604966848-d7adac402bff",
  "1433832597046-4f10e10ac764",
  "1473448912268-2022ce9509d8",
  "1502082553048-f009c37129b9",
  "1505245208761-ba872912fac0",
  "1506905925346-21bda4d32df4",
  "1469854523086-cc02fe5d8800",
  "1513694203232-719a280e022f",
  "1475924156734-496f6cac6ec1",
  "1507525428034-b723cf961d3e",
  "1454496522488-7a8e488e8606",
  "1486873249359-2731bd6da57b",
  "1470240731273-7821a6eeb6bd",
  "1500627869374-13cd993b1115",
  "1504851149312-7a075b496cc7",
  "1518098268026-4e43a1a009de",
  "1501854140801-50d01698950b"
];

const offerUnsplashIds = [
  "1542718610-a1d656d1884c",
  "1501785888041-af3ef285b470",
  "1520250497591-112f2f40a3f4",
  "1473448912268-2022ce9509d8",
  "1507525428034-b723cf961d3e"
];

const activityUnsplashIds = [
  "1596464716127-f2a82984de30",
  "1544551763-46a013bb70d5",
  "1516422266228-215b17950c4f",
  "1464822759023-fed622ff2c3b",
  "1563299796-17596ed6b017",
  "1541625602330-2277a4c4b081"
];

export async function seedFullData() {
  console.log("🚀 Starting database cleanup & seeding...");

  // 1. CLEAN EXISTING TABLES
  console.log("Cleaning old seeded data (cabins, bookings, reviews, locations, offers, activities)...");
  
  // Set circular relations to null to prevent constraint issues during delete
  await supabase.from("locations").update({ cabin_id: null, cabin_name: null }).neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("offers").update({ cabin_id: null, cabin_name: null }).neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("activities").update({ cabin_id: null, cabin_name: null }).neq("id", "00000000-0000-0000-0000-000000000000");

  // Delete dependencies
  await supabase.from("cabin_offers").delete().neq("cabin_id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("cabin_activities").delete().neq("cabin_id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  // Delete main lists
  await supabase.from("offers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("activities").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("cabins").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("locations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  console.log("Old seeded data cleaned.");

  // 2. CHECK OR CREATE USERS & GUESTS
  console.log("Checking for existing guests...");
  const { data: existingGuests } = await supabase.from("guests").select("*");
  let newGuests = existingGuests || [];

  if (newGuests.length > 10) {
    console.log(`Found ${newGuests.length} guests. Truncating to exactly 10...`);
    const guestsToDelete = newGuests.slice(10);
    const idsToDelete = guestsToDelete.map(g => g.id);
    await supabase.from("guests").delete().in("id", idsToDelete);
    newGuests = newGuests.slice(0, 10);
  } else if (newGuests.length < 10) {
    const toCreate = 10 - newGuests.length;
    console.log(`Found ${newGuests.length} guests. Creating ${toCreate} new ones...`);
    for (let i = 0; i < toCreate; i++) {
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
  }
  console.log(`✅ Loaded/Created ${newGuests.length} guests`);

  if (newGuests.length === 0) {
    console.error("No guests available, skipping dependent tables.");
    return;
  }

  // 3. LOCATIONS
  const commonLocations = [
    { name: "Pokhara Lakeside", city: "Pokhara", country: "Nepal", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80" },
    { name: "Annapurna Base Camp", city: "Ghandruk", country: "Nepal", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
    { name: "Chitwan National Park", city: "Sauraha", country: "Nepal", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" },
    { name: "Everest View Lodge", city: "Namche Bazaar", country: "Nepal", img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80" },
    { name: "Lumbini Garden Retreat", city: "Lumbini", country: "Nepal", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
    { name: "Kathmandu Valley Sanctuary", city: "Kathmandu", country: "Nepal", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80" },
    { name: "Rara Lake Retreat", city: "Mugu", country: "Nepal", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80" },
    { name: "Langtang Valley Chalet", city: "Langtang", country: "Nepal", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
    { name: "Bandipur Heritage Lodge", city: "Bandipur", country: "Nepal", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80" },
    { name: "Nagarkot Sunrise Resort", city: "Nagarkot", country: "Nepal", img: "https://images.unsplash.com/photo-1472214222541-d510753a4707?w=800&q=80" }
  ];

  const locationsToInsert = commonLocations.map(loc => ({
    name: loc.name,
    city: loc.city,
    country: loc.country,
    description: faker.lorem.sentence(),
    image_url: loc.img
  }));

  const { data: locations, error: lErr } = await supabase.from("locations").insert(locationsToInsert).select();
  if (lErr) {
    console.error("Error seeding locations:", lErr.message);
    return;
  }
  console.log(`✅ Seeded ${locations.length} locations`);

  // 4. OFFERS
  const commonOffers = [
    { title: "Free Breakfast", badge: "FREE", pct: 0 },
    { title: "Early Bird 20%", badge: "SALE", pct: 20 },
    { title: "Weekend Special", badge: "VIP", pct: 15 },
    { title: "Seasonal Discount", badge: "SALE", pct: 30 },
    { title: "Long Stay Premium", badge: "VIP", pct: 25 }
  ];

  const offersToInsert = commonOffers.map((offer, idx) => {
    const offerImgId = offerUnsplashIds[idx % offerUnsplashIds.length];
    return {
      title: offer.title,
      description: faker.lorem.sentence(),
      badge: offer.badge,
      discount_percent: offer.pct,
      spend_threshold: faker.number.int({ min: 1000, max: 5000 }),
      image_url: `https://images.unsplash.com/photo-${offerImgId}?auto=format&fit=crop&q=80`,
      is_featured: faker.datatype.boolean()
    };
  });

  const { data: offers, error: oErr } = await supabase.from("offers").insert(offersToInsert).select();
  if (oErr) console.error("Error seeding offers:", oErr.message);
  else console.log(`✅ Seeded ${offers.length} offers`);

  // 5. ACTIVITIES
  const commonActivities = [
    { name: "Paragliding" },
    { name: "Boating" },
    { name: "Jungle Safari" },
    { name: "Trekking" },
    { name: "Bungee Jumping" }
  ];

  const activitiesToInsert = commonActivities.map((act, idx) => {
    const actImgId = activityUnsplashIds[idx % activityUnsplashIds.length];
    return {
      name: act.name,
      image_url: `https://images.unsplash.com/photo-${actImgId}?auto=format&fit=crop&q=80`
    };
  });

  const { data: activities, error: aErr } = await supabase.from("activities").insert(activitiesToInsert).select();
  if (aErr) console.error("Error seeding activities:", aErr.message);
  else console.log(`✅ Seeded ${activities.length} activities`);

  // 6. CABINS
  const cabinTypes = ["Lodge", "Cabin", "Villa", "Retreat", "Suite", "Hut", "Cottage", "Chalet", "Bungalow", "Loft"];
  const cabinQualities = ["Luxury", "Serene", "Himalayan", "Riverside", "Alpine", "Forest", "Mountain", "Royal", "Eco", "Wild"];
  
  let cabinIndex = 0;
  const cabinsToInsert = [];
  locations.forEach(loc => {
    let targetCount = 2; // Exactly 2 cabins per location (10 locations * 2 = 20 cabins in total)
    
    for (let i = 0; i < targetCount; i++) {
      const type = faker.helpers.arrayElement(cabinTypes);
      const quality = faker.helpers.arrayElement(cabinQualities);
      const cabinImgId = cabinUnsplashIds[cabinIndex % cabinUnsplashIds.length];
      
      cabinsToInsert.push({
        name: `${quality} ${type} ${i + 1}`,
        capacity: faker.number.int({ min: 2, max: 10 }),
        price_per_night: faker.number.int({ min: 120, max: 1200 }),
        discount: faker.number.int({ min: 0, max: 25 }),
        image_url: `https://images.unsplash.com/photo-${cabinImgId}?auto=format&fit=crop&q=80`,
        description: faker.lorem.paragraphs(2),
        location_id: loc.id
      });
      cabinIndex++;
    }
  });

  const { data: cabins, error: cErr } = await supabase.from("cabins").insert(cabinsToInsert).select();
  if (cErr) {
    console.error("Error seeding cabins:", cErr.message);
    return;
  }
  console.log(`✅ Seeded ${cabins.length} cabins`);

  // 7. CABIN OFFERS, ACTIVITIES & LOCATIONS LINKS
  if (cabins) {
    // A. Link offers to cabins (Each cabin gets 1-2 random offers)
    if (offers && offers.length > 0) {
      const cabinOffersLinks = [];
      for (const cabin of cabins) {
        const numOffers = faker.number.int({ min: 1, max: 2 });
        const selectedOffers = faker.helpers.arrayElements(offers, numOffers);
        for (const offer of selectedOffers) {
          cabinOffersLinks.push({
            cabin_id: cabin.id,
            offer_id: offer.id
          });
        }
      }
      if (cabinOffersLinks.length > 0) {
        const { error: coErr } = await supabase.from("cabin_offers").insert(cabinOffersLinks);
        if (coErr) console.error("Error seeding cabin_offers:", coErr.message);
        else console.log(`✅ Seeded ${cabinOffersLinks.length} cabin_offers links`);
      }

      // Legacy 1-1 links (for compatibility)
      for (const offer of offers) {
        const randomCabin = faker.helpers.arrayElement(cabins);
        await supabase
          .from("offers")
          .update({ 
            cabin_id: randomCabin.id,
            cabin_name: randomCabin.name 
          })
          .eq("id", offer.id);
      }
      console.log(`✅ Seeded offers cabin links`);
    }

    // B. Link activities to cabins (Each cabin gets 2-3 random activities)
    if (activities && activities.length > 0) {
      const cabinActivitiesLinks = [];
      for (const cabin of cabins) {
        const numActs = faker.number.int({ min: 2, max: 3 });
        const selectedActs = faker.helpers.arrayElements(activities, numActs);
        for (const act of selectedActs) {
          cabinActivitiesLinks.push({
            cabin_id: cabin.id,
            activity_id: act.id
          });
        }
      }
      if (cabinActivitiesLinks.length > 0) {
        const { error: caErr } = await supabase.from("cabin_activities").insert(cabinActivitiesLinks);
        if (caErr) console.error("Error seeding cabin_activities:", caErr.message);
        else console.log(`✅ Seeded ${cabinActivitiesLinks.length} cabin_activities links`);
      }

      // Legacy 1-1 links (for compatibility)
      for (const activity of activities) {
        const randomCabin = faker.helpers.arrayElement(cabins);
        await supabase
          .from("activities")
          .update({ 
            cabin_id: randomCabin.id,
            cabin_name: randomCabin.name
          })
          .eq("id", activity.id);
      }
      console.log(`✅ Seeded activities cabin links`);
    }

    if (locations && locations.length > 0) {
      for (const loc of locations) {
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

  // 8. BOOKINGS
  if (cabins && newGuests) {
    const bookingsToInsert = Array.from({ length: 20 }).map(() => {
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

  // 9. REVIEWS
  if (cabins && newGuests) {
    const reviewsToInsert = Array.from({ length: 20 }).map(() => {
      const isApproved = faker.helpers.arrayElement([true, true, true, false, null]);
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
