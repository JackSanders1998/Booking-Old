import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function VenueForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <Form<S> {...props}>
        <LabeledTextField name="name" label="Name" placeholder="Name" />

        <LabeledTextField
          name="timeSlots.0.start"
          label="Time slot start"
          placeholder="Time slot start"
        />
        <LabeledTextField
          name="timeSlots.1.end"
          label="Time slot end"
          placeholder="Time slot end"
        />
      </Form>
    </div>
  )
}
