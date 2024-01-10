import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";

const handleLink = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#333",
        color: "white",
        textAlign: "center",
        padding: "10px 20px",
        position: "fixed",  // Fixed at the bottom of the viewport
        bottom: "0",
        left: "0",
        right: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p>© 2024 Blockchain at Berkeley. All Rights Reserved.</p>

      <div style={{ display: "flex", alignItems: "center" }}>
        <FaTwitter
          className="text-white mx-2 hover:cursor-pointer hover:scale-110"
          onClick={() => {
            handleLink("https://twitter.com/arbitrum");
          }}
          size={24}
        />
        <FaDiscord
          className="text-white mx-2 hover:cursor-pointer hover:scale-110"
          onClick={() => {
            handleLink("https://discord.com/invite/arbitrum");
          }}
          size={24}
        />
      </div>
    </footer>
  );
}

export default Footer;
