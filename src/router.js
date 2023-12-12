import { createBrowserRouter } from "react-router-dom";
import Landing from "./containers/Landing";
import SwapPage from "./containers/SwapPage";

export default createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/swap",
    element: <SwapPage />,
  },
]);
