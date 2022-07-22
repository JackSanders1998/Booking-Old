import { Suspense } from "react"
import { Head, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"

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

      <div>
        <h1>{venue.name}</h1>
        <pre>{JSON.stringify(venue, null, 2)}</pre>
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

BookVenuePage.authenticate = true
BookVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default BookVenuePage
