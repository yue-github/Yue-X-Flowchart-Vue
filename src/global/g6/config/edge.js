/**
 * Created by OXOYO on 2019/7/16.
 *
 * 边配置
 */

export default {
  style: {
    default: {
      stroke: '#000000',
      strokeOpacity: 1
    },
    active: {
      shadowColor: 'red',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    },
    inactive: {
      shadowColor: ''
    },
    myActive: {
      shadowColor: '#28FF28',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    },
    myInactive: {
      shadowColor: ''
    }
  },
  type: {
    doubleArticle: {
      lineDash: [0, 0]
    },
    solid: {
      lineDash: []
    },
    dashed: {
      lineDash: [ 5, 5 ]
    },
    dot: {
      lineDash: [ 2, 2 ]
    },
    pipe: {
      lineDash: []
    }
  }
}
