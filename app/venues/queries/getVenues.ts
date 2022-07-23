import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetVenuesInput
  extends Pick<Prisma.VenueFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetVenuesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: venues,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.venue.count({ where }),
      query: (paginateArgs) =>
        db.venue.findMany({ ...paginateArgs, where, orderBy, include: { timeSlots: true } }),
    })

    return {
      venues,
      nextPage,
      hasMore,
      count,
    }
  }
)
