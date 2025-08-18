import { z } from 'zod'

export const PdfMetadataSchema = z.object({
  title: z.string(),
})

export type PdfMetadata = z.infer<typeof PdfMetadataSchema>

export const HtmlMetadataSchema = z.object({
  title: z.object({
    document: z.string().nullable(),
    display: z.string().nullable(),
    og: z.string().nullable(),
    twitter: z.string().nullable(),
    jsonld: z.string().nullable(),
  }),
})

export type HtmlMetadata = z.infer<typeof HtmlMetadataSchema>

export const YoutubeDataAPIV3MetadataSchema = z.object({
  title: z.string(),
})

export type YoutubeDataAPIV3Metadata = z.infer<
  typeof YoutubeDataAPIV3MetadataSchema
>

export const UdemyAffiliateAPIMetadataSchema = z.object({
  title: z.string(),
})

export type UdemyAffiliateAPIMetadata = z.infer<
  typeof UdemyAffiliateAPIMetadataSchema
>

export const FeatureExtractionResultDetailDataSchema = z.discriminatedUnion(
  'source',
  [
    z.object({
      source: z.literal('PdfFile'),
      metadata: PdfMetadataSchema,
    }),
    z.object({
      source: z.literal('Html'),
      metadata: HtmlMetadataSchema,
    }),
    z.object({
      source: z.literal('YoutubeDataAPIV3'),
      metadata: YoutubeDataAPIV3MetadataSchema,
    }),
    z.object({
      source: z.literal('UdemyAffiliateAPI'),
      metadata: UdemyAffiliateAPIMetadataSchema,
    }),
  ],
)

export type FeatureExtractionResultDetailData = z.infer<
  typeof FeatureExtractionResultDetailDataSchema
>

export const FeatureExtractionResultDataSchema = z.discriminatedUnion(
  'success',
  [
    z.object({
      url: z.string(),
      success: z.literal(true),
      detail: FeatureExtractionResultDetailDataSchema,
    }),
    z.object({
      url: z.string(),
      success: z.literal(false),
      error: z.string(),
    }),
  ],
)

export type FeatureExtractionResultData = z.infer<
  typeof FeatureExtractionResultDataSchema
>

export const FeatureExtractionDataSchema = z.object({
  date: z.date(),
})

export type FeatureExtractionData = z.infer<typeof FeatureExtractionDataSchema>
