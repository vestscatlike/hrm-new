<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
export default {
  methods: {
    success(data) {
      console.log(data)
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 新设一个空数组来放数据
      // const arr = []

      // data.results.forEach(item => {
      //   // 每次都新建一个对象
      //   const userInfo = {}
      //   // 此时item就是其中的每一项
      //   for (const k in item) {
      //     userInfo[userRelations[k]] = item[k]
      //   }
      //   arr.push(userInfo)
      // })
      // console.log(arr)

      const arr = data.results.map(item => {
        const userInfo = {}
        for (const k in item) {
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[k])) {
            userInfo[userRelations[k]] = new Date(this.formatDate(item[k], '/'))
          } else {
            userInfo[userRelations[k]] = item[k]
          }
        }
        return userInfo
      })
      console.log(arr)
      this.$router.back()
    },

    // 对时间的一个过滤器
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
