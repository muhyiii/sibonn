import { Route, Routes } from "react-router-dom";
import Root from "./route/root";
import Klien from "./pages/Klien";
import ErrorPage from "./error-page";
import Home from "./pages/Home";
import Nota from "./pages/Nota";
import DetailKlien from "./component/Klien/Detail";
import DetailNotaBon from "./component/NotaBon/Detail";

// import React from "react";

const App = () => {
  return (
    <div id="modal-root" className="relative">
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="klien" element={<Klien />}>
            <Route path="tambah-klien" element={<Klien />} />
          </Route>
          <Route path="klien/:id" element={<DetailKlien />}>
            <Route path="update-klien" element={<DetailKlien />} />
          </Route>
          <Route path="nota" element={<Nota />}>
            <Route path="tambah-nota" element={<Nota />} />
          </Route>
          <Route path="nota/:nota_no" element={<DetailNotaBon />}>
            <Route path="update-nota-order" element={<DetailKlien />} />
          </Route>
        </Route>{" "}
        {/* <Route path="klien/tambah-klien" element={<TambahKlien />} /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
