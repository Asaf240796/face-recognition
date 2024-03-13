import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, buttonSubmit }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      buttonSubmit();
    }
  };
  return (
    <div>
      <p className="f3">
        {"This magic brain will detect faces in any picture. Give it a try"}
      </p>
      <div className="center">
        <div className=" form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
            onKeyDown={handleKeyPress}
          />
          <button
            className="Detect w-30 grow f4 link ph3 pv2 dib white bg-light-purple "
            onClick={buttonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
