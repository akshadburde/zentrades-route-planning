import React from "react";
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";
import {useState, useMemo} from "react";
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
import {AdvancedMarker, APIProvider, Map as Map_, Pin} from "@vis.gl/react-google-maps";

export default function AddressInput() {
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: "AIzaSyDRvcUu4sMMpSN3kAJvIJpbiOkAWQZMRUM",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map/>;
}

function Map() {
  const center = useMemo(() => ({lat: 18.51, lng: 73.85}), []);
  const [selected, setSelected] = useState(null);

  return (
    <>
    <div className="places-container">
      <PlacesAutocomplete selected={selected} setSelected={setSelected}/>
    </div>
    <div style={{height: "100vh"}}>
      <GoogleMap zoom={10} center={center} mapContainerClassName={"map-container"}>
        {selected && <Marker position={selected}/>}
      </GoogleMap>
    </div>
    {/*<APIProvider apiKey="AIzaSyDRvcUu4sMMpSN3kAJvIJpbiOkAWQZMRUM">*/}
    {/*  <div id="map-container">*/}
    {/*    <Map_ zoom={15} center={center}>*/}
    {/*      {selected && <AdvancedMarker position={center}>*/}
    {/*        <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"}/>*/}
    {/*      </AdvancedMarker>}*/}
    {/*    </Map_>*/}
    {/*  </div>*/}
    {/*</APIProvider>*/}
    </>
    );
}

const PlacesAutocomplete = ({selected, setSelected}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: {status, data},
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({address});
    const {lat, lng} = await getLatLng(results[0]);
    setSelected({lat, lng});
    console.log(selected);
  };

  return (
    <div>
      {/* <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        id="address-input"
        className="form-control address-input"
        placeholder="Search for location"
      />
      <ul id="address-input">
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <li key={place_id}>{description}</li>
          ))}
      </ul> */}
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search for address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({place_id, description}) => (
                <ComboboxOption key={place_id} value={description}/>
                ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
    );
};
