import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTimeSlot = z.object({
  id: z.number(),
  start: z.date(),
  end: z.date(),
})

export default resolver.pipe(
  resolver.zod(UpdateTimeSlot),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const timeSlot = await db.timeSlot.update({
      where: { id },
      data,
    })

    return timeSlot
  }
)
