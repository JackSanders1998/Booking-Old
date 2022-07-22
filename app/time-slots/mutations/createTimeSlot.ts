import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTimeSlot = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  start: z.date(),
  end: z.date(),
  venueId: z.number(),
})

export default resolver.pipe(resolver.zod(CreateTimeSlot), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const timeSlot = await db.timeSlot.create({ data: input })

  return timeSlot
})
