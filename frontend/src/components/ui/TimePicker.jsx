import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

export default function TimePicker({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiTimePicker
        label="Pilih Waktu"
        ampm={false}
        value={value ? dayjs(`2025-01-01T${value}`) : null}
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
        }}
        onChange={(newValue) => {
          if (!newValue?.isValid()) return;

          onChange(newValue.format("HH:mm:ss"));
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            placeholder: "Pilih Waktu",
          },
        }}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "#ffffffff",
          },
          "& .MuiInputBase-input": {
            padding: "16px",
          },
        }}
      />
    </LocalizationProvider>
  );
}
