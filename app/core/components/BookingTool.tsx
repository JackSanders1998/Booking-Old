/* This example requires Tailwind CSS v2.0+ */
import React, { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns"

const events = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-07-11T13:00",
    endDatetime: "2022-07-11T14:30",
  },
  {
    id: 2,
    name: "Jack Sanders",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-07-11T13:00",
    endDatetime: "2022-07-11T14:30",
  },
  {
    id: 3,
    name: "Pablo Olavarrieta",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-07-12T22:30",
    endDatetime: "2022-07-12T23:30",
  },
  {
    id: 4,
    name: "Hank Sanders",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-07-11T11:15",
    endDatetime: "2022-07-11T13:45",
  },
  {
    id: 5,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-07-12T13:00",
    endDatetime: "2022-07-12T14:30",
  },
  {
    id: 6,
    name: "Jack Sanders",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-07-12T13:00",
    endDatetime: "2022-07-12T14:30",
  },
  {
    id: 7,
    name: "Pablo Olavarrieta",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-07-12T22:30",
    endDatetime: "2022-07-12T23:30",
  },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default function BookingTool() {
  let today: Date = startOfToday()
  let [selectedDay, setSelectedDay] = useState<Date[]>([])
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))
  let firstDayCurrentMonth: Date = parse(currentMonth, "MMM-yyyy", new Date())

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

  const isDayEqual = (day: Date): Boolean => {
    for (let i = 0; i < selectedDay.length; i++) {
      if (isEqual(day, selectedDay[i] ?? -1)) {
        return true
      }
    }
    return false
  }

  const onDateClick = (day: Date) => {
    let isSelected = false
    for (let i = 0; i < selectedDay.length; i++) {
      if (isEqual(day, selectedDay[i] ?? -1)) {
        isSelected = true
      }
    }
    if (!isSelected) {
      selectedDay.push(day)
      setSelectedDay(selectedDay)
    } else {
      selectedDay = selectedDay.filter((date) => !isEqual(day, date))
      setSelectedDay(selectedDay)
    }
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
                  isDayEqual(day) && "bg-slate-12 text-violet-01",
                  !isDayEqual(day) && isToday(day) && "bg-slate-04 text-slate-12",
                  !isDayEqual(day) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-slate-12",
                  !isDayEqual(day) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-red-400",
                  isDayEqual(day) && isToday(day) && "bg-slate-12 text-violet-11",
                  isDayEqual(day) && !isToday(day) && "bg-slate-12 text-violet-01",
                  !isDayEqual(day) && "hover:bg-slate-10",
                  (isDayEqual(day) || isToday(day)) && "text-slate-12",
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
