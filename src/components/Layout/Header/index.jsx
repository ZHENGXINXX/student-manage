import React from 'react';
import css from './index.module.less';

export default function Header() {
	return (
		<div className={css.header}>
			<div className={css.name}>学生信息管理系统</div>
		</div>
	);
}
