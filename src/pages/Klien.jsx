import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TambahKlien from "../component/Klien/TambahKlien";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loadingState } from "../functions/atoms";
import Loading from "../component/LoadingPage";

const Klien = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = location.pathname.split("/")[2] == "tambah-klien";

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const [loading, setLoading] = useRecoilState(loadingState);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState();
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:1234/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setMsg(result?.data?.msg);
        setData(result?.data);
        setFilteredData(result?.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Gagal mendapatkan data, ${error}`,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading, setData, location.pathname]);
  React.useEffect(() => {
    const filtered = data?.filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  if (loading) return <Loading />;
  return (
    <div className="">
      <TambahKlien isOpen={isOpen} />

      <div className="p-5 inter">
        <div className="mb-5">
          <h1 className="text-3xl font-medium ">Daftar Klien</h1>
          <p className="text-gray-500">
            Menampilkan semua data pembeli yang pernah bertransaksi jasa atau
            barang
          </p>
        </div>
        <div className="border-b mb-5"></div>
        <div className="mb-5 flex space-x-5">
          <div className="flex justify-center  items-center border rounded-lg w-72 px-3 py-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Search..."
              className="outline-none"
            />
            <button onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          <Link
            to={"tambah-klien"}
            className={`${
              data?.length < 1 && "hidden"
            } bg-sky-600 px-5 py-2 rounded-lg text-white shadow-lg hover:scale-110 ease-in duration-300 outline-none hover:shadow-xl font-medium  `}
          >
            Buat Data Klien Baru
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-8 gap-5">
            {filteredData?.length < 1 ? (
              <div className="col-span-8 text-center border rounded   p-20">
                <p className="mb-5">{msg}</p>{" "}
                <Link
                  to={"/klien/tambah-klien"}
                  className="bg-sky-600 px-5 py-2 rounded-lg  text-white shadow-lg hover:scale-110 ease-in duration-300 outline-none hover:shadow-xl font-medium te"
                >
                  Buat Data Klien Baru
                </Link>
              </div>
            ) : (
              filteredData?.map((data, key) => (
                <div
                  key={key}
                  onClick={() => navigate(`/klien/${data.id}`)}
                  className="border rounded space-x-2 space-y-2 col-span-2 grid grid-cols-4 items-center px-5 py-8 border-b-4 border-b-sky-600 hover:cursor-pointer hover:outline hover:outline-sky-600 hover:border-b-0 hover:scale-105 hover:outline-b-8 ease-in-out duration-200"
                >
                  <div className="col-span-3">
                    <p className="text-xl font-medium text-wrap text-clip">
                      {data.nama}
                    </p>
                    <p className="text-sm text-gray-500">{data.noTelp}</p>
                  </div>
                  <div className="col-start-4 flex items-center space-x-2">
                    <p className="text-2xl font-medium">3</p>
                    <p className="text-xs">Nota</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Klien;
