import { Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import deleteVenue from "app/venues/mutations/deleteVenue"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import AddTimeSlotModal from "app/core/components/Modals/AddTimeSlotModal"
import { UserAddIcon } from "@heroicons/react/solid"

const venueLorem = {
  href: "#",
  description:
    "1 Monosodium glutamate. MSG is a sodium salt of commonly known amino acid, that is, glutamic acid. MSG has only a bit of flavor and is mainly used to enhance the flavor of savory foods. It is also used in meats, condiments, pickles, soups, candy, and baked goods to increase flavor.",
  imageSrc: "https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg",
  imageAlt: "Model wearing light green backpack with black canvas straps and front zipper pouch.",
  breadcrumbs: [
    { id: 1, name: "Venues" },
    { id: 2, name: "{venue.name}", href: "#" },
  ],
}

export const Venue = () => {
  const currentUser = useCurrentUser()
  const venueId = useParam("venueId", "number")
  const [deleteVenueMutation] = useMutation(deleteVenue)
  const [venue] = useQuery(getVenue, { id: venueId })

  return (
    <>
      <Head>
        <title>{venue.name}</title>
      </Head>

      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Venue details */}
        <div className="lg:max-w-lg lg:self-end">
          <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              {venueLorem.breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center text-sm">
                    <Link href={breadcrumb.href || Routes.VenuesPage()}>
                      <a className="font-medium text-gray-500 hover:text-gray-900">
                        {breadcrumb.name}
                      </a>
                    </Link>
                    {breadcrumbIdx !== venueLorem.breadcrumbs.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 flex-shrink-0 h-5 w-5 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-10 sm:tracking-tight sm:text-4xl">
              {venue.name}
            </h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{venueLorem.description}</p>
            </div>
          </section>
        </div>

        {/* Venue image */}
        <div className="mt-10 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:self-center">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img
              src={venueLorem.imageSrc}
              alt={venueLorem.imageAlt}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Product form */}
        <div className="mt-10 lg:max-w-lg lg:col-start-1 lg:row-start-2 lg:self-start">
          <section aria-labelledby="options-heading">
            <div className="mt-10">
              {currentUser && venue.id === currentUser.id ? (
                <Link href={Routes.EditVenuePage({ venueId: venue.id })}>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    <a>Edit {venue.name}</a>
                  </button>
                </Link>
              ) : (
                <Link href={Routes.BookVenuePage({ venueId: venue.id })}>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    <a>Book {venue.name}</a>
                  </button>
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

const ShowVenuePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Venue />
      </Suspense>
    </div>
  )
}

ShowVenuePage.authenticate = false
ShowVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowVenuePage
