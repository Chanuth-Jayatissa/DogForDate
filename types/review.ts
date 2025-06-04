export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewedId: string; // can be dog ID, owner ID, or renter ID
  reviewedType: 'Dog' | 'Owner' | 'Renter';
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date string
}