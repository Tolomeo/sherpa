import { styled } from '@mui/material/styles'

/* https://css-tricks.com/styling-underlines-web/#aa-background-image */
const Underline = styled('u')`
  text-decoration: none;
  background-image: linear-gradient(
    to right,
    currentColor 40%,
    transparent 40%
  );
  background-position: 0 1.2em;
  background-repeat: repeat-x;
  background-size: max(0.25em, 9px) max(0.05em, 2px);
`

export default Underline
