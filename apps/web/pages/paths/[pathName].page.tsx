import type { ParsedUrlQuery } from 'querystring'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import {
  type TopicName,
  type PopulatedTopicData,
  type TopicMetadata,
} from '@sherpa/data/topic'
import PathsProvider from '../../src/paths'
import PathBody from '../../src/path'
import config from '../../src/config'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  paths: TopicMetadata[]
  path: PopulatedTopicData
}

export const getStaticPaths: GetStaticPaths = () => {
  const staticPaths = config.paths.topics.map((pathName) => ({
    params: { pathName },
  }))

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = ({
  params,
}) => {
  const paths = config.paths.topics.map((topicName) => {
    const topicMetadata = require(
      `@sherpa/data/json/meta/${topicName}.json`,
    ) as TopicMetadata

    return topicMetadata
  })
  const topic = params!.pathName as TopicName
  const path = require(
    `@sherpa/data/json/topic/${topic}.json`,
  ) as PopulatedTopicData

  return {
    props: {
      paths,
      topic,
      path,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function PathPage({ paths, path }: Props) {
  return (
    <PathsProvider paths={paths}>
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
          config.paths.topicsTitles[path.name]
        } path`}</title>
      </Head>

      <PathBody path={path} />
    </PathsProvider>
  )
}
