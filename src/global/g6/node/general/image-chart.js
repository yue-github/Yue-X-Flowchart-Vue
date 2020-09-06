/**
 * Created by 蓝之静云 on 2019/9/18
 *柱状、环形、折线、饼图等
 */

import Global from '@antv/g6/es/global'
import * as G6Util from '@antv/util'
import Util from '@antv/g6/es/util'
import base from '../base'
import utils from '../../utils'
import config from '../../config'
import myBus from '@/global/utils/bus'
import Chart from '@antv/chart-node-g6';// 安装命令：cnpm i @antv/chart-node-g6@0.0.3

export default {
  name: 'image-chart',
  extendName: 'single-shape',
  options: {
    ...base,
    shapeType: 'rect',
    getShapeStyle(cfg) {
      console.log(cfg)
      cfg.style.fill = "transparent"
      cfg.style.stroke = 'transparent'
      cfg.style.opacity = 0.4
      const width = cfg.width
      const height = cfg.height
      const x = 0 - width / 2
      const y = 0 - height / 2
      const img = cfg.img
      const is = cfg.is
      const color = cfg.color || Global.defaultNode.color
      const path = [
        // 左上顶点
        ['M', -width / 2, -height / 2],
        // 右上顶点
        ['L', width / 2, -height / 2],
        // 右下顶点
        ['L', width / 2, height / 2],
        // 左下顶点
        ['L', -width / 2, height / 2],
        ['Z']
      ]
      const style = Util.mix({}, Global.defaultNode.style, {
        // 节点的位置在上层确定，所以这里仅使用相对位置即可
        x,
        y,
        zIndex: 100,
        width,
        height,
        shadowOffsetX: 4,
        shadowOffsetY: 5,
        shadowColor: '#000',
        shadowBlur: 8,
        trendData: cfg.trendData,
        img,
        is,
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
      const shapeType = this.shapeType
      outKeyShape = group.addShape(shapeType, {
        attrs: shapeStyle,
        name: 'XFCNodeKeyShape',
        draggable: true
      })
      // 单独对虚拟参照路径进行操作
      let pathKeyShape = group.addShape('path', {
        draggable: true,
        attrs: {
          x: 0,
          y: 0,
          path,
          ...backgroundStyle,
        },
      });
      // 绑定事件点击做些什么
      outKeyShape.on('mouseenter', _e => {
        const trendData = [
          { genre: '机顶', sold: 75 * Math.random() },
          { genre: '机舱', sold: 115 * Math.random() },
          { genre: '机尾', sold: 320 * Math.random() },
          { genre: '机头', sold: 150 * Math.random() },
          { genre: '机中', sold: 250 * Math.random() },
        ];
        const view = outKeyShape.get('intervalView');
        if (view) view.changeData(trendData);
      })
      this.pathKeyShape = pathKeyShape;
      // chart实例
      let view = null;
      switch (shapeStyle.is) {
        //  图柱体
        case 'chartColumnar':
          // 标题背景色
          group.addShape('rect', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              x: shapeStyle.x,
              y: shapeStyle.y,
              width: shapeStyle.width,
              height: shapeStyle.height / 5,
              fill: '#69c0ff',
            }
          });
          // 标题文字
          group.addShape('text', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              text: '运行率',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + shapeStyle.height / 10 + 8,
              fontSize: 12,
              fill: '#fff'
            }
          });
          // 描述性文字
          group.addShape('text', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              text: '2020-06-07 ~ 2021-06-14 | 均值',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + 17 + shapeStyle.height / 5,
              fontSize: 8,
              fill: '#fff',
            }
          });
          view = new Chart({
            group,
            padding: 1,
            visible: true,// 是否显示
            width: shapeStyle.width,
            height: shapeStyle.height * 3 / 5,
            x: shapeStyle.x,
            y: shapeStyle.y + shapeStyle.height * 2 / 5
          });
          view.data(shapeStyle.trendData);
          view.interval().position('genre*sold').color('genre');
          view.legend('genre', false);
          view.scale({
            genre: {
              alias: '种类', // 列定义，定义该属性显示的别名
            },
            sold: {
              alias: '运行率',
            },
          });
          view.axis('sold', true);
          // 极坐标下的图
          // view.coordinate('polar');
          break;
        // 饼图
        case 'pieChart':
          // 标题背景色
          group.addShape('rect', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              x: shapeStyle.x,
              y: shapeStyle.y,
              width: shapeStyle.width,
              height: shapeStyle.height / 5,
              fill: '#69c0ff',
            }
          });
          // 标题文字
          group.addShape('text', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              text: '饼图率',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + shapeStyle.height / 10 + 8,
              fontSize: 12,
              fill: '#fff'
            }
          });
          // 描述性文字
          group.addShape('text', {
            draggable: true,
            zIndex: 1000,
            attrs: {
              flag: shapeStyle.is,
              text: '2020-06-07 ~ 2021-06-14 | 平均值',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + 17 + shapeStyle.height / 5,
              fontSize: 8,
              fill: '#fff',
            }
          });
          view = new Chart({
            group,
            padding: 2,
            visible: true,// 是否显示
            width: shapeStyle.width,
            height: shapeStyle.height * 2.5 / 5,
            x: shapeStyle.x,
            y: shapeStyle.y + shapeStyle.height * 2.3 / 5
          });
          view.data(shapeStyle.trendData);
          view.interval().position('genre*sold').color('genre');
          view.legend('genre', false);
          view.scale({
            genre: {
              alias: '种类', // 列定义，定义该属性显示的别名
            },
            sold: {
              alias: '饼图率',
            },
          });
          view.axis('sold', true);
          // 极坐标下的图
          view.coordinate('polar');
          break;
        // 折线图
        case 'chartFracture':
          // 标题背景色
          group.addShape('rect', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              x: shapeStyle.x,
              y: shapeStyle.y,
              width: shapeStyle.width,
              height: shapeStyle.height / 5,
              fill: '#69c0ff',
            }
          });
          // 标题文字
          group.addShape('text', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              text: '出错率',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + shapeStyle.height / 10 + 8,
              fontSize: 12,
              fill: '#fff'
            }
          });
          // 描述性文字
          group.addShape('text', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              text: '2020-06-07 ~ 2021-06-14 | 精值',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + 17 + shapeStyle.height / 5,
              fontSize: 8,
              fill: '#fff',
            }
          });
          view = new Chart({
            group,
            padding: 1,
            visible: true,// 是否显示
            width: shapeStyle.width,
            height: shapeStyle.height * 3 / 5,
            x: shapeStyle.x,
            y: shapeStyle.y + shapeStyle.height * 2 / 5
          });
          view.data(shapeStyle.trendData);
          view.line().position('genre*sold').color('#9AD681').shape('dash');
          view.point().position('genre*sold').color('#9AD681').shape('circle');
          // view.area().position('genre*sold').color('phone');
          view.legend('genre', false);
          view.scale({
            genre: {
              alias: '种类', // 列定义，定义该属性显示的别名
            },
            sold: {
              alias: '出错率',
            },
          });
          view.axis('sold', true);
          // 极坐标下的图
          // view.coordinate('polar');
          break;
        // 环形图
        case 'ringDiagram':
          // 标题背景色
          group.addShape('rect', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              x: shapeStyle.x,
              y: shapeStyle.y,
              width: shapeStyle.width,
              height: shapeStyle.height / 5,
              fill: '#69c0ff',
            }
          });
          // 标题文字
          group.addShape('text', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              text: '出错率',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + shapeStyle.height / 10 + 8,
              fontSize: 12,
              fill: '#fff'
            }
          });
          // 描述性文字
          group.addShape('text', {
            draggable: true,
            attrs: {
              flag: shapeStyle.is,
              text: '2020-06-07 ~ 2021-06-14 | 精值',
              x: shapeStyle.x + 5,
              y: shapeStyle.y + 17 + shapeStyle.height / 5,
              fontSize: 8,
              fill: '#fff',
            }
          });
          view = new Chart({
            group,
            padding: 1,
            visible: true,// 是否显示
            width: shapeStyle.width,
            height: shapeStyle.height * 2.8 / 5,
            x: shapeStyle.x,
            y: shapeStyle.y + shapeStyle.height * 2 / 5,
          });
          view.data(shapeStyle.trendData);
          view.line().position('genre*sold').color('#9AD681').shape('dash');
          view.legend('genre', false);
          view.scale({
            genre: {
              alias: '种类', // 列定义，定义该属性显示的别名
            },
            sold: {
              alias: '出错率',
            },
          });
          view.axis('sold', true);
          // 极坐标下的图
          view.coordinate('polar');
          break;
      }
      if (view) {
        view.axis('genre', {
          label:{
            style:{
              fill:'#69c0ff',
            },
          }
        });
        view.axis('sold', {
          label:{
            style:{
              fill:'#69c0ff',
            },
          }
        });
        view.render();
        outKeyShape.set('intervalView', view);
      }







      // 图表背景色
      group.addShape('rect', {
        draggable: true,
        zIndex: -1000,
        attrs: {
          flag: 'chart-bg',
          x: shapeStyle.x,
          y: shapeStyle.y,
          width: shapeStyle.width,
          height: shapeStyle.height,
          fill: '#000',
          opacity: 0.4,
          zIndex: -1000,
        }
      });
      group.sort(); // 排序，根据 zIndex 排序
      return outKeyShape;
    },
    // 绘制后附加锚点
    afterDraw(cfg, group) {
      // 模拟要绘制的图元属性绑定值---在cfg里可以找到，若后端对该图元信息有加bindAttr属性
      let bindAttr = [], total = 3
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
          shape: 'circle',
          opacity: 0.6,
          shadowColor: `#${(color => new Array(7 - color.length).join('0') + color)((Math.random() * 0x1000000 >>> 0).toString(16))}`,
          shadowBlur: 10,
          r: 10,
          span: 5
        })
      }
      // 过滤不展示的部分
      bindAttr = bindAttr.filter(_ => {
        return _.isShow
      })
      // 为了比较清晰暂不整合一起，这里单独对绑定的属性进行改造
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
        })
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
        json.width = 20
        json.height = 20
        json.id = _i + 1
        json.entityId = cfg.id
        json.text = '信息...'
        json.x = _.x - (json.width >> 1)
        json.y = _.y - (json.height >> 1)
        json.opacity = 1
        switch (_i) {// 只是模拟---实际直接传值
          case 0:
            json.img = require('@/assets/images/bindAttr/feel.png')
            json.data = {
              id: 1,
              title: '传感器信息',// 标题
              bgColor: '#f4b910',// 盒子背景颜色
              bgOpacity: 0.3,// 盒子背景颜色透明度
              tag: 3,// 标题右侧tag数字
              handleLogo: require('@/assets/images/bindAttr/yellow.png'),// 手柄logo
              tagBg: '#dca00a',// 标题右侧tag数字背景
              boxBorder: '1px solid #e4b63e',// box边框设置
              titles: {// 模拟表格标题---注意字段名例如row1...与具体数据的属性需要保持一致
                itemText: '属性名称',
                itemValue: '属性ID',
                sensorName: '传感器名称',
                id: '传感器逻辑ID',
                sensorType: '传感器类型',
                defaultValue: '值'
              },
              tableData: [] // 绑定属性表格数据
            }
            break
          case 1:
            json.img = require('@/assets/images/bindAttr/param.png')
            json.data = {
              id: 2,
              title: '能源绩效参数',// 标题
              bgColor: '#f68596',// 盒子背景颜色
              bgOpacity: 0.5,// 盒子背景颜色透明度
              tag: 2,// 标题右侧tag数字
              handleLogo: require('@/assets/images/bindAttr/red.png'),// 手柄logo
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
            break
          case 2:
            json.img = require('@/assets/images/bindAttr/standard.png')
            json.data = {
              id: 3,
              title: '指标信息',// 标题
              bgColor: '#6ce6b0',// 盒子背景颜色
              bgOpacity: 0.5,// 盒子背景颜色透明度
              tag: 1,// 标题右侧tag数字
              handleLogo: require('@/assets/images/bindAttr/green.png'),// 手柄logo
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
            break
        }
        return json
      })
      // 过滤不需要展示的部分
      bindAttr.bindAttrImages.forEach(attrs => {
        attrs.flag = 'bindAttr' //标识是绑定属性
        const imgShape = group.addShape('image', {
          visible: false,// 默认不展示
          attrs: attrs
        })
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
            console.log(_e)
            imgShape.attr({
              ...config.bindAttr.style.default,
              ...config.bindAttr.style.active
            })
            // 完成业务逻辑
            myBus.$emit('bindAttr/click', _e)
          })
        }
      })
      // 添加文本浮层---尝试过直接在addShape中添加文本，未成功，可再试
      // bindAttr.bindAttrTexts = bindAttr.map(_ => {
      //   let json = {}
      //   json.id = _.id;
      //   json.x = _.x + _.disTextX;
      //   json.y = _.y + _.disTextY;
      //   json.textAlign ='center';
      //   json.text = _.text;
      //   json.fontSize = '12px';
      //   json.opacity = 1;
      //   json.textAlign = 'left';
      //   json.fill = "#409efe"
      //   return json;
      // })
      // bindAttr.bindAttrTexts.forEach(attrs => {
      //   const textShape = group.addShape('text', {
      //     attrs: attrs
      //   });
      // })
      console.log(group)
      // 绘制锚点
      utils.anchor.draw(cfg, group)
      // 绘制shapeControl
      utils.shapeControl.draw(cfg, group)
    },
    update(cfg, item) {
      const keyShape = item.getKeyShape();
      const view = keyShape.get('intervalView');
      if (view) view.changeData(cfg.trendData);
      // 自定义节点配置
      const defaultStyle = this.options
      // 从新计算图形样式
      const shapeStyle = this.getShapeStyle(cfg)
      const style = G6Util.mix({}, defaultStyle, shapeStyle)
      // 更新图形
      this.updateShape(cfg, item, style)
    }
  }
}
