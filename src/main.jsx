/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import Root from "./route/root";
import ErrorPage from "./error-page";
import Home from "./pages/Home";
import Klien from "./pages/Klien";
import Nota from "./pages/Nota";
import DetailKlien from "./component/Klien/Detail";
import DetailNotaBon from "./component/NotaBon/Detail";
import TambahKlien from "./component/Klien/TambahKlien";
import App from "./app";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "klien",
        element: <Klien />,
        children: [
          {
            path: "tambah-klien",
            element: <Klien />,
          },
        ],
      },
      {
        path: "klien/:id",
        element: <DetailKlien />,
        children: [
          {
            path: "update-klien",
            element: <DetailKlien />,
          },
        ],
      },
      {
        path: "nota",
        element: <Nota />,
      },
      {
        path: "nota/:id",
        element: <DetailNotaBon />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
