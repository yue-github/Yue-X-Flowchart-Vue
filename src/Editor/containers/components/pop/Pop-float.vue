<template>
    <div class="main">
        <div class="bg"></div>
        <div class="msg" @click="handleBindAttr">
           <div class="msg-detail" v-for="i in msg" :key="i.key">
                <img :src="i.url" :alt="i.label">
                <span>{{ i.label }}</span>
           </div>   
        </div>
    </div>
</template>

<script>
import { updateBA } from '@/global/utils/bindAttrController'
    export default {
        data(){
            return {}
        },
        props:{
            msg:{
                default: [],
                type: Array
            }
        },
        methods:{
            // 例子
            handleBindAttr(){
                let graph = this.$store.getters.graph;
                console.log(graph)
                updateBA(graph, 'g15_1597136389113', [1,3], this.flag ? false : true)
                this.flag = !this.flag;
            }
        }
    }
</script>

<style lang="less" scoped>
.main{
    padding: 3px 10px 8px 5px;
    border-radius: 13px;
    box-shadow: 4px 2px 6px #ccc;
    overflow: hidden;
    display:flex;
    position:fixed;
    right:29px;
    top:110px;
    z-index: 120;
    border-bottom: 2px solid #ccc;
    .bg{
        width:100%;
        height:100%;
        background: #eceaeb;
        position: absolute;
        left:0;
        top:0;
    }
    .msg{
        z-index:1;
        display:flex;
        flex-direction: column;
        .msg-detail{
            display:flex;
            justify-content: start;
            align-items: center;
            margin-top: 6.5px;
            margin-left:5px;
            img{
                width: 18px;
                margin-right: 8px;
            }
            span{
                color: #97999d;
                font-size: 12px;
            }
        }
    }
}
</style>