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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Main>
        <Column>
          <H1>Welcome to The&nbsp;Learning&nbsp;Path</H1>
        </Column>

        <Column>
          <P>
            Whether you are a professional with years of expertise or a would-be
            engineer, you are possibly here because you realise how valuable it
            is to aquire new skills and to make the most out of those you
            already master.
          </P>
          <P>
            There are some amazing platforms providing high quality paid
            educational content and I recommend you check them out.
            <br /> The web is a wild place though and it is possible to find
            some equally stunning learning material provided entirely for free.
            That is incredible!
          </P>
          <P>
            A challenge you may face is to find it. Sometimes you are pushed as
            far as checking the second results page of your Google search.
            That&apos;s bananas, right? <br /> It is not always explicit what to
            start from or what to progress with. <br /> More often that not it
            is unclear how newly acquired shiny pieces of knowledge fit
            together.
          </P>
          <P>
            This project tries to solve those issues, providing you with
            opinionated lists of resources useful to learn on different topics.
            <br /> All resources are free and hand-picked to create learning
            paths which aim to be as comprehensive and consistent as possible.
          </P>
        </Column>

        <Column>
          <H2>All the paths</H2>
          <Paths paths={paths} />
        </Column>
      </Main>
    </div>
  )
}
