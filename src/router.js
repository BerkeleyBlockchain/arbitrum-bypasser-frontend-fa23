import { createBrowserRouter } from "react-router-dom";
import Landing from "./containers/Landing";
import SwapPage from "./containers/SwapPage";
import TransactionPage from "./containers/TransactionPage";
import AddABI from "./containers/AddABI";
import Layout from "./containers/Layout";
import SubmissionConfirmation from "./containers/ABISubmissionConfirmation";

export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/swap", element: <SwapPage /> },
      { path: "/transactions", element: <TransactionPage /> },
      { path: "/add-abi", element: <AddABI /> },
      { path: "/abi-confirmation", element: <SubmissionConfirmation /> },
      { path: "*", element: <Landing /> },
    ],
  },
]);
