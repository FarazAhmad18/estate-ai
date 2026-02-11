require("dotenv").config();
const sequelize = require("./config/db");
const bcrypt = require("bcrypt");
const { User, Property, PropertyImage } = require("./models");

// ── Agents ──────────────────────────────────────────────
const agents = [
  { name: "Ahmed Raza", email: "ahmed.raza@estateai.pk", phone: "+92 300 1234567" },
  { name: "Fatima Khan", email: "fatima.khan@estateai.pk", phone: "+92 321 9876543" },
  { name: "Hassan Ali", email: "hassan.ali@estateai.pk", phone: "+92 333 4567890" },
  { name: "Ayesha Malik", email: "ayesha.malik@estateai.pk", phone: "+92 312 3456789" },
  { name: "Usman Sheikh", email: "usman.sheikh@estateai.pk", phone: "+92 345 6789012" },
  { name: "Sana Javed", email: "sana.javed@estateai.pk", phone: "+92 301 2345678" },
  { name: "Bilal Qureshi", email: "bilal.qureshi@estateai.pk", phone: "+92 322 8765432" },
  { name: "Zainab Noor", email: "zainab.noor@estateai.pk", phone: "+92 311 5678901" },
];

// ── Buyers ──────────────────────────────────────────────
const buyers = [
  { name: "Imran Siddiqui", email: "imran.buyer@gmail.com", phone: "+92 300 1112233" },
  { name: "Mariam Tariq", email: "mariam.buyer@gmail.com", phone: "+92 321 4445566" },
  { name: "Ali Hamza", email: "ali.buyer@gmail.com", phone: "+92 333 7778899" },
  { name: "Hira Asif", email: "hira.buyer@gmail.com", phone: "+92 345 2223344" },
  { name: "Owais Ahmed", email: "owais.buyer@gmail.com", phone: "+92 312 5556677" },
];

// ── Property images (Unsplash – public, no auth needed) ─
const houseImgs = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
];
const apartmentImgs = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
];
const villaImgs = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
];
const commercialImgs = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
  "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
];
const landImgs = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&q=80",
  "https://images.unsplash.com/photo-1595880500386-4b33c4870519?w=800&q=80",
];

const imgMap = { House: houseImgs, Apartment: apartmentImgs, Villa: villaImgs, Commercial: commercialImgs, Land: landImgs };

