"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  gameDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePicker({
  gameDate,
  onDateChange,
}: DatePickerProps) {
  const t = useTranslations("admin.datePicker");

  // Convert string date to Date object for the calendar
  const selectedDate = gameDate ? new Date(gameDate) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Convert Date to YYYY-MM-DD string format
      const isoString = date.toISOString().split("T")[0];
      onDateChange(isoString);
    } else {
      onDateChange("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">{t("title")}</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gameDate">{t("label")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="gameDate"
              variant={"outline"}
              className={cn(
                "w-full md:w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-600">{t("description")}</p>
      </div>
    </div>
  );
}
