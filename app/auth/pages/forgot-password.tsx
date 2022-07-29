import { BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-center">Forgot your password?</h1>

          {isSuccess ? (
            <div>
              <h2>Request Submitted</h2>
              <p>
                If your email is in our system, you will receive instructions to reset your password
                shortly.
              </p>
            </div>
          ) : (
            <Form
              submitText="Send Reset Password Instructions"
              submitStyle="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-violet-11 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              className="space-y-6"
              schema={ForgotPassword}
              initialValues={{ email: "" }}
              onSubmit={async (values) => {
                try {
                  await forgotPasswordMutation(values)
                } catch (error: any) {
                  return {
                    [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
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
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = "/"
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>

export default ForgotPasswordPage
