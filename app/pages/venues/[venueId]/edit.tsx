import React, { Fragment, Suspense, useState } from "react"
import { Head, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import updateVenue from "app/venues/mutations/updateVenue"
import { VenueForm, FORM_ERROR } from "app/venues/components/VenueForm"
import AddTimeSlotModal from "app/core/components/Modals/AddTimeSlotModal"
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
import { ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon } from "@heroicons/react/solid"
import { Dialog, Menu, Transition } from "@headlessui/react"
import { TimeSlot } from "@prisma/client"
import updateTimeSlot from "app/time-slots/mutations/updateTimeSlot"
import deleteTimeSlot from "app/time-slots/mutations/deleteTimeSlot"
import { ClockIcon } from "@heroicons/react/outline"

// Types
interface CalendarProps {
  gigs: TimeSlot[]
}
interface GigProps {
  gig: TimeSlot
}
interface DatePickerProps {
  gig: TimeSlot
  activeBool: boolean
}
interface TimePickerProps {
  startOrEnd: "Start" | "End"
}
interface TimePicker {
  [key: string]: number | string
  hour: number
  minute: number
  ampm: string
}
// Helpers
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const timeZone = "America/Chicago"

function Gig(props: GigProps) {
  const venueId = useParam("venueId", "number")
  const [venue, { setQueryData, refetch }] = useQuery(
    getVenue,
    { id: venueId },
    {
      staleTime: Infinity,
    }
  )
  const [updateTimeSlotMutation] = useMutation(updateTimeSlot)
  const [deleteTimeSlotMutation] = useMutation(deleteTimeSlot)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const handleDeleteGig = async () => {
    const timeSlotId: { id: number } = {
      id: props.gig.id,
    }
    try {
      await deleteTimeSlotMutation(timeSlotId)
      sleep(1)
      refetch()
    } catch (error: any) {
      console.error(error)
      return JSON.stringify(error)
    }
  }

  function UpdateTimeSlotModal(props: DatePickerProps) {
    const [startTime, setStartTime] = useState<TimePicker>({
      hour: props.gig.start.getHours() % 12,
      minute: props.gig.start.getMinutes(),
      ampm: props.gig.start.getHours() >= 12 ? "pm" : "am",
    })
    const [endTime, setEndTime] = useState<TimePicker>({
      hour: props.gig.end.getHours() % 12,
      minute: props.gig.start.getMinutes(),
      ampm: props.gig.start.getHours() >= 12 ? "pm" : "am",
    })
    const day = format(props.gig.start, "MM/dd/yyyy")

    const handleUpdateGig = async () => {
      const startDateTime = add(new Date(day), {
        hours: startTime.ampm === "pm" ? startTime.hour + 12 : startTime.hour,
        minutes: startTime.minute,
      })
      const endDateTime = add(new Date(day), {
        hours: endTime.ampm === "pm" ? endTime.hour + 12 : endTime.hour,
        minutes: endTime.minute,
      })
      const values: { id: number; start: Date; end: Date; venueId: number } = {
        id: props.gig.id,
        start: startDateTime,
        end: endDateTime,
        venueId: venue.id,
      }
      try {
        await updateTimeSlotMutation(values)
        setShowUpdateModal(false)
        refetch()
      } catch (error: any) {
        console.error(error)
        return JSON.stringify(error)
      }
    }

    const TimePicker = (props: TimePickerProps): JSX.Element => {
      const handleChange = (key: string, value: any) => {
        if (props.startOrEnd === "Start") {
          startTime[key] = value.target.value
          setStartTime(startTime)
        } else if (props.startOrEnd === "End") {
          endTime[key] = value.target.value
          setEndTime(endTime)
        }
      }
      return (
        <div className="flex-auto m-4 p-2 bg-slate-11 rounded-lg text-l">
          <div className="mx-4 px-2 ">
            <label
              htmlFor={`${props.startOrEnd}TimePicker`}
              className="block text-sm font-medium text-gray-700"
            >
              {props.startOrEnd}:
            </label>
            <div className="flex">
              <select
                id="hour"
                name="hour"
                className="flex-1 bg-transparent appearance-none outline-none"
                defaultValue={props.startOrEnd === "Start" ? startTime.hour : endTime.hour}
                onChange={(hour: any) => {
                  handleChange("hour", hour)
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
              <span className="flex-1">:</span>
              <select
                id="minute"
                name="minute"
                className="flex-1 bg-transparent appearance-none outline-none"
                defaultValue={props.startOrEnd === "Start" ? startTime.minute : endTime.minute}
                onChange={(minute: any) => {
                  handleChange("minute", minute)
                }}
              >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
              <select
                id="ampm"
                name="ampm"
                className="flex-1 bg-transparent appearance-none outline-none"
                defaultValue={props.startOrEnd === "Start" ? startTime.ampm : endTime.ampm}
                onChange={(ampm: any) => {
                  handleChange("ampm", ampm)
                }}
              >
                <option value="am">am</option>
                <option value="pm">pm</option>
              </select>
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        {/* <a
          href="#"
          onClick={() => setShowUpdateModal(true)}
          className={classNames(
            props.activeBool ? "bg-gray-100 text-slate-900" : "text-slate-700",
            "block px-4 py-2 text-sm"
          )}
        >
          Edit
        </a> */}
        <Transition.Root show={showUpdateModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowUpdateModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative bg-slate-01 border border-slate-08 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                    <div>
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <ClockIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-slate-11"
                        >
                          Add Gigs
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Select a start and end time.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-2">
                      <TimePicker startOrEnd="Start" />
                      <TimePicker startOrEnd="End" />
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        onClick={() => handleUpdateGig()}
                      >
                        Update Gig Time
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={() => setShowUpdateModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    )
  }

  return (
    <>
      <UpdateTimeSlotModal activeBool={true} gig={props.gig} />
      <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
        <div className="flex-auto">
          <p className="mt-0.5">
            <time dateTime={props.gig.start.toDateString()}>
              {format(props.gig.start, "h:mm a")}
            </time>{" "}
            - <time dateTime={props.gig.end.toDateString()}>{format(props.gig.end, "h:mm a")}</time>
          </p>
        </div>
        <Menu
          as="div"
          className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
        >
          <div>
            <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-slate-500 hover:text-slate-600">
              <span className="sr-only">Open options</span>
              <DotsVerticalIcon className="h-6 w-6" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="focus:outline-none absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => setShowUpdateModal(true)}
                      className={classNames(
                        active ? "bg-gray-100 text-slate-900" : "text-slate-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Edit
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => handleDeleteGig()}
                      className={classNames(
                        active ? "bg-gray-100 text-slate-900" : "text-slate-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Delete
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </li>
    </>
  )
}

function Calendar(props: CalendarProps) {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

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
  let selectedDayGigs = props.gigs.filter((gig) => isSameDay(gig.start, selectedDay))
  return (
    <div>
      <div className="pt-16">
        <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-14">
              <div className="flex items-center">
                <h2 className="flex-auto font-semibold text-slate-11">
                  {format(firstDayCurrentMonth, "MMMM yyyy")}
                </h2>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-slate-400 hover:text-slate-500"
                >
                  <span className="sr-only">Previous month</span>
                  <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-slate-400 hover:text-slate-500"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-slate-500">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(dayIdx === 0 && colStartClasses[getDay(day)], "py-1.5")}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={classNames(
                        isEqual(day, selectedDay) && "text-white",
                        !isEqual(day, selectedDay) && isToday(day) && "text-red-500",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-slate-09",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-slate-400",
                        isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                        isEqual(day, selectedDay) && !isToday(day) && "bg-slate-08",
                        !isEqual(day, selectedDay) && "hover:bg-gray-200",
                        (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                      {props.gigs.some((gig) => isSameDay(gig.start, day)) && (
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <section className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-semibold text-slate-11">
                Schedule for{" "}
                <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                  {format(selectedDay, "MMM dd, yyy")}
                </time>
              </h2>
              <ol className="mt-4 space-y-1 text-sm leading-6 text-slate-500">
                {selectedDayGigs.length > 0 ? (
                  selectedDayGigs.map((gig) => <Gig gig={gig} key={gig.id} />)
                ) : (
                  <p>No gigs for today.</p>
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-row-reverse">
          <AddTimeSlotModal day={selectedDay} />
        </div>
      </div>
    </div>
  )
}

const EditVenue = () => {
  const router = useRouter()
  const venueId = useParam("venueId", "number")
  const [venue, { setQueryData }] = useQuery(
    getVenue,
    { id: venueId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateVenueMutation] = useMutation(updateVenue)
  return (
    <>
      <Head>
        <title>Edit {venue.name}</title>
      </Head>
      <div className="my-6">
        <form className="space-y-6" action="#" method="POST">
          <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="px-4 py-5 sm:p-6">
              <Calendar gigs={venue.timeSlots} />
            </div>
          </div>

          <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-slate-11">Venue Details</h3>
                <p className="mt-1 text-sm text-slate-500">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
                <VenueForm
                  submitText="Update Venue"
                  initialValues={venue}
                  onSubmit={async (values) => {
                    try {
                      const updated = await updateVenueMutation({
                        id: venue.id,
                        ...values,
                      })
                      let res = await setQueryData(updated)
                      // router.push(Routes.ShowVenuePage({ venueId: updated.id }))
                    } catch (error: any) {
                      return {
                        [FORM_ERROR]: error.toString(),
                      }
                    }
                  }}
                />

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-slate-11">
                    About
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder={`${venue.name} is the best venue in the world`}
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Brief description of your venue. URLs are hyperlinked.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Cover photo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-slate-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-slate-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Delete
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

const EditVenuePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditVenue />
      </Suspense>
    </div>
  )
}

EditVenuePage.authenticate = true
EditVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditVenuePage

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]
