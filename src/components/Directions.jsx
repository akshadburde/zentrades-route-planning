import React, { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

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
    let waypoints = [];
    for (let i = 0; i < jobLocations.length - 1; i++) {
      waypoints.push({
        location: jobLocations[i].address,
        stopover: true,
      });
    }
    directionService
      .route({
        origin,
        destination,
        waypoints,
        travelMode: "DRIVING",
      })
      .then((response) => directionRenderer.setDirections(response));
  }, [directionService, directionRenderer]);

  return <div>Directions</div>;
}
