const mongoose = require("mongoose");

const Mentor = require("./models/Mentor");

// Database connection
const DATABASE_URL = "mongodb+srv://domadenikhil:1uooV4uCIDKWipHz@cluster0.o8k3ye6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Dummy data with domain and resume fields
const mentorDummyData = [
    {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@gmail.com",
        phone: "9876543210",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        department: "Computer Science",
        passoutYear: 2018,
        companies: ["Google", "Microsoft", "Amazon"],
        gender: "Male",
        domain: "Software Development",
        resume: "https://example.com/resumes/rajesh-kumar-resume.pdf"
    },
    {
        name: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        phone: "8765432109",
        image: "https://images.unsplash.com/photo-1494790108755-2616b34e4178?w=300&h=300&fit=crop&crop=face",
        department: "Information Technology",
        passoutYear: 2019,
        companies: ["Facebook", "Netflix", "Uber"],
        gender: "Female",
        domain: "Full Stack Development",
        resume: "https://example.com/resumes/priya-sharma-resume.pdf"
    },
    {
        name: "Amit Patel",
        email: "amit.patel@gmail.com",
        phone: "7654321098",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        department: "Mechanical Engineering",
        passoutYear: 2017,
        companies: ["Tesla", "Ford", "General Motors"],
        gender: "Male",
        domain: "Automotive Engineering",
        resume: "https://example.com/resumes/amit-patel-resume.pdf"
    },
    {
        name: "Sneha Reddy",
        email: "sneha.reddy@gmail.com",
        phone: "6543210987",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
        department: "Electronics and Communication",
        passoutYear: 2020,
        companies: ["Intel", "Qualcomm", "Broadcom"],
        gender: "Female",
        domain: "Hardware Engineering",
        resume: "https://example.com/resumes/sneha-reddy-resume.pdf"
    },
    {
        name: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        phone: "5432109876",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        department: "Civil Engineering",
        passoutYear: 2016,
        companies: ["Larsen & Toubro", "Tata Projects", "Godrej Properties"],
        gender: "Male",
        domain: "Construction Management",
        resume: "https://example.com/resumes/vikram-singh-resume.pdf"
    },
    {
        name: "Ananya Gupta",
        email: "ananya.gupta@gmail.com",
        phone: "4321098765",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
        department: "Computer Science",
        passoutYear: 2021,
        companies: ["Apple", "Adobe", "Salesforce"],
        gender: "Female",
        domain: "Mobile App Development",
        resume: "https://example.com/resumes/ananya-gupta-resume.pdf"
    },
    {
        name: "Rohit Verma",
        email: "rohit.verma@gmail.com",
        phone: "3210987654",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
        department: "Electrical Engineering",
        passoutYear: 2019,
        companies: ["Siemens", "General Electric", "ABB"],
        gender: "Male",
        domain: "Power Systems",
        resume: "https://example.com/resumes/rohit-verma-resume.pdf"
    },
    {
        name: "Kavya Iyer",
        email: "kavya.iyer@gmail.com",
        phone: "2109876543",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
        department: "Biotechnology",
        passoutYear: 2018,
        companies: ["Biocon", "Dr. Reddy's", "Cipla"],
        gender: "Female",
        domain: "Pharmaceutical Research",
        resume: "https://example.com/resumes/kavya-iyer-resume.pdf"
    },
    {
        name: "Arjun Nair",
        email: "arjun.nair@gmail.com",
        phone: "1098765432",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
        department: "Chemical Engineering",
        passoutYear: 2017,
        companies: ["Reliance Industries", "ONGC", "Indian Oil"],
        gender: "Male",
        domain: "Process Engineering",
        resume: "https://example.com/resumes/arjun-nair-resume.pdf"
    },
    {
        name: "Meera Joshi",
        email: "meera.joshi@gmail.com",
        phone: "0987654321",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
        department: "Information Technology",
        passoutYear: 2020,
        companies: ["IBM", "Accenture", "TCS"],
        gender: "Female",
        domain: "Cloud Computing",
        resume: "https://example.com/resumes/meera-joshi-resume.pdf"
    },
    {
        name: "Karan Malhotra",
        email: "karan.malhotra@gmail.com",
        phone: "9988776655",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&crop=face",
        department: "Aerospace Engineering",
        passoutYear: 2016,
        companies: ["ISRO", "Boeing", "Airbus"],
        gender: "Male",
        domain: "Space Technology",
        resume: "https://example.com/resumes/karan-malhotra-resume.pdf"
    },
    {
        name: "Riya Kapoor",
        email: "riya.kapoor@gmail.com",
        phone: "8877665544",
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face",
        department: "Data Science",
        passoutYear: 2021,
        companies: ["Spotify", "LinkedIn", "Twitter"],
        gender: "Female",
        domain: "Machine Learning",
        resume: "https://example.com/resumes/riya-kapoor-resume.pdf"
    },
    {
        name: "Siddharth Rao",
        email: "siddharth.rao@gmail.com",
        phone: "7766554433",
        image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face",
        department: "Mechanical Engineering",
        passoutYear: 2018,
        companies: ["Mahindra", "Bajaj Auto", "Hero MotoCorp"],
        gender: "Male",
        domain: "Automotive Design",
        resume: "https://example.com/resumes/siddharth-rao-resume.pdf"
    },
    {
        name: "Ishita Bansal",
        email: "ishita.bansal@gmail.com",
        phone: "6655443322",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&crop=face",
        department: "Computer Science",
        passoutYear: 2019,
        companies: ["PayPal", "Stripe", "Square"],
        gender: "Female",
        domain: "Fintech",
        resume: "https://example.com/resumes/ishita-bansal-resume.pdf"
    },
    {
        name: "Akash Desai",
        email: "akash.desai@gmail.com",
        phone: "5544332211",
        image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
        department: "Industrial Engineering",
        passoutYear: 2017,
        companies: ["Infosys", "Wipro", "HCL Technologies"],
        gender: "Male",
        domain: "Operations Management",
        resume: "https://example.com/resumes/akash-desai-resume.pdf"
    },
    {
        name: "Divya Agarwal",
        email: "divya.agarwal@gmail.com",
        phone: "4433221100",
        image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=300&h=300&fit=crop&crop=face",
        department: "Computer Science",
        passoutYear: 2020,
        companies: ["Flipkart", "Zomato", "Swiggy"],
        gender: "Female",
        domain: "E-commerce",
        resume: "https://example.com/resumes/divya-agarwal-resume.pdf"
    },
    {
        name: "Harsh Agrawal",
        email: "harsh.agrawal@gmail.com",
        phone: "3322110099",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
        department: "Artificial Intelligence",
        passoutYear: 2021,
        companies: ["OpenAI", "DeepMind", "Nvidia"],
        gender: "Male",
        domain: "AI Research",
        resume: "https://example.com/resumes/harsh-agrawal-resume.pdf"
    },
    {
        name: "Pooja Mehta",
        email: "pooja.mehta@gmail.com",
        phone: "2211009988",
        image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&crop=face",
        department: "Environmental Engineering",
        passoutYear: 2018,
        companies: ["Greenpeace", "WWF", "TERI"],
        gender: "Female",
        domain: "Environmental Sustainability",
        resume: "https://example.com/resumes/pooja-mehta-resume.pdf"
    },
    {
        name: "Nikhil Jain",
        email: "nikhil.jain@gmail.com",
        phone: "1100998877",
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face",
        department: "Finance",
        passoutYear: 2019,
        companies: ["Goldman Sachs", "Morgan Stanley", "JP Morgan"],
        gender: "Male",
        domain: "Investment Banking",
        resume: "https://example.com/resumes/nikhil-jain-resume.pdf"
    },
    {
        name: "Sakshi Pandey",
        email: "sakshi.pandey@gmail.com",
        phone: "0099887766",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
        department: "Psychology",
        passoutYear: 2020,
        companies: ["BetterHelp", "Headspace", "Calm"],
        gender: "Female",
        domain: "Mental Health",
        resume: "https://example.com/resumes/sakshi-pandey-resume.pdf"
    },
    {
        name: "Rohit Choudhary",
        email: "rohit.choudhary@gmail.com",
        phone: "9988776600",
        image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop&crop=face",
        department: "Petroleum Engineering",
        passoutYear: 2016,
        companies: ["Shell", "ExxonMobil", "BP"],
        gender: "Male",
        domain: "Oil and Gas",
        resume: "https://example.com/resumes/rohit-choudhary-resume.pdf"
    },
    {
        name: "Tanvi Shah",
        email: "tanvi.shah@gmail.com",
        phone: "8877665500",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop&crop=face",
        department: "Marketing",
        passoutYear: 2019,
        companies: ["Ogilvy", "Publicis", "WPP"],
        gender: "Female",
        domain: "Digital Marketing",
        resume: "https://example.com/resumes/tanvi-shah-resume.pdf"
    },
    {
        name: "Deepak Kumar",
        email: "deepak.kumar@gmail.com",
        phone: "7766554400",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face",
        department: "Agricultural Engineering",
        passoutYear: 2017,
        companies: ["Monsanto", "Syngenta", "Bayer"],
        gender: "Male",
        domain: "Agro Technology",
        resume: "https://example.com/resumes/deepak-kumar-resume.pdf"
    },
    {
        name: "Nisha Mishra",
        email: "nisha.mishra@gmail.com",
        phone: "6655443300",
        image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&crop=face",
        department: "Pharmacy",
        passoutYear: 2018,
        companies: ["Pfizer", "Novartis", "Roche"],
        gender: "Female",
        domain: "Drug Development",
        resume: "https://example.com/resumes/nisha-mishra-resume.pdf"
    },
    {
        name: "Varun Gupta",
        email: "varun.gupta@gmail.com",
        phone: "5544332200",
        image: "https://images.unsplash.com/photo-1517070208541-6ddc4d3b8d81?w=300&h=300&fit=crop&crop=face",
        department: "Architecture",
        passoutYear: 2020,
        companies: ["Foster + Partners", "Zaha Hadid", "Gensler"],
        gender: "Male",
        domain: "Sustainable Architecture",
        resume: "https://example.com/resumes/varun-gupta-resume.pdf"
    },
    {
        name: "Ritika Saxena",
        email: "ritika.saxena@gmail.com",
        phone: "4433221199",
        image: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=300&h=300&fit=crop&crop=face",
        department: "Journalism",
        passoutYear: 2021,
        companies: ["BBC", "CNN", "Reuters"],
        gender: "Female",
        domain: "Digital Journalism",
        resume: "https://example.com/resumes/ritika-saxena-resume.pdf"
    },
    {
        name: "Aditya Bhatt",
        email: "aditya.bhatt@gmail.com",
        phone: "3322110088",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        department: "Robotics Engineering",
        passoutYear: 2019,
        companies: ["Boston Dynamics", "iRobot", "ABB Robotics"],
        gender: "Male",
        domain: "Industrial Robotics",
        resume: "https://example.com/resumes/aditya-bhatt-resume.pdf"
    },
    {
        name: "Shreya Sinha",
        email: "shreya.sinha@gmail.com",
        phone: "2211009977",
        image: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=300&fit=crop&crop=face",
        department: "Graphic Design",
        passoutYear: 2020,
        companies: ["Adobe", "Canva", "Figma"],
        gender: "Female",
        domain: "UI/UX Design",
        resume: "https://example.com/resumes/shreya-sinha-resume.pdf"
    },
    {
        name: "Manish Tiwari",
        email: "manish.tiwari@gmail.com",
        phone: "1100998866",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        department: "Mining Engineering",
        passoutYear: 2016,
        companies: ["Coal India", "Vedanta", "Tata Steel"],
        gender: "Male",
        domain: "Mining Operations",
        resume: "https://example.com/resumes/manish-tiwari-resume.pdf"
    },
    {
        name: "Priyanka Yadav",
        email: "priyanka.yadav@gmail.com",
        phone: "0099887755",
        image: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=300&h=300&fit=crop&crop=face",
        department: "Hotel Management",
        passoutYear: 2018,
        companies: ["Marriott", "Hilton", "Taj Hotels"],
        gender: "Female",
        domain: "Hospitality Management",
        resume: "https://example.com/resumes/priyanka-yadav-resume.pdf"
    },
    {
        name: "Abhishek Soni",
        email: "abhishek.soni@gmail.com",
        phone: "9988776644",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
        department: "Marine Engineering",
        passoutYear: 2017,
        companies: ["Shipping Corporation of India", "Maersk", "MSC"],
        gender: "Male",
        domain: "Maritime Operations",
        resume: "https://example.com/resumes/abhishek-soni-resume.pdf"
    },
    {
        name: "Swati Kulkarni",
        email: "swati.kulkarni@gmail.com",
        phone: "8877665533",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
        department: "Fashion Design",
        passoutYear: 2019,
        companies: ["Zara", "H&M", "Myntra"],
        gender: "Female",
        domain: "Fashion Technology",
        resume: "https://example.com/resumes/swati-kulkarni-resume.pdf"
    },
    {
        name: "Gaurav Pandey",
        email: "gaurav.pandey@gmail.com",
        phone: "7766554422",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
        department: "Cybersecurity",
        passoutYear: 2020,
        companies: ["CrowdStrike", "Palo Alto Networks", "Symantec"],
        gender: "Male",
        domain: "Information Security",
        resume: "https://example.com/resumes/gaurav-pandey-resume.pdf"
    },
    {
        name: "Anjali Dixit",
        email: "anjali.dixit@gmail.com",
        phone: "6655443311",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
        department: "Interior Design",
        passoutYear: 2021,
        companies: ["IKEA", "Godrej Interio", "Pepperfry"],
        gender: "Female",
        domain: "Space Planning",
        resume: "https://example.com/resumes/anjali-dixit-resume.pdf"
    }
];

// Function to add dummy data to database
async function addDummyData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(DATABASE_URL);
        console.log("Connected to MongoDB successfully!");
        
        // Clear existing data (optional)
        await Mentor.deleteMany({});
        console.log("Cleared existing mentor data");
        
        // Insert dummy data
        const insertedMentors = await Mentor.insertMany(mentorDummyData);
        console.log(`Successfully inserted ${insertedMentors.length} mentors`);
        
        // Display inserted data
        console.log("\nInserted Mentors:");
        insertedMentors.forEach((mentor, index) => {
            console.log(`${index + 1}. ${mentor.name} - ${mentor.department} (${mentor.passoutYear}) - Domain: ${mentor.domain}`);
        });
        
    } catch (error) {
        console.error("Error inserting dummy data:", error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
    }
}

// Run the script
addDummyData();