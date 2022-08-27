import React, { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import updateVenue from "app/venues/mutations/updateVenue"
import { VenueForm, FORM_ERROR } from "app/venues/components/VenueForm"
import AddTimeSlotModal from "app/core/components/Modals/AddTimeSlotModal"
import deleteVenue from "app/venues/mutations/deleteVenue"
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
  parseISO,
  startOfToday,
} from "date-fns"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsVerticalIcon,
} from "@heroicons/react/solid"
import { Menu, Transition } from "@headlessui/react"
import { TimeSlot } from "@prisma/client"

interface CalendarProps {
  gigs: TimeSlot[]
}

interface GigProps {
  gig: TimeSlot
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

const CalendarNav = () => {
  const navBack = () => {
    console.log("going back!")
  }

  const navNext = () => {
    console.log("going next!")
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

const Stringify = ({ venue }: any) => {
  return (
    <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="px-4 py-5 sm:p-6">
        return <>{JSON.stringify(venue)}</>
      </div>
    </div>
  )
}

const DeleteWarning = (venue: any) => {
  const router = useRouter()
  const [deleteVenueMutation] = useMutation(deleteVenue)

  return (
    <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete your venue</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Once you delete your venue, you will lose all data associated with it.</p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteVenueMutation({ id: venue.id })
                router.push(Routes.VenuesPage())
              }
            }}
          >
            Delete Venue
          </button>
        </div>
      </div>
    </div>
  )
}

function Gig(props: GigProps) {
  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <div className="flex-auto">
        <p className="mt-0.5">
          <time dateTime={props.gig.start.toDateString()}>{format(props.gig.start, "h:mm a")}</time>{" "}
          - <time dateTime={props.gig.end.toDateString()}>{format(props.gig.end, "h:mm a")}</time>
        </p>
      </div>
    </li>
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
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Previous month</span>
                  <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
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
                          "text-gray-400",
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
              <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
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
        <AddTimeSlotModal day={selectedDay} />
      </div>
      <CalendarNav />
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
                <h3 className="text-lg font-medium leading-6 text-gray-900">Venue Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
              <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Website
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        http://
                      </span>
                      <input
                        type="text"
                        name="company-website"
                        id="company-website"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="www.example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
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
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description of your venue. URLs are hyperlinked.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <div className="flex text-sm text-gray-600">
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DeleteWarning venue={venue} />
          <Stringify venue={venue} />

          <div>
            <VenueForm
              submitText="Update Venue"
              initialValues={venue}
              onSubmit={async (values) => {
                try {
                  const updated = await updateVenueMutation({
                    id: venue.id,
                    ...values,
                  })
                  await setQueryData(updated)
                  router.push(Routes.ShowVenuePage({ venueId: updated.id }))
                } catch (error: any) {
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
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
