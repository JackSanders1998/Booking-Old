import { useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { Fragment, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/solid"
import { Role, RoleMode } from "types"

type SignupFormProps = {
  onSuccess?: () => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const [artistOrVenue, setArtistOrVenue] = useState<Role>(RoleMode.ARTIST)

  const CreateAccountButton = () => {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex px-4 mx-2 justify-center w-25 rounded-md bg-slate-06 border border-slate-01 shadow sm:rounded-lg sm:px-4">
            {artistOrVenue == RoleMode.ARTIST ? (
              <>Artist</>
            ) : artistOrVenue == RoleMode.VENUE ? (
              <>Venue</>
            ) : (
              <>ERROR</>
            )}
            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-slate-06 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => setArtistOrVenue(RoleMode.VENUE)}
                    className={classNames(
                      active ? "bg-slate-04 text-slate-12" : "text-slate-12",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Venue
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => setArtistOrVenue(RoleMode.ARTIST)}
                    className={classNames(
                      active ? "bg-slate-04 text-slate-12" : "text-slate-12",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Artist
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    )
  }

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-01 border border-slate-06 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center mb-4">
            <p className="inline-block">
              Create {artistOrVenue == RoleMode.ARTIST ? <>an</> : <>a</>}
            </p>
            <CreateAccountButton />
            <p className="inline-block">Account</p>
          </div>
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
