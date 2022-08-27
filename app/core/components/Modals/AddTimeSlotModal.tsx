import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ClockIcon, TrashIcon } from "@heroicons/react/outline"
import { ArrowCircleRightIcon } from "@heroicons/react/solid"
import { add } from "date-fns"
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz"
import createTimeSlot from "app/time-slots/mutations/createTimeSlot"
import { useMutation, useParam, useQuery, useRouter } from "blitz"
import getVenue from "app/venues/queries/getVenue"

const timeZone = "America/Chicago"

interface DatePickerProps {
  day: Date
}
interface TimePickerProps {
  startOrEnd: "Start" | "End"
}
interface TimePicker {
  hour: number
  minute: number
  ampm: string
}

export default function AddTimeSlotModal(props: DatePickerProps) {
  console.log(props.day)
  console.log(typeof props.day)
  const router = useRouter()
  const venueId = useParam("venueId", "number")
  const [venue, { setQueryData, refetch }] = useQuery(
    getVenue,
    { id: venueId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [createTimeSlotMutation] = useMutation(createTimeSlot)
  const [open, setOpen] = useState(false)
  const [startTime, setStartTime] = useState<TimePicker>({
    hour: 9,
    minute: 30,
    ampm: "pm",
  })
  const [endTime, setEndTime] = useState<TimePicker>({ hour: 11, minute: 45, ampm: "pm" })

  const handleAddGig = async () => {
    const startDateTime = add(new Date(props.day), {
      hours: startTime.ampm === "pm" ? startTime.hour + 12 : startTime.hour,
      minutes: startTime.minute,
    })
    const endDateTime = add(new Date(props.day), {
      hours: endTime.ampm === "pm" ? endTime.hour + 12 : endTime.hour,
      minutes: endTime.minute,
    })
    const values: { start: Date; end: Date; venueId: number } = {
      start: startDateTime,
      end: endDateTime,
      venueId: venue.id,
    }
    try {
      const timeSlot = await createTimeSlotMutation(values)
      setOpen(false)
      refetch()
    } catch (error: any) {
      console.error(error)
      return JSON.stringify(error)
    }
  }
  const TimePicker = (props: TimePickerProps): JSX.Element => {
    const handleChange = (key: any, value: any) => {
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
              onChange={(hour: number) => {
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
              onChange={(minute: number) => {
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
              onChange={(ampm: string) => {
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
      <button
        type="button"
        className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        onClick={() => setOpen(true)}
      >
        AddTimeSlot
      </button>{" "}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-slate-11">
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
                      onClick={() => handleAddGig()}
                    >
                      Add Gig Time
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setOpen(false)}
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
