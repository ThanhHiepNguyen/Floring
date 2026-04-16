import { Metadata } from 'next';
import FavoritesClient from './FavoritesClient';

export const metadata: Metadata = {
  title: 'Favorites | Floring',
  description: 'Favorite products list.',
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}

