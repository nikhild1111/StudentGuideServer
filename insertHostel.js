const { MongoClient } = require("mongodb");

// MongoDB connection string
const uri = "mongodb+srv://domadenikhil:1uooV4uCIDKWipHz@cluster0.o8k3ye6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB collection details
const dbName = "test"; // ✅ This is the correct database name
// Your DB name
const collectionName = "hostels";

// Sample hostel data (👇 You can paste your full array here)
const hostelData = [
   {
    name: "Sunrise Boys Hostel",
    type: "boys",
    rent: 8500,
    rating: 4.2,
    images: ["https://example.com/sunrise1.jpg", "https://example.com/sunrise2.jpg"],
    video: "https://example.com/sunrise_video.mp4",
    services: ["wifi", "security", "electricity", "food", "washing"],
    address: {
      full: "123 MG Road, Koramangala, Bangalore, Karnataka 560034",
      landmark: "Near Forum Mall",
      gully: "2nd Cross Street",
      building: "Sunrise Complex"
    },
    contact: "9876543210",
    description: "Modern hostel with excellent facilities and 24/7 security in prime location."
  },
  {
    name: "Rose Garden Girls Hostel",
    type: "girls",
    rent: 9000,
    rating: 4.5,
    images: ["https://example.com/rose1.jpg", "https://example.com/rose2.jpg"],
    video: "https://example.com/rose_video.mp4",
    services: ["wifi", "security", "electricity", "food", "personal_toilet", "water_filter"],
    address: {
      full: "456 Brigade Road, Richmond Town, Bangalore, Karnataka 560025",
      landmark: "Opposite Metro Station",
      gully: "Rose Garden Lane",
      building: "Rose Tower"
    },
    contact: "9876543211",
    description: "Safe and comfortable girls hostel with modern amenities and home-like atmosphere."
  },
  {
    name: "Green Valley Boys PG",
    type: "boys",
    rent: 7500,
    rating: 4.0,
    images: ["https://example.com/green1.jpg", "https://example.com/green2.jpg"],
    services: ["wifi", "security", "electricity", "washing", "washroom"],
    address: {
      full: "789 Residency Road, Shanthala Nagar, Bangalore, Karnataka 560027",
      landmark: "Near City Railway Station",
      gully: "Green Valley Street",
      building: "Valley Heights"
    },
    contact: "9876543212",
    description: "Budget-friendly hostel with basic facilities and convenient transport connectivity."
  },
  {
    name: "Pearl Girls Accommodation",
    type: "girls",
    rent: 8800,
    rating: 4.3,
    images: ["https://example.com/pearl1.jpg"],
    video: "https://example.com/pearl_video.mp4",
    services: ["wifi", "security", "electricity", "food", "personal_toilet"],
    address: {
      full: "321 Commercial Street, Shivaji Nagar, Bangalore, Karnataka 560001",
      landmark: "Near Trinity Metro",
      gully: "Pearl Street",
      building: "Pearl Manor"
    },
    contact: "9876543213",
    description: "Premium girls hostel with luxury facilities and personalized room service."
  },
  {
    name: "Golden Gate Boys Hostel",
    type: "boys",
    rent: 7800,
    rating: 3.8,
    images: ["https://example.com/golden1.jpg", "https://example.com/golden2.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "654 Cunningham Road, Vasantha Nagar, Bangalore, Karnataka 560052",
      landmark: "Near Cubbon Park",
      gully: "Golden Gate Road",
      building: "Gate Complex"
    },
    contact: "9876543214",
    description: "Affordable boys hostel with basic amenities and peaceful environment."
  },
  {
    name: "Lotus Girls Residence",
    type: "girls",
    rent: 9500,
    rating: 4.6,
    images: ["https://example.com/lotus1.jpg", "https://example.com/lotus2.jpg", "https://example.com/lotus3.jpg"],
    video: "https://example.com/lotus_video.mp4",
    services: ["wifi", "security", "electricity", "food", "washing", "personal_toilet", "water_filter"],
    address: {
      full: "987 Indiranagar, 100 Feet Road, Bangalore, Karnataka 560038",
      landmark: "Near Metro Cash & Carry",
      gully: "Lotus Lane",
      building: "Lotus Towers"
    },
    contact: "9876543215",
    description: "Luxury girls hostel with all modern facilities and premium location."
  },
  {
    name: "Star Boys PG",
    type: "boys",
    rent: 6500,
    rating: 3.5,
    images: ["https://example.com/star1.jpg"],
    services: ["wifi", "security", "electricity"],
    address: {
      full: "147 Whitefield Road, Marathahalli, Bangalore, Karnataka 560037",
      landmark: "Near Forum Value Mall",
      gully: "Star Street",
      building: "Star Building"
    },
    contact: "9876543216",
    description: "Basic boys hostel with essential facilities in IT hub area."
  },
  {
    name: "Moonlight Girls Hostel",
    type: "girls",
    rent: 8200,
    rating: 4.1,
    images: ["https://example.com/moon1.jpg", "https://example.com/moon2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washroom"],
    address: {
      full: "258 Jayanagar, 4th Block, Bangalore, Karnataka 560041",
      landmark: "Near Jayanagar Shopping Complex",
      gully: "Moonlight Avenue",
      building: "Moon Residency"
    },
    contact: "9876543217",
    description: "Comfortable girls hostel with good food and friendly environment."
  },
  {
    name: "Crown Boys Accommodation",
    type: "boys",
    rent: 9200,
    rating: 4.4,
    images: ["https://example.com/crown1.jpg", "https://example.com/crown2.jpg"],
    video: "https://example.com/crown_video.mp4",
    services: ["wifi", "security", "electricity", "food", "washing", "personal_toilet"],
    address: {
      full: "369 BTM Layout, 1st Stage, Bangalore, Karnataka 560068",
      landmark: "Near Silk Board Junction",
      gully: "Crown Street",
      building: "Crown Plaza"
    },
    contact: "9876543218",
    description: "Premium boys hostel with excellent facilities and professional management."
  },
  {
    name: "Sakura Girls PG",
    type: "girls",
    rent: 7200,
    rating: 3.9,
    images: ["https://example.com/sakura1.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "741 Electronic City, Phase 1, Bangalore, Karnataka 560100",
      landmark: "Near Infosys Campus",
      gully: "Sakura Lane",
      building: "Sakura Heights"
    },
    contact: "9876543219",
    description: "Budget-friendly girls PG with basic amenities near IT companies."
  },
  {
    name: "Phoenix Boys Hostel",
    type: "boys",
    rent: 8700,
    rating: 4.2,
    images: ["https://example.com/phoenix1.jpg", "https://example.com/phoenix2.jpg"],
    services: ["wifi", "security", "electricity", "food", "water_filter"],
    address: {
      full: "852 Banashankari, 2nd Stage, Bangalore, Karnataka 560070",
      landmark: "Near Banashankari Temple",
      gully: "Phoenix Road",
      building: "Phoenix Complex"
    },
    contact: "9876543220",
    description: "Well-maintained boys hostel with quality food and clean environment."
  },
  {
    name: "Orchid Girls Residence",
    type: "girls",
    rent: 9800,
    rating: 4.7,
    images: ["https://example.com/orchid1.jpg", "https://example.com/orchid2.jpg", "https://example.com/orchid3.jpg"],
    video: "https://example.com/orchid_video.mp4",
    services: ["wifi", "security", "electricity", "food", "washing", "personal_toilet", "water_filter"],
    address: {
      full: "963 HSR Layout, Sector 1, Bangalore, Karnataka 560102",
      landmark: "Near HSR BDA Complex",
      gully: "Orchid Street",
      building: "Orchid Manor"
    },
    contact: "9876543221",
    description: "Luxury girls residence with top-notch facilities and premium services."
  },
  {
    name: "Thunder Boys PG",
    type: "boys",
    rent: 6800,
    rating: 3.6,
    images: ["https://example.com/thunder1.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "174 Rajajinagar, 1st Block, Bangalore, Karnataka 560010",
      landmark: "Near Rajajinagar Metro Station",
      gully: "Thunder Lane",
      building: "Thunder House"
    },
    contact: "9876543222",
    description: "Simple boys PG with basic facilities and metro connectivity."
  },
  {
    name: "Jasmine Girls Hostel",
    type: "girls",
    rent: 8400,
    rating: 4.0,
    images: ["https://example.com/jasmine1.jpg", "https://example.com/jasmine2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washroom"],
    address: {
      full: "285 Malleshwaram, 15th Cross, Bangalore, Karnataka 560003",
      landmark: "Near Malleshwaram Metro",
      gully: "Jasmine Garden",
      building: "Jasmine Towers"
    },
    contact: "9876543223",
    description: "Cozy girls hostel with homely atmosphere and nutritious meals."
  },
  {
    name: "Eagle Boys Accommodation",
    type: "boys",
    rent: 7900,
    rating: 4.1,
    images: ["https://example.com/eagle1.jpg", "https://example.com/eagle2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washing"],
    address: {
      full: "396 Vijayanagar, 2nd Stage, Bangalore, Karnataka 560040",
      landmark: "Near Vijayanagar Bus Stand",
      gully: "Eagle Street",
      building: "Eagle Nest"
    },
    contact: "9876543224",
    description: "Comfortable boys accommodation with good food and transport facility."
  },
  {
    name: "Tulip Girls PG",
    type: "girls",
    rent: 7600,
    rating: 3.8,
    images: ["https://example.com/tulip1.jpg"],
    services: ["wifi", "security", "electricity", "personal_toilet"],
    address: {
      full: "507 Basavanagudi, Bull Temple Road, Bangalore, Karnataka 560019",
      landmark: "Near Bull Temple",
      gully: "Tulip Lane",
      building: "Tulip Residency"
    },
    contact: "9876543225",
    description: "Affordable girls PG with private facilities and peaceful location."
  },
  {
    name: "Diamond Boys Hostel",
    type: "boys",
    rent: 8900,
    rating: 4.3,
    images: ["https://example.com/diamond1.jpg", "https://example.com/diamond2.jpg"],
    video: "https://example.com/diamond_video.mp4",
    services: ["wifi", "security", "electricity", "food", "washing", "water_filter"],
    address: {
      full: "618 RT Nagar, Main Road, Bangalore, Karnataka 560032",
      landmark: "Near ISKCON Temple",
      gully: "Diamond Street",
      building: "Diamond Palace"
    },
    contact: "9876543226",
    description: "Premium boys hostel with excellent facilities and spiritual environment."
  },
  {
    name: "Violet Girls Residence",
    type: "girls",
    rent: 8600,
    rating: 4.2,
    images: ["https://example.com/violet1.jpg", "https://example.com/violet2.jpg"],
    services: ["wifi", "security", "electricity", "food", "personal_toilet"],
    address: {
      full: "729 Yelahanka, New Town, Bangalore, Karnataka 560064",
      landmark: "Near Yelahanka Railway Station",
      gully: "Violet Avenue",
      building: "Violet Heights"
    },
    contact: "9876543227",
    description: "Modern girls residence with quality amenities and safe environment."
  },
  {
    name: "Falcon Boys PG",
    type: "boys",
    rent: 7100,
    rating: 3.7,
    images: ["https://example.com/falcon1.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "834 Hebbal, Outer Ring Road, Bangalore, Karnataka 560024",
      landmark: "Near Hebbal Flyover",
      gully: "Falcon Road",
      building: "Falcon Tower"
    },
    contact: "9876543228",
    description: "Basic boys PG with essential facilities and highway connectivity."
  },
  {
    name: "Lily Girls Hostel",
    type: "girls",
    rent: 8300,
    rating: 4.1,
    images: ["https://example.com/lily1.jpg", "https://example.com/lily2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washroom", "water_filter"],
    address: {
      full: "945 Kammanahalli, Main Road, Bangalore, Karnataka 560084",
      landmark: "Near Kammanahalli Bus Stop",
      gully: "Lily Street",
      building: "Lily Gardens"
    },
    contact: "9876543229",
    description: "Comfortable girls hostel with clean facilities and good connectivity."
  },
  {
    name: "Platinum Boys Accommodation",
    type: "boys",
    rent: 9600,
    rating: 4.5,
    images: ["https://example.com/platinum1.jpg", "https://example.com/platinum2.jpg", "https://example.com/platinum3.jpg"],
    video: "https://example.com/platinum_video.mp4",
    services: ["wifi", "security", "electricity", "food", "washing", "personal_toilet", "water_filter"],
    address: {
      full: "156 Sarjapur Road, Bellandur, Bangalore, Karnataka 560103",
      landmark: "Near Eco Space",
      gully: "Platinum Lane",
      building: "Platinum Towers"
    },
    contact: "9876543230",
    description: "Luxury boys accommodation with premium facilities and corporate environment."
  },
  {
    name: "Daisy Girls PG",
    type: "girls",
    rent: 7400,
    rating: 3.9,
    images: ["https://example.com/daisy1.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "267 Ramamurthy Nagar, Main Road, Bangalore, Karnataka 560016",
      landmark: "Near ITPL Main Gate",
      gully: "Daisy Lane",
      building: "Daisy House"
    },
    contact: "9876543231",
    description: "Budget-friendly girls PG with basic amenities near IT park."
  },
  {
    name: "Royal Boys Hostel",
    type: "boys",
    rent: 8100,
    rating: 4.0,
    images: ["https://example.com/royal1.jpg", "https://example.com/royal2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washing"],
    address: {
      full: "378 Mathikere, BEL Road, Bangalore, Karnataka 560054",
      landmark: "Near BEL Circle",
      gully: "Royal Street",
      building: "Royal Palace"
    },
    contact: "9876543232",
    description: "Well-maintained boys hostel with royal treatment and quality service."
  },
  {
    name: "Magnolia Girls Residence",
    type: "girls",
    rent: 9100,
    rating: 4.4,
    images: ["https://example.com/magnolia1.jpg", "https://example.com/magnolia2.jpg"],
    video: "https://example.com/magnolia_video.mp4",
    services: ["wifi", "security", "electricity", "food", "personal_toilet", "water_filter"],
    address: {
      full: "489 Frazer Town, Mosque Road, Bangalore, Karnataka 560005",
      landmark: "Near Frazer Town Railway Station",
      gully: "Magnolia Avenue",
      building: "Magnolia Manor"
    },
    contact: "9876543233",
    description: "Elegant girls residence with modern amenities and central location."
  },
  {
    name: "Hawk Boys PG",
    type: "boys",
    rent: 6900,
    rating: 3.6,
    images: ["https://example.com/hawk1.jpg"],
    services: ["wifi", "security", "electricity"],
    address: {
      full: "590 Domlur, Inner Ring Road, Bangalore, Karnataka 560071",
      landmark: "Near HAL Airport",
      gully: "Hawk Lane",
      building: "Hawk Heights"
    },
    contact: "9876543234",
    description: "Simple boys PG with basic facilities and airport proximity."
  },
  {
    name: "Sunflower Girls Hostel",
    type: "girls",
    rent: 8000,
    rating: 4.0,
    images: ["https://example.com/sunflower1.jpg", "https://example.com/sunflower2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washroom"],
    address: {
      full: "601 Banaswadi, Main Road, Bangalore, Karnataka 560043",
      landmark: "Near Banaswadi Railway Station",
      gully: "Sunflower Street",
      building: "Sunflower Complex"
    },
    contact: "9876543235",
    description: "Bright and cheerful girls hostel with good food and friendly staff."
  },
  {
    name: "Emerald Boys Accommodation",
    type: "boys",
    rent: 8800,
    rating: 4.3,
    images: ["https://example.com/emerald1.jpg", "https://example.com/emerald2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washing", "water_filter"],
    address: {
      full: "712 Nagarbhavi, Main Road, Bangalore, Karnataka 560072",
      landmark: "Near Nagarbhavi Circle",
      gully: "Emerald Street",
      building: "Emerald Tower"
    },
    contact: "9876543236",
    description: "Premium boys accommodation with emerald standard facilities and service."
  },
  {
    name: "Iris Girls PG",
    type: "girls",
    rent: 7700,
    rating: 3.8,
    images: ["https://example.com/iris1.jpg"],
    services: ["wifi", "security", "electricity", "personal_toilet"],
    address: {
      full: "823 Kengeri, Satellite Town, Bangalore, Karnataka 560060",
      landmark: "Near Kengeri Metro Station",
      gully: "Iris Lane",
      building: "Iris Residency"
    },
    contact: "9876543237",
    description: "Comfortable girls PG with private facilities and metro connectivity."
  },
  {
    name: "Thunder Bay Boys Hostel",
    type: "boys",
    rent: 7300,
    rating: 3.9,
    images: ["https://example.com/thunderbay1.jpg", "https://example.com/thunderbay2.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "934 Jakkur, Main Road, Bangalore, Karnataka 560064",
      landmark: "Near Jakkur Lake",
      gully: "Thunder Bay Street",
      building: "Thunder Bay House"
    },
    contact: "9876543238",
    description: "Peaceful boys hostel with lake view and natural surroundings."
  },
  {
    name: "Marigold Girls Residence",
    type: "girls",
    rent: 8500,
    rating: 4.1,
    images: ["https://example.com/marigold1.jpg", "https://example.com/marigold2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washroom", "water_filter"],
    address: {
      full: "145 Peenya, Industrial Area, Bangalore, Karnataka 560058",
      landmark: "Near Peenya Metro Station",
      gully: "Marigold Avenue",
      building: "Marigold Gardens"
    },
    contact: "9876543239",
    description: "Modern girls residence with industrial area connectivity and amenities."
  },
  {
    name: "Viper Boys PG",
    type: "boys",
    rent: 6600,
    rating: 3.5,
    images: ["https://example.com/viper1.jpg"],
    services: ["wifi", "security", "electricity"],
    address: {
      full: "256 Hoodi, Whitefield Road, Bangalore, Karnataka 560048",
      landmark: "Near ITPL",
      gully: "Viper Lane",
      building: "Viper Building"
    },
    contact: "9876543240",
    description: "Basic boys PG with essential facilities near IT companies."
  },
  {
    name: "Peony Girls Hostel",
    type: "girls",
    rent: 8200,
    rating: 4.0,
    images: ["https://example.com/peony1.jpg", "https://example.com/peony2.jpg"],
    services: ["wifi", "security", "electricity", "food", "personal_toilet"],
    address: {
      full: "367 Ulsoor, MG Road, Bangalore, Karnataka 560008",
      landmark: "Near Ulsoor Lake",
      gully: "Peony Street",
      building: "Peony Manor"
    },
    contact: "9876543241",
    description: "Elegant girls hostel with lake view and premium location."
  },
  {
    name: "Sapphire Boys Accommodation",
    type: "boys",
    rent: 9400,
    rating: 4.6,
    images: ["https://example.com/sapphire1.jpg", "https://example.com/sapphire2.jpg", "https://example.com/sapphire3.jpg"],
    video: "https://example.com/sapphire_video.mp4",
    services: ["wifi", "security", "electricity", "food", "washing", "personal_toilet", "water_filter"],
    address: {
      full: "478 Koramangala, 5th Block, Bangalore, Karnataka 560095",
      landmark: "Near Sony World Junction",
      gully: "Sapphire Lane",
      building: "Sapphire Towers"
    },
    contact: "9876543242",
    description: "Luxury boys accommodation with sapphire class facilities and prime location."
  },
  {
    name: "Daffodil Girls PG",
    type: "girls",
    rent: 7500,
    rating: 3.7,
    images: ["https://example.com/daffodil1.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "589 Mysore Road, Kengeri, Bangalore, Karnataka 560074",
      landmark: "Near Nice Road Junction",
      gully: "Daffodil Street",
      building: "Daffodil House"
    },
    contact: "9876543243",
    description: "Budget-friendly girls PG with basic amenities and highway access."
  },
  {
    name: "Titan Boys Hostel",
    type: "boys",
    rent: 8300,
    rating: 4.2,
    images: ["https://example.com/titan1.jpg", "https://example.com/titan2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washing"],
    address: {
      full: "690 Cunningham Road, Vasanth Nagar, Bangalore, Karnataka 560052",
      landmark: "Near Kanteerava Stadium",
      gully: "Titan Street",
      building: "Titan Complex"
    },
    contact: "9876543244",
    description: "Strong and reliable boys hostel with titan-grade facilities."
  },
  {
    name: "Lavender Girls Residence",
    type: "girls",
    rent: 8900,
    rating: 4.3,
    images: ["https://example.com/lavender1.jpg", "https://example.com/lavender2.jpg"],
    services: ["wifi", "security", "electricity", "food", "personal_toilet", "water_filter"],
    address: {
      full: "701 Richmond Road, Shanthala Nagar, Bangalore, Karnataka 560025",
      landmark: "Near St. Marks Cathedral",
      gully: "Lavender Avenue",
      building: "Lavender Manor"
    },
    contact: "9876543245",
    description: "Sophisticated girls residence with lavender scented ambiance and luxury."
  },
  {
    name: "Cobra Boys PG",
    type: "boys",
    rent: 7000,
    rating: 3.8,
    images: ["https://example.com/cobra1.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "812 Yeshwanthpur, Tumkur Road, Bangalore, Karnataka 560022",
      landmark: "Near Yeshwanthpur Metro Station",
      gully: "Cobra Lane",
      building: "Cobra House"
    },
    contact: "9876543246",
    description: "Secure boys PG with cobra-level security and metro connectivity."
  },
  {
    name: "Hibiscus Girls Hostel",
    type: "girls",
    rent: 8100,
    rating: 4.0,
    images: ["https://example.com/hibiscus1.jpg", "https://example.com/hibiscus2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washroom"],
    address: {
      full: "923 HAL Airport Road, Kodihalli, Bangalore, Karnataka 560017",
      landmark: "Near HAL Heritage Centre",
      gully: "Hibiscus Street",
      building: "Hibiscus Gardens"
    },
    contact: "9876543247",
    description: "Beautiful girls hostel with hibiscus garden and airport proximity."
  },
  {
    name: "Ruby Boys Accommodation",
    type: "boys",
    rent: 8600,
    rating: 4.1,
    images: ["https://example.com/ruby1.jpg", "https://example.com/ruby2.jpg"],
    services: ["wifi", "security", "electricity", "food", "washing", "water_filter"],
    address: {
      full: "134 Bannerghatta Road, Arekere, Bangalore, Karnataka 560076",
      landmark: "Near IIM Bangalore",
      gully: "Ruby Street",
      building: "Ruby Palace"
    },
    contact: "9876543248",
    description: "Precious boys accommodation with ruby-standard facilities and educational vicinity."
  },
  {
    name: "Poppy Girls PG",
    type: "girls",
    rent: 7800,
    rating: 3.9,
    images: ["https://example.com/poppy1.jpg"],
    services: ["wifi", "security", "electricity", "personal_toilet"],
    address: {
      full: "245 Old Madras Road, Banaswadi, Bangalore, Karnataka 560043",
      landmark: "Near Banaswadi Railway Station",
      gully: "Poppy Lane",
      building: "Poppy Residency"
    },
    contact: "9876543249",
    description: "Cheerful girls PG with poppy-bright atmosphere and railway connectivity."
  },
  {
    name: "Scorpion Boys Hostel",
    type: "boys",
    rent: 7200,
    rating: 3.7,
    images: ["https://example.com/scorpion1.jpg", "https://example.com/scorpion2.jpg"],
    services: ["wifi", "security", "electricity", "washing"],
    address: {
      full: "356 Outer Ring Road, Marathahalli, Bangalore, Karnataka 560037",
      landmark: "Near Brookfield Mall",
      gully: "Scorpion Street",
      building: "Scorpion Tower"
    },
    contact: "9876543250",
    description: "Secure boys hostel with scorpion-level protection and mall proximity."
  },
  {
    name: "Camellia Girls Residence",
    type: "girls",
    rent: 8700,
    rating: 4.2,
    images: ["https://example.com/camellia1.jpg", "https://example.com/camellia2.jpg"],
    services: ["wifi", "security", "electricity", "food", "personal_toilet", "water_filter"],
    address: {
      full: "467 Langford Road, Shanti Nagar, Bangalore, Karnataka 560027",
      landmark: "Near Sagar Hospital",
      gully: "Camellia Avenue",
      building: "Camellia Manor"
    },
    contact: "9876543251",
    description: "Elegant girls residence with camellia-like beauty and medical facility nearby."
  },
  // ✅ Paste more hostel objects here (up to 100)
];

async function insertHostelData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertMany(hostelData);
    console.log(`✅ ${result.insertedCount} hostels inserted successfully.`);
  } catch (error) {
    console.error("❌ Error inserting hostels:", error.message);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

insertHostelData();
