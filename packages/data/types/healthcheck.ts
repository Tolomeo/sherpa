import { z } from 'zod'

export const HttpHealthCheckRunConfigSchema = z
  .object({
    titleSelector: z.string(),
  })
  .strict()

export type HttpHealthCheckRunConfig = z.infer<
  typeof HttpHealthCheckRunConfigSchema
>

export const E2EHealthCheckRunConfigSchema = z.object({
  // TODO: css selector regex
  titleSelector: z.string(),
  // https://playwright.dev/docs/api/class-page#page-wait-for-load-state
  waitForLoadState: z.enum(['load', 'domcontentloaded', 'networkidle']),
})

export type E2EHealthCheckRunConfig = z.infer<
  typeof E2EHealthCheckRunConfigSchema
>

export const ZenscrapeHealthCheckRunConfigSchema = z
  .object({
    titleSelector: z.string(),
    render: z.boolean(),
    premium: z.boolean(),
  })
  .strict()

export type ZenscrapeHealthCheckRunConfig = z.infer<
  typeof ZenscrapeHealthCheckRunConfigSchema
>

export const HealthCheckStrategySchema = z.discriminatedUnion('runner', [
  z
    .object({
      runner: z.literal('Http'),
      config: HttpHealthCheckRunConfigSchema,
    })
    .strict(),
  z
    .object({
      runner: z.literal('PdfFile'),
    })
    .strict(),
  z
    .object({
      runner: z.literal('E2E'),
      config: E2EHealthCheckRunConfigSchema,
    })
    .strict(),
  z
    .object({
      runner: z.literal('YoutubeData'),
    })
    .strict(),
  z
    .object({
      runner: z.literal('Zenscrape'),
      config: ZenscrapeHealthCheckRunConfigSchema,
    })
    .strict(),
  z
    .object({
      runner: z.literal('UdemyAffiliate'),
    })
    .strict(),
])

export type HealthCheckStrategy = z.infer<typeof HealthCheckStrategySchema>

const ResourceIdSchema = z.string().regex(/^[a-zA-Z0-9]{16}$/)

export const HostnameHealthCheckStrategySchema = z
  .object({
    resource: ResourceIdSchema,
    strategy: HealthCheckStrategySchema,
  })
  .strict()

export type HostnameHealthCheckStrategy = z.infer<
  typeof HostnameHealthCheckStrategySchema
>
