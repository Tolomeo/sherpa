import { Path, Paths, Resource } from '../../data'
import { LayoutProvider } from '../../src/theme'
import Provider from './Provider'
import Header from './Header'
import Footer from './Footer'
import Content from './Content'
import { useResourcesCompletionStore } from '../user'
import { useEffect } from 'react'

type Props = {
  path: Path
  resources: Resource[]
  paths: Paths
}

const Path = ({ path, resources, paths }: Props) => {
  const { prune } = useResourcesCompletionStore()

  useEffect(() => {
    const resourcesUrls = resources.map(({ url }) => url)
    const { topic } = path
    prune(resourcesUrls, topic).catch(console.error)
  }, [prune, path, resources])

  return (
    <main>
      <LayoutProvider>
        <Provider path={path} resources={resources} paths={paths}>
          <Header />
          <Content />
          <Footer />
        </Provider>
      </LayoutProvider>
    </main>
  )
}

export default Path
