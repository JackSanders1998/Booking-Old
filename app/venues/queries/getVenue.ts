import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetVenue = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetVenue), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const venue = await db.venue.findFirst({
    where: { id },
    include: { timeSlots: true },
  })

  if (!venue) throw new NotFoundError()

  return venue
})
