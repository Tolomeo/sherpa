import MuiContainer from '@mui/material/Container'
import Box, { BoxProps } from '@mui/material/Box'

const Container = ({ children, ...props }: BoxProps) => (
  <Box {...props}>
    <MuiContainer maxWidth="xl">{children}</MuiContainer>
  </Box>
)

export default Container
