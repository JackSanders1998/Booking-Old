import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteVenue = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteVenue), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  await db.timeSlot.deleteMany({ where: { venueId: id } })
  const venue = await db.venue.deleteMany({ where: { id } })

  return venue
})
