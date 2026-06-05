import { useEffect, useRef } from "react";
import AirDatepicker from "air-datepicker";
import localeId from "air-datepicker/locale/id";
import "air-datepicker/air-datepicker.css";

export default function DatePicker({ value, onChange, placeholder, required }) {
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const indonesiaLocale = {
    days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    daysShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    daysMin: ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"],
    months: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    monthsShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    today: "Hari Ini",
    clear: "Bersihkan",
    dateFormat: "yyyy-MM-dd",
    timeFormat: "HH:mm",
    firstDay: 1,
  };

  useEffect(() => {
    pickerRef.current = new AirDatepicker(inputRef.current, {
      locale: indonesiaLocale,
      autoClose: true,
      altField: inputRef.current,
      altFieldDateFormat: "d MMMM yyyy",
      dateFormat: "yyyy-MM-dd",

      onSelect({ formattedDate }) {
        onChange(formattedDate);
      },
    });

    if (value) {
      pickerRef.current.selectDate(new Date(value));
    }

    return () => {
      pickerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!pickerRef.current || !value) return;

    pickerRef.current.selectDate(new Date(value), {
      silent: true,
    });
  }, [value]);

  return (
    <input
      ref={inputRef}
      defaultValue={value}
      required={required}
      placeholder={placeholder}
      className="input"
      readOnly
    />
  );
}
