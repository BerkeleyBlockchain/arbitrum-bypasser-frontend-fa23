import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

export default function GasSlider({ gasState, setGasState }) {
  const handleSliderChange = (event, newValue) => {
    setGasState(newValue);
  };

  const handleInputChange = (event) => {
    setGasState(event.target.value === "" ? 0 : Number(event.target.value));
  };

  return (
    <div className="mb-5">
      <span className="text-white">Add a % Gas Buffer:</span>
      <span className="mt-2 flex justify-start items-center w-full">
        <Slider
          style={{ width: "79%" }}
          value={typeof gasState === "number" ? gasState : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
        />
        <div className="w-12 text-left mr-2 ml-3">
          <input
            type="text"
            value={gasState + "%"}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none"
            style={{
              backgroundColor: "rgba(25, 29, 36, 1)",
              borderRadius: "8px",
            }}
          />
        </div>
      </span>
    </div>
  );
}
