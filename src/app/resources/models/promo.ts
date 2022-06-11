import { PromoStatus } from '@enums/promo-status';
import { Timestamp } from 'firebase/firestore';
import { Chip } from '../constants/chip';

export interface Promo {
  uid?: string;
  address?: string;
  category?: Chip;
  createdAt?: Timestamp;
  createdBy?: string;
  observation?: string;
  photo: string;
  price?: number;
  product?: string;
  status?: PromoStatus;
  store?: string;
}
