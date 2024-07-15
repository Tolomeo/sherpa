/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// import * as fs from 'node:fs'
// import * as path from 'node:path'
// import * as util from 'node:util'
import * as readline from 'node:readline'
import open from 'open'
import Resource, { getUrl } from '../../src/resource'
// import { listPaths, readPath } from './paths/read'
// import pathsData from '../src/store/paths'
// import { listResources, readResources } from './resources/read'

/* const {
  positionals: [],
} = util.parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
}) */

/* if (!url) {
  console.error('A resource url must be specified')
  console.error(
    'For example: tsx scripts/resources/update.ts "http://www.resource-url.com"\n',
  )
  process.exit(1)
} */
type Nullable<T> = T | null

const input = (question: string): Promise<Nullable<string>> => {
  const describedQuestion = `\n${question}\n[q] cancel\n> `
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(describedQuestion, (answer) => {
      rl.close()

      if (answer.trim() === 'q') resolve(null)
      else resolve(answer)
    })
  })
}

const choice = async <T extends string>(
  question: string,
  options: T[],
): Promise<Nullable<T>> => {
  const describedQuestion = `${question}\n${options
    .map((option, idx) => `[${idx + 1}] ${option}`)
    .join('\n')}`

  let optionAnswer: T | undefined

  while (!optionAnswer) {
    const answer = await input(describedQuestion)

    if (answer === null) return null

    const answerIndex = parseInt(answer, 10)

    if (isNaN(answerIndex) || !options[answerIndex - 1]) {
      console.log('\nInvalid choice')
      continue
    }

    optionAnswer = options[answerIndex - 1]
  }

  return optionAnswer
}

const confirm = async (question: string): Promise<Nullable<boolean>> => {
  const confirmOptionsMap: Record<string, boolean> = {
    yes: true,
    no: false,
  }
  const confirmOptions = Object.keys(confirmOptionsMap)

  const optionAnswer = await choice(question, confirmOptions)

  if (optionAnswer === null) return null

  return confirmOptionsMap[optionAnswer]
}

const getResource = async () => {
  let resource: Resource | undefined

  while (!resource) {
    const url = await input(`Enter resource url`)

    if (url === null) return null

    const urlResource = await getUrl(url)

    if (!urlResource) {
      console.log(`\nResource "${url}" not found`)
      continue
    }

    resource = urlResource
  }

  return resource
}

const updateResource = async (resource: Resource) => {
  const resourceData = await resource.get()

  if (!resourceData) return

  const resourceUpdate = { ...resourceData }

  for (const [key, value] of Object.entries(resourceData)) {
    const valueUpdate = await input(`${key}(${value})`)

    if (!valueUpdate) continue

    resourceUpdate[key] = valueUpdate
  }

  const persist = await confirm(
    `Persist changes?\n${JSON.stringify(resourceUpdate, null, 2)}`,
  )

  if (!persist) return

  try {
    await resource.change(resourceUpdate)
  } catch (error) {
    console.error(`\nResource update failed.\n`)
    console.error(error)
  }
}

const update = async (resource: Resource) => {
  while (true) {
    const resourceData = await resource.get()

    if (!resourceData) return

    console.log(`\n${JSON.stringify(resourceData, null, 2)}`)

    const action = await choice('Choose action', ['open', 'update'])

    switch (action) {
      case 'open':
        await open(resource.url)
        break
      case 'update':
        await updateResource(resource)
        break
      case null:
        return
    }
  }
}

;(async function main() {
  while (true) {
    const resource = await getResource()

    if (resource === null) break

    await update(resource)
  }
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
