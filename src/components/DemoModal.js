import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import videoSrc from "../assets/ethsign_demo.mp4";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%", // Increased width to take up more screen space
  maxWidth: 800, // Maximum width to ensure it's not too large on big screens
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "16px",
  p: 4,
};

export default function DemoModal({ open, handleClose }) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open} timeout={750}>
        <Box sx={style}>
          <h1 className="text-5xl font-bold mb-2">
            How do you use{" "}
            <span className="text-[rgba(0,212,136,1)]">ArbPasser</span>?
          </h1>
          <p className="mb-8">
            You need to turn on eth_sign! This can be accessed through the
            MetaMask Extension. Because of our implementation, we pre-sign your
            transaction and bypass the sequencer submission process by sending
            your pre-signed l2 transaction to a bridge on Ethereum.
          </p>
          {/* <Typography
            id="transition-modal-title"
            variant="h6"
            component="h2"
            style={{ marginBottom: "10px" }}
          >
            How do you use ArbPasser?
          </Typography>
          <Typography
            id="transition-modal-description"
            style={{ marginBottom: "20px" }}
          >
            You need to turn on eth_sign!
          </Typography> */}
          <video
            style={{
              width: "100%",
              height: "auto",
              marginBottom: "20px",
            }}
            autoPlay
            muted
            loop
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <Button
            onClick={handleClose}
            style={{
              marginTop: "16px",
              backgroundColor: "#2979ff", // Blue color
              color: "white",
              borderRadius: "20px", // Rounded corners
              padding: "10px 20px", // Padding for a larger button
              textTransform: "none", // Prevents uppercase transformation
            }}
          >
            Close
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
