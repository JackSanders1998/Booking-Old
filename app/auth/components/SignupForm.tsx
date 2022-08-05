import { useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-center">Create an Account</h1>
          <Form
            submitText="Create Account"
            submitStyle="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-violet-11 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            className="space-y-6"
            schema={Signup}
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values) => {
              try {
                await signupMutation(values)
                props.onSuccess?.()
              } catch (error: any) {
                if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                  // This error comes from Prisma
                  return { email: "This email is already being used" }
                } else {
                  return { [FORM_ERROR]: error.toString() }
                }
              }
            }}
          >
            <LabeledTextField
              labelStyle="block text-sm font-medium"
              inputContainerStyle="mt-1"
              inputStyle="text-slate-07 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email address"
              placeholder="Email"
              required
            />
            <LabeledTextField
              labelStyle="block text-sm font-medium"
              inputContainerStyle="mt-1"
              inputStyle="text-slate-07 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              required
            />
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
