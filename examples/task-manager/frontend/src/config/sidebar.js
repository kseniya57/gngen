import React from 'react';
import { browserHistory } from 'react-router';
import {
	PeopleRounded,
	WorkRounded,
	CategoryRounded
} from '@material-ui/icons'

const goTo = path => () => browserHistory.push(path);

export default [
    {
		title: 'users',
		icon: <PeopleRounded />,
		action: goTo('/users'),
	},
	{
		title: 'tasks',
		icon: <WorkRounded />,
		action: goTo('/tasks'),
	},
	{
		title: 'categories',
		icon: <CategoryRounded />,
		action: goTo('/categories'),
	}
];
