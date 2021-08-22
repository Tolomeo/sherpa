import React from 'react'
import { PopulatedPath } from '../../data'
import { Timeline, H2, P } from '../ui'
import styles from './Path.module.scss'

type Props = {
    path: PopulatedPath
}

const Path = ({ path }: Props) => {
    return (
    <Timeline>
        {Object.values(path.resources).map((resource, index) => 
            <Timeline.Item key={resource.url}>
                <a href={resource.url} target="_blank" rel="noreferrer">
                    <p className={styles.resource__source}>{resource.source}</p>
                    <H2>{resource.title}</H2>
                    <p className={styles.resource__type}>{resource.type}</p>
                </a>
            </Timeline.Item>)}
    </Timeline>
)
}

export default Path