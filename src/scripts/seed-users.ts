import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

// User Schema Definition (duplicating here for standalone script without Next.js aliases)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['customer', 'vendor', 'admin', 'superadmin'], default: 'customer' },
    walletBalance: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    referralCode: { type: String, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    twoFAEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const testUsers = [
  {
    name: "Super Admin User",
    email: "superadmin@ecom.com",
    role: "superadmin",
    walletBalance: 0,
    rewardPoints: 1000,
    referralCode: "SUPER100",
  },
  {
    name: "Admin User",
    email: "admin@ecom.com",
    role: "admin",
    walletBalance: 0,
    rewardPoints: 500,
    referralCode: "ADMIN50",
  },
  {
    name: "Vendor Seller",
    email: "vendor@ecom.com",
    role: "vendor",
    walletBalance: 1250,
    rewardPoints: 100,
    referralCode: "VENDOR20",
  },
  {
    name: "Customer User",
    email: "customer@ecom.com",
    role: "customer",
    walletBalance: 5000,
    rewardPoints: 200,
    referralCode: "CUST500",
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing users from the seeded emails
    const emails = testUsers.map(u => u.email);
    await User.deleteMany({ email: { $in: emails } });
    console.log("Cleared existing test users");

    // Hash password "admin123"
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insert new users
    const usersWithPasswords = testUsers.map(user => ({
      ...user,
      password: hashedPassword,
    }));

    await User.insertMany(usersWithPasswords);
    console.log("Successfully seeded test users:");
    testUsers.forEach(u => console.log(` - ${u.name} (${u.email}) [Role: ${u.role}]`));

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
