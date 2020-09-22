/**
 * Created by OXOYO on 2019/7/4.
 *
 * 注册自定义边
 */

import line from './line'
import cubic from './cubic'
import broken from './broken'
import doubleArticle from './doubleArticle'
import pipe from './pipe'

const obj = {
  line,
  cubic,
  broken,
  doubleArticle,
  pipe
}

export default function (G6) {
  Object.values(obj).forEach(item => {
    G6.registerEdge(item.name, item.options, item.extendName)
  })
}
