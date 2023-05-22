import React,{lazy} from 'react';
import {
	LineChartOutlined,
} from '@ant-design/icons';
const routerList = [
	{
		path:'/student',
		label:'学生系统',
		icon:<LineChartOutlined />,
		component:lazy(()=>import('@/view/Student'))
	},
];

export default routerList;