import Head from 'next/head'
import { Path } from '../../data'

type Props = {
  path: Path
}

const PageHead = ({ path }: Props) => {
  return (
    <Head>
      <title>{`Sherpa: the ${path.title} path`}</title>
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
      <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#5bbad5" />
      <link rel="shortcut icon" href="/favicon.ico?v=1" />
      <meta name="msapplication-TileColor" content="#ff6bdf" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  )
}

export default PageHead
