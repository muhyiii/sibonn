/* eslint-disable react/prop-types */
import React, { useState } from "react";

const SearchUser = ({ setFormData }) => {
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:1234/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        /* empty */
      }
    };

    fetchData();
  }, []);

  const filteredOptions = data?.filter((option) =>
    option.nama.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );
  const handleOptionClick = (option) => {
    setSelectedOption(option.nama);
    setFormData((prevData) => ({
      ...prevData,
      klien_id: option.id,
    }));
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" >
      <input
        type="text"
        value={selectedOption ? selectedOption : searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Ketik Nama Klien..."
        className="w-full px-4 py-2 border-2 outline-none rounded-lg  focus:outline-none focus:ring-2 focus:ring-sky-600"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          {filteredOptions?.length > 0 ? (
            filteredOptions?.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {option.nama}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">
              Data klien tidak ditemukan
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchUser;
