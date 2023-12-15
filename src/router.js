import { createBrowserRouter } from "react-router-dom";
import Landing from "./containers/Landing";
import SwapPage from "./containers/SwapPage";
import TransactionPage from "./containers/TransactionPage";
import Layout from "./containers/Layout";

export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/swap",
        element: <SwapPage />,
      },
      {
        path: "/transactions",
        element: <TransactionPage />,
      },
      {
        path: "*",
        element: <Landing />,
      },
    ],
  },
]);
