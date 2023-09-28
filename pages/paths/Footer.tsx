import { LayoutContainer } from '../../src/theme'

interface Props {
  children: React.ReactNode
}

const PathFooter = ({ children }: Props) => {
  return (
    <footer>
      <LayoutContainer>{children}</LayoutContainer>
    </footer>
  )
}

export default PathFooter
