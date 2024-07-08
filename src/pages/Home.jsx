import { useRecoilState } from "recoil";
import Avatar from "../functions/RandomAvatar";
import {
  jumlahKlien,
  jumlahNota,
  loadingState,
  rupiah,
} from "../functions/atoms";
import React from "react";
import Swal from "sweetalert2";
import Loading from "../component/LoadingPage";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [jumlahNotas, setJumlahNotas] = useRecoilState(jumlahNota);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [jumlahKliens, setJumlahKliens] = useRecoilState(jumlahKlien);
  const [dataNota, setDataNota] = React.useState();

  React.useEffect(() => {
    const fetchDataNota = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:1234/notas");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setJumlahNotas(result.data.length);
        setDataNota(result?.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Gagal mendapatkan data nota, ${error}`,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    const fetchDataUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:1234/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setJumlahKliens(result?.data.length);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Gagal mendapatkan data nota klien, ${error}`,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDataUser();
    fetchDataNota();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-5 inter">
      <div className="mb-5">
        <h1 className="text-3xl font-medium ">Beranda</h1>
        <p className="text-gray-500">
          Menampilkan semua data pembelian berdasarkan nama
        </p>
      </div>
      <div className="border-b mb-5"></div>
      <div className="grid grid-cols-4 gap-x-5 mb-5">
        <div className="border shadow-lg p-5 rounded-lg space-y-2">
          <p>Total Daftar Klien</p>
          <p className="text-3xl font-semibold">{jumlahKliens}</p>
        </div>{" "}
        <div className="border shadow-lg p-5 rounded-lg space-y-2">
          <p>Total Transaksi</p>{" "}
          <p className="text-3xl font-semibold">{jumlahNotas}</p>
        </div>{" "}
        <div>
          {/* <p>Total Daftar Klien</p> <p className="text-3xl font-semibold">15</p> */}
        </div>{" "}
        <div>
          {/* <p>Total Daftar Klien</p> <p className="text-3xl font-semibold">15</p> */}
        </div>
      </div>
      <div>
        <p className="text-xl font-medium">Transaksi terakhir</p>
        <div className="grid grid-cols-12 p-7 text-gray-600">
          <p className="col-span-4">Nama</p>
          <p className="text-center">Nota Nomor</p>
          <p className="col-start-8 col-span-2">Total Pesanan</p>
          <p className="col-start-11">Status</p>
        </div>
        <div className="border-b-2"></div>
        {dataNota?.map((data, _) => {
          return (
            <div
              key={_}
              className="shadow rounded-md p-7 grid grid-cols-12 items-center  border-r-8 border-r-sky-600 mt-3 hover:cursor-pointer hover:border hover:border-sky-600 ease-in duration-200 "
              onClick={() => navigate(`/nota/${data.nota_no}`)}
            >
              <div className="flex items-center space-x-10 col-span-4 ">
                <Avatar />
                <div>
                  <p className="font-medium text-xl">{data.user.nama}</p>
                  <p className="text-xs text-gray-500">{data.user.noTelp}</p>
                </div>
              </div>
              <p className="  font-medium text-xl text-center ">
                {data.nota_no}
              </p>
              <p className="col-start-8 col-span-2  font-medium text-xl ">
                {rupiah(data.total) || "Belum Diinput"}
              </p>{" "}
              <p
                className={`col-start-11 font-semibold  ${
                  data.status === "lunas" ? "text-green-700" : "text-red-700"
                } `}
              >
                {data.status === "lunas" ? "LUNAS" : "BELUM LUNAS"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
