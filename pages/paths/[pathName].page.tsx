import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { ParsedUrlQuery } from 'querystring'
import {
  Path,
  SerializedPath,
  PathsList as TPathsList,
  ParsedPath,
} from '../../data/paths'
import { getPath, getPathsList, readPath } from '../../data/paths/utils'
import { readResources } from '../../data/resources/utils'
import { Resource } from '../../data'
import { Layout, Typography } from '../../src/theme'
import { PathProvider } from '../../src/path'
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
  serializedPath: ParsedPath
  resources: Resource[]
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
  const serializedPath = readPath(topic)
  const resources = readResources(topic)
  const paths = getPathsList(config.topics as unknown as string[])

  return {
    props: {
      topic,
      path,
      serializedPath,
      resources,
      paths,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function PathPage({
  path,
  serializedPath,
  paths,
  topic,
  resources,
}: Props) {
  return (
    <>
      <PageHead>
        <title>{`Sherpa: the ${path.title} path`}</title>
      </PageHead>

      <Layout>
        <PageHeader paths={paths} />

        <PathProvider topic={topic} path={serializedPath} resources={resources}>
          <PageContent topic={topic} path={path} resources={resources} />
        </PathProvider>

        {path.notes && (
          <PageFooter>
            {path.notes.map((note, index) => (
              <Typography
                key={index}
                variant="body2"
                color="text.disabled"
                sx={{
                  overflowWrap: 'anywhere',
                }}
              >
                {note}
              </Typography>
            ))}
          </PageFooter>
        )}
      </Layout>
    </>
  )
}
