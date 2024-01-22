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
      color: "#818181",
      transform: "translateX(66px) translateY(-1px)", // Adjusted for the new width and thumb size
      "& + .MuiSwitch-track": {
        color: "#818181",
        "&:after": {
          content: '"Testnet"', // Show 'Mainnet' when checked
          right: "40px", // Adjusted positioning
          visibility: "visible",
          pointerEvents: "none", // Allow click events to pass through
        },
        "&:before": {
          visibility: "hidden", // Hide 'Testnet' when checked
        },
      },
    },
    "&:not(.Mui-checked) + .MuiSwitch-track": {
      "&:before": {
        content: '"Mainnet"', // Show 'Testnet' when not checked
        visibility: "visible",
        left: "36px", // Adjusted to shift the text to the right
        pointerEvents: "none", // Allow click events to pass through
      },
      "&:after": {
        visibility: "hidden", // Hide 'Mainnet' when not checked
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
    backgroundColor: "#23bf58",
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

export default function NetworkSwitch({ disabled }) {
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
      className={`${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } text-white font-thin py-2 px-4 rounded flex items-center mr-3`}
    />
  );
}
