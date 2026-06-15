import Product, { IProduct } from '@/models/Product';
import connectToDatabase from '@/lib/db';
import cache from '@/lib/redis';

export interface ISearchFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  status?: string;
  productType?: string;
}

export class ProductService {
  /**
   * Performs advanced search, filtering, and sorting of catalog products.
   * Leverages caching to optimize repeat query latency.
   */
  static async searchProducts(
    query?: string,
    filters: ISearchFilters = {},
    sortBy = 'newest',
    limit = 12,
    page = 1
  ): Promise<{ products: IProduct[]; total: number; pages: number }> {
    await connectToDatabase();

    const cacheKey = `search:${JSON.stringify({ query, filters, sortBy, limit, page })}`;
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const dbQuery: any = { status: 'active' };

    // Text Search Query
    if (query) {
      dbQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ];
    }

    // Faceted Filters
    if (filters.category) {
      dbQuery.category = filters.category;
    }
    if (filters.subcategory) {
      dbQuery.subcategory = filters.subcategory;
    }
    if (filters.brand) {
      dbQuery.brand = filters.brand;
    }
    if (filters.productType) {
      dbQuery.productType = filters.productType;
    }

    // Price Filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      dbQuery.price = {};
      if (filters.minPrice !== undefined) dbQuery.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) dbQuery.price.$lte = filters.maxPrice;
    }

    // Rating Filter
    if (filters.rating !== undefined) {
      dbQuery.rating = { $gte: filters.rating };
    }

    // Sort Logic
    let sortOptions: any = {};
    switch (sortBy) {
      case 'popularity':
        sortOptions = { rating: -1, stock: -1 };
        break;
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(dbQuery).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(dbQuery),
    ]);

    const result = {
      products: products as unknown as IProduct[],
      total,
      pages: Math.ceil(total / limit),
    };

    // Cache the result for 5 minutes (300 seconds)
    await cache.set(cacheKey, result, 300);

    return result;
  }

  /**
   * Recommends items frequently bought together or related by metadata.
   */
  static async getRelatedProducts(productId: string, limit = 4): Promise<IProduct[]> {
    await connectToDatabase();
    
    const product = await Product.findById(productId).lean();
    if (!product) return [];

    // Fetch products in the same category or brand, excluding current product
    const related = await Product.find({
      _id: { $ne: productId },
      status: 'active',
      $or: [{ category: product.category }, { brand: product.brand }],
    })
      .limit(limit)
      .lean();

    return related as unknown as IProduct[];
  }

  /**
   * AI personalization simulator. Recommends items based on user traits.
   */
  static async getPersonalizedRecommendations(userId?: string, limit = 4): Promise<IProduct[]> {
    await connectToDatabase();

    // In a fully-fledged setup, this reads user purchase history, views logs, and runs matrix factorization.
    // For this upgrade, we query highly rated featured products, falling back to new arrivals.
    const recommendations = await Product.find({
      status: 'active',
      isFeatured: true,
    })
      .sort({ rating: -1 })
      .limit(limit)
      .lean();

    if (recommendations.length > 0) {
      return recommendations as unknown as IProduct[];
    }

    // Fallback
    const fallback = await Product.find({ status: 'active' }).sort({ createdAt: -1 }).limit(limit).lean();
    return fallback as unknown as IProduct[];
  }
}
