import React from 'react';
import routeList from '@/router';
// import State from '@/tools/state';
import { breadcrumbItems } from '@/router/breadcrumb.js';

import { Breadcrumb } from 'antd';
import { Route, Link } from 'react-router-dom';

// 权限路由的相关封装还可以优化(这坨屎还可以优化^_^)
export function getRouters(permission) {
    let res = [];
    for (let i = 0; i < permission.length; i++) {
        if (permission[i].selected) {
            for (let j = 0; j < routeList.length; j++) {
                if (permission[i].path === routeList[j].path) {
                    res.push(routeList[j]);
                }
            }
        } else if (permission[i].children && permission[i].children.length) {
            let children = [];
            for (let j = 0; j < permission[i].children.length; j++) {
                if (permission[i].children[j].selected) {
                    children.hidden = true;
                    children.push(routeList[i].children.find(item =>
                        item.label === permission[i].children[j].name
                    ));
                }
            }
            if (children.length) {
                routeList[i].children = children;
                res.push(routeList[i]);
            }
        }
    }
    return res;
}

/**
 * 根据路由表渲染侧边栏菜单
 * @param {*} menu 
 * @returns 
 */
export const renderMenu = (menu) => {
    let items = [];
    if (!menu) return [];
    for (let i = 0; i < menu.length; i++) {
        const { label, path, icon, children } = menu[i];
        if (!menu[i].hidden) {

            // 若没有子路由或者子路由都有hidden:true的属性, flag为false
            let flag = false;
            if (children) flag = children.every((r) => !r.hidden);

            items.push(flag ?
                {
                    key: path || label,
                    label: label,
                    icon: icon,
                    children: renderMenu(children)
                } :
                {
                    key: path || label,
                    label: <Link to={path}>{label}</Link>,
                    icon: icon,
                });
        }
    }
    return items;
};

/**
 * 根据路由表渲染路由
 * @param {Array} childRoutes 
 * @returns 
 */
export const renderRouters = (childRoutes) => {
    return childRoutes.map((route, index) => {
        if (route.children !== undefined &&
            route.children.length > 0) {
            return renderRouters(route.children);
        }
        delete route.children;
        return <Route key={index} {...route} element={<route.component />} />;
    });
};

/**
 * 根据路径获取面包屑
 * @param {Array} path
 * @returns
 */
export function getBreadcrumb(path) {
    let breadcrumb = [];
    for (let i = 0, j = 0; i < path.length && j < breadcrumbItems.length; j++) {
        if (path[i] === breadcrumbItems[j].path) {
            breadcrumb.push(
                <Breadcrumb.Item key={path[i]}>
                    {breadcrumbItems[j].breadcrumbName}
                </Breadcrumb.Item>
            );
            i++;
        }
    }
    return breadcrumb;
}
//直接根据路由创建路由
