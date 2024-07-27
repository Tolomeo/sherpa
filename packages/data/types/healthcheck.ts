import { z } from 'zod'

const {
  literal,
  string,
  object,
  boolean,
  enum: enumerator,
  discriminatedUnion,
} = z

export const HttpHealthcheckRunConfigSchema = object({
  titleSelector: string(),
}).strict()

export type HttpHealthcheckRunConfig = z.infer<
  typeof HttpHealthcheckRunConfigSchema
>

export const E2EHealthcheckRunConfigSchema = object({
  // TODO: css selector regex
  titleSelector: string(),
  // https://playwright.dev/docs/api/class-page#page-wait-for-load-state
  waitForLoadState: enumerator(['load', 'domcontentloaded', 'networkidle']),
})

export type E2EHealthcheckRunConfig = z.infer<
  typeof E2EHealthcheckRunConfigSchema
>

export const ZenscrapeHealthcheckRunConfigSchema = object({
  titleSelector: string(),
  render: boolean(),
  premium: boolean(),
}).strict()

export type ZenscrapeHealthcheckRunConfig = z.infer<
  typeof ZenscrapeHealthcheckRunConfigSchema
>

export const HealthcheckStrategySchema = discriminatedUnion('runner', [
  object({
    runner: literal('Http'),
    config: HttpHealthcheckRunConfigSchema,
  }).strict(),

  object({
    runner: literal('PdfFile'),
  }).strict(),

  object({
    runner: literal('E2E'),
    config: E2EHealthcheckRunConfigSchema,
  }).strict(),

  object({
    runner: literal('YoutubeData'),
  }).strict(),

  object({
    runner: literal('Zenscrape'),
    config: ZenscrapeHealthcheckRunConfigSchema,
  }).strict(),

  object({
    runner: literal('UdemyAffiliate'),
  }).strict(),
])

export type HealthcheckStrategy = z.infer<typeof HealthcheckStrategySchema>
