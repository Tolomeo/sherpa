import { z } from 'zod'

export enum ResourceType {
  competitor = 'competitor',
  basics = 'basics',
  advanced = 'advanced',
  'how-to' = 'how-to',
  curiosity = 'curiosity',
  tool = 'tool',
  reference = 'reference',
  feed = 'feed',
}

export const SerializedResourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.string().optional(),
  type: z.nativeEnum(ResourceType),
})

export type SerializedResource = z.infer<typeof SerializedResourceSchema>

export const ResourceSchema = SerializedResourceSchema.extend({
  source: z.string(),
})

export type Resource = z.infer<typeof ResourceSchema>
