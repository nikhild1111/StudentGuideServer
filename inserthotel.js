// seedHotel.js
const mongoose = require("mongoose");
const Hotel = require("./models/Hotel"); // model name must match
const data = require("./dummyMessData.json");

const MONGO_URI =
  "mongodb+srv://domadenikhil:1uooV4uCIDKWipHz@cluster0.o8k3ye6.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"; // ✅ Corrected DB: test

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Hotel.deleteMany({});
    console.log("🧹 Old Hotel data removed");

    await Hotel.insertMany(data);
    console.log("✅ 20 Hotel records inserted");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding hotel data:", err);
  }
}

seedData();



// // fixImagePaths.js
// const mongoose = require("mongoose");
// const Hotel = require("./models/Hotel"); // adjust if path is different

// const MONGO_URI = "mongodb+srv://domadenikhil:1uooV4uCIDKWipHz@cluster0.o8k3ye6.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

// async function fixImagePaths() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     const hotels = await Hotel.find({});
//     let count = 0;

//     console.log(hotels);

//     for (let hotel of hotels) {
//       let updated = false;

//       hotel.images = hotel.images.map((img) => {
//         if (img.startsWith("public/")) {
//           updated = true;
//           return img.replace("public/", "");
//         }
//         return img;
//       });

//       if (updated) {
//         await hotel.save();
//         count++;
//       }
//     }

//     console.log(`✅ Updated ${count} hotels with cleaned image paths.`);
//     mongoose.disconnect();
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     process.exit(1);
//   }
// }

// fixImagePaths();
