import { z } from 'zod'

const HttpHealthCheckRunConfigSchema = z.object({
  titleSelector: z.string(),
})

export type HttpHealthCheckRunConfig = z.infer<
  typeof HttpHealthCheckRunConfigSchema
>

const E2EHealthCheckRunConfigSchema = z.object({
  titleSelector: z.string(),
  // https://playwright.dev/docs/api/class-page#page-wait-for-load-state
  waitForLoadState: z.enum(['load', 'domcontentloaded', 'networkidle']),
})

export type E2EHealthCheckRunConfig = z.infer<
  typeof E2EHealthCheckRunConfigSchema
>

const ZenscrapeHealthCheckRunConfigSchema = z.object({
  titleSelector: z.string(),
  render: z.boolean(),
  premium: z.boolean(),
})

export type ZenscrapeHealthCheckRunConfig = z.infer<
  typeof ZenscrapeHealthCheckRunConfigSchema
>

const HealthCheckStrategySchema = z.discriminatedUnion('runner', [
  z.object({
    runner: z.literal('Http'),
    config: HttpHealthCheckRunConfigSchema,
  }),
  z.object({
    runner: z.literal('PdfFile'),
  }),
  z.object({
    runner: z.literal('E2E'),
    config: E2EHealthCheckRunConfigSchema,
  }),
  z.object({
    runner: z.literal('YoutubeData'),
  }),
  z.object({
    runner: z.literal('Zenscrape'),
    config: ZenscrapeHealthCheckRunConfigSchema,
  }),
  z.object({
    runner: z.literal('UdemyAffiliate'),
  }),
])

export type HealthCheckStrategy = z.infer<typeof HealthCheckStrategySchema>
