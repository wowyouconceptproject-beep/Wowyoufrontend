"use client";

import DatePicker from "react-datepicker";
import { parseISO, format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimePicker({
  label,
  value,
  onChange,
}: DateTimePickerProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      <DatePicker
        selected={value ? parseISO(value) : null}
        onChange={(date: Date | null) => {
          if (!date) return;

          // Store local datetime instead of UTC
          onChange(format(date, "yyyy-MM-dd'T'HH:mm"));
        }}
        showTimeSelect
        timeIntervals={15}
        timeFormat="h:mm aa"
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Select date & time"
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#3E86A4]/60 focus:ring-1 focus:ring-[#3E86A4]/20"
        calendarClassName="wowyou-calendar"
        popperClassName="wowyou-popper"
      />
    </div>
  );
}