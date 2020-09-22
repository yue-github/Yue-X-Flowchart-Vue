/**
 * @author 玉旨旺
 * @date 2020/9/14/23:16
 * @param {操作对象} graph
 */
export default (graph) => {
  if (!graph) {
    return
  }
  graph.getCombos().filter(combo => {
    return combo.hasState('nodeActiveRed') || combo.hasState('nodeActive')
  }).forEach(function (combo) {
    graph.clearItemStates(combo, ['nodeActiveRed', 'nodeActive'])
    // 刷新combo组合
    graph.refreshItem(combo)
  });
  graph.getNodes().filter(node => {
    return node.hasState('nodeActiveRed') || node.hasState('nodeActive')
  }).forEach(function (node) {
    graph.clearItemStates(node, ['nodeActiveRed', 'nodeActive'])
    // 刷新节点
    graph.refreshItem(node)
  });
  graph.getEdges().filter(edge => {
    return edge.hasState('active') || edge.hasState('edgeActive')
  }).forEach(function (edge) {
    graph.clearItemStates(edge, ['active', 'edgeActive'])
    // 刷新节点
    graph.refreshItem(edge)
  });
}
