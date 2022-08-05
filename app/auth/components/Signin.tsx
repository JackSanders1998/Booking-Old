import { Suspense } from "react"
import { Image, Link, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import SigninPage from "../pages/login"

export const SigninButton = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    console.log("User id: ", currentUser.id)
    console.log("User role: ", currentUser.role)

    return (
      <button
        className="inline-flex items-center px-1.5 py-1 border border-slate-07 text-base font-normal rounded text-slate-11 bg-slate-03 hover:bg-slate-08 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-08"
        onClick={async () => {
          await logoutMutation()
        }}
      >
        Logout
      </button>
    )
  } else {
    return (
      <Link href={Routes.SigninPage()}>
        <a className="inline-flex items-center px-1.5 py-1 border border-slate-07 text-base font-normal rounded text-slate-11 bg-slate-03 hover:bg-slate-08 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-08">
          Sign in
        </a>
      </Link>
    )
  }
}

export default SigninButton
