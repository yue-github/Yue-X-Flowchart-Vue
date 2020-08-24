/**
 * Created by 玉旨旺 on 2020/7/18.
 *
 * png、jpg、svg等图片
 * 
 * Update by 蓝之静云 on 2020/8/18
 */

import Global from '@antv/g6/src/global'
import Util from '@antv/g6/src/util'
import base from '../base'
import utils from '../../utils'
import config from '../../config'
import myBus from '@/global/utils/bus'
import Store from '@/store'
export default {
  name: 'image',
  extendName: 'single-shape',
  options: {
    ...base,
    shapeType: 'image',
    getShapeStyle(cfg) {
      const size = this.getSize(cfg)
      const width = size[0]
      const height = size[1]
      const x = 0 - width / 2
      const y = 0 - height / 2
      const img = cfg.img
      const color = cfg.color || Global.defaultNode.color
      const style = Util.mix({}, Global.defaultNode.style, {
        // 节点的位置在上层确定，所以这里仅使用相对位置即可
        x,
        y,
        zIndex: 100,
        width,
        height,
        img,
        stroke: color
      }, cfg.style)
      return style
    },
    // 绘制后附加锚点
    afterDraw(cfg, group) {
      // 模拟要绘制的图元属性绑定值---在cfg里可以找到，若后端对该图元信息有加bindAttr属性
      let bindAttr = [], total = 3;
      for (let i of new Array(total)) {
        bindAttr.push({
          id: 1,
          x: 0,
          y: 0,
          isShow: true || Math.random() * 2 << 0 == 0 ? true : false,
          text: `T:${Math.random() * 18 >>> 0}℃`,
          disTextX: -20, // x轴偏移量---后端传过来的数据可根据每一个绑定的属性自定义调整位置
          disTextY: 6, // y轴偏移量
          bindAttrTexts: [
            // 各自图元的绑定属性文本
          ],
          bindAttrImages: [{}],// 绑定属性logo及相关信息
          fill: "#F0F0F0",
          shape: 'circle',
          opacity: 0.6,
          shadowColor: `#${(color => new Array(7 - color.length).join("0") + color)((Math.random() * 0x1000000 >>> 0).toString(16))}`,
          shadowBlur: 10,
          r: 10,
          span: 5
        })
      }
      // 图元尺寸
      const size = this.getSize(cfg)
      bindAttr = bindAttr.map((i, index, _t) => {// 注意：目前最多绑定3个属性，若超过需要改动位置算法
        if (index === 0) {
          i.x = (size[0] >> 1) - i.r// 最右边一个---> 往左排
          i.y = (size[1] >> 1) + i.r
        } else {
          i.x = _t[index - 1].x - (i.r << 1) - _t[index - 1].span
          i.y = _t[index - 1].y
        }
        return i
      })
      // 添加circle图形作为绑定属性的背景浮层
      bindAttr.forEach(attrs => {
        attrs.flag = 'bindCircle'
        const attrBg = group.addShape(attrs.shape, {
          zIndex: -1,
          visible: false && attrs.isShow,
          attrs
        });
        if (attrBg) {
          attrBg.on('mouseenter', function () {
            attrBg.attr({
              ...config.bindAttr.style.default,
              ...config.bindAttr.style.hover

            })
          })
          attrBg.on('mouseleave', function () {
            attrBg.attr({
              ...config.bindAttr.style.default,
              ...config.bindAttr.style.unhover
            })
          })
          attrBg.on('click', _e => {
            console.log(_e.target._attrs.text)
            attrBg.attr({
              ...config.bindAttr.style.default,
              ...config.bindAttr.style.active
            })
            // 完成业务逻辑
            myBus.$emit('bindAttr/click', _e)
          })
        }
      })
      // 添加图片logo
      bindAttr.bindAttrImages = bindAttr.map((_, _i) => {
        let json = {}
        json.width = 20;
        json.height = 20;
        json.id = _.id;
        json.text = '信息...';
        json.x = _.x - (json.width >> 1);
        json.y = _.y - (json.height >> 1);
        json.opacity = 1;
        switch (_i) {// 只是模拟---实际直接传值
          case 0:
            json.img = require('@/assets/images/bindAttr/feel.png');
            json.data = {
              id: 1,
              title: '传感器信息',// 标题
              bgColor: '#f4b910',// 盒子背景颜色
              bgOpacity: 0.3,// 盒子背景颜色透明度
              tag: 3,// 标题右侧tag数字
              tagBg: '#dca00a',// 标题右侧tag数字背景
              boxBorder: '1px solid #e4b63e',// box边框设置
              titles: {// 模拟表格标题---注意字段名例如row1...与具体数据的属性需要保持一致
                row1: '属性名称',
                row2: '属性ID',
                row3: '传感器名称',
                row4: '传感器ID',
                row5: '传感器类型',
              },
              tableData: [// 绑定属性表格数据
                {
                  row1: '属性1',
                  row2: '12',
                  row3: '传感器1',
                  row4: '34',
                  row5: '计量类',
                },
                {
                  row1: '属性2',
                  row2: '121',
                  row3: '传感器2',
                  row4: '232',
                  row5: '运行监检测类',
                },
                {
                  row1: '属性3',
                  row2: '23434',
                  row3: '传感器3',
                  row4: '232',
                  row5: '水阀类',
                },
              ]
            }
            break;
          case 1:
            json.img = require('@/assets/images/bindAttr/param.png');
            json.data = {
              id: 2,
              title: '能源绩效参数',// 标题
              bgColor: '#f68596',// 盒子背景颜色
              bgOpacity: 0.5,// 盒子背景颜色透明度
              tag: 2,// 标题右侧tag数字
              tagBg: '#bf0c22',// 标题右侧tag数字背景
              boxBorder: '1px solid #e88c9f',// box边框设置
              titles: {// 模拟表格标题---注意字段名例如row1...与具体数据的属性需要保持一致
                row1: '能源绩效参数',
                row2: '单位',
              },
              tableData: [// 绑定属性表格数据
                {
                  row1: '单位产品综合能耗',
                  row2: '万元',
                },
                {
                  row1: '耗天燃气量',
                  row2: '万立方米',
                }
              ]
            }
            break;
          case 2:
            json.img = require('@/assets/images/bindAttr/standard.png');
            json.data = {
              id: 3,
              title: '指标信息',// 标题
              bgColor: '#6ce6b0',// 盒子背景颜色
              bgOpacity: 0.5,// 盒子背景颜色透明度
              tag: 1,// 标题右侧tag数字
              tagBg: '#0cb768',// 标题右侧tag数字背景
              boxBorder: '1px solid #20c283',// box边框设置
              titles: {// 模拟表格标题---注意字段名例如row1...与具体数据的属性需要保持一致
                row1: '属性名称',
                row2: '属性ID',
                row3: '图片',
                row4: '指标名称',
                row5: '单位'
              },
              tableData: [// 绑定属性表格数据
                {
                  row1: '属性1',
                  row2: '123',
                  row3: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=986631091,2171506786&fm=26&gp=0.jpg',
                  row4: '温度',
                  row5: '℃'
                },
                {
                  row1: '属性2',
                  row2: '456',
                  row3: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2398903586,4830202&fm=26&gp=0.jpg',
                  row4: '湿度',
                  row5: '☀'
                }
              ]
            }
            break;
        }
        return json;
      })
      // 过滤不需要展示的部分
      bindAttr.bindAttrImages = bindAttr.bindAttrImages.filter(_ => Store.getters.bindAttrList.includes(_.data.id))
      bindAttr.bindAttrImages.forEach(attrs => {
        attrs.flag = 'bindAttr'; //标识是绑定属性
        const imgShape = group.addShape('image', {
          visible: false,// 默认不展示
          attrs: attrs
        });
        if (imgShape) {
          imgShape.on('mouseenter', function () {
            imgShape.attr({
              ...config.bindAttr.style.default,
              ...config.bindAttr.style.hover
            })
          })
          imgShape.on('mouseleave', function () {
            imgShape.attr({
              ...config.bindAttr.style.default,
              ...config.bindAttr.style.unhover
            })
          })
          imgShape.on('click', _e => {
            console.log(_e, _e.target._attrs.text)
            imgShape.attr({
              ...config.bindAttr.style.default,
              ...config.bindAttr.style.active
            })
            // 完成业务逻辑
            myBus.$emit('bindAttr/click', _e)
          })
        }
      })
      // 绘制锚点
      utils.anchor.draw(cfg, group)
      // 绘制shapeControl
      utils.shapeControl.draw(cfg, group)
    }
  }
}
