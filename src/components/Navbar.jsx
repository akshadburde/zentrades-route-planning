import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav>
      <span style={{ marginRight: "20px" }}>
        <FontAwesomeIcon
          icon={faMapLocationDot}
          color="#4832a9"
          fontSize={22}
        />
      </span>
      <span>Route Planning Tool MVP</span>
    </nav>
  );
}
