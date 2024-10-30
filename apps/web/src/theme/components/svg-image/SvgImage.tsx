import React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

interface SizerProps {
  size?: 'medium' | 'large'
}

interface Props extends SizerProps {
  svg: string
}

const Img = styled('img')`
  display: block;
  position: relative;
  margin: auto;
  width: 1.5em;
`

const ImgSizer = styled(Box)<SizerProps>(({ theme, size }) => {
  const fontSize =
    size === 'large'
      ? (theme.typography.h1.fontSize as string)
      : (theme.typography.h3.fontSize as string)

  return `
		font-size: ${fontSize};
	`
})

const SVGImage: React.FC<Props> = ({ svg, size = 'large' }) => (
  <ImgSizer size={size}>
    <Img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="" />
  </ImgSizer>
)

export default SVGImage
