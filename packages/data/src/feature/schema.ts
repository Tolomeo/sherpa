import { z } from 'zod'

export const FeatureExtractionResultDataSchema = z.object({})

export const FeatureExtractionDataSchema = z.object({
  date: z.date(),
})

export type FeatureExtractionData = z.infer<typeof FeatureExtractionDataSchema>
