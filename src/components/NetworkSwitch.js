import React, { useContext } from "react";
import { GlobalContext } from "../ContextProvider";

import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: "100px", // Scaled up for longer text
  height: "32px", // Increased height
  padding: "0px",
  "& .MuiSwitch-switchBase": {
    color: "#818181",
    padding: "2px", // Slightly increased padding
    "&.Mui-checked": {
      color: "#818181", // Color for the thumb when checked
      transform: "translateX(66px) translateY(-1px)", // Adjusted for the new width and thumb size
      "& + .MuiSwitch-track": {
        backgroundColor: "#818181", // Gray background when checked
        "&:after": {
          content: '"Testnet"', // Show 'Testnet' when checked
          right: "40px", // Adjusted positioning
          visibility: "visible",
          pointerEvents: "none", // Allow click events to pass through
        },
        "&:before": {
          visibility: "hidden", // Hide 'Mainnet' when checked
        },
      },
    },
    "&:not(.Mui-checked) + .MuiSwitch-track": {
      backgroundColor: "#23bf58", // Gray background for 'Testnet' (non-checked)
      "&:before": {
        content: '"Mainnet"', // Show 'Mainnet' when not checked
        visibility: "visible",
        left: "36px", // Adjusted to shift the text to the right
        pointerEvents: "none", // Allow click events to pass through
      },
      "&:after": {
        visibility: "hidden", // Hide 'Testnet' when not checked
      },
    },
  },
  "& .MuiSwitch-thumb": {
    color: "white",
    width: "26px", // Adjusted thumb size
    height: "26px", // Adjusted thumb size
    margin: "2px", // Adjusted margin
  },
  "& .MuiSwitch-track": {
    borderRadius: "32px", // Adjusted for larger height
    backgroundColor: "#23bf58", // Green background for 'Mainnet' (non-checked)
    opacity: 1,
    "&:after, &:before": {
      color: "white",
      fontSize: "13px", // Increased font size
      position: "absolute",
      top: "8px", // Adjusted for larger height
      whiteSpace: "nowrap",
      visibility: "hidden", // Initially hidden
      pointerEvents: "none", // Allow click events to pass through
    },
  },
}));

export default function NetworkSwitch({ disabledVar }) {
  const { livenet, setLivenet } = useContext(GlobalContext);

  const toggleNetwork = () => {
    setLivenet(!livenet);
    // console.log(livenet);
  };

  return (
    <StyledSwitch
      checked={!livenet}
      onChange={toggleNetwork}
      name="networkSwitch"
      inputProps={{ "aria-label": "secondary checkbox" }}
      disabled={disabledVar} // Disable the switch based on the 'disabled' variable
      style={
        disabledVar
          ? { ...disabledStyles } // Merge disabled styles if it is disabled
          : {}
      }
      className={`text-white font-thin py-2 px-4 rounded flex items-center mr-3 ${
        disabledVar ? "additional-disabled-class" : ""
      }`}
    />
  );
}

const disabledStyles = {
  opacity: 0.3, // Adjust this value to control the darkness
  cursor: "not-allowed",
  // Add any other styles you want to apply when the switch is disabled
};
