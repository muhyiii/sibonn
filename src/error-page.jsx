import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div id="error-page" className="space-y-10">
        <h1 className="font-bold text-6xl">Oops! Kesalahan </h1>
        <p>
          <i>404</i>
        </p>
        <div className="border p-5 rounded-lg text-xl">
          <p>Maaf, halaman yang anda cari tidak ditemukan.</p>
        </div>
        <button
          className="hover:text-gray-700 font-medium"
          onClick={() => navigate(-1)}
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
