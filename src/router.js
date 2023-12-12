import { createBrowserRouter } from "react-router-dom";
import Landing from './components/Landing';
import SwapPage from './components/SwapPage';


export default createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/swap",
    element: <SwapPage />
  }
]);
