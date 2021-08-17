import React from 'react'
import { PopulatedPath } from '../../data'
import { Timeline, Container, Title } from '../shared'

type Props = {
    path: PopulatedPath
}

const Path = ({ path }: Props) => {
    return (
        <div>

            <Title>
                The <u>{path.title}</u> learning path
            </Title>

            <Container>
                <Timeline>
                    {Object.values(path.resources).map((resource, index) => 
                    <Timeline.Item key={resource.url} active={index < 3}>
                        <span style={{ color: '#BDBDBD', fontSize: '0.8rem' }}>{resource.source}</span>
                        <br />
                        <a style={{ display: 'inline-block', padding: '0 0 0.25rem 0' }} href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>
                        <br />
                        <span style={{ color: '#9B51E0' }}>&Theta; &AElig;</span>
                    </Timeline.Item>)}
                </Timeline>
            </Container>

        </div>
    )
}

export default Path