/**
 * @author 蓝之静云
 * @date 2020/8/21/23:16
 * @param {操作对象} graph
 * @param {节点ID} nodeId
 * @param {需要更新的绑定属性ID} attrIds
 * @param {类型：false为让其消失；true为让其出现} type
 * @param {表格数据} tableData
 */
export const updateBA = (graph, nodeId, attrIds = [], type, tableData = '') => {
    if (!graph || !nodeId) throw new Error('graph or nodeId must be requested!')
    let node = graph.findById(nodeId)
    if (!node || attrIds.length == 0) return 'update failed!'
    let children = node._cfg.group.cfg.children
    let originBindAttrs = children.filter(_ => _.attrs.flag == 'bindAttr')
    if (Object.prototype.toString.call(type) === '[object Boolean]') {
      originBindAttrs.map((_, _index) => {
        if (attrIds.includes(_._attrs.data.id)) {
          if(tableData) _._attrs.data.tableData = JSON.parse(tableData);
          originBindAttrs[_index]._cfg.visible = type
        }
      })
    } else {
      switch (type) {
        case 'position':// 更新位置
          // 更新外圈
          const originBindCircle = children.filter(_ => _.attrs.flag == 'bindCircle')
          const model = node.getModel()
          const size = model.size
          originBindCircle.map((i, _index, _t) => {
            if (i.attrs) {
              if (_index === 0) {
                originBindCircle[_index].attrs.x = (size[0] / 2) - i.attrs.r // 最右边一个---> 往左排
                originBindCircle[_index].attrs.y = (size[1] / 2) + i.attrs.r
              } else {
                i.attrs.r = size[0] / 10
                if (_t[_index - 1].attrs) {
                  originBindCircle[_index].attrs.x = _t[_index - 1].attrs.x - (i.attrs.r * 2) - _t[_index - 1].attrs.span
                  originBindCircle[_index].attrs.y = _t[_index - 1].attrs.y
                } else {
                  originBindCircle[_index].attrs.x = i.attrs.x + (i.attrs.r * 2) + _t[_index - 1].attrs.span
                }
              }
              originBindCircle[_index].attrs.span = 5
            }
          })
          // 更新logo
          if (originBindCircle.length == 0) break
          originBindAttrs.map((i, _index) => {
            originBindAttrs[_index].attrs.x = originBindCircle[_index].attrs.x - (i.attrs.width / 2)
            originBindAttrs[_index].attrs.y = originBindCircle[_index].attrs.y - (i.attrs.height / 2)
          })
          break
      }
    }
    graph.refreshItem(node)
  }
  