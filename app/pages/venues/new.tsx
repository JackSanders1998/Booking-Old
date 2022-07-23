import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createVenue from "app/venues/mutations/createVenue"
import { VenueForm, FORM_ERROR } from "app/venues/components/VenueForm"
import { createVenueSchema } from "app/venues/validations"

const NewVenuePage: BlitzPage = () => {
  const router = useRouter()
  const [createVenueMutation] = useMutation(createVenue)

  return (
    <div>
      <h1>Create New Venue</h1>

      <VenueForm
        submitText="Create Venue"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateVenue}
        // initialValues={{}}
        schema={createVenueSchema}
        initialValues={{ name: "", timeSlots: [] }}
        onSubmit={async (values) => {
          try {
            const venue = await createVenueMutation(values)
            router.push(Routes.ShowVenuePage({ venueId: venue.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.VenuesPage()}>
          <a>Venues</a>
        </Link>
      </p>
    </div>
  )
}

NewVenuePage.authenticate = true
NewVenuePage.getLayout = (page) => <Layout title={"Create New Venue"}>{page}</Layout>

export default NewVenuePage
