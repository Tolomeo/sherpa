import { useEffect } from 'react'
import { type PopulatedPathData } from '@sherpa/data/path'
import { LayoutProvider } from '../theme'
import Provider from './Provider'
import Header from './header'
import Footer from './footer'
import Content from './content'
import { useResourcesCompletionStore } from './utils'

interface Props {
  path: PopulatedPathData
}

const PathComponent = ({ path }: Props) => {
  const { prune } = useResourcesCompletionStore()

  useEffect(() => {
    if (!path.main) return

    const { topic, main } = path
    const mainUrls = main.map(({ url }) => url)

    // eslint-disable-next-line no-console -- catched error to console
    prune(mainUrls, topic).catch(console.error)
  }, [prune, path])

  return (
    <LayoutProvider>
      <Provider path={path}>
        <Header />
        <Content />
        <Footer />
      </Provider>
    </LayoutProvider>
  )
}

export default PathComponent
