import React from "react";
import { Tilt } from "react-tilt";
import "./Logo.css";
import brain from "./brain.png";

const Logo = () => {
  return (
    <div>
      <Tilt
        className="Tilt br2 shadow-2"
        optins={{ max: 55 }}
        style={{ height: 150, width: 150 }}
      >
        <div className=" pa3">
          <img src={brain} alt="brain" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
