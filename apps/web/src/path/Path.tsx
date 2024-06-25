import { useEffect } from 'react'
import type { Path, Resource } from '@sherpa/data/types'
import { LayoutProvider } from '../theme'
import Provider from './Provider'
import Header from './header'
import Footer from './footer'
import Content from './content'
import { useResourcesCompletionStore } from './utils'

interface Props {
  path: Path
  resources: Resource[]
}

const PathComponent = ({ path, resources }: Props) => {
  const { prune } = useResourcesCompletionStore()

  useEffect(() => {
    const resourcesUrls = resources.map(({ url }) => url)
    const { topic } = path
    // eslint-disable-next-line no-console
    prune(resourcesUrls, topic).catch(console.error)
  }, [prune, path, resources])

  return (
    <LayoutProvider>
      <Provider path={path} resources={resources}>
        <Header />
        <Content />
        <Footer />
      </Provider>
    </LayoutProvider>
  )
}

export default PathComponent
