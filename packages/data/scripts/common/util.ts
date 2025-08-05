import open from 'open'
import { chromium } from 'playwright'

export type JSONSerializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<JSONSerializable>
  | { [key: string]: JSONSerializable }

export interface Browser {
  goTo: (url: string) => Promise<unknown>
  close: () => Promise<void>
}

const clone = <T extends JSONSerializable>(value: T) =>
  JSON.parse(JSON.stringify(value)) as T

const openBrowser = async (): Promise<Browser> => {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  return {
    goTo: (url: string) => page.goto(url),
    close: () => browser.close(),
  }
}

export default {
  open,
  openBrowser,
  clone,
}
