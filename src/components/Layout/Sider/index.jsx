import React, { } from 'react';
import {Menu} from 'antd';
// import { renderMenu } from '@/tools/route';
// import { Link } from 'react-router-dom';
import css from './index.module.less';
import routerList from '../../../router';

export default function Sider() {
    // const [current, setCurrent] = useState(path); // 菜单选择项

    const routes = routerList.map(item=>{
        return {
            key:item.path||item.label,
            label:item.label,
            icon:item.icon
        };
    });
	return (
		<>
            <div className={css.logo} />
            <Menu
                theme="light"
                mode="inline"
                items={routes}
                // onClick={menuOnClick}
                // selectedKeys={[current]}
            />
        </>
	);
}
