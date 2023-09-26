import { Path } from '../../data/paths'
import { LayoutContainer, Typography } from '../../src/theme'

interface Props {
  path: Path
}

const PathFooter = ({ path }: Props) => {
  if (!path.notes) return null

  return (
    <LayoutContainer>
      <footer>
        {path.notes.map((note, index) => (
          <Typography
            key={index}
            variant="body2"
            color="text.disabled"
            sx={{
              overflowWrap: 'anywhere',
            }}
          >
            {note}
          </Typography>
        ))}
      </footer>
    </LayoutContainer>
  )
}

export default PathFooter
