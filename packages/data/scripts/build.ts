import * as fs from 'node:fs'
import * as path from 'node:path'
import * as childProcess from 'node:child_process'
import type { TopicMetadata } from '../types/topic'
import { getAll } from '../src/topic/model'

// const srcDir = 'src'
const outDir = 'dist'

/* const {
  positionals: [outDir],
} = util.parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
})

if (!outDir) {
  console.error('An output directory must be specified')
  console.error('For example: tsx scripts/build.ts dist\n')
  process.exit(1)
} */

/* function findFilesByExtension(dir: string, ext: string) {
  const results: string[] = []

  function getFilePaths(currentDir: string) {
    const files = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const file of files) {
      const filePath = path.join(currentDir, file.name)

      if (file.isDirectory()) {
        getFilePaths(filePath)
      } else if (file.isFile() && path.extname(file.name) === ext) {
        results.push(path.relative(dir, filePath))
      }
    }
  }

  getFilePaths(dir)
  return results
} */

const buildTS = () => {
  childProcess.execSync('tsc --project "tsconfig.build.json"', {
    stdio: 'inherit',
  })
}

const buildJSON = async () => {
  const topics = await getAll()

  const metadataDist = path.join(outDir, 'json', 'meta')

  if (!fs.existsSync(metadataDist))
    fs.mkdirSync(metadataDist, { recursive: true })

  for (const topic of topics) {
    const metadata = topic.metadata

    fs.writeFileSync(
      path.join(metadataDist, `${topic.name}.json`),
      JSON.stringify(metadata),
      { encoding: 'utf8' },
    )
  }

  const topicDist = path.join(outDir, 'json', 'topic')

  if (!fs.existsSync(topicDist)) fs.mkdirSync(topicDist, { recursive: true })

  for (const topic of topics) {
    const pathData = await topic.populate()

    fs.writeFileSync(
      path.join(topicDist, `${topic.name}.json`),
      JSON.stringify(pathData),
      { encoding: 'utf8' },
    )
  }
}

;(async function main() {
  buildTS()
  await buildJSON()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
