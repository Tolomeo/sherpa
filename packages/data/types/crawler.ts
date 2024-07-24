import { z } from 'zod'

const {
  literal,
  string,
  object,
  boolean,
  enum: enumerator,
  discriminatedUnion,
} = z

export const HttpCrawlerRunConfigSchema = object({
  titleSelector: string(),
}).strict()

export type HttpCrawlerRunConfig = z.infer<typeof HttpCrawlerRunConfigSchema>

export const E2ECrawlerRunConfigSchema = object({
  // TODO: css selector regex
  titleSelector: string(),
  // https://playwright.dev/docs/api/class-page#page-wait-for-load-state
  waitForLoadState: enumerator(['load', 'domcontentloaded', 'networkidle']),
})

export type E2ECrawlerRunConfig = z.infer<typeof E2ECrawlerRunConfigSchema>

export const ZenscrapeCrawlerRunConfigSchema = object({
  titleSelector: string(),
  render: boolean(),
  premium: boolean(),
}).strict()

export type ZenscrapeCrawlerRunConfig = z.infer<
  typeof ZenscrapeCrawlerRunConfigSchema
>

export const CrawlerStrategySchema = discriminatedUnion('runner', [
  object({
    runner: literal('Http'),
    config: HttpCrawlerRunConfigSchema,
  }).strict(),

  object({
    runner: literal('PdfFile'),
  }).strict(),

  object({
    runner: literal('E2E'),
    config: E2ECrawlerRunConfigSchema,
  }).strict(),

  object({
    runner: literal('YoutubeData'),
  }).strict(),

  object({
    runner: literal('Zenscrape'),
    config: ZenscrapeCrawlerRunConfigSchema,
  }).strict(),

  object({
    runner: literal('UdemyAffiliate'),
  }).strict(),
])

export type CrawlerStrategy = z.infer<typeof CrawlerStrategySchema>

const ResourceIdSchema = string().regex(/^[a-zA-Z0-9]{16}$/)

export const ResourceCrawlerStrategySchema = object({
  resourceId: ResourceIdSchema,
  strategy: CrawlerStrategySchema,
}).strict()

export type ResourceCrawlerStrategy = z.infer<
  typeof ResourceCrawlerStrategySchema
>