// ── Properties ──────────────────────────────────────────
const properties = [
  // ─── Lahore ───
  { type: "House", purpose: "Sale", price: 35000000, location: "DHA Phase 5, Lahore", bedrooms: 5, area: 3500, description: "Stunning 5-bedroom house in the heart of DHA Phase 5. Features marble flooring, modern kitchen with imported fittings, servant quarters, and a beautifully landscaped lawn. Located on a 10-marla plot with 24/7 security and near commercial markets." },
  { type: "House", purpose: "Sale", price: 22000000, location: "Bahria Town, Lahore", bedrooms: 4, area: 2400, description: "Well-maintained 4-bedroom house in Bahria Town Sector C. Double-story construction with attached bathrooms, lounge, drawing room, and car porch for two vehicles. Gated community with parks and mosques nearby." },
  { type: "Apartment", purpose: "Rent", price: 85000, location: "Gulberg III, Lahore", bedrooms: 3, area: 1800, description: "Luxury 3-bedroom apartment in a high-rise building on Main Boulevard Gulberg. Fully furnished with split ACs, modern kitchen, and gymnasium access. Ideal for professionals and families. Walking distance to shopping malls." },
  { type: "Villa", purpose: "Sale", price: 95000000, location: "DHA Phase 6, Lahore", bedrooms: 7, area: 8000, description: "Palatial 1-kanal villa with 7 bedrooms, home theater, swimming pool, and rooftop terrace. Smart home automation, Italian marble throughout, and designer interiors. Located in the most premium block with lush green surroundings." },
  { type: "Commercial", purpose: "Sale", price: 45000000, location: "Liberty Market, Lahore", bedrooms: 0, area: 2200, description: "Prime commercial space on Liberty Roundabout with heavy foot traffic. Ground + mezzanine floor, suitable for retail brand outlet or restaurant. Recently renovated with modern facade and central air conditioning." },
  { type: "House", purpose: "Rent", price: 120000, location: "Johar Town, Lahore", bedrooms: 3, area: 1600, description: "Neat and clean 3-bedroom house near Expo Center Lahore. Tiled flooring, gas and electricity available, two bathrooms, and an open kitchen. Quiet neighborhood with easy access to main canal road." },
  { type: "Land", purpose: "Sale", price: 15000000, location: "DHA Phase 9, Lahore", bedrooms: 0, area: 5000, description: "5-marla residential plot in DHA Phase 9 Prism block. Ideal investment opportunity with rapid area development. All utilities available, ballot confirmed, and transfer ready. Near upcoming commercial hub." },
  { type: "Apartment", purpose: "Sale", price: 18500000, location: "Mall Road, Lahore", bedrooms: 2, area: 1200, description: "Elegant 2-bedroom apartment in a newly constructed residential tower on Mall Road. City views from the 12th floor, underground parking, 24/7 concierge service, and premium lobby. Perfect urban living." },

  // ─── Islamabad ───
  { type: "House", purpose: "Sale", price: 55000000, location: "F-7/2, Islamabad", bedrooms: 6, area: 5500, description: "Majestic 6-bedroom house in F-7, one of Islamabad's most prestigious sectors. Triple-story with elevator access, home office, three kitchens, and a rooftop garden with Margalla Hills views. Ideal for diplomats and executives." },
  { type: "House", purpose: "Sale", price: 28000000, location: "Bahria Enclave, Islamabad", bedrooms: 4, area: 2800, description: "Modern 4-bedroom house in Bahria Enclave with contemporary design. Open-plan living, imported sanitary fittings, solar panel system, and a beautiful garden. Peaceful environment with mountain views." },
  { type: "Apartment", purpose: "Rent", price: 150000, location: "E-11/3, Islamabad", bedrooms: 3, area: 2000, description: "Spacious 3-bedroom luxury apartment in Marhaba Heights E-11. Covered parking, backup generator, and gym facility. Tastefully furnished with wooden flooring and modular kitchen. Near Jinnah Supermarket." },
  { type: "Villa", purpose: "Sale", price: 120000000, location: "F-6/1, Islamabad", bedrooms: 8, area: 10000, description: "Ultra-luxury 2-kanal villa in the diplomatic enclave of F-6. Eight bedrooms, indoor pool, cinema room, wine cellar, and separate guest house. Architectural masterpiece surrounded by mature trees and complete privacy." },
  { type: "Land", purpose: "Sale", price: 40000000, location: "DHA Phase 2, Islamabad", bedrooms: 0, area: 10000, description: "1-kanal residential plot in DHA Phase 2 Sector J. Fully developed area with all amenities. Level ground, ideal for custom home construction. Near DHA Club and main boulevard. High appreciation potential." },
  { type: "Commercial", purpose: "Rent", price: 350000, location: "Blue Area, Islamabad", bedrooms: 0, area: 3500, description: "Premium office space in Jinnah Avenue, Blue Area. Open floor plan with panoramic views of the capital. Building has 4 elevators, underground parking, and a modern reception. Suitable for corporate headquarters." },
  { type: "House", purpose: "Rent", price: 200000, location: "G-10/2, Islamabad", bedrooms: 4, area: 3000, description: "Spacious 4-bedroom house in G-10 with large front lawn and separate entrance for guests. Servant quarters, two-car garage, and recently renovated bathrooms. Close to Centaurus Mall and major hospitals." },

  // ─── Karachi ───
  { type: "Apartment", purpose: "Sale", price: 32000000, location: "Clifton Block 5, Karachi", bedrooms: 4, area: 2600, description: "Sea-facing 4-bedroom apartment in a premium tower at Clifton. Floor-to-ceiling windows with Arabian Sea views, Italian kitchen, jacuzzi bath, and residents' rooftop lounge. Minutes from Dolmen Mall and Seaview." },
  { type: "House", purpose: "Sale", price: 75000000, location: "DHA Phase 8, Karachi", bedrooms: 6, area: 6000, description: "Brand new 6-bedroom bungalow in DHA Phase 8 Zone A. Architect-designed with double-height ceilings, home automation, basement parking for 4 cars, and a lush garden with fountain. Top-tier finishes throughout." },
  { type: "Apartment", purpose: "Rent", price: 95000, location: "Gulshan-e-Iqbal, Karachi", bedrooms: 2, area: 1100, description: "Well-maintained 2-bedroom apartment in Gulshan Block 13. Tiled flooring, built-in wardrobes, and an open balcony. Secure building with intercom system. Near University of Karachi and Safoora Chowrangi." },
  { type: "Villa", purpose: "Sale", price: 150000000, location: "Bahria Town, Karachi", bedrooms: 7, area: 9000, description: "Magnificent 500-yard villa in Bahria Town Precinct 1. Seven luxury bedrooms, private pool, landscaped lawns, and a party hall. Premium finishes with imported chandeliers, Teak wood doors, and Kohler fittings." },
  { type: "Commercial", purpose: "Sale", price: 60000000, location: "Tariq Road, Karachi", bedrooms: 0, area: 4000, description: "High-visibility commercial space on Tariq Road, one of Karachi's busiest shopping streets. Two floors with separate washrooms, central AC, and a wide frontage. Perfect for a flagship store or showroom." },
  { type: "Land", purpose: "Sale", price: 25000000, location: "Scheme 33, Karachi", bedrooms: 0, area: 4800, description: "240 sq yards residential plot in Scheme 33 near Safoora Goth. Rapidly developing area with new infrastructure. Boundary wall constructed, utilities connection available, and ideal for immediate construction." },
  { type: "House", purpose: "Rent", price: 180000, location: "DHA Phase 6, Karachi", bedrooms: 5, area: 4000, description: "Fully furnished 5-bedroom house in DHA Phase 6 available for rent. Modern decor, split ACs in every room, modular kitchen, and maid's room. Quiet lane with park views. Ideal for expat families." },

  // ─── Rawalpindi ───
  { type: "House", purpose: "Sale", price: 18000000, location: "Satellite Town, Rawalpindi", bedrooms: 4, area: 2200, description: "Solidly built 4-bedroom house in Satellite Town Block D. Double story with marble flooring, three bathrooms, and a terrace. Well-connected location near Ayub Park and Rawalpindi Cricket Stadium." },
  { type: "Apartment", purpose: "Rent", price: 55000, location: "Commercial Market, Rawalpindi", bedrooms: 2, area: 900, description: "Budget-friendly 2-bedroom apartment near Commercial Market. Basic furnishing, gas and water available 24/7. Walking distance to Saddar Bazaar, hospitals, and public transport. Ideal for small families." },
  { type: "Commercial", purpose: "Rent", price: 200000, location: "Murree Road, Rawalpindi", bedrooms: 0, area: 2500, description: "Spacious commercial hall on Murree Road suitable for a showroom, clinic, or co-working space. Ample parking, wide road access, and high visibility. Ground floor with separate utility room." },

  // ─── Faisalabad ───
  { type: "House", purpose: "Sale", price: 12000000, location: "Madina Town, Faisalabad", bedrooms: 3, area: 1800, description: "Affordable 3-bedroom house in Madina Town. Tiled flooring, modern bathroom fittings, and a compact garden. Located in a peaceful residential area with schools and hospitals nearby. Great value for money." },
  { type: "Commercial", purpose: "Sale", price: 35000000, location: "D Ground, Faisalabad", bedrooms: 0, area: 3000, description: "Commercial plaza on D Ground, Faisalabad's premium business hub. Three floors with multiple shop spaces, escalator, and parking. High rental income potential with existing tenants. Prime investment opportunity." },
  { type: "House", purpose: "Rent", price: 45000, location: "Gulberg Colony, Faisalabad", bedrooms: 3, area: 1500, description: "Comfortable 3-bedroom house in Gulberg Colony. Well-ventilated rooms, two bathrooms, and a small courtyard. Affordable rent in a well-established residential area. Near Canal Road and public transport." },

  // ─── Multan ───
  { type: "House", purpose: "Sale", price: 8500000, location: "Bosan Road, Multan", bedrooms: 3, area: 1600, description: "Charming 3-bedroom house on Bosan Road. Newly painted with modern kitchen, two bathrooms, and a car porch. Located in a friendly neighborhood near Nishtar Hospital and Multan Cantt." },
  { type: "Land", purpose: "Sale", price: 5000000, location: "DHA Multan", bedrooms: 0, area: 5000, description: "5-marla plot in DHA Multan Phase 1 Sector T. Ideal investment as area is under rapid development. Possession available, all dues cleared. DHA offers world-class infrastructure and gated living." },
  { type: "Villa", purpose: "Sale", price: 45000000, location: "Shah Rukn-e-Alam Colony, Multan", bedrooms: 5, area: 4500, description: "Luxurious 5-bedroom villa with traditional Multani architecture blended with modern amenities. Hand-painted tile work, spacious courtyard, rooftop lounge, and smart home features. A unique heritage-style home." },

  // ─── Peshawar ───
  { type: "House", purpose: "Sale", price: 15000000, location: "Hayatabad Phase 3, Peshawar", bedrooms: 4, area: 2400, description: "Well-constructed 4-bedroom house in Hayatabad Phase 3. Ground + first floor with separate drawing room, dining area, and a green lawn. Secure neighborhood with schools, mosque, and park within walking distance." },
  { type: "Apartment", purpose: "Rent", price: 40000, location: "University Road, Peshawar", bedrooms: 2, area: 850, description: "Affordable 2-bedroom apartment on University Road. Close to University of Peshawar and Board Bazaar. Tiled floors, one bathroom, and a small kitchen. Ideal for students and bachelors." },
  { type: "Land", purpose: "Sale", price: 8000000, location: "Regi Model Town, Peshawar", bedrooms: 0, area: 4000, description: "Residential plot in Regi Model Town Phase 5. Flat terrain, corner lot with two road access. All utilities available. Growing neighborhood with new construction all around. Great for building a family home." },

  // ─── More premium Lahore / Islamabad ───
  { type: "Villa", purpose: "Rent", price: 500000, location: "DHA Phase 7, Lahore", bedrooms: 6, area: 7000, description: "Stunning fully furnished 6-bedroom villa available for rent in DHA Phase 7. Features pool, home gym, BBQ area, and separate guest wing. Ideal for corporate executives or diplomatic families. Available immediately." },
  { type: "House", purpose: "Sale", price: 42000000, location: "Gulberg II, Lahore", bedrooms: 5, area: 4000, description: "Elegant 5-bedroom house on a prime Gulberg II street. Classic architecture with modern renovation. Wood-paneled study, wraparound veranda, and a mature fruit garden. Commercial potential due to location." },
  { type: "Apartment", purpose: "Sale", price: 25000000, location: "Centaurus Mall, Islamabad", bedrooms: 3, area: 2200, description: "Luxurious 3-bedroom residence in The Centaurus. Premium finishes, floor-to-ceiling windows with panoramic views, access to 5-star amenities including pool, spa, and fine dining. The epitome of urban living." },
  { type: "House", purpose: "Sale", price: 48000000, location: "F-10/3, Islamabad", bedrooms: 5, area: 4500, description: "Tastefully designed 5-bedroom house in F-10 Islamabad. Italian marble, central heating and cooling, home office, and a Japanese-style garden. Quiet cul-de-sac location with excellent security." },
  { type: "Commercial", purpose: "Sale", price: 80000000, location: "I-8 Markaz, Islamabad", bedrooms: 0, area: 5000, description: "Premium commercial building in I-8 Markaz. Ground + 3 floors with elevator, rooftop parking, and 20+ office units. Fully rented with stable income. Excellent ROI for investors." },
  { type: "House", purpose: "Rent", price: 75000, location: "Wapda Town, Lahore", bedrooms: 3, area: 1400, description: "Cozy 3-bedroom house in Wapda Town Phase 1. Marble floors, two bathrooms, covered car parking, and a small lawn. Family-oriented neighborhood near schools and markets. Available from next month." },
  { type: "Apartment", purpose: "Rent", price: 65000, location: "Askari 11, Lahore", bedrooms: 2, area: 1100, description: "Neat 2-bedroom apartment in Askari 11. Secure military housing area with 24/7 security, clean parks, and community center. Tiled floors, balcony, and parking included. Near Allama Iqbal Airport." },
  { type: "Land", purpose: "Sale", price: 55000000, location: "Gulberg Greens, Islamabad", bedrooms: 0, area: 20000, description: "4-kanal farmhouse plot in Gulberg Greens. Serene location surrounded by greenery with Margalla Hills backdrop. Gated community with clubhouse and equestrian facilities. Perfect weekend retreat investment." },
  { type: "House", purpose: "Sale", price: 19500000, location: "Chaklala Scheme 3, Rawalpindi", bedrooms: 4, area: 2000, description: "Renovated 4-bedroom house in Chaklala Scheme 3. Modern bathrooms, new electrical wiring, and fresh paint. Corner plot with extra parking space. Peaceful area close to Rawalpindi Bypass." },
  { type: "Apartment", purpose: "Sale", price: 14000000, location: "Civic Center, Bahria Town Lahore", bedrooms: 2, area: 1050, description: "Brand new 2-bedroom apartment in Bahria Town Civic Center. Open kitchen, large living room, and a balcony overlooking the Grand Mosque. Building has elevator, generator backup, and rooftop lounge." },
];

