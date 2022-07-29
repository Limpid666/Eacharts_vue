/* 澈澈 */
<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timerId: null
    }
  },
  destroyed() {
    this.clearInterval(this.timerId)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef)
      // 鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData() {
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      this.totalPage =
        this.allData % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1
      console.log(ret)
      this.updataChart()
      // 启动定时器
      this.startInterval()
    },
    updataChart() {
      // 动态刷新
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      // 基础实现
      const sellerNames = showData.map((item) => item.name)
      const sellerValues = showData.map((item) => item.value)
      const option = {
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: sellerNames
        },
        series: [{ type: 'bar', data: sellerValues }]
      }
      this.chartInstance.setOption(option)
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updataChart()
      }, 3000)
    }
  },
  created() {},
  mounted() {
    this.initChart()
    this.getData()
  }
}
</script>
<style scoped lang="scss"></style>
