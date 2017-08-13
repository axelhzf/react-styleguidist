import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from 'rsg-components/Editor';
import styled from 'styled-components';

export default class Stories extends Component {
	static propTypes = {
		stories: PropTypes.any
	}

	render () {
		const { stories: { module, source } } = this.props;

		const stories = [];
		const addStory = (name, component) => stories.push({ name, component })
		module.default(addStory);

		return (
			<Container>
				{stories.map((story, index) => (
					<Story key={story.name}>
						<StoryTitle>{story.name}</StoryTitle>
						<StoryComponent>{<story.component/>}</StoryComponent>
						<StoryEditor>
							<Editor code={source[index]}/>
						</StoryEditor>
					</Story>
				))}
			</Container>
		)
	}

}


const Container = styled.div`

`;

const Story = styled.div`
	margin-bottom: 35px;
`;

const StoryTitle = styled.div`
	font-size: 20px;
	border-bottom: 1px solid #e8e8e8;
	padding-bottom: 7px;
	margin-bottom: 10px;
`;

const StoryComponent = styled.div`
	padding: 16px;
	border: 1px #e8e8e8 solid;
  border-radius: 3px;
  margin-bottom: 10px;
`;

const StoryEditor = styled.div`

`;
