import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Product Schema Definition (duplicating here for standalone script without Next.js aliases)
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

const products = [
  {
    title: "MacBook Pro 16-inch (M3 Max)",
    slug: "macbook-pro-16-m3-max",
    description: "The ultimate pro laptop with the incredibly advanced M3 Max chip. Features a stunning Liquid Retina XDR display and up to 22 hours of battery life.",
    price: 3499.00,
    category: "Laptops",
    brand: "Apple",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
    rating: 4.9
  },
  {
    title: "Dell XPS 15",
    slug: "dell-xps-15",
    description: "A perfect balance of power and portability. 15.6-inch OLED InfinityEdge display, Intel Core i9, and NVIDIA RTX 4070.",
    price: 2499.00,
    discountPrice: 2299.00,
    category: "Laptops",
    brand: "Dell",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"],
    rating: 4.7
  },
  {
    title: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    description: "Forged in titanium. Features the A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.",
    price: 1199.00,
    category: "Smartphones",
    brand: "Apple",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity and productivity.",
    price: 1299.00,
    category: "Smartphones",
    brand: "Samsung",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading noise cancellation. Two processors control 8 microphones for unprecedented noise cancellation.",
    price: 398.00,
    discountPrice: 348.00,
    category: "Audio",
    brand: "Sony",
    stock: 120,
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "AirPods Pro (2nd generation)",
    slug: "airpods-pro-2",
    description: "Up to 2x more Active Noise Cancellation than the previous generation. Spatial Audio takes immersion to a remarkably personal level.",
    price: 249.00,
    category: "Audio",
    brand: "Apple",
    stock: 200,
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80"],
    rating: 4.9
  },
  {
    title: "LG UltraGear 27-inch Gaming Monitor",
    slug: "lg-ultragear-27",
    description: "27-inch QHD (2560x1440) OLED Gaming Monitor with 240Hz refresh rate and 0.03ms response time.",
    price: 999.00,
    discountPrice: 899.00,
    category: "Monitors",
    brand: "LG",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"],
    rating: 4.7
  },
  {
    title: "Keychron Q1 Pro Mechanical Keyboard",
    slug: "keychron-q1-pro",
    description: "A fully customizable 75% layout mechanical keyboard with QMK/VIA support, double-gasket design, and wireless capabilities.",
    price: 199.00,
    category: "Accessories",
    brand: "Keychron",
    stock: 65,
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "Logitech MX Master 3S Mouse",
    slug: "logitech-mx-master-3s",
    description: "Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI sensor.",
    price: 99.00,
    category: "Accessories",
    brand: "Logitech",
    stock: 150,
    images: ["https://images.unsplash.com/photo-1527814050087-379381547969?w=800&q=80"],
    rating: 4.9
  },
  {
    title: "iPad Pro 12.9-inch (M2)",
    slug: "ipad-pro-12-9-m2",
    description: "The ultimate iPad experience. Now with breakthrough M2 performance, a breathtaking XDR display, and superfast wireless connectivity.",
    price: 1099.00,
    category: "Tablets",
    brand: "Apple",
    stock: 45,
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "Samsung Galaxy Tab S9 Ultra",
    slug: "samsung-galaxy-tab-s9-ultra",
    description: "Crystal-clear viewing with a massive 14.6-inch Dynamic AMOLED 2X display. IP68 water and dust resistance.",
    price: 1199.00,
    category: "Tablets",
    brand: "Samsung",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80"],
    rating: 4.7
  },
  {
    title: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    description: "A brighter display, faster S9 SiP, and a magical new way to use your watch without touching the screen.",
    price: 399.00,
    category: "Wearables",
    brand: "Apple",
    stock: 80,
    images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "Garmin Fenix 7X Sapphire Solar",
    slug: "garmin-fenix-7x",
    description: "Ultimate multisport GPS watch with a scratch-resistant Power Sapphire solar charging lens and built-in LED flashlight.",
    price: 899.00,
    discountPrice: 799.00,
    category: "Wearables",
    brand: "Garmin",
    stock: 35,
    images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"],
    rating: 4.9
  },
  {
    title: "Nintendo Switch OLED Model",
    slug: "nintendo-switch-oled",
    description: "Play at home or on the go with a vibrant 7-inch OLED screen, a wide adjustable stand, and a dock with a wired LAN port.",
    price: 349.00,
    category: "Gaming",
    brand: "Nintendo",
    stock: 100,
    images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "PlayStation 5 Console",
    slug: "playstation-5",
    description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback.",
    price: 499.00,
    category: "Gaming",
    brand: "Sony",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"],
    rating: 4.9
  },
  {
    title: "Xbox Series X",
    slug: "xbox-series-x",
    description: "The fastest, most powerful Xbox ever. Explore rich new worlds with 12 teraflops of raw graphic processing power.",
    price: 499.00,
    category: "Gaming",
    brand: "Microsoft",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "Bose QuietComfort Ultra Earbuds",
    slug: "bose-qc-ultra-earbuds",
    description: "World-class noise cancellation, customized sound, and unparalleled comfort. Now with spatial audio.",
    price: 299.00,
    category: "Audio",
    brand: "Bose",
    stock: 75,
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"],
    rating: 4.7
  },
  {
    title: "Asus ROG Swift 360Hz Gaming Monitor",
    slug: "asus-rog-swift-360hz",
    description: "27-inch 1440p gaming monitor with an ultrafast 360Hz refresh rate designed for professional esports gamers.",
    price: 1049.00,
    category: "Monitors",
    brand: "Asus",
    stock: 12,
    images: ["https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=800&q=80"],
    rating: 4.6
  },
  {
    title: "Razer DeathAdder V3 Pro",
    slug: "razer-deathadder-v3-pro",
    description: "Ultra-lightweight wireless ergonomic esports mouse featuring the Razer Focus Pro 30K Optical Sensor.",
    price: 149.00,
    discountPrice: 129.00,
    category: "Accessories",
    brand: "Razer",
    stock: 90,
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?w=800&q=80"],
    rating: 4.8
  },
  {
    title: "GoPro HERO12 Black",
    slug: "gopro-hero12-black",
    description: "Incredible image quality, even better HyperSmooth video stabilization, and a huge boost in battery life.",
    price: 399.00,
    category: "Cameras",
    brand: "GoPro",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"],
    rating: 4.7
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    await Product.insertMany(products);
    console.log("Successfully seeded 20 demo products");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
