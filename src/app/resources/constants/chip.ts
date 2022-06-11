export interface Chip {
  backgroundColor: string;
  iconName: string;
  iconColor: string;
  label: string;
  value: string;
  selected: boolean;
}

export const CHIPS: readonly Chip[] = [
  {
    backgroundColor: '#0099cc',
    iconName: 'home-outline',
    iconColor: 'white',
    label: 'Casa',
    value: 'home',
    selected: false
  },
  {
    backgroundColor: '#930101',
    iconName: 'wallet-outline',
    iconColor: 'white',
    label: 'Contas',
    value: 'debts',
    selected: false
  },
  {
    backgroundColor: '#9933cc',
    iconName: 'book-outline',
    iconColor: 'white',
    label: 'Educação',
    value: 'education',
    selected: false
  },
  {
    backgroundColor: '#ffbd21',
    iconName: 'desktop-outline',
    iconColor: 'white',
    label: 'Eletrônicos',
    value: 'eletronics',
    selected: false
  },
  {
    backgroundColor: '#8ad5f0',
    iconName: 'game-controller-outline',
    iconColor: 'white',
    label: 'Jogos',
    value: 'games',
    selected: false
  },
  {
    backgroundColor: '#004e09',
    iconName: 'umbrella-outline',
    iconColor: 'white',
    label: 'Lazer',
    value: 'leisure',
    selected: false
  },
  {
    backgroundColor: '#439996',
    iconName: 'paw-outline',
    iconColor: 'white',
    label: 'Pets',
    value: 'pets',
    selected: false
  },
  {
    backgroundColor: '#ff9494',
    iconName: 'gift-outline',
    iconColor: 'white',
    label: 'Presentes',
    value: 'gifts',
    selected: false
  },
  {
    backgroundColor: '#cc0000',
    iconName: 'restaurant-outline',
    iconColor: 'white',
    label: 'Restaurantes',
    value: 'restaurant',
    selected: false
  },
  {
    backgroundColor: '#669900',
    iconName: 'medkit-outline',
    iconColor: 'white',
    label: 'Saúde',
    value: 'health',
    selected: false
  },
  {
    backgroundColor: '#f44',
    iconName: 'storefront-outline',
    iconColor: 'white',
    label: 'Supermercado',
    value: 'store',
    selected: false
  },
  {
    backgroundColor: '#2a23ff',
    iconName: 'car-outline',
    iconColor: 'white',
    label: 'Transporte',
    value: 'transport',
    selected: false
  },
  {
    backgroundColor: '#a5119f',
    iconName: 'shirt-outline',
    iconColor: 'white',
    label: 'Vestuário',
    value: 'clothing',
    selected: false
  },
  {
    backgroundColor: '#2cb1e1',
    iconName: 'airplane-outline',
    iconColor: 'white',
    label: 'Viagem',
    value: 'trip',
    selected: false
  }
] as const;
