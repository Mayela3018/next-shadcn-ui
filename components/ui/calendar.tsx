"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "bg-white rounded-2xl shadow-sm p-4",
        months: "flex flex-col",
        month: "space-y-3",
        month_caption: "flex justify-center items-center py-2",
        caption_label: "text-sm font-bold text-[#4D267E]",
        nav: "flex items-center justify-between mb-2",
        button_previous: "p-1 rounded-lg hover:bg-[#f3eeff] text-[#4D267E] font-bold",
        button_next: "p-1 rounded-lg hover:bg-[#f3eeff] text-[#4D267E] font-bold",
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday: "flex-1 text-center text-xs font-semibold text-[#915ECF] py-1",
        weeks: "flex flex-col gap-1",
        week: "flex",
        day: "flex-1 text-center",
        day_button: "w-8 h-8 mx-auto flex items-center justify-center rounded-xl text-sm text-[#4D267E] hover:bg-[#f3eeff] transition-colors cursor-pointer font-medium",
        selected: "bg-[#4D267E] text-white rounded-xl",
        today: "bg-[#C1A5E4] text-[#4D267E] rounded-xl font-bold",
        outside: "opacity-30",
        disabled: "opacity-20 cursor-not-allowed",
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }