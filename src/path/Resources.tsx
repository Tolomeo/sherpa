import React from 'react'
import { PopulatedPath, Resource } from '../../data'
import { Timeline, H2, P } from '../ui'
import styles from './Path.module.scss'

type Props = {
  resources: Resource[]
}

const Resources = ({ resources }: Props) => {
  return (
    <Timeline>
      {Object.values(resources).map((resource) => (
        <Timeline.Item key={resource.url}>
          <a href={resource.url} target="_blank" rel="noreferrer">
            <p className={styles.resource__source}>{resource.source}</p>
            <H2>{resource.title}</H2>
            <p className={styles.resource__type}>{resource.type.join(', ')}</p>
          </a>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}

export default Resources
