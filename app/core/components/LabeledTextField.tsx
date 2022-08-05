import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  labelStyle?: string
  inputContainerStyle?: string
  inputStyle?: string
  fieldProps?: UseFieldConfig<string>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  (
    {
      name,
      label,
      outerProps,
      fieldProps,
      labelProps,
      labelStyle,
      inputContainerStyle,
      inputStyle,
      ...props
    },
    ref
  ) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <label {...labelProps} className={labelStyle}>
          {label}
          <div className={inputContainerStyle}>
            <input {...input} className={inputStyle} disabled={submitting} {...props} ref={ref} />
          </div>
        </label>

        {touched && normalizedError && (
          <div role="alert" className="text-red-600">
            {normalizedError}
          </div>
        )}
      </div>
    )
  }
)

export default LabeledTextField
