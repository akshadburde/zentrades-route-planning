import React, { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { distance } from "../utils/getDistance";

export default function Directions({ origin, destination, jobLocations }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionService, setDirectionService] = useState();
  const [directionRenderer, setDirectionRenderer] = useState();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionService(new routesLibrary.DirectionsService());
    setDirectionRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionService || !directionRenderer) return;

    const allJobLocations = [...jobLocations];
    let currentOrigin = origin;
    let routesCount = 0;
    let minIndex, minDistance;

    const finalArray = [];

    while (routesCount !== jobLocations.length) {
      minIndex = -1;
      minDistance = 100000000;
      finalArray.push(currentOrigin);

      for (let i = 0; i < allJobLocations.length; i++) {
        if (allJobLocations[i] == 1) continue;

        const dist = distance(
          currentOrigin.position.lat,
          allJobLocations[i].position.lat,
          currentOrigin.position.lng,
          allJobLocations[i].position.lng
        );

        if (dist < minDistance) {
          minDistance = dist;
          minIndex = i;
        }
      }

      currentOrigin = jobLocations[minIndex];
      allJobLocations[minIndex] = 1;
      routesCount++;
    }

    finalArray.push(currentOrigin);

    let waypoints = [];
    for (let i = 1; i < finalArray.length - 1; i++) {
      waypoints.push({
        location: finalArray[i].address,
        stopover: true,
      });
    }
    directionService
      .route({
        origin: origin.address,
        destination: finalArray[finalArray.length - 1].address,
        waypoints,
        travelMode: "DRIVING",
      })
      .then((response) => directionRenderer.setDirections(response));
  }, [directionService, directionRenderer]);

  return <div>Directions</div>;
}
