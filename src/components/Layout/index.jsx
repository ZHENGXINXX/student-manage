import React from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sider from './Sider';
import Content from './Content';
import './index.less';
import css from './index.module.less';

export default function AppLayout() {

    return (
        <Layout className={css.app_layout}>
            <Layout.Header>
                <Header />
            </Layout.Header>

            <Layout>
                <Layout.Sider theme={'light'}>
                    <Sider />
                </Layout.Sider>

                <Layout.Content className={css.content}>
                    <Content />
                </Layout.Content>
            </Layout>
        </Layout>
    );
}
