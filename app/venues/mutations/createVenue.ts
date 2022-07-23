import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateVenue = z.object({
  name: z.string(), //.min(1, "You must name your venue."),
  timeSlots: z.array(z.object({ start: z.date(), end: z.date() })),
})

export default resolver.pipe(resolver.zod(CreateVenue), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const venue = await db.venue.create({
    data: {
      ...input,
      timeSlots: { create: input.timeSlots },
    },
  })

  return venue
})
