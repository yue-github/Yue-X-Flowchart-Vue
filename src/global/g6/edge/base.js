/**
 * Created by OXOYO on 2019/8/7.
 * Update by 蓝之静云 on 2020/8/15
 *
 * 线条公共方法
 */
import utils from '../utils'
import Store from '@/store'
let back1 = null, back2 = null, back3 = null;
export default {
  draw(cfg, group) {
    const { startPoint, endPoint } = cfg
    const keyShape = group.addShape('path', {
      className: 'edge-shape',
      attrs: {
        ...cfg,
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, endPoint.y]
        ]
      }
    })
    return keyShape
  },
  afterDraw(cfg, group) {
    if (!Store.getters.edgeAnimate) return
    // 获得当前边的第一个图形，这里是边本身的 path
    const shape = group.get('children')[0];
    // 边 path 的起点位置
    const startPoint = shape.getPoint(0) || cfg.startPoint;
    // 添加红色 circle 图形
    const circle = group.addShape('circle', {
      attrs: {
        x: startPoint.x,
        y: startPoint.y,
        fill: '#59abfe',
        r: 3
      }
    });
    // 对红色圆点添加动画
    circle.animate({
      // 动画重复
      repeat: true,
      // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
      onFrame(ratio) {
        // 根据比例值，获得在边 path 上对应比例的位置。
        const tmpPoint = shape.getPoint(ratio) || {};
        // 返回需要变化的参数集，这里返回了位置 x 和 y
        return {
          x: tmpPoint.x,
          y: tmpPoint.y
        };
      }
    }, 3000); // 一次动画的时间长度
    // 画圆
    let r = 3
    back1 = group.addShape('circle', {
      zIndex: -3,
      attrs: {
        x: startPoint.x,
        y: startPoint.y,
        r: r,
        repeat: true,
        fill: `#${(color => new Array(7 - color.length).join("0") + color)((Math.random() * 0x1000000 >>> 0).toString(16))}`,
        opacity: 0.1
      }
    });
    // 第二个背景圆
    back2 = group.addShape('circle', {
      zIndex: -2,
      attrs: {
        x: startPoint.x,
        y: startPoint.y,
        r: r,
        repeat: true,
        fill: `#${(color => new Array(7 - color.length).join("0") + color)((Math.random() * 0x1000000 >>> 0).toString(16))}`,
        opacity: 0.2
      }
    });
    // 第三个背景圆
    back3 = group.addShape('circle', {
      zIndex: -1,
      attrs: {
        x: startPoint.x,
        y: startPoint.y,
        r: r,
        repeat: true,
        fill: `#${(color => new Array(7 - color.length).join("0") + color)((Math.random() * 0x1000000 >>> 0).toString(16))}`,
        opacity: 0.3
      }
    }); 
    group.sort(); // 排序，根据 zIndex 排序
    back1.animate({
      // 动画重复
      repeat: true,
      // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
      onFrame(ratio) {
        // 根据比例值，获得在边 path 上对应比例的位置。
        const tmpPoint = shape.getPoint(ratio) || {};
        // 返回需要变化的参数集，这里返回了位置 x 和 y
        return {
          x: tmpPoint.x,
          y: tmpPoint.y
        };
      }
    }, 3000)
    setTimeout(() => {
      // 第一个背景圆逐渐放大，并消失
    back1.animate({
      r: r + 10,
      repeat: true, // 循环
    }, 3000, 'easeCubic', null, 0) // 无延迟
    // 第二个背景圆逐渐放大，并消失
    back2.animate({
      r: r + 10,
      repeat: true, // 循环
    }, 3000, 'easeCubic', null, 1000) // 1 秒延迟
    // 第三个背景圆逐渐放大，并消失
    back3.animate({
      repeat: true, // 循环
      r: r + 10,
    }, 3000, 'easeLinear', null, 2000) // 2 秒延迟
    })
    
    back2.animate({
      // 动画重复
      repeat: true,
      // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
      onFrame(ratio) {
        // 根据比例值，获得在边 path 上对应比例的位置。
        const tmpPoint = shape.getPoint(ratio) || {};
        // 返回需要变化的参数集，这里返回了位置 x 和 y
        return {
          x: tmpPoint.x,
          y: tmpPoint.y
        };
      }
    }, 3000)
    back3.animate({
      // 动画重复
      repeat: true,
      // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
      onFrame(ratio) {
        // 根据比例值，获得在边 path 上对应比例的位置。
        const tmpPoint = shape.getPoint(ratio) || {};
        // 返回需要变化的参数集，这里返回了位置 x 和 y
        return {
          x: tmpPoint.x,
          y: tmpPoint.y
        };
      }
    }, 3000)
  },
  setState(name, value, item) {
    // 设置边状态
    utils.edge.setState(name, value, item)
  },
}

