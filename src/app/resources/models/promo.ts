import { Comment } from './comment';

export interface Promo {
  uid: string;
  product?: string;
  store?: string;
  price?: number;
  address?: string;
  category?: string;
  likes?: number;
  observation?: string;
  createdAt?: string;
  createdBy?: string;
  active?: boolean;
  comments?: Comment[];
}
