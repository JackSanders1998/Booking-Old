import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import deleteVenue from "app/venues/mutations/deleteVenue"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import AddTimeSlotModal from "app/core/components/Modals/addTimeSlotModal"

export const Venue = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const venueId = useParam("venueId", "number")
  const [deleteVenueMutation] = useMutation(deleteVenue)
  const [venue] = useQuery(getVenue, { id: venueId })

  return (
    <>
      <Head>
        <title>Venue {venue.name}</title>
      </Head>

      <div>
        <h1>{venue.name}</h1>
        {/* <pre>{JSON.stringify(venue, null, 2)}</pre> */}
        <ul>
          {venue.timeSlots.map((timeslot) => (
            <li key={timeslot.id}>
              <>
                {timeslot.id}:{timeslot.start} - {timeslot.end} votes
              </>
            </li>
          ))}
        </ul>

        <Link href={Routes.BookVenuePage({ venueId: venue.id })}>
          <a>Book </a>
        </Link>

        <AddTimeSlotModal />

        <Link href={Routes.EditVenuePage({ venueId: venue.id })}>
          <a> Edit </a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (currentUser) {
              if (window.confirm("This will be deleted")) {
                await deleteVenueMutation({ id: venue.id })
                router.push(Routes.VenuesPage())
              }
            } else {
              if (window.confirm("You must be signed in to delete venues")) {
              }
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowVenuePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.VenuesPage()}>
          <a>Venues</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Venue />
      </Suspense>
    </div>
  )
}

ShowVenuePage.authenticate = false
ShowVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowVenuePage
