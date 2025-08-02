import { z } from 'zod'
import { HealthcheckStrategySchema } from './healthcheck'

export enum ResourceType {
  basics = 'basics',
  advanced = 'advanced',
  'how-to' = 'how-to',
  curiosity = 'curiosity',
  tool = 'tool',
  reference = 'reference',
  feed = 'feed',
}

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

export const ResourceDataSchema2 = z.object({
  url: z.string().min(2),
  data: z.object({
    title: z.string().min(2),
    source: z.string().min(2),
  }),
  type: ResourceTypeSchema,
  healthcheck: HealthcheckStrategySchema.optional(),
})

export type ResourceData2 = z.infer<typeof ResourceDataSchema2>

export const ResourceDataSchema = z
  .object({
    title: z.string().min(2),
    url: z.string().url(),
    type: z.nativeEnum(ResourceType),
    source: z.string().min(2),
    healthcheck: HealthcheckStrategySchema.optional(),
  })
  .strict()

export type ResourceData = z.infer<typeof ResourceDataSchema>
