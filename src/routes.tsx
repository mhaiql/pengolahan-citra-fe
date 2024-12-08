import { Navigate, createBrowserRouter } from "react-router-dom";

// root pages
import Root from "./Root";
import HomePage from "./pages/home";

// filter page
import FilterPage from "./pages/filter";

// output page

import OutputPage from "./pages/output";

const routerApp = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/filter",
        element: <FilterPage />,
      },
      {
        path: "/output",
        element: <OutputPage />,
      },
    ],
  },
]);

export default routerApp;
