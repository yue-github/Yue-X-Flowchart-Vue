/**
 * @author 蓝之静云
 * @way 瞒天过海
 * @type 双线
 */
import base from './base'
import G6 from '@antv/g6';
const edgeTypeColorMap = {
  type1: ['#531dab', '#391085', '#391085'],
  type2: ['#d9d9d9', '#bfbfbf', '#8c8c8c'],
  type3: ['#d3adf7', '#b37feb', '#9254de']
}
export default {
  name: 'doubleArticle',
  extendName: 'line',
  options: {
    ...base,
    draw (cfg, group) {
      const { startPoint, endPoint } = cfg
      let keyShape = group.addShape('path', {
        name: 'edgeShape',
        className: 'edge-shape',
        attrs: {
          ...cfg,
          path:[
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, endPoint.y]
          ],
        }
      })
      console.log(keyShape)
      // group.addShape('path', {
      //   name: 'edgeShape',
      //   className: 'edge-shape',
      //   zIndex: 10000,
      //   attrs: {
      //     flag: 'doubleArticle',
      //     ...keyShape.attrs,
      //     lineWidth: 1,
      //     stroke: 'blue',
      //   },
      //   draggable: true,
      //   capture: true
      // })
      // console.log(cfg)
      return keyShape
    }
  }
}
