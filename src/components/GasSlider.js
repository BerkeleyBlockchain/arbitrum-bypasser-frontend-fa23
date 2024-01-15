import * as React from "react";
import Slider from "@mui/material/Slider";

export default function GasSlider({ gasState, setGasState }) {
  const inputRef = React.useRef(null);

  const handleSliderChange = (event, newValue) => {
    setGasState(newValue);
  };

  const handleInputChange = (event) => {
    // Remove the percent sign and parse the remaining string as a floating-point number
    const value = event.target.value.replace('%', '');
    setGasState(value === "" ? '' : parseFloat(value));
  };

  const handleBlur = () => {
    if (gasState < 0) {
      setGasState(0);
    } else if (gasState > 100) {
      setGasState(100);
    } else if (gasState === '') {
      setGasState(0); // Reset to 0 if the input is empty
    }
  };

  const handleInputFocus = () => {
    const length = inputRef.current.value.length - 1; // Exclude the '%' sign
    inputRef.current.setSelectionRange(length, length);
  };

  const handleInputClick = (e) => {
    // Prevent the default input click behavior which moves the cursor
    e.preventDefault();
    handleInputFocus();
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
            ref={inputRef}
            type="text"
            value={gasState !== '' ? gasState + "%" : ''}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            onBlur={handleBlur}
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
