/* eslint-disable react/prop-types */
// eslint-disable-next-line react-hooks/exhaustive-deps
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loadingState } from "../functions/atoms";
import { useRecoilState } from "recoil";
import Loading from "../component/LoadingPage";
import Swal from "sweetalert2";
import TambahNota from "../component/NotaBon/TambahNota";

const Nota = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useRecoilState(loadingState);
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedMonth, setSelectedMonth] = React.useState("Semua Bulan");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

  const isOpen = location.pathname.split("/")[2] === "tambah-nota";

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:1234/notas");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
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
    const filterData = () => {
      if (selectedMonth === "Semua Bulan" && selectedYear === "Semua Tahun") {
        setFilteredData(data);
      } else {
        setFilteredData(
          data.filter((nota) => {
            const notaDate = new Date(nota.tanggal_order);
            const notaMonth = notaDate.toLocaleString('id-ID', { month: 'long' });
            const notaYear = notaDate.getFullYear();

            return (
              (selectedMonth === "Semua Bulan" || selectedMonth === notaMonth) &&
              (selectedYear === "Semua Tahun" || selectedYear === notaYear)
            );
          })
        );
      }
    };

    filterData();
  }, [data, selectedMonth, selectedYear]);

  if (loading) return <Loading />;

  return (
    <div className="p-5 inter">
      <TambahNota isOpen={isOpen} />
      <div className="mb-5">
        <h1 className="text-3xl font-medium">Daftar Nota</h1>
        <p className="text-gray-500">
          Menampilkan semua data nota pembelian berdasarkan urutan nomor
        </p>
      </div>
      <FilterComponent 
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <div>
        <div className="grid grid-cols-6 gap-3">
          {filteredData.length < 1 ? (
            <div className="col-span-8 text-center border rounded p-20">
              <p className="mb-5">
                {selectedMonth !== "Semua Bulan" || selectedYear !== "Semua Tahun"
                  ? `Data di bulan ${selectedMonth} tahun ${selectedYear} tidak ada`
                  : "Data tidak ditemukan"}
              </p>
              {selectedMonth === "Semua Bulan" && selectedYear === "Semua Tahun" && (
                <Link
                  to={"/nota/tambah-nota"}
                  className="bg-sky-600 px-5 py-2 rounded-lg text-white shadow-lg hover:scale-110 ease-in duration-300 outline-none hover:shadow-xl font-medium"
                >
                  Buat Data Nota Baru
                </Link>
              )}
            </div>
          ) : (
            filteredData.map((nota, _) => {
              return (
                <div
                  key={_}
                  className="border-2 relative grid grid-rows-2 shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:outline outline-sky-600 hover:cursor-pointer duration-300 ease-in-out"
                  onClick={() => navigate(`${nota?.nota_no}`)}
                >
                  <div>
                    <div className="p-5">
                      <p className="font-medium">Nota</p>
                      <p className="text-5xl font-semibold">{nota?.nota_no}</p>
                    </div>
                    <div className="border-b"></div>
                  </div>
                  <div>
                    <div>
                      <p className="pl-5 pt-5 pr-3 font-medium text-wrap text-ellipsis">
                        {nota?.pekerjaan}
                      </p>
                    </div>
                  </div>
                  <p className="pl-5 py-5 text-xs font-medium text-ellipsis">
                    {nota?.user?.nama}
                  </p>
                  <div className="p-5 bottom-0 right-0 w-full rounded-b-lg font-medium bg-sky-600 py-5 text-lg text-white">
                    {nota.total !== "" ? rupiah(nota?.total) : "Belum Diinput"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const FilterComponent = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  const months = [
    "Semua Bulan",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Daftar rentang tahun
  const years = ["Semua Tahun"];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 2; i--) {
    years.push(i);
  }

  return (
    <div className="mb-5 space-y-2 items-end flex space-x-10">
      <div>
        <label htmlFor="">Filter berdasarkan bulan dan tahun:</label>
        <div className="flex space-x-4">
          <select
            className="border-gray-300 border px-5 py-2 rounded-md outline-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="border-gray-300 border px-5 py-2 rounded-md outline-none appearance-auto"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Link
        to={"tambah-nota"}
        className="bg-sky-600 px-5 py-2 rounded-lg text-white shadow-lg hover:scale-110 ease-in duration-300 outline-none hover:shadow-xl font-medium"
      >
        Buat Nota Baru
      </Link>
    </div>
  );
};

export default Nota;
