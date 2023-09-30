import { LayoutContainer, Typography } from '../../theme'
import { usePathContext } from '../Provider'

const PathFooter = () => {
  const {
    path: { notes },
  } = usePathContext()

  if (!notes) return null

  return (
    <footer>
      <LayoutContainer>
        {notes.map((note, index) => (
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
      </LayoutContainer>
    </footer>
  )
}

export default PathFooter
