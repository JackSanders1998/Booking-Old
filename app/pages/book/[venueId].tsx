import { Suspense } from "react"
import { Head, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import BookingTool from "app/core/components/BookingTool"

export const BookVenue = () => {
  const router = useRouter()
  const venueId = useParam("venueId", "number")
  const [venue] = useQuery(getVenue, { id: venueId })

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
              you&#39;d be available to play at {venue.name} from the list.
            </p>
          </div>
        </div>
        <BookingTool />
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

BookVenuePage.authenticate = false
BookVenuePage.suppressFirstRenderFlicker = true
BookVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default BookVenuePage
