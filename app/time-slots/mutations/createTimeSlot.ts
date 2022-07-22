import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTimeSlot = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateTimeSlot), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const timeSlot = await db.timeSlot.create({ data: input })

  return timeSlot
})
