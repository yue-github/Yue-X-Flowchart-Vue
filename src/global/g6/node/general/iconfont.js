/**
 * Created by OXOYO on 2019/7/8.
 *
 * 正方形
 */

import * as G6Util from '@antv/util'
import base from '../base'

export default {
  name: 'iconfont',
  extendName: 'single-node',
  options: {
    shapeType: 'text',
    ...base,
    getShapeStyle (cfg,group) {
      let size = this.getSize(cfg)
      const width = size[0]
      const height = size[1]
      const text = cfg.text
      const type = cfg.type
      const iconColor = cfg.iconColor
      const iconSize = cfg.iconSize
      const x = 0 - width / 2
      const y = 0 - height / 2
      const path = [
        // 左上顶点
        [ 'M', -width / 2, -height / 2 ],
        // 右上顶点
        [ 'L', width / 2, -height / 2 ],
        // 右下顶点
        [ 'L', width / 2, height / 2 ],
        // 左下顶点
        [ 'L', -width / 2, height / 2 ],
        [ 'Z' ]
      ]
      const color = cfg.color
      const style = G6Util.mix({}, {
        // 节点的位置在上层确定，所以这里仅使用相对位置即可
        x,
        y,
        width,
        height,
        text,
        type,
        iconSize,
        iconColor,// 这边设置值 会往下draw传递 通过cfg
        path,
        stroke: color
      }, cfg.style)
      return style
    },
    drawShape(cfg, group) {
      let shapeStyle = this.getShapeStyle(cfg);
      let path = shapeStyle.path;
      const { backgroundConfig: backgroundStyle, style, labelCfg: labelStyle } = cfg;
      let outKeyShape;
      style.x = 0;
      style.y = 0;
      outKeyShape =  group.addShape(this.shapeType, {
       attrs: {
         fontFamily: 'iconfont', // 对应css里面的font-family: "iconfont";
         textAlign: 'center',
         textBaseline: 'middle',
         text: cfg.text,
         fontSize: cfg.iconSize,
         ...style,
       },
       // must be assigned in G6 3.3 and later versions. it can be any value you want
       draggable: true
     });
     let pathKeyShape = group.addShape('path', {
        attrs: {
          x: 0,
          y: 0,
          path,
          ...backgroundStyle,
        },
        draggable: true,
      });
     this.pathKeyShape = pathKeyShape;
     return outKeyShape;
    },
  }
}
