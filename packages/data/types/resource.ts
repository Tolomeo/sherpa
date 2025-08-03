import { z } from 'zod'
import { HealthcheckStrategySchema } from './healthcheck'

export const ResourceTypeSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('knowledge'),
    variant: z.enum(['basics', 'advanced', 'how-to']),
  }),
  z.object({
    name: z.literal('reference'),
    variant: z.enum(['index', 'feed']),
  }),
  z.object({
    name: z.literal('tool'),
  }),
  z.object({
    name: z.literal('curiosity'),
  }),
])

export const ResourceDataSchema = z.object({
  url: z.string().min(2),
  data: z.object({
    title: z.string().min(2),
    source: z.string().min(2),
  }),
  type: ResourceTypeSchema,
  healthcheck: HealthcheckStrategySchema.optional(),
})

export type ResourceData = z.infer<typeof ResourceDataSchema>
