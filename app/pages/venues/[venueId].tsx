import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import deleteVenue from "app/venues/mutations/deleteVenue"

export const Venue = () => {
  const router = useRouter()
  const venueId = useParam("venueId", "number")
  const [deleteVenueMutation] = useMutation(deleteVenue)
  const [venue] = useQuery(getVenue, { id: venueId })

  return (
    <>
      <Head>
        <title>Venue {venue.id}</title>
      </Head>

      <div>
        <h1>Venue {venue.id}</h1>
        <pre>{JSON.stringify(venue, null, 2)}</pre>

        <Link href={Routes.EditVenuePage({ venueId: venue.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteVenueMutation({ id: venue.id })
              router.push(Routes.VenuesPage())
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

ShowVenuePage.authenticate = true
ShowVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowVenuePage
