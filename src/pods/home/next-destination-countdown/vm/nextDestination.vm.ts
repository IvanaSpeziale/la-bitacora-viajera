import { NextDestinationDTO } from "../DTOs/nextDestinationDTO";
import { NextDestination } from "../entities/nextDestination";

export interface NextDestinationContextType {
  nextDestinations: NextDestination[];
  nextDestination: NextDestination | null;
  fetchNextDestinations: () => Promise<NextDestination[] | null>;
  fetchNextDestinationById: (id: string) => Promise<NextDestination | null>;
  addNextDestination: (destination: NextDestinationDTO) => Promise<void>;
  editNextDestination: (
    id: string,
    destination: NextDestinationDTO
  ) => Promise<void>;
  removeNextDestination: (id: string) => Promise<void>;
  // fetchTrendingActivities: (destinationName: string) => Promise<string[]>;
  // trendingActivities: string[];
}