// ── Helpers ─────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(startDays, endDays) {
  const now = Date.now();
  const start = now - startDays * 86400000;
  const end = now - endDays * 86400000;
  return new Date(start + Math.random() * (end - start));
}

// ── Main ────────────────────────────────────────────────
async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.\n");

    // Sync tables (don't force — keep existing data safe, just ensure tables exist)
    await sequelize.sync();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // ── Create agents ───────────────────────────────────
    console.log("Creating agents...");
    const createdAgents = [];
    for (const a of agents) {
      const [user] = await User.findOrCreate({
        where: { email: a.email },
        defaults: { name: a.name, email: a.email, password: hashedPassword, role: "Agent", phone: a.phone },
      });
      createdAgents.push(user);
    }
    console.log(`  ${createdAgents.length} agents ready.`);

    // ── Create buyers ───────────────────────────────────
    console.log("Creating buyers...");
    const createdBuyers = [];
    for (const b of buyers) {
      const [user] = await User.findOrCreate({
        where: { email: b.email },
        defaults: { name: b.name, email: b.email, password: hashedPassword, role: "Buyer", phone: b.phone },
      });
      createdBuyers.push(user);
    }
    console.log(`  ${createdBuyers.length} buyers ready.`);

    // ── Create properties ───────────────────────────────
    console.log("Creating properties...");
    let created = 0;
    for (const p of properties) {
      const agent = pick(createdAgents);
      const createdAt = randomDate(180, 1); // random date in last 6 months

      const property = await Property.create({
        agent_id: agent.id,
        type: p.type,
        purpose: p.purpose,
        price: p.price,
        location: p.location,
        bedrooms: p.bedrooms,
        area: p.area,
        description: p.description,
        createdAt,
        updatedAt: createdAt,
      });

      // Add 2-4 images per property
      const imgs = imgMap[p.type] || houseImgs;
      const count = rand(2, Math.min(4, imgs.length));
      const shuffled = [...imgs].sort(() => Math.random() - 0.5).slice(0, count);
      for (let i = 0; i < shuffled.length; i++) {
        await PropertyImage.create({
          property_id: property.id,
          image_url: shuffled[i],
          is_primary: i === 0,
        });
      }

      created++;
    }
    console.log(`  ${created} properties created with images.\n`);

    // ── Summary ─────────────────────────────────────────
    const totalUsers = await User.count();
    const totalProps = await Property.count();
    const totalImgs = await PropertyImage.count();
    console.log("═══════════════════════════════════════");
    console.log("  Seed complete!");
    console.log(`  Users:      ${totalUsers} (${createdAgents.length} agents, ${createdBuyers.length} buyers)`);
    console.log(`  Properties: ${totalProps}`);
    console.log(`  Images:     ${totalImgs}`);
    console.log("═══════════════════════════════════════");
    console.log("\n  All accounts use password: password123");
    console.log("  Agent login example: ahmed.raza@estateai.pk");
    console.log("  Buyer login example: imran.buyer@gmail.com\n");

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
