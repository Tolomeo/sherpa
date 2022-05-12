import MuiContainer, { ContainerProps } from '@mui/material/Container'

const Container = (props: Omit<ContainerProps, 'maxWidth'>) => (
  <MuiContainer {...props} maxWidth="xl" />
)

export default Container
