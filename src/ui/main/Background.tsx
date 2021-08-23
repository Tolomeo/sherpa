import * as React from 'react'
import styles from './Main.module.scss'

const Wave = () => {
  return (
    <svg
      width={1440}
      height={483}
      viewBox="0 0 1440 483"
      preserveAspectRatio="xMinYMin meet"
      fill="none"
      className={styles.main__background}
      role="presentation"
    >
      <path
        d="M652.909 210.534C216.03 215.487-193.298 44.087-343.353-42.232L-560-552.406 1266.48-588c153.22 392.045 413.48 1153.645 228.77 1063.681-230.88-112.455-296.24-271.337-842.341-265.147z"
        fill="url(#prefix__paint0_linear)"
      />
      <defs>
        <linearGradient
          id="prefix__paint0_linear"
          x1={1291.78}
          y1={-320.274}
          x2={-314.361}
          y2={-320.274}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA72FF" />
          <stop offset={1} stopColor="#FF6BDF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Wave
