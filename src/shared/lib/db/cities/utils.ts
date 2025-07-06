import { TCity } from './types';

export async function readAllCities(): Promise<TCity[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}/db/cities.json`);
  return await response.json();
}
