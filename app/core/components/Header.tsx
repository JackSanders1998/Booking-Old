import { Link } from "blitz"

export default function Header() {
  return (
    <Link href={"/"}>
      <a>
        <h3 className="font-semibold text-lg text-slate-11">Medli</h3>
      </a>
    </Link>
  )
}
