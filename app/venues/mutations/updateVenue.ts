import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateVenue = z.object({
  id: z.number(),
  name: z.string(),
  start: z.date(),
  end: z.date(),
  timeSlots: z.array(z.object({ id: z.number().optional(), start: z.date(), end: z.date() })),
})

export default resolver.pipe(
  resolver.zod(UpdateVenue),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // const venue = await db.venue.update({ where: { id }, data })
    const venue = await db.venue.update({
      where: { id },
      data: {
        ...data,
        timeSlots: {
          upsert: data.timeSlots.map((timeSlot) => ({
            // Appears to be a prisma bug,
            // because `|| 0` shouldn't be needed
            where: { id: timeSlot.id || 0 },
            create: { start: timeSlot.start, end: timeSlot.end },
            update: { start: timeSlot.start, end: timeSlot.end },
          })),
        },
      },
      include: {
        timeSlots: true,
      },
    })

    return venue
  }
)
