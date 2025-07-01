"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export type DateRange = {
  from?: Date;
  to?: Date;
};

type Props = {
  date: DateRange;
  setDate: (range: DateRange) => void;
};

export default function DatePickerWithRange({ date, setDate }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Start Date */}
      <div className="md:basis-[35%]">
        <label className="text-sm text-muted-foreground font-normal leading-none mb-1 block">
          Start date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 justify-between text-left font-normal text-muted-foreground"
            >
              {date?.from ? format(date.from, "PPP") : "Pick a date"}
              <CalendarIcon className="ml-2 size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <DayPicker
              mode="single"
              selected={date.from}
              onSelect={(selected) =>
                setDate((prev) => ({ ...prev, from: selected ?? undefined }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="md:basis-[35%]">
        <label className="text-sm text-muted-foreground font-normal leading-none mb-1 block">
          End date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 justify-between text-left font-normal text-muted-foreground"
            >
              {date?.to ? format(date.to, "PPP") : "Pick a date"}
              <CalendarIcon className="ml-2 size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <DayPicker
              mode="single"
              selected={date.to}
              onSelect={(selected) =>
                setDate((prev) => ({ ...prev, to: selected ?? undefined }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
