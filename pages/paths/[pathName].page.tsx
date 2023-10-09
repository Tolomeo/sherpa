import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Head from 'next/head'
import { Paths, Path, Resource } from '../../data'
import { readPathsList, readPath } from '../../data/paths/utils'
import { readResources } from '../../data/resources/utils'
import PathBody from '../../src/path'
import config from '../../src/config'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  topic: (typeof config.topics)[number]
  path: Path
  resources: Resource[]
  paths: Paths
}

export const getStaticPaths: GetStaticPaths = async () => {
  const staticPaths = config.topics.map((pathName) => ({
    params: { pathName },
  }))

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({
  params,
}) => {
  const topic = params!.pathName as (typeof config.topics)[number]
  const path = readPath(topic)
  const resources = readResources(topic)
  const paths = readPathsList(config.topics as unknown as string[])

  return {
    props: {
      topic,
      path,
      resources,
      paths,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function PathPage({ path, paths, resources }: Props) {
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

        <title>{`Sherpa: the ${path.title} path`}</title>
      </Head>

      <PathBody path={path} resources={resources} paths={paths} />
    </>
  )
}
