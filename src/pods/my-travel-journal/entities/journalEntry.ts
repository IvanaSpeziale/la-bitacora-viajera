import { Location } from "./location";

export class JournalEntry {
  id: string;
  locations: Location[];
  date: string;
  description: string;
  dailyExpenses: number;
  favorite: string;
  leastFavorite: string;
  score: number;
  imageUrls: string[];

  constructor(
    id: string,
    locations: Location[],
    date: string,
    description: string,
    dailyExpenses: number,
    favorite: string,
    leastFavorite: string,
    score: number,
    imageUrls: string[]
  ) {
    this.id = id;
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
