import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  paths,
  populatePath,
  PopulatedPath,
  hasPrevPaths,
  hasNextPaths,
} from '../../data'
import { Header, Main, Column, H1, H2 } from '../../src/ui'
import { Resources, Paths } from '../../src/path'
import Aside from '../../src/path/Aside'

interface Params extends ParsedUrlQuery {
  pathName: string
}

interface StaticProps {
  path: PopulatedPath
}

export const getStaticPaths: GetStaticPaths = async () => {
  const staticPaths = Object.keys(paths).map((pathName) => ({
    params: { pathName },
  }))

  return { paths: staticPaths, fallback: false }
}

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({
  params,
}) => {
  const path = paths[params!.pathName]
  const populatedPath = populatePath(path)

  return {
    props: {
      path: populatedPath,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function PathPage({ path }: Props) {
  console.log(path)

  return (
    <div>
      <Head>
        <title>The {path.title} learning path</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <Header />

      <Main>
        <Column>
          <H1>
            The <u>{path.title}</u> learning path
          </H1>
        </Column>

        {hasPrevPaths(path) && (
          <Column>
            <aside>
              <H2>You want to come from</H2>
              <Paths paths={path.prev} />
            </aside>
          </Column>
        )}

        <Column
          after={path.asides.map((aside, index) => (
            <>
              <H2>{aside.title}</H2>
              <Aside key={index} aside={aside} />
            </>
          ))}
        >
          <Resources resources={path.resources} />
        </Column>

        {hasNextPaths(path) && (
          <Column>
            <aside>
              <H2>You could continue with</H2>
              <Paths paths={path.next} />
            </aside>
          </Column>
        )}
      </Main>
    </div>
  )
}
