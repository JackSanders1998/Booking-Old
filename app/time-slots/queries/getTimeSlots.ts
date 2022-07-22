import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTimeSlotsInput
  extends Pick<Prisma.TimeSlotFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTimeSlotsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: timeSlots,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.timeSlot.count({ where }),
      query: (paginateArgs) => db.timeSlot.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      timeSlots,
      nextPage,
      hasMore,
      count,
    }
  }
)
