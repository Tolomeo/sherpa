import { styled } from '@mui/material/styles'
import logo from './logo.svg'

const Logo = styled((props) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    {...props}
    src={logo.src}
    width={logo.width}
    height={logo.height}
    alt=""
  />
))``

export default Logo
