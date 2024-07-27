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
