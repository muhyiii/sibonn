/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loadingState, rupiah } from "../../functions/atoms";
import Loading from "../LoadingPage";
import { useLocation, useParams } from "react-router-dom";

const UpdateOrder = ({ isOpenOrder }) => {
  const handleCloseModal = () => {
    window.history.back();
    resetForm();
  };

  const { nota_no } = useParams();
  const location = useLocation();
  const [checkStatus, setCheckStatus] = useState(false);
  const [additional, setAditional] = useState(false);
  const [showSwal, setShowSwal] = useState(false);
  const [hasShownSwal, setHasShownSwal] = useState(false);

  const [totalRupiah, setTotalRupiah] = useState("");
  const [loading, setLoading] = useRecoilState(loadingState);
  const [disabledButton, setDisabledButton] = useState(true);
  const [disabledTotal, setDisabledTotal] = useState(true);

  const [formData, setFormData] = useState({
    pekerjaan: "",
    total: "",
    orders: [],
  });
  // const [orders, setOrders] = useState([]);
  const [errorInput, setErrorInput] = useState({
    pekerjaan: "",
    total: "",
    orders: [],
  });

  const resetForm = () => {
    setFormData({
      pekerjaan: "",
      total: "",
      orders: [],
    });
    setErrorInput({
      pekerjaan: "",
    });
  };
  const handleBlur = () => {
    if (totalRupiah !== "") {
      setTotalRupiah(rupiah(parseFloat(totalRupiah)));
    }
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
    if (name === "pekerjaan") {
      error = validatePekerjaan(value);
    }

    setErrorInput({ ...errorInput, [name]: error });
  };

  // TOMBOL SUBMIT UTAMA FORM TAMBAH NOTA
  const handleSubmit = async (e) => {
    // return console.log(formData);

    if (disabledButton) return;

    if (showSwal) {
      return Swal.fire({
        title: "Tambah Data Order?",
        showCancelButton: true,
        confirmButtonText: "Iya",
        cancelButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed) {
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

    e.preventDefault();
    setLoading(true);
    console.log(formData);
    try {
      const response = await fetch(
        `http://localhost:1234/notas/update/${nota_no}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      //   console.log(await response.json());
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
    handleCloseModal();
  };

  React.useEffect(() => {
    if (formData.orders?.length > 0) {
      setAditional(true);
      setDisabledTotal(false);
      setShowSwal(false);
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
    if (formData.total === "" && !hasShownSwal) {
      setShowSwal(true);
      setHasShownSwal(true);
    }
  }, [hasShownSwal, formData.orders]);
  React.useEffect(() => {
    setCheckStatus(location.state?.status);
    setFormData({
      pekerjaan: location.state?.pekerjaan,
      orders: location.state?.orders,
    });
  }, [location.state]);
  // TOMBOL UNTUK MENAMPILKAN SWAL UNTUK MENAMBAH DATA ORDER
  const handleOrderInput = () => {
    if (checkStatus) {
      Swal.fire({
        title: "Tambah order walau sudah lunas?",
        showCancelButton: true,
        confirmButtonText: "Iya",
        cancelButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed) {
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
            //   console.log("asddddddddd");
            if (result.isConfirmed) {
              // console.log("DATA DITAMBAH");
              const newOrder = result.value;
              setFormData((prevData) => {
                // Ensure orders array exists
                const orders = prevData.orders || [];

                // Check if the order description already exists
                const existingOrderIndex = orders.findIndex(
                  (order) => order.deskripsi === newOrder.deskripsi
                );

                if (existingOrderIndex !== -1) {
                  // If the description exists, update the quantity
                  const updatedOrders = orders.map((order, index) => {
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
                  // If the description doesn't exist, add the new order
                  return {
                    ...prevData,
                    orders: [...orders, newOrder],
                  };
                }
              });
              // setFormData((prevData) => {
              //   prevData.orders : [...orders, newOrder]
              // });
              console.log(formData);
              askToAddMore();
            } else console.log("DATA BERHENTI DITAMBAH");
          });
        }
      });
    } else
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
        //   console.log("asddddddddd");
        if (result.isConfirmed) {
          // console.log("DATA DITAMBAH");
          const newOrder = result.value;
          setFormData((prevData) => {
            // Ensure orders array exists
            const orders = prevData.orders || [];

            // Check if the order description already exists
            const existingOrderIndex = orders.findIndex(
              (order) => order.deskripsi === newOrder.deskripsi
            );

            if (existingOrderIndex !== -1) {
              // If the description exists, update the quantity
              const updatedOrders = orders.map((order, index) => {
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
              // If the description doesn't exist, add the new order
              return {
                ...prevData,
                orders: [...orders, newOrder],
              };
            }
          });
          // setFormData((prevData) => {
          //   prevData.orders : [...orders, newOrder]
          // });
          console.log(formData);
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
      if (result.isConfirmed) {
        handleOrderInput();
      } else {
        setShowSwal(false);
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
  }, []);
  // TOMBOL HANDLE BAYAR UNTUK INPUT DATA PEMBAYARAN
  // USEFFECT UNTUK DISABLE BUTTON
  useEffect(() => {
    if (errorInput.pekerjaan === "") setDisabledButton(false);
    else setDisabledButton(true);
  }, [formData, errorInput]);

  //   React.useEffect(() => {

  //     if (formData.orders?.length > 0) setAditional(true);
  //   }, [location.pathname]);
  if (loading) return <Loading />;
  if (!isOpenOrder) return null;

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
              <p className="text-3xl font-bold">
                {" "}
                Edit Nota Nomor {location.state.nota_no}
              </p>
              <p className="m text-gray-500 capitalize">
                Form untuk edit pekerjaan dan tambah atau edit order
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
                  htmlFor={"pekerjaan"}
                  className="text-sm text-gray-500 capitalize"
                >
                  <p className="p-2">Pekerjaan </p>
                </label>
                <input
                  type={"text"}
                  id={"pekerjaan"}
                  name={"pekerjaan"}
                  value={formData["pekerjaan"]}
                  className="border-2 rounded-lg w-full px-3 py-2 outline-none appearance-none"
                  onChange={handleChange}
                />
                {errorInput["pekerjaan"] && (
                  <p className="text-red-500 text-xs px-2 capitalize">
                    *{errorInput["pekerjaan"]}
                  </p>
                )}
              </div>
              {formData?.orders?.length > 0 && (
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
                  <div className="grid grid-cols-10 items-center py-2 text-sm space-x-5  text-center">
                    <p className="mx-10">Jumlah</p>
                    <p className="col-span-5">Deskripsi</p>
                    <p className="col-span-2">Harga</p>
                    <p className="col-span-2">Total</p>
                  </div>
                  <div className="border-b"></div>
                  {formData.orders.length > 0 &&
                    formData.orders.map((data, _) => (
                      <div
                        key={_}
                        className="grid grid-cols-10 items-center text-xs px-3 py-2 space-x-5   "
                      >
                        {" "}
                        <div className="flex items-center  space-x-5 px-1 ">
                          {" "}
                          <MdDelete size={20}
                            className="hover:scale-150 cursor-pointer duration-300 hover:text-red-600"
                            onClick={() =>
                              Swal.fire({
                                title: `Ingin menghapus order ${data.deskripsi}?`,
                                showCancelButton: true,
                                confirmButtonText: "Save",
                              }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                  Swal.fire("Saved!", "", "success");
                                } else {
                                  Swal.fire(
                                    `${data.deskripsi} tidak dihapus`,
                                    "",
                                    "info"
                                  );
                                }
                              })
                            }
                          />
                          <p className="text-center ">{data.jumlah}</p>
                        </div>
                        <p className="col-span-5 pl-2 text-wrap">
                          {data.deskripsi}
                        </p>
                        <p className="pl-5 col-span-2">{rupiah(data.harga)}</p>
                        <p className="pl-3 col-span-2">
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

export default UpdateOrder;

// /* eslint-disable react/prop-types */
// import { IoClose } from "react-icons/io5";
// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import { useRecoilState } from "recoil";
// import { loadingState, rupiah } from "../../functions/atoms";
// import Loading from "../LoadingPage";
// import { useLocation, useParams } from "react-router-dom";

// const UpdateOrder = ({ isOpenOrder }) => {
//   const handleCloseModal = () => {
//     window.history.back();
//     resetForm();
//   };

//   const { nota_no } = useParams();
//   const location = useLocation();
//   const [additional, setAditional] = useState(false);
//   const [showSwal, setShowSwal] = useState(false);
//   const [hasShownSwal, setHasShownSwal] = useState(false);

//   const [totalRupiah, setTotalRupiah] = useState("");
//   const [loading, setLoading] = useRecoilState(loadingState);
//   const [disabledButton, setDisabledButton] = useState(true);
//   const [disabledTotal, setDisabledTotal] = useState(true);

//   const [formData, setFormData] = useState({
//     pekerjaan: "",
//     total: "",
//     orders: [],
//   });
//   const [errorInput, setErrorInput] = useState({
//     pekerjaan: "",
//     total: "",
//     orders: [],
//   });

//   const resetForm = () => {
//     setFormData({
//       pekerjaan: "",
//       total: "",
//       orders: [],
//     });
//     setErrorInput({
//       pekerjaan: "",
//     });
//   };

//   const handleBlur = () => {
//     if (totalRupiah !== "") {
//       setTotalRupiah(rupiah(parseFloat(totalRupiah)));
//     }
//   };

//   // VALIDASI UNTUK PEKERJAAN
//   const validatePekerjaan = (pekerjaan) => {
//     if (pekerjaan.length < 10) {
//       return "Nama pekerjaan minimal 10 karakter";
//     }
//     return "";
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     let error = "";
//     if (name === "pekerjaan") {
//       error = validatePekerjaan(value);
//     }

//     setErrorInput({ ...errorInput, [name]: error });
//   };

//   // Fungsi untuk menghapus order
//   const handleRemoveOrder = (index) => {
//     setFormData((prevData) => {
//       const updatedOrders = prevData.orders.filter((_, i) => i !== index);
//       return {
//         ...prevData,
//         orders: updatedOrders,
//       };
//     });
//   };

//   // Fungsi untuk memperbarui order
//   const handleOrderUpdate = (index, field, value) => {
//     setFormData((prevData) => {
//       const updatedOrders = prevData.orders.map((order, i) => {
//         if (i === index) {
//           return {
//             ...order,
//             [field]: field === "jumlah" ? parseInt(value) : value,
//           };
//         }
//         return order;
//       });
//       return {
//         ...prevData,
//         orders: updatedOrders,
//       };
//     });
//   };

//   // TOMBOL SUBMIT UTAMA FORM TAMBAH NOTA
//   const handleSubmit = async (e) => {
//     if (disabledButton) return;

//     if (showSwal) {
//       return Swal.fire({
//         title: "Tambah Data Order?",
//         showCancelButton: true,
//         confirmButtonText: "Iya",
//         cancelButtonText: "Tidak",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           handleOrderInput();
//           setAditional(true);
//         } else {
//           if (formData.orders.length < 1) {
//             setAditional(false);
//           }
//           setShowSwal(false);
//         }
//       });
//     }

//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `http://localhost:1234/notas/update/${nota_no}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Terjadi kesalahan");
//       }

//       const result = await response.json();
//       Swal.fire({
//         position: "center",
//         icon: "success",
//         title: result.msg,
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } catch (error) {
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         title: "Terjadi kesalahan",
//         text: error.message,
//         showConfirmButton: true,
//       });
//     } finally {
//       setLoading(false);
//       resetForm();
//       setAditional(false);
//       handleCloseModal();
//     }
//   };

//   const handleOrderInput = async () => {
//     if (formData.orders.length > 0) {
//       try {
//         const orderResponse = await fetch(
//           `http://localhost:1234/orders/update/${nota_no}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ orders: formData.orders }),
//           }
//         );

//         if (!orderResponse.ok) {
//           throw new Error("Terjadi kesalahan pada input order");
//         }

//         const orderResult = await orderResponse.json();
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           title: orderResult.msg,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       } catch (error) {
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "Terjadi kesalahan pada input order",
//           text: error.message,
//           showConfirmButton: true,
//         });
//       } finally {
//         setLoading(false);
//         resetForm();
//         setAditional(false);
//         handleCloseModal();
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:1234/notas/${nota_no}`);
//         if (!response.ok) {
//           throw new Error("Terjadi kesalahan dalam mengambil data");
//         }
//         const data = await response.json();
//         setFormData({
//           pekerjaan: data.pekerjaan,
//           total: data.total,
//           orders: data.orders,
//         });
//         setTotalRupiah(rupiah(data.total));
//       } catch (error) {
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "Terjadi kesalahan",
//           text: error.message,
//           showConfirmButton: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [isOpenOrder]);

//   useEffect(() => {
//     if (formData.orders?.length > 0) {
//       setAditional(true);
//       setDisabledTotal(false);
//       setShowSwal(false);
//       let total = 0;
//       formData?.orders?.forEach((data) => {
//         total += data.harga * data.jumlah;
//       });
//       setTotalRupiah(rupiah(total));
//       setFormData((prevData) => ({
//         ...prevData,
//         total: total,
//       }));
//     }
//     if (formData.total === "" && !hasShownSwal) {
//       setShowSwal(true);
//       setHasShownSwal(true);
//     }
//   }, [formData.orders]);

//   useEffect(() => {
//     const isFormValid = formData.pekerjaan.length >= 10;
//     setDisabledButton(!isFormValid);
//   }, [formData.pekerjaan, formData.orders]);

//   if (!isOpenOrder) return null;

//   if (loading) return <Loading />;
//   return (
//     <>
//       {/* {loading && <Loading />} */}
//       <div className="flex justify-center fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//         <div className="rounded-lg bg-gray-100 h-fit w-1/2 my-4 p-6 shadow-lg">
//           <div className="flex justify-between items-start">
//             <h3 className="text-xl font-semibold mb-5">Update Order</h3>
//             <button onClick={handleCloseModal} className="text-2xl">
//               <IoClose />
//             </button>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div className="flex flex-col space-y-2">
//                 <label htmlFor="pekerjaan">Pekerjaan</label>
//                 <input
//                   type="text"
//                   id="pekerjaan"
//                   name="pekerjaan"
//                   value={formData.pekerjaan}
//                   onChange={handleChange}
//                   className={`p-2 border rounded ${
//                     errorInput.pekerjaan && "border-red-500"
//                   }`}
//                 />
//                 {errorInput.pekerjaan && (
//                   <p className="text-red-500 text-xs">{errorInput.pekerjaan}</p>
//                 )}
//               </div>
//               <div className="flex flex-col space-y-2">
//                 <label htmlFor="total">Total</label>
//                 <input
//                   type="text"
//                   id="total"
//                   name="total"
//                   value={totalRupiah}
//                   disabled={disabledTotal}
//                   onBlur={handleBlur}
//                   onChange={(e) => setTotalRupiah(e.target.value)}
//                   className="p-2 border rounded"
//                 />
//               </div>
//             </div>

//             {/* Render orders */}
//             <div className="space-y-2">
//               {formData.orders.length > 0 &&
//                 formData.orders.map((data, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-10 items-center text-xs p-2 space-x-5 rounded"
//                   >
//                     <input
//                       type="number"
//                       className="text-center"
//                       value={data.jumlah}
//                       onChange={(e) =>
//                         handleOrderUpdate(index, "jumlah", e.target.value)
//                       }
//                     />
//                     <p className="col-span-4 pl-2 text-wrap">
//                       {data.deskripsi}
//                     </p>
//                     <input
//                       type="number"
//                       className="col-span-2"
//                       value={data.harga}
//                       onChange={(e) =>
//                         handleOrderUpdate(index, "harga", e.target.value)
//                       }
//                     />
//                     <p className="col-span-2">
//                       {rupiah(data.harga * data.jumlah)}
//                     </p>
//                     <button
//                       onClick={() => handleRemoveOrder(index)}
//                       className="text-red-500 col-span-1"
//                     >
//                       Hapus
//                     </button>
//                   </div>
//                 ))}
//             </div>

//             <div className="flex justify-end mt-4">
//               <button
//                 type="submit"
//                 className={`bg-blue-500 text-white px-4 py-2 rounded ${
//                   disabledButton && "opacity-50 cursor-not-allowed"
//                 }`}
//                 disabled={disabledButton}
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UpdateOrder;
