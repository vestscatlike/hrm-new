<!--
 * @Author: 方书生 fanss1368@163.com
 * @Date: 2023-02-26 15:23:26
 * @LastEditors: 方书生 fanss1368@163.com
 * @LastEditTime: 2023-02-26 17:42:59
 * @FilePath: \hrsaas\src\views\dashboard\components\work-calendar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}年</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}月</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentData">
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startData: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      yearList: [],

      // 当前时间，日历组件根据这个时间进行默认的展示
      currentDataData: null
    }
  },
  computed: {
    currentData() {
      return new Date(`${this.currentYear}-${this.currentMonth - 1}`)
    }
  },
  created() {
    console.log(this.startData)
    this.currentMonth = this.startData.getMonth() + 1
    this.currentYear = this.startData.getFullYear()

    // 构建一个年份表
    this.yearList = Array.from(Array(11), (item, index) => {
      return this.currentYear + index - 5
    })
  },
  methods: {
    // 是否是休息日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style  scoped lang="scss">
 /* ::deep .el-calendar__header {
   display: none
 } */
 .date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
</style>
