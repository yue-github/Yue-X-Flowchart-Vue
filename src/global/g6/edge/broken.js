/**
 * Created by OXOYO on 2019/8/14.
 *
 * 折线
 */
import base from './base'
import utils from '../utils'

export default {
  name: 'x-broken',
  extendName: 'single-edge',
  options: {
    ...base,
    draw (cfg, group) {
      const { startPoint, endPoint } = cfg
      const controlPoints = this.getControlPoints(cfg)
      const points = [startPoint]
      if (controlPoints) {
        points.push(controlPoints)
      }
      points.push(endPoint)
      const path = this.getPath(points)
      const keyShape = group.addShape('path', {
        name: 'edgeShape',
        className: 'edge-shape',
        attrs: {
          ...cfg,
          path: path
        }
      })
      return keyShape
    },
    afterDraw(cfg, group) {
      
      console.log("画圈数据", cfg)
      let backA = null, backB = null, backC = null, backD = null, backE = null;
      // 获得当前边的第一个图形，这里是边本身的 path
      let shape = group.get('children')[0];
      let index = 0;
      if(cfg.attrs.flag == "doubleLine"){
        shape.animate(
          () => {
            index++;
            if (index > 9) {
              index = 0;
            }
            const res = {
              lineDash: [4, 2, 1, 2],
              lineDashOffset: -index,
              zIndex: 1000000
            };
            // returns the modified configurations here, lineDash and lineDashOffset here
            return res;
          },
          {
            repeat: true, // whether executes the animation repeatly
            duration: 3000, // the duration for executing once
          },
        );
      }
      // 边 path 的起点位置
      const startPoint = shape.getPoint(0) || cfg.startPoint;
      let sinStart1 = startPoint.y / Math.sqrt(Math.pow(startPoint.x, 2) + Math.pow(startPoint.y, 2));
      let cosStart1 = startPoint.x / Math.sqrt(Math.pow(startPoint.x, 2) + Math.pow(startPoint.y, 2))
      let topX1 = startPoint.x - sinStart1 * 10;
      let topY1 = startPoint.y - cosStart1 * 10
      let bottomX1 = startPoint.x + sinStart1 * 10
      let bottomY1 = startPoint.y + cosStart1 * 10
      // 添加红色 circle 图形
      // let myPath = group.addShape('path', {
      //   attrs: {
      //     x: startPoint.x,
      //     y: startPoint.y,
      //     path: [
      //       [
      //         'M',
      //         topX1,
      //         topY1
      //       ],
      //       [
      //         'L',
      //         startPoint.x + cosStart1 * 10,
      //         startPoint.y - sinStart1 * 10
      //       ],
      //       [
      //         'L',
      //         bottomX1,
      //         bottomY1
      //       ],
      //       ['Z']
      //     ],
      //     fill: '#59abfe',
      //     stroke: 'pink'
      //   }
      // });
      // // 对红色圆点添加动画
      // myPath.animate({
      //   // 动画重复
      //   repeat: true,
      //   // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
      //   onFrame(ratio) {
      //     // 根据比例值，获得在边 path 上对应比例的位置。
      //     let tmpPoint = shape.getPoint(ratio) || cfg.startPoint;
      //     // 返回需要变化的参数集，这里返回了位置 x 和 y
      //     let sinStart = tmpPoint.y / Math.sqrt(Math.pow(tmpPoint.x, 2) + Math.pow(tmpPoint.y, 2));
      //     let cosStart = tmpPoint.x / Math.sqrt(Math.pow(tmpPoint.x, 2) + Math.pow(tmpPoint.y, 2))
      //     let topX = tmpPoint.x - sinStart * 10;
      //     let topY = tmpPoint.y - cosStart * 10
      //     let bottomX = tmpPoint.x + sinStart * 10
      //     let bottomY = tmpPoint.y + cosStart * 10

      //     return {
      //       x: tmpPoint.x,
      //       y: tmpPoint.y,

      //       path: [
      //         [
      //           'M',
      //           bottomX,
      //           bottomY

      //         ],
      //         [
      //           'L',
      //           tmpPoint.x + sinStart * 10,
      //           tmpPoint.y - cosStart * 10
      //         ],
      //         [
      //           'L',
      //           topX,
      //           topY
      //         ],
      //         ['Z']
      //       ],
      //     };
      //   }
      // }, 3000); // 一次动画的时间长度
      let myCircle = group.addShape('circle', {
        zIndex: 1000,
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fillOpacity: 0.8,
          lineWidth: 1,
          stroke: 'red',
          fill: cfg.style.stroke,
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
        duration: 4000,
        repeat: true,
        delay: 0
      })
      // 画圆
      let r = 3
      if (!backA || !backB || !backC || !backD || !backE) {
        // 第一个背景圆
        console.log(cfg)
        backA = group.addShape('circle', {
          zIndex: -3,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: cfg.style.stroke,
            opacity: 1,
          }
        });
        backA.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 200,
            easing: 'easeCubic',
          });
        // 第二个背景圆
        backB = group.addShape('circle', {
          zIndex: -2,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: 'green',
            opacity: 1
          }
        });
        backB.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 600,
            easing: 'easeCubic',
          });
        // 第三个背景圆
        backC = group.addShape('circle', {
          zIndex: -1,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: '#f40',
            opacity: 1
          }
        })
        backC.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 1200,
            easing: 'easeCubic'
          });
               // 第二个背景圆
        backD = group.addShape('circle', {
          zIndex: -2,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: 'blue',
            opacity: 1
          }
        });
        backD.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 1800,
            easing: 'easeCubic',
          });
        // 第三个背景圆
        backE = group.addShape('circle', {
          zIndex: -1,
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            r: r,
            fill: 'purple',
            opacity: 1
          }
        })
        backE.animate({
          r: r + 10,
          opacity: 0
        },
          {
            repeat: true,
            duration: 3000,
            delay: 2400,
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
      }, 4000)
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
      }, 4000)
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
      }, 4000)
      backD.animate({
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
      }, 4000)
      backE.animate({
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
      }, 4000)
      group.sort(); // 排序，根据 zIndex 排序
    },
    getPath (points) {
      const path = []
      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        if (i === 0) {
          path.push([ 'M', point.x, point.y ])
        } else if (i === points.length - 1) {
          path.push([ 'L', point.x, point.y ])
        } else {
          const prevPoint = points[i - 1]
          const nextPoint = points[i + 1]
          let cornerLen = 5
          if (Math.abs(point.y - prevPoint.y) > cornerLen || Math.abs(point.x - prevPoint.x) > cornerLen) {
            if (prevPoint.x === point.x) {
              path.push(['L', point.x, point.y > prevPoint.y ? point.y - cornerLen : point.y + cornerLen])
            } else if (prevPoint.y === point.y) {
              path.push(['L', point.x > prevPoint.x ? point.x - cornerLen : point.x + cornerLen, point.y])
            }
          }
          const yLen = Math.abs(point.y - nextPoint.y)
          const xLen = Math.abs(point.x - nextPoint.x)
          if (yLen > 0 && yLen < cornerLen) {
            cornerLen = yLen
          } else if (xLen > 0 && xLen < cornerLen) {
            cornerLen = xLen
          }
          if (prevPoint.x !== nextPoint.x && nextPoint.x === point.x) {
            path.push(['Q', point.x, point.y, point.x, point.y > nextPoint.y ? point.y - cornerLen : point.y + cornerLen])
          } else if (prevPoint.y !== nextPoint.y && nextPoint.y === point.y) {
            path.push(['Q', point.x, point.y, point.x > nextPoint.x ? point.x - cornerLen : point.x + cornerLen, point.y])
          }
        }
      }
      return path
    },
    getControlPoints (cfg) {
      if (!cfg.sourceNode) {
        return cfg.controlPoints
      }
      return utils.edge.polylineFinding(cfg.sourceNode, cfg.targetNode, cfg.startPoint, cfg.endPoint, 40)
    }
  }
}
