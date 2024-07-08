/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loadingState } from "../../functions/atoms";
import Loading from "../LoadingPage";

const TambahKlien = ({ isOpen }) => {
  const handleCloseModal = () => {
    window.history.back();
    resetForm();
  };
  const [formData, setFormData] = useState({ nama: "", noTelp: "" });
  const [errorInput, setErrorInput] = useState({ nama: "", noTelp: "" });
  const [loading, setLoading] = useRecoilState(loadingState);
  const [disabledButton, setDisabledButton] = useState(true);

  const resetForm = () => {
    setFormData({ nama: "", noTelp: "" });
    setErrorInput({ nama: "", noTelp: "" });
  };

  const validateName = (name) => {
    if (!name) {
      return "Nama tidak boleh kosong";
    }
    if (/[^a-zA-Z\s]/.test(name)) {
      return "Nama hanya boleh berisi huruf dan spasi";
    }
    return "";
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return "Nomor telepon tidak boleh kosong";
    }
    if (!/^\d+$/.test(phoneNumber)) {
      return "Nomor telepon hanya boleh berisi angka";
    }
    if (
      !/^\d{10,15}$/.test(phoneNumber) ||
      !/^(08|628)\d*$/.test(phoneNumber)
    ) {
      return "Format nomor telepon tidak valid";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let error = "";
    if (name === "nama") {
      error = validateName(value);
    } else if (name === "noTelp") {
      error = validatePhoneNumber(value);
    }
    setErrorInput({ ...errorInput, [name]: error });
  };

  const handleSubmit = async (e) => {
    if (disabledButton) return;
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:1234/users/tambah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Terjadi kesalahan");
      }

      const result = await response.json();
      console.log(response);
      Swal.fire({
        position: "center",
        icon: "success",
        title: result.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      setFormData({ nama: "", noTelp: "" });
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
  // USEFFECT UNTUK DISABLE BUTTON
  React.useEffect(() => {
    if (
      errorInput.nama === "" &&
      errorInput.noTelp === "" &&
      formData.nama !== "" &&
      formData.noTelp !== ""
    )
      setDisabledButton(false);
    else setDisabledButton(true);
  }, [formData, errorInput]);

  if (loading) return <Loading />;
  if (!isOpen) return null;
  return (
    <div className="absolute h-screen inset-0 flex items-center justify-center z-10 inter">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg  relative ">
        <div className="p-4 space-y-5 mb-10">
          <div className="flex space-x-10 items-start">
            <div className="">
              <p className="text-3xl font-bold"> Tambah Klien Baru</p>
              <p className="m text-gray-500">
                Form untuk menambah data klien atau pembeli baru
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="border p-2 rounded-md hover:scale-110 ease-in hover:text-white hover:bg-sky-600 duration-300"
            >
              <IoClose />
            </button>
          </div>
          <div className="border-b "></div>
          <div className="">
            {["nama", "noTelp"].map((input) => (
              <div key={input}>
                <label
                  htmlFor={input}
                  className="text-sm text-gray-500 capitalize"
                >
                  <p className="p-2">
                    {input == "noTelp" ? "Nomor Telepon" : input}
                  </p>
                </label>
                <input
                  type={"text"}
                  id={input}
                  name={input}
                  value={formData[input]}
                  className="border-2 rounded-lg w-full px-3 py-2 outline-none appearance-none"
                  onChange={handleChange}
                />
                {errorInput[input] && (
                  <p className="text-red-500 text-xs px-2 capitalize">
                    *{errorInput[input]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>{" "}
        <div className="bg-slate-600  rounded-b-lg h-20 flex items-center justify-end p-5">
          <button
            type="submit"
            disabled={loading}
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

export default TambahKlien;
