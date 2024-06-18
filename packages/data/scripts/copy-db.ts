/* eslint-disable no-await-in-loop */
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as util from 'node:util'
// import { listPaths, readPath } from './paths/read'
// import pathsData from '../src/store/paths'
// import { listResources, readResources } from './resources/read'

const {
  positionals: [srcDir, outDir],
} = util.parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
})

if (!srcDir || !outDir) {
  console.error('Both source dir and output dir must be specified')
  console.error('For example: tsx scripts/copy-db.ts src dist')
  process.exit(1)
}

function findFilesByExtension(dir: string, ext: string) {
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
}

const copyDBFiles = () => {
  const dbfiles = findFilesByExtension(srcDir, '.db')

  for (const dbfile of dbfiles) {
    const dbname = path.basename(dbfile)
    const dbdir = path.dirname(dbfile)

    fs.mkdirSync(path.join(outDir, dbdir), { recursive: true })
    fs.copyFileSync(
      path.join(srcDir, dbdir, dbname),
      path.join(outDir, dbdir, dbname),
    )
  }
}

;(function main() {
  copyDBFiles()
  // await buildPaths()
})()
