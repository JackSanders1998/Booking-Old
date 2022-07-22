import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetTimeSlot = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTimeSlot), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const timeSlot = await db.timeSlot.findFirst({ where: { id } })

  if (!timeSlot) throw new NotFoundError()

  return timeSlot
})
