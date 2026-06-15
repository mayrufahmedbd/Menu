export interface IShippingProvider {
  id: string;
  name: string;
  baseCost: number;
  perKgCost: number;
  estimatedDays: string;
}

export const SHIPPING_PROVIDERS: IShippingProvider[] = [
  { id: 'pathao', name: 'Pathao Delivery', baseCost: 60, perKgCost: 15, estimatedDays: '1-2 Days' },
  { id: 'steadfast', name: 'SteadFast Courier', baseCost: 55, perKgCost: 20, estimatedDays: '2-3 Days' },
  { id: 'redx', name: 'RedX Logistics', baseCost: 65, perKgCost: 10, estimatedDays: '2-4 Days' },
  { id: 'paperfly', name: 'Paperfly Private', baseCost: 50, perKgCost: 18, estimatedDays: '3-5 Days' },
  { id: 'sundarban', name: 'Sundarban Courier Service', baseCost: 100, perKgCost: 25, estimatedDays: '2-3 Days' },
];

export class ShippingService {
  /**
   * Calculates real-time shipping cost based on the courier, weight, and destination.
   */
  static calculateShippingCost(providerId: string, weightInKg = 1, destinationCity = 'Dhaka'): number {
    const provider = SHIPPING_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) return 60; // default cost

    let cost = provider.baseCost + (weightInKg - 1) * provider.perKgCost;
    if (cost < provider.baseCost) cost = provider.baseCost;

    // Adjust rate for outside Dhaka deliveries
    if (destinationCity.toLowerCase() !== 'dhaka') {
      cost += 40; // Outside Dhaka delivery surcharge
    }

    return Math.round(cost);
  }

  /**
   * Generates a mock tracking number and yields progress tracking timelines.
   */
  static getTrackingTimeline(trackingNumber: string) {
    // Generate static mockup logs depending on tracking code numbers
    return [
      { status: 'Order Packed', notes: 'Parcel packed and labelled at warehouse.', date: '2026-06-12 10:00' },
      { status: 'Picked Up', notes: 'Courier agent has picked up the package.', date: '2026-06-12 14:30' },
      { status: 'In Transit', notes: 'Dispatched to target sorting center.', date: '2026-06-13 03:00' },
      { status: 'Out for Delivery', notes: 'Courier agent is currently delivering the items.', date: '2026-06-13 09:15' },
    ];
  }
}
