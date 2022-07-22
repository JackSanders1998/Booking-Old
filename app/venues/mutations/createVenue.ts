import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateVenue = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateVenue), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const venue = await db.venue.create({ data: input })

  return venue
})
