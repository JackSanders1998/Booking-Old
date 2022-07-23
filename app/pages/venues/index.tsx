import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenues from "app/venues/queries/getVenues"

const ITEMS_PER_PAGE = 100

export const VenuesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ venues, hasMore }] = usePaginatedQuery(getVenues, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {venues.map((venue) => (
          <li key={venue.id}>
            <Link href={Routes.ShowVenuePage({ venueId: venue.id })}>
              <a>{venue.name}</a>
            </Link>
            <ul>
              {venue.timeSlots.map((timeSlot) => (
                <li key={timeSlot.id}>
                  <>
                    {timeSlot.start} - {timeSlot.end}
                  </>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const VenuesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Venues</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewVenuePage()}>
            <a>Create Venue</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <VenuesList />
        </Suspense>
      </div>
    </>
  )
}

VenuesPage.authenticate = true
VenuesPage.getLayout = (page) => <Layout>{page}</Layout>

export default VenuesPage
