import { Suspense } from "react"
import { Head, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import BookingTool from "app/core/components/BookingTool"

export const BookVenue = () => {
  const router = useRouter()
  const venueId = useParam("venueId", "number")
  const [venue] = useQuery(getVenue, { id: venueId })
  console.log(venue.name)

  return (
    <>
      <Head>
        <title>{venue.name}</title>
      </Head>
      <div className="py-2 w-full min-h-screen">
        <div className="flex gap-16">
          <div className="w-5/6">
            <h2 className="py-2 font-readex font-semibold text-2xl text-slate-12">
              Book a show at {venue.name}
            </h2>
            <p className="py-2 font-readex font-normal text-base text-slate-11">
              Click on a date in the calendar to see available timeslots. Pick all the timeslots
              you`&apos;`d be available to play at {venue.name} from the list.
            </p>
          </div>
          <div className="w-1/6">
            <button
              type="button"
              className="inline-flex items-center px-1.5 py-1 border border-slate-07 text-base font-normal rounded text-slate-11 bg-slate-03 hover:bg-slate-08 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-08"
            >
              Sign in
            </button>
          </div>
        </div>
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
          <BookingTool eventData={venue.timeSlots} />
        </div>
      </div>
    </>
  )
}

const BookVenuePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BookVenue />
      </Suspense>
    </div>
  )
}

BookVenuePage.suppressFirstRenderFlicker = true
BookVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default BookVenuePage

{
  /* <div>
        <h1>{venue.name}</h1>
        <pre>{JSON.stringify(venue, null, 2)}</pre>
      </div> */
}
