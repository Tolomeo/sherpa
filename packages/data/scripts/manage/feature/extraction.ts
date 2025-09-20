import FeatureExtractionRunner from '../../../src/feature/runner'
import { getByName as getTopicByName } from '../../../src/topic/model'
import {
  getAllById as getResourcesById,
  getByUrl as getResourceByUrl,
} from '../../../src/resource/model'
import { create as createFeatureExtraction } from '../../../src/feature/model'

const run = async () => {
  const topic = await getTopicByName('htmlcss')

  if (!topic) throw new Error(`Topic not found`)

  const resourceIds = await topic.getResources()
  const resources = await getResourcesById(...resourceIds)

  const featureExtractionRun = await createFeatureExtraction({
    date: new Date(),
    trigger: 'manual',
  })
  const featureExtractionRunner = new FeatureExtractionRunner()

  const results = await Promise.all(
    resources.map((resource) => {
      return featureExtractionRunner.run(resource.url, resource.healthcheck)
    }),
  )

  await featureExtractionRun.setResults(results)

  await featureExtractionRunner.teardown()
}

const extractOne = async () => {
  // const url = 'https://www.udemy.com/course/modern-react/'
  // const url = 'https://www.udemy.com/course/javascript-essentials'
  // const url = 'https://www.youtube.com/@teej_dv'
  // const url = 'https://www.youtube.com/playlist?list=PLT98CRl2KxKHaKA9-4_I38sLzK134p4GJ'
  // const url = 'https://www.youtube.com/watch?v=MpFog2kZsHk'
  // const url = 'https://python-notes.curiousefficiency.org'
  const url = 'https://flaviocopes.com/jest'
  // const url = 'https://www.maths.ox.ac.uk/system/files/legacy/2356/basic-unix.pdf'
  const resource = await getResourceByUrl(url)

  if (!resource) throw new Error(`Resource not found`)

  const featureExtractionRunner = new FeatureExtractionRunner()

  const result = await featureExtractionRunner.run(
    resource.url,
    resource.healthcheck,
  )

  console.log(JSON.stringify(result))

  await featureExtractionRunner.teardown()
}

const extractPDF = async () => {
  const url =
    'https://uploads-ssl.webflow.com/609ce44d3dfdab98b5019cf9/6143613a2ebbb44c1e9d1251_BusinessThinkingforDesigners.pdf'
  /* const url =
    'https://github.com/pdf-association/pdf20examples/raw/refs/heads/master/Simple%20PDF%202.0%20file.pdf' */

  const featureExtractionRunner = new FeatureExtractionRunner()

  const result = await featureExtractionRunner.run(url, { runner: 'PdfFile' })

  console.log(JSON.stringify(result))

  await featureExtractionRunner.teardown()
}

export default run
