import React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

interface Props {
  svg: string
}

const Img = styled('img')`
  display: block;
  position: relative;
  margin: auto;
  width: 1.5em;
`

const ImgSizer = styled(Box)(
  ({ theme }) => `
	font-size: ${theme.typography.h1.fontSize as string};
`,
)

const SVGImage: React.FC<Props> = ({ svg }) => (
  <ImgSizer>
    <Img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="" />
  </ImgSizer>
)

export default SVGImage
