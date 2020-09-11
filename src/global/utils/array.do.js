
/**
 * @author { Bonait-蓝之静云 }
 * @date { 2020-9-5 10:14 }
 * @param { Array-要递归查询数组 } arr 
 * @param { String-对象子数组键 } childArrKey 
 * @param { String-要查找的属性名 } _k 
 * @param { String-要查找的属性名对应的值 } _v 
 * @return { Success-Object-返回按条件找到的该查找属性所在对象 }
 * @return { Fail-Boolean-返回false }
 */
export const searchAttr = (arr, childArrKey, _k, _v) => {
    // 第一个传入必须是数组
    if(Object.prototype.toString.call(arr) != '[object Array]'){
        throw new Error('the first params must be request and it is array!')
    }else{
        // 递归查询
        return searchAttrInternal(arr, childArrKey, _k, _v)
    }
}
const searchAttrInternal = (arr, childArrKey, _k, _v) => {
    for(let [k, v] of arr.entries()){
        // 基准条件
        if(v[_k] == _v) return v;
        // 递归入口
        if(Object.prototype.toString.call(v[childArrKey]) == '[object Array]' && v[childArrKey].length > 0){
            const res = searchAttrInternal(v[childArrKey], childArrKey, _k, _v)
            if(res) return res;
        }
    }
    // 递归最终告知结果
    return false;
}
// 递归过滤算法
/**
 * @author { Bonait-蓝之静云 }
 * @date { 2020-9-20 10:14 }
 * @param { Array-要过滤的数组 } arr 
 * @param { String-对象子数组键 } childArrKey 
 * @param { String-要过滤的属性名 } _k 
 * @param { String-要过滤的属性名对应的值 } _v 
 * @return arr
 */
export const recursionFilter = (arr, childArrKey, _k, _v) => {
    // 第一个传入必须是数组
    if(Object.prototype.toString.call(arr) != '[object Array]'){
        throw new Error('the first params must be request and it is array!')
    }else{
        // 递归过滤
        return filterInternal(JSON.parse(JSON.stringify(arr)), childArrKey, _k, _v)
    }
}
const filterInternal = (arr, childArrKey, _k, _v) => {
    let delList = [];// 需删除列表
    for(let [k, v] of arr.entries()){
        // 基准条件
        if(v && v[_k] == _v) {
            delList.push(k)
        }
        // 递归入口
        if(v && Object.prototype.toString.call(v[childArrKey]) == '[object Array]' && v[childArrKey].length > 0){
            // 承接值---防止根键断裂
            v[childArrKey] = filterInternal(v[childArrKey], childArrKey, _k, _v)
        }
    }
    // 递归最终过滤的结果
    return arr.filter((i, _i) => !delList.includes(_i));
}