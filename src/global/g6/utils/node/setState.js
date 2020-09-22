/**
 * created by 蓝之静云 on 2020/8/15
 *
 * 设置节点状态
 */
export default function (name, value, item) {
  let model = item.getModel()
  if (name === 'dragenter') {
    if (value) {
      model.style = Object.assign({}, model.style, {
        stroke: 'rgb(53, 181, 52)',
        strokeOpacity: 0.83
      })
    } else {
      model.style = Object.assign({}, model.style, {
        stroke: model.style.currentStroke || 'red',
        strokeOpacity: 0.83
      })
    }
  }
  if (name === 'nodeActive') {
    if (value) {
      model.style = Object.assign({}, model.style, {
        shadowColor: '#28FF28',
        shadowBlur: 10
      })
    } else {
      model.style = Object.assign({}, model.style, {
        shadowColor: '',
        shadowBlur: 0
      })
    }
  }
  if (name === 'nodeActiveRed') {
    if (value) {
      model.style = Object.assign({}, model.style, {
        shadowColor: 'red',
        shadowBlur: 10
      })
    } else {
      model.style = Object.assign({}, model.style, {
        shadowColor: '',
        shadowBlur: 0
      })
    }
  }
}
