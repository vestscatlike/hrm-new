<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-07 16:06:42
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-03-16 15:14:47
 * @FilePath: \hrsaas\src\views\404.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div :loading="loading" />
    <div v-if="flag" ref="divRef">22</div>
    <!-- <button @click="chageC">1</button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: false,
      loading: false
    }
  },
  created() {
    this.chageC()
  },

  methods: {
    chageC() {
      this.loading = true
      console.log(this.flag)
      this.$nextTick(() => {
        console.log(this.flag)
        console.log(this.$refs.divRef)
      })
      console.log(this.flag)
      this.flag = true
      console.log(this.flag)
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
</script>

<style>

</style>
