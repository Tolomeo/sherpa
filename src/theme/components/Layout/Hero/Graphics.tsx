import React, { SVGProps, Ref, forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { useThemeContext } from '../../../Provider'

const dimensions = {
  width: 760,
  height: 315,
}

const SvgComponent = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => {
  const { theme } = useThemeContext()

  return (
    <svg
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 315h760V42.475l-.516-.528c-3.429-3.507-6.866-7.023-9.82-10.815-3.457-4.436-6.144-9.308-8.829-14.177-3.265-5.92-6.528-11.836-11.167-16.955-1.154 1.981-2.05 4.205-2.96 6.46a112.805 112.805 0 0 1-1.322 3.187c-1.129 2.578-2.441 5.07-4.383 7.146-2.191 2.341-4.863 3.457-7.589 4.595-2.792 1.166-5.64 2.355-8.085 4.91-4.443-1.2-8.383-.198-12.219.805l-.136.035c-4.778 1.25-9.401 2.46-14.638-.64-2.633-1.558-4.593-4.752-6.449-7.774-3.507-5.713-6.638-10.813-13.22-3.097-.24-.811-.956-1.854-1.738-2.991-1.089-1.586-2.305-3.356-2.528-4.933-5.351 1.966-9.399 7.99-13.316 13.819-2.555 3.801-5.053 7.52-7.821 9.975-3.394 3.012-6.404 5.847-9.216 8.76-4.176 4.33-7.916 8.844-11.825 14.386-.503.714-1.008 1.44-1.519 2.188-1.946 2.858-3.913 6.138-5.947 9.53h-.001c-4.603 7.673-9.547 15.917-15.353 21.136-3.996 3.592-7.666 5.462-11.021 7.171-1.585.808-3.101 1.58-4.547 2.481-3.602 2.244-6.775 5.288-9.538 11.682l-.567 1.313c-5.43 12.583-6.667 15.448-18.095 24.352-3.683 2.869-6.31 6.706-8.908 10.5-3.188 4.655-6.331 9.245-11.324 11.904-3.739 1.99-7.713 2.653-11.697 3.317-5.777.964-11.574 1.93-16.703 6.951-5.13 5.021-8.839 9.048-12.674 13.213a624.993 624.993 0 0 1-5.365 5.778c-1.4 1.484-2.045 3.089-2.684 4.683-.849 2.116-1.69 4.211-4.28 5.981-1.452.993-3.78 1.413-6.26 1.862-2.571.464-5.306.959-7.401 2.151-1.985 1.129-3.214 2.731-4.447 4.338-1.502 1.957-3.01 3.922-5.896 5.054-2.515.986-5.58.843-8.693.698-1.013-.047-2.031-.095-3.036-.103-1.956-.018-3.866.112-5.6.674-4.727 1.535-8.366 3.779-11.334 6.472-5.109 4.637-8.212 10.62-11.359 16.69-2.732 5.269-5.498 10.602-9.639 15.177-7.05 7.787-8.045 7.049-11.353 4.597-1.901-1.409-4.565-3.384-9.579-4.634-6.676-1.665-11.086.779-15.685 3.328-3.025 1.677-6.132 3.399-10.019 4.026-1.19.192-2.58-.582-3.948-1.356l-.057-.032c-1.334-.756-2.645-1.499-3.725-1.33-.918.142-1.846.802-2.739 1.437-.894.636-1.752 1.246-2.53 1.288-1.261.069-2.202.944-3.163 1.838-1.022.95-2.066 1.921-3.541 1.962-1.842.049-3.362-1.439-4.788-2.836-1.19-1.165-2.314-2.266-3.505-2.356-5.399-.411-10.282.305-15.116 1.021l-.07.011c-4.529.671-9.018 1.336-13.854 1.072-1.615-.088-3.252-.296-4.905-.507-2.097-.267-4.221-.537-6.365-.57-1.469-.024-2.945.054-4.429.333-1.371.257-3.067 1.245-4.833 2.273-2.602 1.516-5.353 3.119-7.428 2.592-3.671-.931-9.582-7.466-14.947-13.398-3.511-3.881-6.788-7.505-9.053-9.133-3.293-2.367-6.72-5.164-10.215-8.016-4.362-3.56-8.83-7.207-13.276-10.213.985.735-3.02-1.316-6.443-3.368-3.117-1.866-5.752-3.734-3.701-3.5-4.694-.539-6.937 1.525-9.344 3.74-1.499 1.381-3.063 2.82-5.323 3.724-2.737 1.095-4.866 1.246-6.981 1.396-2.25.16-4.485.319-7.42 1.611-1.47.647-3.181 2.26-5.006 3.981-3.111 2.934-6.553 6.18-9.691 5.473l-.279-.102c-2.513-.825-4.611-4.97-6.547-8.797-1.203-2.376-2.343-4.63-3.482-5.889-3.431-3.793-6.062-4.601-9.001-5.505-1.798-.553-3.711-1.141-5.994-2.469-3.158-1.838-5.496-4.614-7.799-7.348-4.06-4.821-8.012-9.513-16.164-8.716-3.577.349-6.98 3.317-10.152 6.712a144.005 144.005 0 0 0-3.014 3.366l-.001.001-.006.007-.002.003c-3.579 4.083-6.808 7.767-9.598 7.408l-1.036-.368c-3.881-8.001-15.337-28.285-21.561-10.597-.697-.748-1.964-1.318-3.234-1.889-1.185-.533-2.373-1.066-3.098-1.747-5.911 6.791-9.82 14.19-13.676 21.489-5 9.467-9.912 18.765-18.988 26.346-4.166 3.479-9.284 4.558-14.42 5.641-4.122.869-8.256 1.741-11.918 3.857-1.81 1.048-3.576 2.579-5.333 4.29V315Z"
        fill={theme.palette.background.default}
      />
    </svg>
  )
}

const ForwardRef = forwardRef(SvgComponent)
export default styled(ForwardRef)`
  display: block;
  width: 100%;
  position: relative;
  top: 1px;
  aspect-ratio: ${dimensions.width / dimensions.height};
`
