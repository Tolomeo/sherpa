import { Path, Paths, Resource } from '../../data'
import { LayoutProvider } from '../../src/theme'
import Provider from './Provider'
import Header from './Header'
import Footer from './Footer'
import Content from './Content'

type Props = {
  path: Path
  resources: Resource[]
  paths: Paths
}

const Path = ({ path, resources, paths }: Props) => {
  return (
    <LayoutProvider>
      <Provider path={path} resources={resources} paths={paths}>
        <main>
          <Header />

          <Content />

          <Footer />
        </main>
      </Provider>
    </LayoutProvider>
  )
}

export default Path
