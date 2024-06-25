// import * as fs from 'node:fs'
// import * as path from 'node:path'
// import * as util from 'node:util'
import * as readline from 'node:readline'
import open from 'open'
import Resource from '../../src/model/resource'
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
const input = (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${question}\n`, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

const select = async <T extends string>(
  question: string,
  options: T[],
): Promise<T> => {
  const describedQuestion = `${question}\n${options
    .map((option, idx) => `[${idx + 1}] ${option}`)
    .join('\n')}\n`

  let optionAnswer: T | undefined

  while (!optionAnswer) {
    const answer = await input(describedQuestion)
    const answerIndex = parseInt(answer, 10)

    if (isNaN(answerIndex) || !options[answerIndex - 1]) {
      console.log('\nInvalid choice\n')
      continue
    }

    optionAnswer = options[answerIndex - 1]
  }

  return optionAnswer
}

const getResource = async () => {
  let resource: Resource | undefined

  while (!resource) {
    const url = await input(`Resource url`)
    const urlResource = new Resource(url)
    const urlResourceExists = await urlResource.exists()

    if (!urlResourceExists) {
      console.log(`\nResource "${url}" not found\n`)
      continue
    }

    resource = urlResource
  }

  return resource
}

const update = async (resource: Resource) => {
  const resourceData = await resource.get()

  if (!resourceData) return

  let updating = true

  while (updating) {
    console.log(`\n${JSON.stringify(resourceData, null, 2)}\n`)

    const action = await select('Actions', ['open-url', 'exit'])

    switch (action) {
      case 'open-url':
        await open(resource.url)
        break
      case 'exit':
        updating = false
    }
  }
}

;(async function main() {
  const resource = await getResource()

  await update(resource)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
