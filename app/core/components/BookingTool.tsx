/* This example requires Tailwind CSS v2.0+ */
import React, { useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns"
import { TimeSlot } from "@prisma/client"

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default function BookingTool(props: any) {
  let today: Date = startOfToday()
  let [selectedDates, setSelectedDates] = useState(new Set<string>())
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))
  let firstDayCurrentMonth: Date = parse(currentMonth, "MMM-yyyy", new Date())

  // useEffect(() => {
  //   setSelectedDates(selectedDates)
  // }, [selectedDates])

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  // const isDayEqual = (day: Date): Boolean => {
  //   selectedDates.forEach((date) => {
  //     if (isEqual(day, date ?? -1)) {
  //       return true
  //     }
  //   })
  //   return false
  // }

  // Select a brand
  const onDateClick = (selectedDate: Date) => {
    const day = selectedDate.toString()
    setSelectedDates((selectedDates) => {
      console.log(selectedDates, day)
      if (!selectedDates.has(day)) {
        console.log("in here")
        selectedDates = new Set(selectedDates)
        selectedDates.add(day)
        console.log(selectedDates)
      } else {
        selectedDates = new Set(selectedDates)
        selectedDates.delete(day)
      }
      return selectedDates
    })
  }

  return (
    <div className="md:grid md:grid-cols-1 md:divide-x md:divide-gray-200">
      <div className="">
        <div className="flex items-center">
          <h2 className="flex-auto text-center font-inter text-2xl font-semibold text-slate-12">
            {format(firstDayCurrentMonth, "MMMM")}
          </h2>
          <button
            onClick={previousMonth}
            type="button"
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 font-inter font-normal text-slate-10">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>
        <div className="mt-2 grid grid-cols-7 text-lg font-inter font-">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx > 6 && "",
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-2"
              )}
            >
              <button
                type="button"
                onClick={() => onDateClick(day)}
                className={classNames(
                  selectedDates.has(day.toString()) && "bg-slate-12 text-violet-01",
                  !selectedDates.has(day.toString()) && isToday(day) && "bg-slate-04 text-slate-12",
                  !selectedDates.has(day.toString()) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-slate-12",
                  !selectedDates.has(day.toString()) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-red-400",
                  selectedDates.has(day.toString()) && isToday(day) && "bg-slate-12 text-violet-11",
                  selectedDates.has(day.toString()) &&
                    !isToday(day) &&
                    "bg-slate-12 text-violet-01",
                  !selectedDates.has(day.toString()) && "hover:bg-slate-10",
                  (selectedDates.has(day.toString()) || isToday(day)) && "text-slate-12",
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                )}
              >
                <time dateTime={format(day, "yyy-mm-dd")}>{format(day, "d")}</time>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]
