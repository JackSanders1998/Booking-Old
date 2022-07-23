import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenue from "app/venues/queries/getVenue"
import updateVenue from "app/venues/mutations/updateVenue"
import { VenueForm, FORM_ERROR } from "app/venues/components/VenueForm"

export const EditVenue = () => {
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
        <title>Edit Venue {venue.id}</title>
      </Head>

      <div>
        <h1>Edit Venue {venue.id}</h1>
        <pre>{JSON.stringify(venue, null, 2)}</pre>

        <VenueForm
          submitText="Update Venue"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateVenue}
          initialValues={venue}
          onSubmit={async (values) => {
            try {
              const updated = await updateVenueMutation({
                id: venue.id,
                // timeSlots: venue.timeSlots
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowVenuePage({ venueId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
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

      <p>
        <Link href={Routes.VenuesPage()}>
          <a>Venues</a>
        </Link>
      </p>
    </div>
  )
}

EditVenuePage.authenticate = true
EditVenuePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditVenuePage
