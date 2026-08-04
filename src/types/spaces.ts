export type SpaceType =
  | 'Master Bedroom'
  | "Children's Bedroom"
  | 'Guest Bedroom'
  | 'Kitchen'
  | 'Hall / Living'
  | 'Dining'
  | 'Bathroom'
  | 'Office'
  | 'Balcony'
  | 'Utility'
  | 'Exterior'
  | 'Others';

export interface QuotationSpace {
  id: string;
  quotationId?: string;
  spaceType: SpaceType;
  spaceName: string;
  displayOrder: number;
  isCollapsed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const SPACE_TYPES: SpaceType[] = [
  'Master Bedroom',
  "Children's Bedroom",
  'Guest Bedroom',
  'Kitchen',
  'Hall / Living',
  'Dining',
  'Bathroom',
  'Office',
  'Balcony',
  'Utility',
  'Exterior',
  'Others',
];

export const SPACE_TYPE_NAME_PRESETS: Record<SpaceType, string[]> = {
  'Master Bedroom': ['Master Bedroom', 'Master Suite'],
  "Children's Bedroom": ["Children's Bedroom", 'Kids Bedroom', 'Playroom'],
  'Guest Bedroom': ['Guest Bedroom', 'Parents Bedroom'],
  Kitchen: ['Kitchen', 'Dry Kitchen', 'Wet Kitchen'],
  'Hall / Living': ['Hall', 'Living Room', 'Home Theatre', 'Family Lounge'],
  Dining: ['Dining Room', 'Breakfast Nook'],
  Bathroom: ['Master Bathroom', 'Guest Bathroom', 'Powder Room'],
  Office: ['Office Cabin', 'CEO Cabin', 'Meeting Room', 'Reception', 'Study Room', 'Conference Room'],
  Balcony: ['Main Balcony', 'Bedroom Balcony', 'Terrace Garden'],
  Utility: ['Laundry Room', 'Storage Room', 'Pooja / Temple Room'],
  Exterior: ['Foyer / Entrance', 'Porch', 'Patio'],
  Others: ['Temple Room', 'Custom Space'],
};

export const DEFAULT_GENERAL_SPACE: QuotationSpace = {
  id: 'space_general',
  spaceType: 'Others',
  spaceName: 'General',
  displayOrder: 0,
};
