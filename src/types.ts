export type CategoryId = 'all' | 'restaurants' | 'hotels' | 'hospitals' | 'atms' | 'attractions';

export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';

export interface Review {
  id: string;
  author: string;
  avatarText: string;
  avatarColor: string;
  rating: number;
  timeAgo: string;
  comment: string;
  helpfulCount?: number;
}

export interface Place {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  cuisine?: string;
  price?: PriceLevel;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  walkTimeMin: number;
  driveTimeMin: number;
  address: string;
  area: string;
  openHours: string;
  closingTime?: string;
  isOpen: boolean;
  phone: string;
  website: string;
  imageUrl: string;
  mapCoordinates: {
    lat: number;
    lng: number;
    xPercent: number; // percentage coordinate on vector map (0 - 100)
    yPercent: number; // percentage coordinate on vector map (0 - 100)
  };
  tags: string[];
  description: string;
  reviews: Review[];
  features?: string[];
}

export type ActiveTab = 'home' | 'map' | 'search' | 'profile';
