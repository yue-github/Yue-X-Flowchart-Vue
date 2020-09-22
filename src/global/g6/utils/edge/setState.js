/**
 * Created by OXOYO on 2019/7/16.
 * Update by 蓝之静云 on 2020/8/15
 * 
 * 设置边状态
 */
import Store from '@/store'
import config from '../../config'
// import drawAnimate from './drawAnimate'
// import destroyAnimate from './destroyAnimate'

export default function (name, value, item) {
  console.log("激活边-------")
  if (name === 'active') {
    let group = item.getContainer()
    let children = group.get('children')
    let edge = children[0]
    // 处理线条状态
    if (edge) {
      if (value) {
        console.log("激活边")
        edge.attr(config.edge.style.active)
        // 绘制边动画
        // drawAnimate(item.getModel(), item.getContainer())
      } else {
          edge.attr(config.edge.style.inactive)
        // 销毁边动画
        // destroyAnimate(item.getModel(), item.getContainer())
      }
    }
  }
  if (name === 'edgeActive') {
    const group = item.getContainer()
    const children = group.get('children')
    const edge = children[0]
    if (!edge) {
      return
    }
    if (value) {
      edge.attr(config.edge.style.myActive)
    } else {
      edge.attr(config.edge.style.myInactive)
    }
  }
}
