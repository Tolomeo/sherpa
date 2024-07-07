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

export const ResourceSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  type: z.nativeEnum(ResourceType),
  source: z.string().min(2),
})

export type Resource = z.infer<typeof ResourceSchema>
