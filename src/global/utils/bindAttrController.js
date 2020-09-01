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
    let children = node._cfg.group._cfg.children
    let originBindAttrs = children.filter(_ => _._attrs.flag == 'bindAttr')
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
          const originBindCircle = children.filter(_ => _._attrs.flag == 'bindCircle')
          const model = node.getModel()
          const size = model.size
          originBindCircle.map((i, _index, _t) => {
            if (i._attrs) {
              if (_index === 0) {
                originBindCircle[_index]._attrs.x = (size[0] / 2) - i._attrs.r // 最右边一个---> 往左排
                originBindCircle[_index]._attrs.y = (size[1] / 2) + i._attrs.r
              } else {
                i._attrs.r = size[0] / 10
                if (_t[_index - 1]._attrs) {
                  originBindCircle[_index]._attrs.x = _t[_index - 1]._attrs.x - (i._attrs.r * 2) - _t[_index - 1]._attrs.span
                  originBindCircle[_index]._attrs.y = _t[_index - 1]._attrs.y
                } else {
                  originBindCircle[_index]._attrs.x = i._attrs.x + (i._attrs.r * 2) + _t[_index - 1]._attrs.span
                }
              }
              originBindCircle[_index]._attrs.span = 5
            }
          })
          // 更新logo
          if (originBindCircle.length == 0) break
          originBindAttrs.map((i, _index) => {
            originBindAttrs[_index]._attrs.x = originBindCircle[_index]._attrs.x - (i._attrs.width / 2)
            originBindAttrs[_index]._attrs.y = originBindCircle[_index]._attrs.y - (i._attrs.height / 2)
          })
          break
      }
    }
    graph.refreshItem(node)
  }
  