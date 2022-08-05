import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, Image } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenues from "app/venues/queries/getVenues"

const ITEMS_PER_PAGE = 100
const SAMPLE_IMAGE_LINK =
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8MXxhbGx8fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080&utm_source=unsplash_source&utm_medium=referral&utm_campaign=api-credit"

export const VenuesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ venues }] = usePaginatedQuery(getVenues, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // startTransition(() => {})

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {venues.map((venue) => (
        <div
          key={venue.id}
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <div className="flex-shrink-0">
            <Image
              src={SAMPLE_IMAGE_LINK}
              alt=""
              height={60}
              width={60}
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={Routes.ShowVenuePage({ venueId: venue.id })}>
              <a href="#" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <a className="text-sm font-medium text-gray-900">{venue.name}</a>
              </a>
            </Link>
          </div>
        </div>
      ))}
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
        <p className="my-4">
          <Link href={Routes.NewVenuePage()}>
            <a className="my-4">Create Venue</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <VenuesList />
        </Suspense>
      </div>
    </>
  )
}

VenuesPage.authenticate = false
VenuesPage.getLayout = (page) => <Layout>{page}</Layout>

export default VenuesPage
