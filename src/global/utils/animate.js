/**
 * @author 蓝之静云
 */
// 为了不丢帧---自定义动画
window.requestAnimation = function(){
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback,ele){
            setTimeout(callback,1000/60);
        }
    )
}();
/**
 *@author 蓝之静云
  @params callback 为传过来的回调,会不断执行
  @parmas timerObj 为传过来的对象 里面放有执行动画的标识 通常用于取消动画
 *
 */
export const animate = (callBack, timerObj) => {
    timerObj.index = requestAnimation(() => {
        callBack(timerObj)
        animate(callBack, timerObj)
    })
}
 