import { Location } from "../entities/location";

export class JournalEntryDTO {
  id?: string;
  locations: Location[];
  date: string;
  description: string;
  dailyExpenses: number;
  favorite: string;
  leastFavorite: string;
  score: number;
  imageUrls: File[]; // Cambiado de 'images' a 'imageUrls'

  constructor(
    locations: Location[],
    date: string,
    description: string,
    dailyExpenses: number,
    favorite: string,
    leastFavorite: string,
    score: number,
    imageUrls: File[] = []
  ) {
    this.locations = locations;
    this.date = date;
    this.description = description;
    this.dailyExpenses = dailyExpenses;
    this.favorite = favorite;
    this.leastFavorite = leastFavorite;
    this.score = score;
    this.imageUrls = imageUrls;
  }
}
