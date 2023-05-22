import { baseReq } from '@/services';

/**
 * 列表
 */
export const list = (data) => {
    return baseReq.connection('post', '/student/list',data);
};

/**
 * 
 * 新增
 */
export const insert = (data) => {
    return baseReq.connection('post', '/student/insert',data);
};

/**
 * 
 * 删除
 */
export const del = (Sno) => {
    return baseReq.connection('delete', `/student/delete/${Sno}`);
};

/**
 * 
 * 详情
 */
export const detail = (Sno) =>{
    return baseReq.connection('get',`/student/detail/${Sno}`);
};

/**
 * 
 * 修改
 */
export const update =(data) =>{
    baseReq.connection('post','student/update-Sno',data);
};