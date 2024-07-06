import type { ParsedUrlQuery } from 'querystring'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import { type Path, PathTopic } from '@sherpa/data/path/schema'
import { type Resource } from '@sherpa/data/resource/schema'
import PathBody from '../../src/path'
import config from '../../src/config'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  topic: (typeof config.paths.topics)[number]
  path: Path
  resources: Resource[]
}

export const getStaticPaths: GetStaticPaths = () => {
  const staticPaths = config.paths.topics.map((pathName) => ({
    params: { pathName },
  }))

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({
  params,
}) => {
  const { default: PathModel } = await import('@sherpa/data/path/index')
  const { default: ResourceModel } = await import('@sherpa/data/resource/index')

  const topic = params!.pathName as PathTopic
  const path = new PathModel(topic)
  const pathData = await path.get()

  if (!pathData) throw new Error(`Topic ${topic} data not found`)

  const pathResources = await path.getResources()
  const resources: Resource[] = []

  for (const pathResource of pathResources) {
    const resource = new ResourceModel(pathResource)
    const resourceData = await resource.get()

    if (!resourceData) continue

    resources.push(resourceData)
  }

  return {
    props: {
      topic,
      path: pathData,
      resources,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function PathPage({ path, resources }: Props) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=1"
        />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=1"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#ff6bdf" />
        <meta name="theme-color" content="#ffffff" />

        <title>{`Sherpa: the ${
          config.paths.topicsTitles[path.topic]
        } path`}</title>
      </Head>

      <PathBody path={path} resources={resources} />
    </>
  )
}
