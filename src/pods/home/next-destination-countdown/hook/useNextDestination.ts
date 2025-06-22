import { useContext } from "react";
import { NextDestinationContext } from "../nextDestination.provider";

export const useNextDestination = () => {
  const context = useContext(NextDestinationContext);

  if (!context) {
    throw new Error(
      "useNextDestination must be used within a NextDestinationProvider"
    );
  }

  return context;
};
