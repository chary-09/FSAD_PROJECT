export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse';
export type LoyaltyTier = 'None' | 'Silver' | 'Gold' | 'Platinum';

export interface Room {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  status: RoomStatus;
  capacity: number;
  amenities?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  loyaltyProgramMember: boolean;
  loyaltyTier: LoyaltyTier;
  previousStays: number;
  preferences?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Reservation {
  id: string;
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';
  specialRequests?: string;
  staffNotes?: string;
  createdAt?: any;
  updatedAt?: any;
}