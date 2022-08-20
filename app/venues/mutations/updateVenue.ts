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
    const venue = await db.venue.update({
      where: { id },
      data: {
        ...data,
        timeSlots: {
          upsert: data.timeSlots.map((timeSlot) => ({
            // Appears to be a prisma bug,
            // because `|| 0` shouldn't be needed
            where: { id: timeSlot.id || 0 },
            create: { start: timeSlot.start, end: timeSlot.end, venueId: id },
            update: { start: timeSlot.start, end: timeSlot.end, venueId: id },
          })),
        },
      },
      include: {
        timeSlots: true,
      },
    })
    const time_slot: any = await db.timeSlot.create({
      data: {
        ...data,
        start: time_slot.start,
        end: time_slot.end,
        venueId: venue.id,
      },
    })
    return venue
  }
)
