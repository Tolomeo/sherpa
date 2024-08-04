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

export const HttpHealthcheckStrategySchema = object({
  runner: literal('Http'),
  config: HttpHealthcheckRunConfigSchema,
}).strict()

export const PdfFileHealthcheckStrategySchema = object({
  runner: literal('PdfFile'),
}).strict()

export const E2EHealthcheckRunConfigSchema = object({
  // TODO: css selector regex
  titleSelector: string(),
  // https://playwright.dev/docs/api/class-page#page-wait-for-load-state
  waitForLoadState: enumerator(['load', 'domcontentloaded', 'networkidle']),
})

export type E2EHealthcheckRunConfig = z.infer<
  typeof E2EHealthcheckRunConfigSchema
>

export const E2EHealthcheckStrategySchema = object({
  runner: literal('E2E'),
  config: E2EHealthcheckRunConfigSchema,
}).strict()

export const YoutubeDataHealthcheckStrategySchema = object({
  runner: literal('YoutubeData'),
}).strict()

export const ZenscrapeHealthcheckRunConfigSchema = object({
  titleSelector: string(),
  render: boolean(),
  premium: boolean(),
}).strict()

export type ZenscrapeHealthcheckRunConfig = z.infer<
  typeof ZenscrapeHealthcheckRunConfigSchema
>

export const ZenscrapeHealthcheckStrategySchema = object({
  runner: literal('Zenscrape'),
  config: ZenscrapeHealthcheckRunConfigSchema,
}).strict()

export const UdemyAffiliateHealthcheckStrategySchema = object({
  runner: literal('UdemyAffiliate'),
}).strict()

export const HealthcheckStrategySchema = discriminatedUnion('runner', [
  HttpHealthcheckStrategySchema,
  PdfFileHealthcheckStrategySchema,
  E2EHealthcheckStrategySchema,
  YoutubeDataHealthcheckStrategySchema,
  ZenscrapeHealthcheckStrategySchema,
  UdemyAffiliateHealthcheckStrategySchema,
]).default({
  runner: 'Http',
  config: {
    titleSelector: 'title:not(:empty)',
  },
})

export type HealthcheckStrategy = z.infer<typeof HealthcheckStrategySchema>

export const HealthCheckStrategies: Record<
  HealthcheckStrategy['runner'],
  HealthcheckStrategy
> = {
  Http: {
    runner: 'Http',
    config: {
      titleSelector: 'title:not(:empty)',
    },
  },
  PdfFile: {
    runner: 'PdfFile',
  },
  E2E: {
    runner: 'E2E',
    config: {
      titleSelector: 'title:not(:empty)',
      waitForLoadState: 'load',
    },
  },
  YoutubeData: {
    runner: 'YoutubeData',
  },
  Zenscrape: {
    runner: 'Zenscrape',
    config: {
      titleSelector: 'title:not(:empty)',
      render: false,
      premium: false,
    },
  },
  UdemyAffiliate: {
    runner: 'UdemyAffiliate',
  },
}
