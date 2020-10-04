/**
 * Created by OXOYO on 2019/8/7.
 * Update by 蓝之静云 on 2020/8/15
 *
 * 线条公共方法
 */
import utils from '../utils'
import Store from '@/store'
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
    setTimeout(() => {
      if (!Store.getters.edgeAnimate) return
      let backA = null, backB = null, backC = null;
      // 获得当前边的第一个图形，这里是边本身的 path
      let shape = group.get('children')[0];
      // 边 path 的起点位置
      const startPoint = shape.getPoint(0) || cfg.startPoint;
      let sinStart1 = startPoint.y / Math.sqrt(Math.pow(startPoint.x, 2) + Math.pow(startPoint.y, 2));
      let cosStart1 = startPoint.x / Math.sqrt(Math.pow(startPoint.x, 2) + Math.pow(startPoint.y, 2))
      let topX1 = startPoint.x - sinStart1 * 10;
      let topY1 = startPoint.y - cosStart1 * 10
      let bottomX1 = startPoint.x + sinStart1 * 10
      let bottomY1 = startPoint.y + cosStart1 * 10
      // 添加红色 circle 图形
      let myPath = group.addShape('path', {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          path: [
            [
              'M',
              topX1,
              topY1
            ],
            [
              'L',
              startPoint.x + cosStart1 * 10,
              startPoint.y - sinStart1 * 10
            ],
            [
              'L',
              bottomX1,
              bottomY1
            ],
            ['Z']
          ],
          fill: '#59abfe',
          stroke: 'pink'
        }
      });
      // 对红色圆点添加动画
      myPath.animate({
        // 动画重复
        repeat: true,
        // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
        onFrame(ratio) {
          // 根据比例值，获得在边 path 上对应比例的位置。
          let tmpPoint = shape.getPoint(ratio) || cfg.startPoint;
          // 返回需要变化的参数集，这里返回了位置 x 和 y
          let sinStart = tmpPoint.y / Math.sqrt(Math.pow(tmpPoint.x, 2) + Math.pow(tmpPoint.y, 2));
          let cosStart = tmpPoint.x / Math.sqrt(Math.pow(tmpPoint.x, 2) + Math.pow(tmpPoint.y, 2))
          let topX = tmpPoint.x - sinStart * 10;
          let topY = tmpPoint.y - cosStart * 10
          let bottomX = tmpPoint.x + sinStart * 10
          let bottomY = tmpPoint.y + cosStart * 10

          return {
            x: tmpPoint.x,
            y: tmpPoint.y,

            path: [
              [
                'M',
                bottomX,
                bottomY

              ],
              [
                'L',
                tmpPoint.x + sinStart * 10,
                tmpPoint.y - cosStart * 10
              ],
              [
                'L',
                topX,
                topY
              ],
              ['Z']
            ],
          };
        }
      }, 3000); // 一次动画的时间长度
      let myCircle = group.addShape('circle', {
        zIndex: 1000,
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: '#409efe',
          r: 3
        }
      })
      myCircle.animate(ratio => {
        const tmpPoint = shape.getPoint(ratio) || {};
        // 返回需要变化的参数集，这里返回了位置 x 和 y
        return {
          x: tmpPoint.x,
          y: tmpPoint.y,
        }
      }, {
        duration: 3000,
        repeat: true,
        delay: 0
      })
      // 画圆
      let r = 3
      if (!backA || !backB || !backC) {
        // 第一个背景圆
        backA = group.addShape('circle', {
          zIndex: -3,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: 'black',
            opacity: 0.5,
          }
        });
        backA.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 0,
            easing: 'easeCubic',
          });
        // 第二个背景圆
        backB = group.addShape('circle', {
          zIndex: -2,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: 'red',
            opacity: 0.7
          }
        });
        backB.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 1000,
            easing: 'easeCubic',
          });
        // 第三个背景圆
        backC = group.addShape('circle', {
          zIndex: -1,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: 'blue',
            opacity: 0.9
          }
        })
        backC.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 2000,
            easing: 'easeCubic'
          });
      }
      backA.animate({
        // 动画重复
        repeat: true,
        // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
        onFrame(ratio) {
          // 根据比例值，获得在边 path 上对应比例的位置。
          const tmpPoint = shape.getPoint(ratio) || {};
          // 返回需要变化的参数集，这里返回了位置 x 和 y
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        }
      }, 3000)
      backB.animate({
        // 动画重复
        repeat: true,
        // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
        onFrame(ratio) {
          // 根据比例值，获得在边 path 上对应比例的位置。
          const tmpPoint = shape.getPoint(ratio) || {};
          // 返回需要变化的参数集，这里返回了位置 x 和 y
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        }
      }, 3000)
      backC.animate({
        // 动画重复
        repeat: true,
        // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
        onFrame(ratio) {
          // 根据比例值，获得在边 path 上对应比例的位置。
          const tmpPoint = shape.getPoint(ratio) || {};
          // 返回需要变化的参数集，这里返回了位置 x 和 y
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        }
      }, 3000)
      group.sort(); // 排序，根据 zIndex 排序
    })
  },
  setState(name, value, item) {
    // 设置边状态
    utils.edge.setState(name, value, item)
  },
}

