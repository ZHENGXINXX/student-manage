/**
 * 删除对象中空属性
 * @param obj 对象
 * @returns {*} 结果
 */
export const deleteEmptyOption = (obj) => {
    if (!(obj instanceof Object)) {
        return;
    }
    for (let key in obj) {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined)
            delete obj[key];
    }
    return obj;
};