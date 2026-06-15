import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { CategoryGrid } from "@/components/categories/CategoryGrid";

export default async function CategoriesPage() {
  await dbConnect();

  // Aggregate product counts by category
  const aggregation = await Product.aggregate([
    { $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } }
  ]);

  // Convert array to Record<string, number> mapping category name to count
  const counts: Record<string, number> = {};
  for (const item of aggregation) {
    if (item._id) {
      counts[item._id] = item.count;
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Shop by Category</h1>
        <p className="text-muted-foreground text-lg">
          Browse our extensive collection of tech gear, neatly organized to help you find exactly what you need.
        </p>
      </div>

      <CategoryGrid counts={counts} />
    </div>
  );
}
