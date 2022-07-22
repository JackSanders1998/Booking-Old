import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateVenue = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateVenue),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const venue = await db.venue.update({ where: { id }, data })

    return venue
  }
)
