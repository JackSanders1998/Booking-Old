import React, { useState } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns"
import { Ctx, useMutation, useParam, useQuery, useSession } from "blitz"
import getVenue from "app/venues/queries/getVenue"
import { atom, useRecoilState } from "recoil"

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

const selectedTimeSlotState = atom({
  key: "selectedTimeSlotState", // unique ID
  default: new Set(), // default value
})

const CalendarNav = () => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useRecoilState(selectedTimeSlotState)

  const navBack = () => {
    console.log("going back!")
  }

  const navNext = () => {
    console.log("going next!")
    console.log(selectedTimeSlots)
  }

  return (
    <div className="flex flex-row-reverse">
      <button
        onClick={() => navNext()}
        type="button"
        className="text-slate-01 relative rounded-lg bg-violet-11 mx-1 px-3 py-2 shadow-sm flex items-center space-x-3 hover:bg-violet-500 focus-within:ring-2 focus-within:ring-offset-2"
      >
        Next
        <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        onClick={() => navBack()}
        type="button"
        className="relative rounded-lg border border-slate-06 bg-slate-01 mx-1 px-3 py-2 shadow-sm flex items-center space-x-3 hover:bg-slate-02 focus-within:ring-2 focus-within:ring-offset-2"
      >
        <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        Back
      </button>
    </div>
  )
}

const TimeSelector = (date: { date: Date }) => {
  const venueId = useParam("venueId", "number")
  const [venue] = useQuery(getVenue, { id: venueId })
  // let [selectedTimeSlotsRecoil, setSelectedTimeSlotsRecoil] = useRecoilState(selectedTimeSlotState)
  let [selectedTimeSlots, setSelectedTimeSlots] = useRecoilState(selectedTimeSlotState)

  // Select a date
  const onTimeSlotClick = (selectedTimeSlot: Date) => {
    const timeSlot = selectedTimeSlot.toString()
    setSelectedTimeSlots((selectedTimeSlots) => {
      if (!selectedTimeSlots.has(timeSlot)) {
        selectedTimeSlots = new Set(selectedTimeSlots)
        selectedTimeSlots.add(timeSlot)
      } else {
        selectedTimeSlots = new Set(selectedTimeSlots)
        selectedTimeSlots.delete(timeSlot)
      }
      return selectedTimeSlots
    })
  }

  return (
    <div className="flex flex-wrap">
      {venue.timeSlots.map((timeSlot) => (
        <div key={timeSlot.id}>
          {isEqual(
            parse(format(date["date"], "MMM dd y"), "MMM dd y", new Date()),
            parse(format(timeSlot.start, "MMM dd y"), "MMM dd y", new Date())
          ) && (
            <button
              onClick={() => onTimeSlotClick(timeSlot.start)}
              type="button"
              className={classNames(
                selectedTimeSlots.has(timeSlot.start.toString()) && "bg-slate-12 text-violet-01",
                "relative rounded-lg border border-slate-06 bg-slate-01 mx-1 px-3 py-2 shadow-sm flex items-center space-x-3 hover:bg-slate-02 focus-within:ring-2 focus-within:ring-offset-2"
              )}
            >
              <h3>
                {format(timeSlot.start, "h:mma").toString().toLowerCase()}-
                {format(timeSlot.end, "h:mma").toString().toLowerCase()}
              </h3>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

const DateHeader = (dates: { dates: string[] }) => {
  return (
    <>
      {dates["dates"].map((date) => (
        <div key={date.toString()} className={"text-lg"}>
          <h3>{format(parse(date.substring(0, 15), "EEE MMM dd y", new Date()), "MMMM d")}</h3>
          <TimeSelector date={parse(date.substring(0, 15), "EEE MMM dd y", new Date())} />
        </div>
      ))}
    </>
  )
}

export default function BookingTool() {
  const venueId = useParam("venueId", "number")
  const [venue] = useQuery(getVenue, { id: venueId })
  let today: Date = startOfToday()
  let [selectedDates, setSelectedDates] = useState(new Set<string>())
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

  const dayInTimeSlots = (day: Date): boolean => {
    return venue.timeSlots.some((timeSlot) => {
      if (
        isSameDay(
          parse(format(day, "MMM dd y"), "MMM dd y", new Date()),
          parse(format(timeSlot.start, "MMM dd y"), "MMM dd y", new Date())
        )
      ) {
        return true
      }
      return false
    })
  }

  // Select a date
  const onDateClick = (selectedDate: Date) => {
    const date = selectedDate.toString()
    setSelectedDates((selectedDates) => {
      if (!selectedDates.has(date)) {
        selectedDates = new Set(selectedDates)
        selectedDates.add(date)
      } else {
        selectedDates = new Set(selectedDates)
        selectedDates.delete(date)
      }
      return selectedDates
    })
  }

  return (
    <div>
      <div className="pt-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
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
                    disabled={!dayInTimeSlots(day)}
                    className={classNames(
                      selectedDates.has(day.toString()) && "bg-slate-12 text-violet-01",
                      !selectedDates.has(day.toString()) &&
                        isToday(day) &&
                        "bg-slate-04 text-slate-12",
                      !selectedDates.has(day.toString()) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-slate-12",
                      !selectedDates.has(day.toString()) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-red-400",
                      selectedDates.has(day.toString()) &&
                        isToday(day) &&
                        "bg-slate-12 text-violet-11",
                      selectedDates.has(day.toString()) &&
                        !isToday(day) &&
                        "bg-slate-12 text-violet-01",
                      !selectedDates.has(day.toString()) && "hover:bg-slate-10",
                      !dayInTimeSlots(day) && "text-slate-09",
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
        <section className="mt-12 md:mt-0 md:pl-14">
          {selectedDates.size > 0 ? (
            <>
              <DateHeader dates={Array.from(selectedDates)} />
            </>
          ) : (
            <h2 className="font-semibold text-slate-11">Please select a date</h2>
          )}
        </section>
      </div>
      <CalendarNav />
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
