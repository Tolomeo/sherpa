import { z } from 'zod'
import description from './runner/scraper/html/description'

export const PDFMetadataSchema = z
  .object({
    title: z.string(),
    author: z.string().nullable(),
    publisher: z.array(z.string()).nullable(),
    publishedDate: z.string().nullable(),
    modifiedDate: z.string().nullable(),
  })
  .strict()

export type PDFMetadata = z.infer<typeof PDFMetadataSchema>

export const HtmlMetadataSchema = z
  .object({
    title: z
      .object({
        document: z.string().nullable(),
        openGraph: z.string().nullable(),
        twitter: z.string().nullable(),
        jsonld: z.string().nullable(),
        display: z.string().nullable(),
      })
      .strict(),
    author: z
      .object({
        document: z.string().nullable(),
        openGraph: z.string().nullable(),
        microdata: z.string().nullable(),
        jsonld: z.string().nullable(),
        display: z.string().nullable(),
      })
      .strict(),
    publisher: z
      .object({
        jsonld: z.string().nullable(),
        document: z.string().nullable(),
        openGraph: z.string().nullable(),
        twitter: z.string().nullable(),
        display: z.string().nullable(),
        domain: z.string().nullable(),
      })
      .strict(),
    date: z
      .object({
        document: z.string().nullable(),
        display: z.string().nullable(),
      })
      .strict(),
    publishedDate: z
      .object({
        jsonld: z.string().nullable(),
        openGraph: z.string().nullable(),
        microdata: z.string().nullable(),
        display: z.string().nullable(),
      })
      .strict(),
    modifiedDate: z
      .object({
        jsonld: z.string().nullable(),
        openGraph: z.string().nullable(),
        microdata: z.string().nullable(),
      })
      .strict(),
    description: z
      .object({
        openGraph: z.string().nullable(),
        twitter: z.string().nullable(),
        document: z.string().nullable(),
        microdata: z.string().nullable(),
        jsonld: z.string().nullable(),
      })
      .strict(),
  })
  .strict()

export type HtmlMetadata = z.infer<typeof HtmlMetadataSchema>

export const YoutubeDataAPIV3MetadataSchema = z
  .object({
    title: z.string(),
    author: z.string(),
    publisher: z.string(),
    publishedDate: z.string(),
    modifiedDate: z.string(),
    description: z.string(),
  })
  .strict()

export type YoutubeDataAPIV3Metadata = z.infer<
  typeof YoutubeDataAPIV3MetadataSchema
>

export const UdemyAffiliateAPIMetadataSchema = z
  .object({
    title: z.string(),
    author: z.array(z.string()),
    publisher: z.string(),
    publishedDate: z.string(),
    modifiedDate: z.string(),
  })
  .strict()

export type UdemyAffiliateAPIMetadata = z.infer<
  typeof UdemyAffiliateAPIMetadataSchema
>

export const FeatureExtractionResultDetailDataSchema = z.discriminatedUnion(
  'source',
  [
    z.object({
      source: z.literal('PdfFile'),
      metadata: PDFMetadataSchema,
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
    z
      .object({
        url: z.string(),
        success: z.literal(true),
        detail: FeatureExtractionResultDetailDataSchema,
      })
      .strict(),
    z
      .object({
        url: z.string(),
        success: z.literal(false),
        error: z.string(),
      })
      .strict(),
  ],
)

export type FeatureExtractionResultData = z.infer<
  typeof FeatureExtractionResultDataSchema
>

export const FeatureExtractionDataSchema = z
  .object({
    date: z.date(),
  })
  .strict()

export type FeatureExtractionData = z.infer<typeof FeatureExtractionDataSchema>
