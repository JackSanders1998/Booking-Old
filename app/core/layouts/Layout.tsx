import { Head, BlitzLayout } from "blitz"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "Booking"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-slate-02 min-h-screen text-slate-12 font-readex">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto py-8">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout
