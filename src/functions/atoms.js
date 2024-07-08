import { atom } from "recoil";

export const loadingState = atom({
  key: "loadingState", // unique ID
  default: false, // nilai default
});

export const dataKlienState = atom({
  key: "dataKlienState",
  default: null,
});

export const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

export const jumlahKlien = atom({
  key: "jumlahKlien",
  default: 0,
});

export const jumlahNota = atom({
  key: "jumlahNota",
  default: 0,
});

export const formattedDate = (newDate) => {
  const date = new Date(newDate);

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

export const detailFormated = (dateString) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
