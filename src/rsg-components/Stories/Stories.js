import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Code from 'rsg-components/Code';
import Editor from 'rsg-components/Editor';

export default class Stories extends Component {
	static propTypes = {
		stories: PropTypes.any
	}

	render () {
		const { stories: { module, source } } = this.props;

		const stories = [];
		const addStory = (name, component) => stories.push({ name, component })
		module.default(addStory);

		console.log(stories[0].name, source);

		return (
			<div>
				{stories.map((story, index) => (
					<div key={story.name}>
						<p>{story.name}</p>
						{<story.component/>}
						<Editor code={source[index]} options={}/>
					</div>
				))}
			</div>
		)
	}

}

