import { PromoStatus } from '@enums/promo-status';
import { Timestamp } from 'firebase/firestore';
import { Comment } from './comment';

export interface Promo {
  uid?: string;
  address?: string;
  category?: string;
  createdAt?: Timestamp;
  createdBy?: string;
  liked?: boolean;
  likes?: number;
  observation?: string;
  photo: string;
  price?: number;
  product?: string;
  status?: PromoStatus;
  store?: string;
  comments?: Comment[];
}
