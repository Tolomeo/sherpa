import * as fs from 'node:fs'
import * as path from 'node:path'
import * as childProcess from 'node:child_process'
import { getAll } from '../src/topic/model'

const srcDir = 'src'
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
  childProcess.execSync('tsc', { stdio: 'inherit' })
}

const buildJSON = async () => {
  const jsonDist = path.join(outDir, 'json')

  if (!fs.existsSync(jsonDist)) fs.mkdirSync(jsonDist)

  const topics = await getAll()

  for (const topic of topics) {
    const pathData = await topic.populate()

    fs.writeFileSync(
      path.join(jsonDist, `${pathData!.topic}.json`),
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
