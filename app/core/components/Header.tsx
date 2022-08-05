import { Link } from "blitz"
import { Suspense } from "react"
import SigninButton from "app/auth/components/Signin"

export default function Header() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Link href={"/"}>
          <a>
            <h3 className="font-semibold text-lg text-slate-11 flex-1">Medli</h3>
          </a>
        </Link>
      </div>
      <div className="flex-2">
        <Suspense
          fallback={
            <p className="inline-flex items-center px-1.5 py-1 border border-slate-07 text-base font-normal rounded text-slate-11 bg-slate-03 hover:bg-slate-08 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-08">
              Loading...
            </p>
          }
        >
          <SigninButton />
        </Suspense>
      </div>
    </div>
  )
}
