/* eslint-disable react-hooks/exhaustive-deps */
import { MdOutlineModeEdit } from "react-icons/md";
import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import UpdateKlien from "./UpdateKlien";
import Loading from "../LoadingPage";
import { useRecoilState } from "recoil";
import { loadingState } from "../../functions/atoms";
import Swal from "sweetalert2";

const DetailKlien = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useRecoilState(loadingState);
  const { id } = useParams();
  const [userData, setUserData] = React.useState();
  const isOpen = location.pathname.split("/")[3] == "update-klien";
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  // console.log(userData.data);
  React.useEffect(() => {
    const getUserById = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:1234/users/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data?.data);
        // console.log(userData?.notas);
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
    getUserById();
  }, [location.pathname]);

  if (loading) <Loading />;

  return (
    <div className="p-5 inter">
      <UpdateKlien isOpen={isOpen} />
      <div
        className="flex items-center hover:text-sky-600 hover:underline space-x-1 mb-5"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack />
        <p>Back</p>
      </div>
      <div className="mb-5">
        <h1 className="text-3xl font-medium ">Detail Klien</h1>
        <p className="text-gray-500">Menampilkan semua data transaksi klien</p>
      </div>
      <div className="border-b mb-5"></div>

      {
        <div>
          <div className="bg-gradient-to-r from-sky-600 to-sky-300  py-5 text-white px-5 rounded-lg shadow-2xl flex items-center justify-between">
            <div>
              {" "}
              <h1 className="text-3xl font-semibold">{userData?.nama}</h1>
              <p>{userData?.noTelp}</p>
            </div>
            <div
              className="bg-white p-3 rounded-md flex hover:scale-110 items-center space-x-5 hover:shadow-md ease-in-out duration-300 hover:cursor-pointer"
              onClick={() => navigate("update-klien")}
            >
              {" "}
              <p className=" font-medium text-sky-600">Edit</p>
              <MdOutlineModeEdit className="text-sky-600" size={24} />
            </div>
          </div>
          <div className="w-full h-screen border bg-gray-100 shadow-lg rounded-lg mt-5 p-5">
            <div>
              <button
                onClick={() => {}}
                className="bg-blue-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded hover:scale-110 duration-300 ease-in"
              >
                Buat Nota
              </button>
            </div>
            <div className="mt-5 grid grid-cols-6 gap-5">
              {userData?.notas.length < 1 ? (
                <div className="">Data Nota Belum Ada</div>
              ) : (
                userData?.notas.map((data, _) => (
                  <div
                    key={_}
                    className="border-2 grid grid-rows-2 shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:outline hover:outline-sky-600 hover:cursor-pointer duration-300 ease-in-out "
                    onClick={() => navigate(`/nota/${data.nota_no}`)}
                  >
                    <div>
                      <div className="p-5">
                        <p className="font-medium">Nota</p>
                        <p className="text-5xl font-semibold">{data.nota_no}</p>
                      </div>
                      <div className="border-b"></div>
                    </div>
                    <div>
                      <div>
                        <p className="pl-5 pt-5  font-medium text-wrap text-ellipsis pr-3">
                          {data.pekerjaan}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`pl-5 py-5 font-semibold text-lg text-ellipsis ${
                        data.status === "lunas"
                          ? "text-sky-600"
                          : "text-red-600"
                      }`}
                    >
                      {data.status === "lunas" ? "LUNAS" : "BELUM LUNAS"}
                    </p>
                    <div className="p-5 rounded-b-lg font-medium bg-sky-600 py-5 text-lg text-white">
                      {rupiah(data.total)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default DetailKlien;
