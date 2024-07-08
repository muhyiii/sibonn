/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
// import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useRef, useState } from "react";
import contohKusen from "../../images/nota/contohKusen.png";
import { useRecoilState } from "recoil";
import {
  detailFormated,
  formattedDate,
  loadingState,
  rupiah,
} from "../../functions/atoms";
import Swal from "sweetalert2";
import Loading from "../LoadingPage";
import UpdateOrder from "./UpdateOrder";

const DetailNotaBon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nota_no } = useParams();
  const [loading, setLoading] = useRecoilState(loadingState);
  const [hasIsBayar, setHasIsBayar] = useState(false);
  const [isBayar, setIsBayar] = useState(false);
  const [notaData, setNotaData] = React.useState();
  const isOpenOrder = location.pathname.split("/")[3] == "update-nota-order";
  const [formData, setFormData] = useState({
    bayar: null,
  });
  React.useEffect(() => {
    console.log(nota_no);
    const getNotaById = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:1234/notas/${nota_no}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNotaData(data?.data);
        console.log(data?.data);
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

    // console.log(location.pathname);
    getNotaById();
  }, [location.pathname]);

  // TOMBOL HANDLE BAYAR UNTUK INPUT DATA PEMBAYARAN
  const handleBayar = () => {
    Swal.fire({
      title: "Masukan Jumlah Pembayaran",
      html: `
      <input id="jumlah_bayar" class="swal2-input" type="text" placeholder="Jumlah Bayar" onfocus="addCurrencyPrefixX()">
      <select id="tipe_pembayaran" class="swal2-input">
        <option value="TF">Transfer</option>
        <option value="CASH">Cash</option>
      </select>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Tambahkan",
      cancelButtonText: "Batal",
      preConfirm: () => {
        let jumlah_bayar = document
          .getElementById("jumlah_bayar")
          .value.replace("Rp", "")
          .trim();
        const tipe_pembayaran =
          document.getElementById("tipe_pembayaran").value;
        if (jumlah_bayar > notaData?.total) jumlah_bayar = notaData?.total;

        return { jumlah_bayar, tipe_pembayaran };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newValue = result.value;
        setFormData({
          bayar: newValue,
        });
        Swal.fire({
          title: "Simpan Pembayaran?",
          showCancelButton: true,
          confirmButtonText: "Iyaa",
          cancelButtonText: "Tidak",
        }).then(async (result) => {
          let data = {
            bayar: newValue,
          };
          // return console.log(data);
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            setLoading(true);
            try {
              const response = await fetch(
                `http://localhost:1234/notas/update-pembayaran/${notaData.nota_no}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                }
              );
              // return console.log(response.json());
              if (!response.ok) {
                throw new Error("Terjadi kesalahan");
              }

              const result = await response.json();
              console.log(result);
              Swal.fire({
                position: "center",
                icon: "success",
                title: result.msg,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            } catch (error) {
              console.log(error);
              Swal.fire({
                position: "center",
                icon: "error",
                title: error.message,
                showConfirmButton: false,
                timer: 1500,
              });
            } finally {
              setLoading(false);
            }
          }
        });
      }
    });
  };
  React.useEffect(() => {
    window.addCurrencyPrefixX = () => {
      const input = document.getElementById("jumlah_bayar");
      if (input && !input.value.includes("Rp")) {
        input.value = "Rp " + input.value;
      }
    };
  }, []);
  // React.useEffect(() => {
  //   window.addCurrencyPrefixX = () => {
  //     const input = document.getElementById("jumlah_bayar");
  //     if (input && !input.value.includes("Rp")) {
  //       input.value = "Rp " + input.value;
  //     }
  //   };
  // }, []);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <div className="p-5 inter">
      <UpdateOrder isOpenOrder={isOpenOrder} />
      <div
        className="flex items-center hover:text-sky-600 hover:underline space-x-1 mb-5"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack />
        <p>Back</p>
      </div>
      <div className="mb-5">
        <h1 className="text-3xl font-medium ">Detail Nota</h1>
        <p className="text-gray-500">
          Menampilkan detail nota berupa total dan status pembayaran
        </p>
      </div>
      <div className="border-b mb-5"></div>
      <div className="border p-5 rounded ">
        <div className="flex items-start justify-between">
          <div className="justify-between flex space-x-3 mb-5 w-2/3 pr-5">
            <div>
              <p className="text-xs">Nota no</p>
              <p className="text-4xl font-semibold text-center">
                {notaData?.nota_no}
              </p>
            </div>
            <p className="text-4xl font-semibold border-b text-wrap text-clip">
              {notaData?.user?.nama}
            </p>
            <div>
              <p className="text-xs">Status</p>
              <p
                className={`text-4xl font-semibold ${
                  notaData?.status === "lunas" ? "text-sky-600" : "text-red-600"
                }  `}
              >
                {notaData?.status === "lunas" ? "LUNAS" : "BELUM LUNAS"}
              </p>
            </div>{" "}
            <div>
              <p className="text-xs">Tanggal Pesan</p>
              <p className="text-lg font-medium ">
                {notaData?.tanggal_order
                  ? detailFormated(notaData.tanggal_order)
                  : ""}
              </p>
            </div>
          </div>{" "}
          <div className="">
            <p className="text-xs">Terakhir Diedit</p>
            <p className="text-lg font-medium ">
              {notaData?.terakhir_edit
                ? formattedDate(notaData.terakhir_edit)
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pb-5">
          {" "}
          <div className="flex justify-between w-2/3  space-x-10 items-center  ">
            <div className="mb-1 font-semibold text-2xl flex-initial flex-grow-1">
              {notaData?.pekerjaan}
            </div>{" "}
            <button
              onClick={() => {
                navigate("update-nota-order", { state: notaData });
              }}
              className="bg-blue-500 hover:bg-sky-600 text-center text-white font-bold py-2 px-4 rounded hover:scale-110 duration-300 ease-in flex-shrink-0 whitespace-nowrap"
            >
              Edit Nota
            </button>
          </div>
          {notaData?.status !== "lunas" && (
            <button
              onClick={() => {
                Swal.fire({
                  title: "Ingin menambah pembayaran?",
                  showCancelButton: true,
                  confirmButtonText: "Iyaa",
                  cancelButtonText: "Tidak",
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    handleBayar();
                  }
                });
              }}
              className="bg-blue-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded hover:scale-110 duration-300 ease-in"
            >
              Tambah Pembayaran
            </button>
          )}
        </div>

        <div className="flex gap-x-3 ">
          <div className="w-2/3 border rounded-sm py-2 ">
            <div className="grid grid-cols-9 text-center ">
              <p className="">Jumlah</p>
              <p className="col-span-4 border-l">Nama Order</p>
              <p className="col-span-2 border-l">Harga</p>
              <p className="col-span-2 border-l">Total</p>
            </div>
            <div className="border-b mb-5 mx-5 mt-2 "></div>
            {notaData?.orders.map((data, _) => (
              <div key={_} className="grid grid-cols-9  text-sm capitalize">
                <p className="text-center">
                  {data?.jumlah > 0 ? data?.jumlah : ""}
                </p>{" "}
                <p className="col-span-4 border-l pl-8">{data?.deskripsi}</p>
                <p className="col-span-2 border-l pl-10">
                  {data?.harga > 0 ? rupiah(data?.harga) : ""}
                </p>
                <p className="col-span-2 border-l pl-10">
                  {data?.harga > 0 ? rupiah(data?.jumlah * data?.harga) : ""}
                </p>
              </div>
            ))}
            <div className="border-b mx-5 mt-10"></div>
            <div className="grid grid-cols-9 my-5 text-lg text-center font-semibold">
              <p className="col-start-6 col-span-2 ">TOTAL</p>
              <p className="col-start-8 col-span-2 ">
                {notaData?.total !== ""
                  ? rupiah(notaData?.total)
                  : "Belum Diinput"}
              </p>
            </div>
          </div>
          <div className="w-1/3 rounded-sm py-2 border">
            <div className="grid grid-cols-8 text-center  ">
              <p className="col-span-2">Tanggal</p>
              <p className="col-span-3 border-l">Bayar</p>
              <p className="col-span-3 border-l">Sisa</p>
            </div>
            <div className="border-b mb-5 mx-5 mt-2 "></div>
            {notaData?.pembayarans?.map((data, _) => (
              <div key={_} className="grid grid-cols-8 text-center text-xs">
                <p className="col-span-2">
                  {formattedDate(data.tanggal_bayar)}
                </p>
                <p
                  className={`col-span-3 border-l cursor-pointer hover:scale-105 ${
                    data?.tipe_pembayaran === "CASH"
                      ? "text-sky-600"
                      : "text-green-600"
                  }`}
                  onClick={() =>
                    Swal.fire({
                      icon: "info",

                      html: '<p>Teks <span style="color:#0284c7;font-weight:700">Biru</span> Untuk Metode Pembayaran CASH <br/> Teks <span style="color:#16a34a;font-weight:600">Hijau</span> Untuk Metode Pembayaran Transfer </p>',
                    })
                  }
                >
                  {rupiah(data?.jumlah_bayar)}
                </p>
                <p className="col-span-3 border-l text-wrap">
                  {rupiah(data?.sisa)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailNotaBon;

// const Nota = React.forwardRef((props, ref) => (
//   <div ref={ref} className=" border rounded-sm p-5">
//     <div className="grid grid-cols-6">
//       <div className="h-full flex items-center">
//         <img src={contohKusen} alt="" className="scale-125 scale-y-150" />
//       </div>
//       <div className="col-span-3 text-center">
//         <div className="flex items-center space-x-2">
//           <div className="bang-lang text-white bg-white text-xl p-[2px] rounded-[50%]  outline-1 outline outline-red-600">
//             <p className="bg-red-600 rounded-full p-1">SK</p>
//           </div>
//           <p className="elephant font-medium  text-red-600">
//             SUMBER KUSEN <br /> BENGKEL LAS
//           </p>
//         </div>
//         <div className="text-[9px] text-sky-700">
//           {" "}
//           <p className="font-semibold">MENERIMA PESANAN:</p>
//           <p>
//             -Kusen, Kayu, Kusen Alumunium, Daun Pintu, Jendela, <br />
//             Tempat Tidur, Lemari, Kitchen Set, Dll
//           </p>
//           <p>- Pagar Besi, Tralis, Kanopi, Dll</p>
//           <p>
//             Jl. Cileungsi Setu, Pasirangin Depan Masjid Nurul Falah <br />
//             WA/HP 0812 1981 1957 - 0877 4166 0011
//           </p>
//         </div>
//       </div>
//       <div className="col-span-2 text-[9px] text-left pl-5 my-2 text-sky-700">
//         <p className="font-medium">Cileungsi, 20 Agustus 2024</p>
//         <p className="text-center font-semibold my-3 mr-5">Kepada Yth,</p>
//         <div className="flex items-center space-x-1">
//           <p className="font-medium">TUAN</p>{" "}
//           <p className="font-semibold text-xs border-b border-dotted border-sky-700">
//             {"  "} Ucup Sudirman
//           </p>
//         </div>
//         <div className="space-y-2">
//           <p className="font-medium">TOKO</p>
//           <div className="border-b border-dotted border-sky-700"></div>
//         </div>
//       </div>
//     </div>
//     <div className="text-sky-700 font-bold text-sm flex items-center space-x-1 mb-2 border-b-[1.5px] pb-1 border-sky-700">
//       <p>NOTA No</p> <p className="border-b border-dotted border-sky-700">1</p>
//     </div>
//     <table className="text-[10px] text-sky-700 border border-sky-700 w-full border-collapse text-center">
//       <thead>
//         <tr className="grid grid-cols-9 text-center items-center ">
//           <th className=" ">
//             <p className="text-[8px]">Banyaknya</p>
//           </th>
//           <th className="col-span-4 font-semibold border-r border-l border-sky-700  ">
//             DESKRIPSI ORDER
//           </th>
//           <th className="col-span-2 border-r border-sky-700 ">Harga Satuan</th>
//           <th className="col-span-2  ">Jumlah</th>
//         </tr>
//       </thead>

//       <tbody>
//         {props.data.map((data) => (
//           <tr
//             key={data}
//             className="grid grid-cols-9 border-t border-sky-700 border-collapse text-[9px]"
//           >
//             <td className="text-center ">2</td>
//             <td className="col-span-4  border-l border-r border-sky-700">
//               Kusen pintu 2 tapi tidak pakai angin2 yang ada diatas nya itu
//             </td>
//             <td className="col-span-2  border-r border-sky-700">
//               Rp 300.000,00
//             </td>
//             <td className="col-span-2 ">Rp 5.600.500,00</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     <table className="w-full">
//       <tr className="grid grid-cols-9 text-[10px] text-sky-700  bg-slate-600 ">
//         <td className="col-start-6 col-span-2 text-center border-r border-sky-700 ">
//           TOTAL
//         </td>
//         <td className="col-start-8 col-span-2 text-center  border-b border-sky-700">
//           Rp 15.600.000,00
//         </td>
//       </tr>
//     </table>
//   </div>
// ));

// const PrintNota = () => {
//   const pageStyle = `
//   @page {
//     size:A5
//   }
//   @media print {
//     body {
//       -webkit-print-color-adjust: exact;
//       font-family: 'Arial', sans-serif;
//     }
//     h1 {
//       color: blue;
//     }
//   }
// `;

//   const componentRef = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     pageStyle: pageStyle,
//   });
//   const data = [
//     {
//       jumlah: "2",
//       deskripsi: "GRC 4 meter",
//       hargaSatuan: "240000",
//       hargaTotal: "480000",
//     },
//     {
//       jumlah: "3",
//       deskripsi: "GRC 5 meter",
//       hargaSatuan: "320000",
//       hargaTotal: "960000",
//     },
//   ];

//   return (
//     <div className="p-4">
//       <button
//         onClick={handlePrint}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-110 duration-300"
//       >
//         Cetak Nota
//       </button>
//       <div className="hidden">
//         {" "}
//         <Nota ref={componentRef} data={data} />
//       </div>
//     </div>
//   );
// };
