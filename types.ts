
export enum PostType {
  OFFER = 'OFFER',
  REQUEST = 'REQUEST'
}

export enum Category {
  HANDYMAN = 'Handyman',
  LANDSCAPING = 'Landscaping',
  CLEANING = 'Cleaning',
  CONSTRUCTION = 'Construction',
  TECH_HELP = 'Tech Help',
  TRANSPORT = 'Transport',
  FOR_SALE = 'For Sale',
  ELDERLY_CARE = 'Elderly Care',
  PET_CARE = 'Pet Care',
  FOOD_AND_BAKED_GOODS = 'Food & Baked Goods',
  OTHER = 'Other'
}

export interface Post {
  id: string;
  type: PostType;
  category: Category;
  title: string;
  description: string;
  contact: string;
  location: string;
  createdAt: number;
  expiresAt: number;
}

export interface GeminiRefinedPost {
  title: string;
  description: string;
  category: Category;
}
