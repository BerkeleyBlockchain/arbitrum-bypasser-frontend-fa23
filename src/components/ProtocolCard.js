import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowSVGIcon from "./ArrowIcon";

function ProtocolCard({ addy, name, abi, type, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/swap", { state: { addy, name, abi } });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: "rgba(25, 22, 28, 1)",
        borderRadius: "15px",
        overflow: "hidden",
        position: "relative",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        transition: "background-color 0.3s ease", // Add transition for background color
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(45, 42, 48, 1)")} // Darken on hover
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(25, 22, 28, 1)")} // Revert on mouse leave
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
