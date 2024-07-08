/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loadingState } from "../../functions/atoms";
import Loading from "../LoadingPage";
import SearchUser from "../SearchUser";

const TambahNota = ({ isOpen }) => {
  const handleCloseModal = () => {
    window.history.back();
    resetForm();
  };
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const [additional, setAditional] = useState(false);
  const [showSwal, setShowSwal] = useState(false);
  const [hasShownSwal, setHasShownSwal] = useState(false);
  const [isBayar, setIsBayar] = useState(false);
  const [hasIsBayar, setHasIsBayar] = useState(false);
  const [totalRupiah, setTotalRupiah] = useState("");
  const [loading, setLoading] = useRecoilState(loadingState);
  const [disabledButton, setDisabledButton] = useState(true);
  const [disabledTotal, setDisabledTotal] = useState(true);

  const [formData, setFormData] = useState({
    nota_no: "",
    klien_id: "",
    pekerjaan: "",
    tanggal_order: getTodayDate(),
    total: "",
    orders: [],
    pembayaran: null,
  });
  // const [orders, setOrders] = useState([]);
  const [errorInput, setErrorInput] = useState({
    nota_no: "",
    klien_id: "",
    pekerjaan: "",
  });

  const resetForm = () => {
    setFormData({
      nota_no: "",
      klien_id: "",
      pekerjaan: "",
      tanggal_order: getTodayDate(),
      total: "",
      orders: [],
      pembayaran: null,
    });
    setErrorInput({
      nota_no: "",
      klien_id: "",
      pekerjaan: "",
      tanggal_order: getTodayDate(),
      total: "",
      orders: [],
      pembayaran: null,
    });
  };
  const handleBlur = () => {
    if (totalRupiah !== "") {
      setTotalRupiah(rupiah(parseFloat(totalRupiah)));
    }
  };

  // VALIDASI UNTUK NOMOR NOTA
  const validateNotaNo = (nota_no) => {
    if (!nota_no) {
      return "Nomor nota tidak boleh kosong";
    }
    return "";
  };
  // VALIDASI UNTUK PEKERJAAN
  const validatePekerjaan = (pekerjaan) => {
    if (pekerjaan.length < 10) {
      return "Nama pekerjaan minimal 10 karakter";
    }
    return "";
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    let error = "";
    if (name === "nota_no") {
      error = validateNotaNo(value);
    } else if (name === "pekerjaan") {
      error = validatePekerjaan(value);
    }
    // else if (name === "noTelp") {
    //   error = validatePhoneNumber(value);
    // }
    setErrorInput({ ...errorInput, [name]: error });
  };
  // FUNGSI UNTUK MENDAPATKAN HARI INI YYYY-MM-DD
  function getTodayDate() {
    // const today = new Date();
    // const yyyy = today.getFullYear();
    // const mm = String(today.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    // const dd = String(today.getDate()).padStart(2, "0");
    return new Date()  ;
  }

  // TOMBOL SUBMIT UTAMA FORM TAMBAH NOTA
  const handleSubmit = async (e) => {
    console.log("STATUS IS BAYAR " + isBayar);
    if (disabledButton) return;

    if (isBayar) {
      return Swal.fire({
        title: "Tambah DP atau Pelunasan",
        showCancelButton: true,
        confirmButtonText: "Iya",
        cancelButtonText: "Tidak",
      }).then((result) => {
        setHasIsBayar(true);
        setShowSwal(false);
        if (result.isConfirmed) {
          handleBayar();
        }

        setIsBayar(false);
      });
    }
    if (showSwal) {
      return Swal.fire({
        title: "Tambah Data Order?",
        showCancelButton: true,
        confirmButtonText: "Iya",
        cancelButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed) {
          if (!hasIsBayar) setIsBayar(true);
          handleOrderInput();
          setAditional(true);
        } else {
          if (formData.orders.length < 1) {
            setAditional(false);
          }
          setShowSwal(false);
        }
      });
    }

    console.log(formData);
    // return console.log("INI TEKAN TOMBOL TERAKHIR");
    e.preventDefault();
    setLoading(true);
    // return;
    try {
      const response = await fetch("http://localhost:1234/notas/tambah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
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
      });
    } catch (error) {
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
    handleCloseModal();
  };
  // USEEFFECT UNTUK MENGUBAH STATUS AGAR SETELAH FORM LENGKAP MAKA AKAN DITANYA UNTUK ORDER ATAUPUN PEMBAYARAN
  React.useEffect(() => {
    if (
      formData.klien_id !== "" &&
      formData.pekerjaan !== "" &&
      formData.tanggal_order !== "" &&
      formData.nota_no !== "" &&
      !hasShownSwal
    ) {
      setShowSwal(true);
      setHasShownSwal(true);
      // console.log("KONDISI IS BAYAR " + isBayar);
    }
    console.log("KONDISI IS BAYAR " + isBayar);
  }, [additional, formData, hasShownSwal, isBayar, showSwal]);

  React.useEffect(() => {
    if (formData.orders?.length > 0) {
      // console.log("ORDER ADA DATA");
      setDisabledTotal(false);
      let total = 0;
      formData?.orders?.forEach((data) => {
        total += data.harga * data.jumlah;
      });
      setTotalRupiah(rupiah(total));
      setFormData((prevData) => ({
        ...prevData,
        total: total,
      }));
    }
  }, [formData.orders]);
  // TOMBOL UNTUK MENAMPILKAN SWAL UNTUK MENAMBAH DATA ORDER
  const handleOrderInput = () => {
    Swal.fire({
      title: "Input Data Order",
      html: `
        <input id="jumlah" class="swal2-input" type="number" placeholder="Jumlah">
        <input id="deskripsi" class="swal2-input" type="text" placeholder="Deskripsi">
        <input id="harga" class="swal2-input" type="text" placeholder="Harga" onfocus="addCurrencyPrefix()" >
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Tambahkan",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const jumlah = document.getElementById("jumlah").value;
        const deskripsi = document.getElementById("deskripsi").value;
        const harga = document
          .getElementById("harga")
          .value.replace("Rp", "")
          .trim();
        return { jumlah: parseInt(jumlah), deskripsi, harga };
      },
    }).then((result) => {
      if (!hasIsBayar) setIsBayar(true);
      if (result.isConfirmed) {
        const newOrder = result.value;
        setFormData((prevData) => {
          // Mencari apakah deskripsi sudah ada di dalam orders
          const existingOrderIndex = prevData.orders.findIndex(
            (order) => order.deskripsi === newOrder.deskripsi
          );

          if (existingOrderIndex !== -1) {
            // Jika deskripsi sudah ada, jumlah akan ditambahkan
            const updatedOrders = prevData.orders.map((order, index) => {
              if (index === existingOrderIndex) {
                return {
                  ...order,
                  jumlah: order.jumlah + newOrder.jumlah,
                };
              }
              return order;
            });
            return {
              ...prevData,
              orders: updatedOrders,
            };
          } else {
            // Jika deskripsi belum ada, tambahkan order baru
            return {
              ...prevData,
              orders: [...prevData.orders, newOrder],
            };
          }
        });
        askToAddMore();
      } else console.log("DATA BERHENTI DITAMBAH");
    });
  };
  // SWAL UNTUK KONFIRMASI TAMBAH DATA ORDER
  const askToAddMore = () => {
    Swal.fire({
      title: "Tambah Data Lagi?",
      showCancelButton: true,
      confirmButtonText: "Iya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      // setIsBayar(true);
      if (result.isConfirmed) {
        handleOrderInput();
      } else {
        setShowSwal(false);
        // setIsBayar(false);
      }
    });
  };
  // UNTUK MEMBERIKAN RP PADA INPUT DALAM SWAL
  React.useEffect(() => {
    window.addCurrencyPrefix = () => {
      const input = document.getElementById("harga");
      if (input && !input.value.includes("Rp")) {
        input.value = "Rp " + input.value;
      }
    };
    window.addCurrencyPrefixX = () => {
      const input = document.getElementById("jumlah_bayar");
      if (input && !input.value.includes("Rp")) {
        input.value = "Rp " + input.value;
      }
    };
  }, []);
  // TOMBOL HANDLE BAYAR UNTUK INPUT DATA PEMBAYARAN
  const handleBayar = () => {
    Swal.fire({
      title: "Masukan Jumlah Pembayaran atau DP",
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
        if (jumlah_bayar > formData.total) jumlah_bayar = formData.total;

        return { jumlah_bayar, tipe_pembayaran };
      },
    }).then((result) => {
      setIsBayar(false);
      setHasIsBayar(true);
      if (result.isConfirmed) {
        const newValue = result.value;
        setFormData((prevData) => ({ ...prevData, bayar: newValue }));
      }
    });
  };
  // USEFFECT UNTUK DISABLE BUTTON
  useEffect(() => {
    if (
      errorInput.nota_no === "" &&
      errorInput.pekerjaan === "" &&
      errorInput.klien_id === "" &&
      formData.klien_id !== "" &&
      formData.nota_no !== ""
    )
      setDisabledButton(false);
    else setDisabledButton(true);
  }, [formData, errorInput]);
  if (loading) return <Loading />;
  if (!isOpen) return null;
  return (
    <div className="absolute h-screen inset-0 flex items-center justify-center z-10 inter">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className={`bg-white rounded-lg  relative ${
          additional ? " w-3/4" : "w-1/4"
        } `}
      >
        <div className="p-4 space-y-5 mb-10">
          <div className="flex space-x-10 items-start">
            <div className="">
              <p className="text-3xl font-bold"> Tambah Nota Baru</p>
              <p className="m text-gray-500">
                Form untuk menambah data nota baru
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="border right-5 absolute p-2 rounded-md hover:scale-110 ease-in hover:text-white hover:bg-sky-600 duration-300"
            >
              <IoClose />
            </button>
          </div>
          <div className="border-b "></div>
          <div
            className={`${
              additional ? "grid grid-cols-2 items-start gap-x-10" : ""
            }`}
          >
            <div className="">
              <div>
                <label
                  htmlFor={"nota_no"}
                  className="text-sm text-gray-500 capitalize"
                >
                  <p className="p-2">Nota Nomor</p>
                </label>
                <input
                  type={"number"}
                  id={"nota_no"}
                  name={"nota_no"}
                  value={formData[formData["nota_no"]]}
                  className="border-2 rounded-lg w-full px-3 py-2 outline-none appearance-none"
                  onChange={handleChange}
                />
                {errorInput["nota_no"] && (
                  <p className="text-red-500 text-xs px-2 capitalize">
                    *{errorInput["nota_no"]}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={"klien_id"}
                  className="text-sm text-gray-500 capitalize"
                >
                  <p className="p-2">Nama Klien</p>
                </label>
                <SearchUser setFormData={setFormData} />
                {errorInput["klien_id"] && (
                  <p className="text-red-500 text-xs px-2 capitalize">
                    *{errorInput["klien_id"]}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={"pekerjaan"}
                  className="text-sm text-gray-500 capitalize"
                >
                  <p className="p-2">
                    Pekerjaan{" "}
                    <span className="text-red-200 text-[10px]">(Optional)</span>
                  </p>
                </label>
                <input
                  type={"text"}
                  id={"pekerjaan"}
                  name={"pekerjaan"}
                  value={formData[formData["pekerjaan"]]}
                  className="border-2 rounded-lg w-full px-3 py-2 outline-none appearance-none"
                  onChange={handleChange}
                />
                {errorInput["pekerjaan"] && (
                  <p className="text-red-500 text-xs px-2 capitalize">
                    *{errorInput["pekerjaan"]}
                  </p>
                )}
              </div>
              {formData?.orders.length > 0 && (
                <div>
                  <label
                    htmlFor={"total"}
                    className="text-sm text-gray-500 capitalize"
                  >
                    <p className="p-2">
                      Total{" "}
                      <span className="text-red-200 text-[10px]">
                        (Otomatis)
                      </span>
                    </p>
                  </label>
                  <input
                    type={"text"}
                    id={"total"}
                    name={"total"}
                    disabled={disabledTotal}
                    value={totalRupiah}
                    className="border-2 rounded-lg w-full px-3 py-2 outline-none appearance-none"
                    onChange={(e) => {
                      setTotalRupiah(e.target.value.replace(/\D/g, ""));
                    }}
                    onBlur={handleBlur}
                  />
                  {errorInput["total"] && (
                    <p className="text-red-500 text-xs px-2 capitalize">
                      {errorInput["total"]}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor={"tanggal_order"}
                  className="text-sm text-gray-500 capitalize"
                >
                  <p className="p-2">tanggal order</p>
                </label>
                <input
                  type={"datetime-local"}
                  id={"tanggal_order"}
                  name={"tanggal_order"}
                  value={formData[formData["tanggal_order"]]}
                  className="border-2 rounded-lg w-full px-3 py-2 outline-none appearance-none"
                  onChange={handleChange}
                />
                {errorInput["tanggal_order"] && (
                  <p className="text-red-500 text-xs px-2 capitalize">
                    *{errorInput["tanggal_order"]}
                  </p>
                )}
              </div>
              {formData.pembayaran !== null && (
                <div className="capitalize mt-5 text-gray-500 ">
                  {/* <div className="border-b"></div> */}
                  <p className="px-3 text-sm">Data Pembayaran</p>
                  <div className="flex justify-between items-center text-lg border-2 px-3 py-2 rounded-lg text-center">
                    <div>
                      <p className="text-sm ">Jumlah Pembayaran</p>
                      <p className={`mt-2`}>
                        {rupiah(formData?.bayar?.jumlah_bayar)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm ">Tipe Pembayaran</p>
                      <p
                        className={`mt-2 font-semibold ${
                          formData?.bayar?.tipe_pembayaran === "TF"
                            ? "text-green-600"
                            : "text-sky-500 "
                        }`}
                      >
                        {formData?.bayar?.tipe_pembayaran === "TF"
                          ? "Transfer"
                          : "Cash"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {additional && (
              <div>
                <div className="flex justify-between items-center">
                  {" "}
                  <p className="text-sm text-gray-500 capitalize p-2">
                    Data order
                  </p>
                  <button
                    onClick={handleOrderInput}
                    className="text-sm bg-sky-600 rounded px-3 py-1 hover:scale-110 ease-in duration-200 text-white"
                  >
                    Tambah
                  </button>
                </div>
                <div className="border rounded">
                  <div className="grid grid-cols-10 items-center py-2 text-xs space-x-5  text-center">
                    <p className="">Jumlah</p>
                    <p className="col-span-5">Deskripsi</p>
                    <p className="col-span-2">Harga</p>
                    <p className="col-span-2">Total</p>
                  </div>
                  <div className="border-b"></div>
                  {formData.orders.length > 0 &&
                    formData?.orders?.map((data, _) => (
                      <div
                        key={_}
                        className="grid grid-cols-10 items-center text-xs p-2 space-x-5  rounded "
                      >
                        <p className="text-center">{data.jumlah}</p>
                        <p className="col-span-5 pl-2 text-wrap">
                          {data.deskripsi}
                        </p>
                        <p className="pl-5 col-span-2">{rupiah(data.harga)}</p>
                        <p className="pl-5 col-span-2">
                          {rupiah(data.harga * data.jumlah)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>{" "}
        <div className="bg-slate-600  rounded-b-lg h-20 flex items-center justify-end p-5">
          <button
            type="submit"
            // disabled={loading}
            className={`bg-white px-10 py-2 rounded-lg text-sky-600 font-medium ${
              !disabledButton &&
              "hover:bg-sky-600 hover:text-white hover:scale-105 duration-200 ease-out"
            }`}
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahNota;
