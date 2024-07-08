import { Outlet, NavLink, Link } from "react-router-dom";
export default function Root() {
  return (
    <div className="grid grid-cols-12 inter h-screen">
      <nav className="col-start-1 col-end-3 shadow-xl p-2 border-r-2 overflow-y-auto ">
        <div className="container mx-auto ">
          <div className="space-y-10">
            <div>
              {" "}
              <div className="p-5">
                <Link to="/" className="text-black font-bold text-4xl">
                  SIBONN
                </Link>{" "}
              </div>
              <div className="border-b"></div>
            </div>
            <div className="px-5">
              <div
                className="space-y-2
              "
              >
                {" "}
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    [
                      isActive &&
                        "border rounded-lg shadow-md border-r-4 border-r-sky-600",
                      "hover:text-sky-600 hover:shadow-lg hover:rounded-lg hover:border-r-4 hover:border-r-teal-500 hover:text-xl px-3 py-2 text-lg font-medium flex",
                    ].join(" ")
                  }
                >
                  Beranda
                </NavLink>
                <NavLink
                  to="/klien"
                  className={({ isActive }) =>
                    [
                      isActive &&
                        "border rounded-lg shadow-md border-r-4 border-r-sky-600",
                      "hover:text-sky-600 hover:shadow-lg hover:rounded-lg hover:border-r-4 hover:border-r-teal-500 hover:text-xl px-3 py-2 text-lg font-medium flex",
                    ].join(" ")
                  }
                >
                  Daftar Klien
                </NavLink>
                <NavLink
                  to="/nota"
                  className={({ isActive }) =>
                    [
                      isActive &&
                        "border w-full rounded-lg shadow-md border-r-4 border-r-sky-600",
                      "hover:text-sky-600 hover:shadow-lg hover:rounded-lg hover:border-r-4 hover:border-r-teal-500 hover:text-xl px-3 py-2 text-lg font-medium flex",
                    ].join(" ")
                  }
                >
                  Daftar Nota
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    [
                      isActive &&
                        "border rounded-lg shadow-md border-r-4 border-r-sky-600",
                      "hover:text-sky-600 hover:shadow-lg hover:rounded-lg hover:border-r-4 hover:border-r-teal-500 hover:text-xl px-3 py-2 text-lg font-medium flex",
                    ].join(" ")
                  }
                >
                  Contact
                </NavLink>
              </div>
            </div>{" "}
            <div className="border-b"></div>
          </div>
        </div>
      </nav>
      <div id="detail" className="col-start-3 col-end-13 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
