import React from "react";
import {useState} from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function RenderMap() {
  const position = {lat: 18.51, lng: 73.85};
  return (
    <APIProvider apiKey="AIzaSyDRvcUu4sMMpSN3kAJvIJpbiOkAWQZMRUM">
      <div id="map-container">
        <Map zoom={15} center={position} mapId={"24337fac4c314362"}>
          <AdvancedMarker position={position}>
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}
