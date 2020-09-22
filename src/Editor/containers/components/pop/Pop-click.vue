<template>
    <div class="main" :style="doMyMsg">
        <div class="bg-control" :style="{background: myMsg.data.bgColor, opacity: myMsg.data.bgOpacity}"></div>
        <div class="handleLogo" v-if="!myMsg.handleLogoIsHide">
            <img :src="myMsg.data.handleLogo" alt="">
        </div>
        <div class="container">
            <div class="title">
                <span class="title-msg">
                    {{ myMsg.data.title }}
                </span>
                <div class="circle-tag" :style="{background: myMsg.data.tagBg}">
                    {{ myMsg.data.tag }}
                </div>
            </div>
            <div class="devide"></div>
            <div class="table-detail">
                <div class="row" v-for="i in tableDataDo">
                    <div class="row-container">
                        <h4>{{ i.title }}</h4>
                        <div class="column-item" :class="{ 'heightSet': WHactive }" v-for="column in i.items">
                            <img :src="column" alt="" v-if="column.includes('.jpg') || column.includes('.png') || column.includes('.gif')" style="width:50px;height:20px">
                            <div v-else :class="{'imgSet': WHactive}">{{ column }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {

            }
        },
        props:{
            myMsg: {
                default: {},
                type: Object
            }
        },
        computed:{
            doMyMsg(){
                return { 'border': this.myMsg.data.boxBorder, left: this.$store.getters.panelLeftMsg.isExpand ? this.myMsg.x + parseFloat(this.$store.getters.panelLeftMsg.style.width) + 'px' : this.myMsg.x + 'px', top: this.myMsg.y + 'px' }
            },
            tableDataDo(){
                let renderData = [];
                for(let i in this.myMsg.data.titles){
                    let json = {
                        title: this.myMsg.data.titles[i],
                        items: this.myMsg.data.tableData.map(_ => _[i])
                    }
                    renderData.push(json)
                }
                // console.log(renderData)
                return renderData;
            },
            WHactive(){
               return this.myMsg.data.tableData.some(_ => Object.values(_).some(_ => _.includes('.jpg') || _.includes('.gif') || _.includes('.png')))
            }
        },
        watch:{
            myMsg(newV){
                console.log(newV)
            }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .main {
    min-width: 150px;
    display:flex;
    justify-content: center;
    align-items: center;
    border-radius: 0px 15px 15px 15px;
    // box-shadow: 4px 2px 6px #ccc;
    position: fixed;
    z-index:115;
    .bg-control{
        width:100%;
        height: 100%;
        position: absolute;
        left:0;
        top:0;
    }
    .container{
        position:relative;
        padding: 5px;
        .title{
            justify-content: center;
            display:flex;
            align-items: center;
            .circle-tag{
                border-radius: 100%;
                width:15px;
                height:15px;
                display:flex;
                justify-content: center;
                align-items: center;
                margin-left:3px;
            }
        }
        .table-detail{
            display:flex;
            z-index: 1;
            position: relative;
            .row{
                padding: 0 5px;
                margin-left: 10px;
                .row-container{
                    display:flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    .column-item{
                        max-width:100px;
                        overflow:hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-top: 5px;
                        font-size: 12px;
                        color:#549ef4;
                        .imgSet{
                            height: 20px;
                            display:flex;
                            align-items: center;
                        }
                        &{
                            height: 20px;
                        }
                    }
                }
                &:first-child{
                  margin-left:0;
                }
            }
        }
    }
}
.devide{
    width: 100%;
    height: 2px;
    background:#fff;
    margin: 6px 0px;
    box-shadow: 0px 0px 1px 0px #fff;
}
.handleLogo{
    position:absolute;
    top: -15px;
    left:1px;
    z-index: 3;
}
</style>
