import { LayoutContainer, Typography, Stack } from '../../theme'
import { usePathContext } from '../Provider'

const PathFooter = () => {
  const {
    path: { notes },
  } = usePathContext()

  if (!notes) return null

  return (
    <footer>
      <LayoutContainer pt={6} pb={2}>
        <Stack spacing={1}>
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
        </Stack>
      </LayoutContainer>
    </footer>
  )
}

export default PathFooter
