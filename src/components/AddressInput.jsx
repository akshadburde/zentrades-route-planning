import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useState, useMemo } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import {
  AdvancedMarker,
  APIProvider,
  Map as Map_,
  Pin,
} from "@vis.gl/react-google-maps";
import Directions from "./Directions";

export default function AddressInput() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDRvcUu4sMMpSN3kAJvIJpbiOkAWQZMRUM",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 18.51, lng: 73.85 }), []);
  const [selected, setSelected] = useState(null);
  const [jobLocations, setSelectedList] = useState(null);
  const [technicianLocation, setTechnicianLocation] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  return (
    <div id="address-input-container">
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>
      <APIProvider apiKey="AIzaSyDRvcUu4sMMpSN3kAJvIJpbiOkAWQZMRUM">
        <div id="content">
          <div id="map-container" className="content-item">
            <Map_
              mapId={"24337fac4c314362"}
              defaultZoom={15}
              defaultCenter={center}
            >
              {/*{selected && <AdvancedMarker position={selected}>*/}
              {/*  <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"}/>*/}
              {/*</AdvancedMarker>}*/}
              {jobLocations &&
                !showDirections &&
                jobLocations.map((item, index) => (
                  <AdvancedMarker
                    key={index}
                    position={item.position}
                  ></AdvancedMarker>
                ))}
              {technicianLocation && !showDirections && (
                <AdvancedMarker position={technicianLocation.position}>
                  <Pin
                    background={"dodgerblue"}
                    borderColor={"blue"}
                    glyphColor={"blue"}
                  />
                </AdvancedMarker>
              )}
              {jobLocations && technicianLocation && showDirections && (
                <>
                  <Directions
                    origin={technicianLocation.address}
                    destination={jobLocations[jobLocations.length - 1].address}
                    jobLocations={jobLocations}
                  />
                  {/* <Directions
                      origin={jobLocations[0].address}
                      destination={jobLocations[1].address}
                    />
                    <Directions
                      origin={jobLocations[1].address}
                      destination={jobLocations[2].address}
                    /> */}
                </>
              )}
            </Map_>
          </div>
          <div id="details" className="content-item">
            <div id="job-locations-container">
              <h1 style={{ fontSize: 20 }}>
                Job locations:{" "}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    let newJobLocations = [];
                    if (jobLocations === null) newJobLocations = [selected];
                    else newJobLocations = [...jobLocations, selected];
                    setSelectedList(newJobLocations);
                  }}
                >
                  Add
                </button>
              </h1>
              <div class="list-group" style={{ minHeight: 200 }}>
                {jobLocations &&
                  jobLocations.map((item, index) => {
                    return (
                      <a
                        href="#"
                        class="list-group-item list-group-item-action"
                        aria-current="true"
                      >
                        {item.address}
                      </a>
                    );
                  })}
              </div>
            </div>
            <div className="technician-location-container">
              <h1 style={{ fontSize: 20, marginTop: 20 }}>
                Technician Location:{" "}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setTechnicianLocation(selected);
                  }}
                >
                  Add
                </button>
              </h1>
              <div class="list-group">
                {technicianLocation && (
                  <a
                    href="#"
                    class="list-group-item list-group-item-action"
                    aria-current="true"
                  >
                    {technicianLocation.address}
                  </a>
                )}
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowDirections(!showDirections)}
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </APIProvider>
    </div>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ address, position: { lat, lng } });
    // let newSelectedList = [];
    // if (selectedList === null)
    //   newSelectedList = [{ address, position: { lat, lng } }];
    // else
    //   newSelectedList = [...selectedList, { address, position: { lat, lng } }];
    // setSelectedList(newSelectedList);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search for address"
          style={{ color: "#000", width: 500, fontFamily: "Barlow" }}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      {/* <div id="btn-container">
        <div>
          <button className="btn btn-primary">Job</button>
        </div>
        <div>
          <button className="btn btn-primary">Technician</button>
        </div>
      </div> */}
    </div>
  );
};
