import { useEffect } from 'react'
import { Path, Resource } from '../../data'
import { LayoutProvider } from '../../src/theme'
import Provider from './Provider'
import Header from './Header'
import Footer from './Footer'
import Content from './Content'
import { useResourcesCompletionStore } from './utils'

type Props = {
  path: Path
  resources: Resource[]
}

const Path = ({ path, resources }: Props) => {
  const { prune } = useResourcesCompletionStore()

  useEffect(() => {
    const resourcesUrls = resources.map(({ url }) => url)
    const { topic } = path
    prune(resourcesUrls, topic).catch(console.error)
  }, [prune, path, resources])

  return (
    <main>
      <LayoutProvider>
        <Provider path={path} resources={resources}>
          <Header />
          <Content />
          <Footer />
        </Provider>
      </LayoutProvider>
    </main>
  )
}

export default Path
