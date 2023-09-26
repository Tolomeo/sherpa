import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Path, PathsList as TPathsList } from '../../data/paths'
import { getPath, getPathsList } from '../../data/paths/utils'
import { Layout } from '../../src/theme'
import config from '../../src/config'
import PageHead from './Head'
import PageHeader from './Header'
import PageContent from './Content'
import PageFooter from './Footer'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  topic: (typeof config.topics)[number]
  path: Path
  paths: TPathsList
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
  const path = getPath(topic)
  const paths = getPathsList(config.topics as unknown as string[])

  return {
    props: {
      topic,
      path,
      paths,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function PathPage({ path, paths, topic }: Props) {
  return (
    <>
      <PageHead path={path} />

      <Layout>
        <PageHeader paths={paths} />

        <PageContent topic={topic} path={path} />

        <PageFooter path={path} />
      </Layout>
    </>
  )
}
