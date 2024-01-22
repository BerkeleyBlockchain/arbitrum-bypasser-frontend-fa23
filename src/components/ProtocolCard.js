import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowSVGIcon from "./ArrowIcon";
import protocolbg1 from "../assets/protocolbg1.png";
import protocolbg2 from "../assets/protocolbg2.png";
import protocolbg3 from "../assets/protocolbg3.png";
import protocolbg4 from "../assets/protocolbg4.png";

function ProtocolCard({ addy, name, abi, type, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/swap", { state: { addy, name, abi } });
  };

  const images = [protocolbg1, protocolbg2, protocolbg3, protocolbg4];
  const stringToNumberInRange = (str) =>
    [...str].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;

  const randomImage = images[stringToNumberInRange(addy)];

  return (
    <div
      onClick={handleClick}
      style={{
        width: "200px",
        height: "200px",
        borderRadius: "15px",
        overflow: "hidden",
        position: "relative",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${randomImage}), linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))`, // Image first, then black background
        backgroundSize: "cover", // Cover the entire div
        backgroundPosition: "center", // Center the image
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease", // Add transition for background color
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "rgba(45, 42, 48, 0.5)")
      } // Darken on hover
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      } // Revert on mouse leave
    >
      <img
        src={image}
        alt={name}
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          marginTop: "10px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          right: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(153, 69, 255, 1)",
            borderRadius: "20px",
            padding: "5px 10px",
            lineHeight: "12.25px",
            letterSpacing: "39%",
            fontFamily: "Roboto",
            fontSize: "10px",
            color: "white",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {type}
        </div>
        <h3
          style={{
            color: "white",
            padding: "1px 0",
            fontFamily: "Roboto",
            fontSize: "15px",
            textAlign: "Left",
          }}
        >
          {name}
        </h3>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "rgba(25, 22, 28, 1)",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ArrowSVGIcon width="20" height="20" fill="white" />
      </div>
    </div>
  );
}

export default ProtocolCard;
