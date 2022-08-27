import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function VenueForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <div className="">
      <Form<S> {...props}>
        <LabeledTextField
          name="name"
          label="Name"
          labelStyle="block text-sm font-medium text-slate-11"
          inputContainerStyle="mt-1"
          inputStyle="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 sm:text-sm border border-gray-300 rounded-md"
          placeholder="Name"
        />
      </Form>
    </div>
  )
}
