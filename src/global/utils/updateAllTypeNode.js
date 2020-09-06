/**
 * @author 蓝之静云
 * @date 2020/9/3/23:16
 * @param {操作对象} graph
 * @param {节点ID} nodeId
 * @param {更新的节点类型} type 
 */
export default (graph, nodeId, type, data, aaaaa) => {
    if (!graph || !nodeId) throw new Error('graph or nodeId must be requested!')
    let node = graph.findById(nodeId);
    if (!node) return 'update failed!'
    let model = node.getModel();
    let children = node._cfg.group.cfg.children
    // 若是图表---自动更新背景
    if(model.type == 'image-chart'){
        let chartBg = children.filter(_ => _.attrs.flag == 'chart-bg')
        if(chartBg && chartBg.length != 0){
            chartBg[0].attrs = Object.assign({}, chartBg[0].attrs, {
                flag: 'chart-bg',
                x: -model.width / 2,
                y: -model.height / 2,
                width: model.width,
                height: model.height,
                fill: '#000',
                opacity: 0.4,
                zIndex: -1000
            })
        }
    }
    switch (type) {
        // 更新柱状表里图形位置宽高信息等
        case 'chartColumnar':
            let chartColumnar = children.filter(_ => _.attrs.flag == 'chartColumnar')
            chartColumnar[0].attrs = Object.assign({}, chartColumnar[0].attrs, {
                x: -model.width / 2,
                y: -model.height / 2,
                width: model.width,
                height: model.height / 5
            })
            chartColumnar[1].attrs = Object.assign({}, chartColumnar[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + model.height / 10 + 3,
                text: '运行率',
                fill: '#fff',
                flag: 'chartColumnar',
            })
            chartColumnar[2].attrs = Object.assign({}, chartColumnar[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + 17 + model.height / 5,
                flag: 'chartColumnar',
                text: '2020-06-07 ~ 2021-06-14 | 均值',
                fill: '#fff',
            })
            // 更新柱体
            // node.getKeyShape().get('intervalView').changeSize(model.width)
            // console.log(node.getKeyShape().get('intervalView'))
            break;
        // 饼图更新
        case 'pieChart':
            let pieChart = children.filter(_ => _.attrs.flag == 'pieChart')
            pieChart[0].attrs = Object.assign({}, pieChart[0].attrs, {
                x: -model.width / 2,
                y: -model.height / 2,
                width: model.width,
                height: model.height / 5
            })
            pieChart[1].attrs = Object.assign({}, pieChart[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + model.height / 10 + 3,
                text: '饼图率',
                fill: '#fff',
                flag: 'pieChart',
            })
            pieChart[2].attrs = Object.assign({}, pieChart[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + 17 + model.height / 5,
                flag: 'pieChart',
                text: '2020-06-07 ~ 2021-06-14 | 平均值',
                fill: '#fff',
            })
            // 更新柱体
            // node.getKeyShape().get('intervalView').changeSize(model.width)
            // console.log(node.getKeyShape().get('intervalView'))
            break;
        case 'chartFracture':
            let chartFracture = children.filter(_ => _.attrs.flag == 'chartFracture')
            chartFracture[0].attrs = Object.assign({}, chartFracture[0].attrs, {
                x: -model.width / 2,
                y: -model.height / 2,
                width: model.width,
                height: model.height / 5
            })
            chartFracture[1].attrs = Object.assign({}, chartFracture[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + model.height / 10 + 3,
                text: '出错率',
                fill: '#fff',
                flag: 'chartFracture',
            })
            chartFracture[2].attrs = Object.assign({}, chartFracture[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + 17 + model.height / 5,
                flag: 'chartFracture',
                text: '2020-06-07 ~ 2021-06-14 | 精值',
                fill: '#fff',
            })
            // 更新柱体
            // node.getKeyShape().get('intervalView').changeSize(model.width)
            // console.log(node.getKeyShape().get('intervalView'))
            break;
        // 环形图
        case 'ringDiagram':
            let ringDiagram = children.filter(_ => _.attrs.flag == 'ringDiagram')
            ringDiagram[0].attrs = Object.assign({}, ringDiagram[0].attrs, {
                x: -model.width / 2,
                y: -model.height / 2,
                width: model.width,
                height: model.height / 5
            })
            ringDiagram[1].attrs = Object.assign({}, ringDiagram[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + model.height / 10 + 3,
                text: '出错率',
                fill: '#fff',
                flag: 'ringDiagram',
            })
            ringDiagram[2].attrs = Object.assign({}, ringDiagram[0].attrs, {
                x: -model.width / 2 + 5,
                y: -model.height / 2 + 17 + model.height / 5,
                flag: 'ringDiagram',
                text: '2020-06-07 ~ 2021-06-14 | 精值',
                fill: '#fff',
            })
            // 更新柱体
            // node.getKeyShape().get('intervalView').changeSize(model.width)
            // console.log(node.getKeyShape().get('intervalView'))
            break;
        // 更新柱状图表数据
        case 'chartColumnarData':
            if (!data.trendData) return;
            graph.updateItem(node, {
                trendData: data.trendData,
            });
            break;
        case 'doubleArticle':
            // let doubleArticle = children.filter(_ => _.attrs.flag == 'doubleArticle')
            // let keyShape = children.find(_ => _._INDEX == 0)
            // doubleArticle[0].attrs.path = keyShape.attrs.path
            // doubleArticle[0].attrs.startPoint = keyShape.attrs.startPoint
            // doubleArticle[0].attrs.endPoint = keyShape.attrs.endPoint
            // doubleArticle[0].attrs.target = keyShape.attrs.target
            // console.log(doubleArticle, keyShape, node)
            break;
    }
    graph.refreshItem(node)
}
