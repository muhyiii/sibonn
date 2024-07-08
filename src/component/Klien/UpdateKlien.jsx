/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../loading.json";
import { dataKlienState, loadingState } from "../../functions/atoms";
import { useRecoilState } from "recoil";
import Loading from "../LoadingPage";

const UpdateKlien = ({ isOpen }) => {
  const { id } = useParams();
  const location = useLocation();

  const handleCloseModal = () => {
    window.history.back();
    resetForm();
  };
  const [formData, setFormData] = useState({
    nama: "",
    noTelp: "",
  });
  const [data, setData] = useRecoilState(dataKlienState);
  const [errorInput, setErrorInput] = useState({ nama: "", noTelp: "" });
  const [loading, setLoading] = useRecoilState(loadingState);

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
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:1234/users/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Something went wrong");
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
        setFormData({ nama: data.data.nama, noTelp: data.data.noTelp });
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
  if (loading) return <Loading />;
  if (!isOpen) return null;

  return (
    <div className="absolute h-screen inset-0 flex items-center justify-center z-10 inter">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg  relative ">
        <div className="p-4 space-y-5 mb-10">
          <div className="flex space-x-10 items-start">
            <div className="">
              <p className="text-3xl font-bold"> Update Klien</p>
              <p className="m text-gray-500">
                Form untuk mengupdate data klien
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="border p-2 rounded-md"
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
              errorInput.nama === "" &&
              errorInput.noTelp === "" &&
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

export default UpdateKlien;
