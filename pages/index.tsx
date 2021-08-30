import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import paths from '../data/paths'
import { Header, Main, Column, H1, H2, P } from '../src/ui'
import { Paths } from '../src/path'

export const getStaticProps = async (_: GetStaticPropsContext) => {
  return {
    props: {
      paths,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ paths }: Props) {
  return (
    <div>
      <Head>
        <title>The Learning Path</title>
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
          <H1>Welcome to The&nbsp;Learning&nbsp;Path</H1>
        </Column>

        <Column>
          <P>
            You are possibly here because of realising how valuable it is to
            acquire new skills and to make the most out of those you already
            master.
          </P>
          <P>
            Although there are some amazing platforms providing high quality
            paid educational content, the web is a wild place and there is some
            equally stunning learning material provided entirely for free.
          </P>
          <P>
            A challenge you may face is to find the right content among hundreds
            of resources. <br /> You may not always know what to start from or
            what to progress with. <br /> You may be unsure about how newly
            acquired shiny pieces of knowledge fit together.
          </P>
          <P>
            This project tries to solve those issues, providing you with ordered
            lists of resources useful to learn on different topics.
            <br /> All of the resources are free and hand-picked to create
            learning paths which aim to be as comprehensive and consistent as
            possible.
          </P>
        </Column>

        <Column>
          <H2>The learning paths</H2>
          <Paths paths={paths} />
        </Column>
      </Main>
    </div>
  )
}
