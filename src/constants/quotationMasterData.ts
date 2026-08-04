import { LucideIcon } from 'lucide-react';

export interface CategoryOption {
  id: string;
  name: string;
  iconName: string;
  description?: string;
  isCustom?: boolean;
}

export interface ItemTypeOption {
  id: string;
  name: string;
  isCustom?: boolean;
}

// Configurable Category Options (Enterprise V3 & Space Hierarchy)
export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'master_bedroom', name: 'Master Bedroom', iconName: 'Bed', description: 'Master Wardrobes, Beds, Lofts & Dressers' },
  { id: 'children_bedroom', name: "Children's Bedroom", iconName: 'Bed', description: 'Kids Wardrobes, Study Desks & Storage' },
  { id: 'guest_bedroom', name: 'Guest Bedroom', iconName: 'Bed', description: 'Guest Wardrobes, Beds & Lofts' },
  { id: 'kitchen', name: 'Kitchen', iconName: 'Utensils', description: 'Modular Kitchen, Cabinets & Countertops' },
  { id: 'hall', name: 'Hall / Living', iconName: 'Tv', description: 'TV Units, Wall Panelling, Partition & Seating' },
  { id: 'dining', name: 'Dining', iconName: 'Coffee', description: 'Crockery Units, Dining Tables & Bar Counters' },
  { id: 'office', name: 'Office', iconName: 'Briefcase', description: 'Study Tables, Cabinets & Office Storage' },
  { id: 'bathroom', name: 'Bathroom', iconName: 'Bath', description: 'Vanity Units & Mirrors' },
  { id: 'utility', name: 'Utility', iconName: 'Wrench', description: 'Storage Racks & Utility Cabinets' },
  { id: 'exterior', name: 'Exterior', iconName: 'Sun', description: 'Balcony Panelling & Outdoor Furniture' },
  { id: 'others', name: 'Others', iconName: 'PlusCircle', isCustom: true, description: 'Custom Category (e.g. Temple, Balcony, CEO Cabin)' },
];

// Configurable Item Types Options (Enterprise V3)
export const DEFAULT_ITEM_TYPES: ItemTypeOption[] = [
  { id: 'box-work', name: 'Box Work' },
  { id: 'frame-work', name: 'Frame Work' },
  { id: 'wall-panel', name: 'Wall Panel' },
  { id: 'tv-unit', name: 'TV Unit' },
  { id: 'wardrobe', name: 'Wardrobe' },
  { id: 'countertop', name: 'Countertop' },
  { id: 'ceiling', name: 'Ceiling' },
  { id: 'loft', name: 'Loft' },
  { id: 'partition', name: 'Partition' },
  { id: 'door', name: 'Door' },
  { id: 'window', name: 'Window' },
  { id: 'shelves', name: 'Shelves' },
  { id: 'storage', name: 'Storage' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'hardware', name: 'Hardware' },
  { id: 'other-item', name: 'Other Item', isCustom: true },
];

// Suggested Custom Category Examples
export const CUSTOM_CATEGORY_EXAMPLES = [
  'Temple Room',
  'Main Balcony',
  'Parents Bedroom',
  'Study Room',
  'CEO Cabin',
  'Reception Area',
  'False Ceiling',
  'Dry Kitchen',
];

// Suggested Custom Item Type Examples
export const CUSTOM_ITEM_TYPE_EXAMPLES = [
  'Mirror Frame',
  'Shoe Rack',
  'Mandir',
  'Island Counter',
  'Bar Counter',
  'Study Table',
  'Pooja Unit',
];
