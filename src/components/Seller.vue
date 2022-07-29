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
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, 'chalk')
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
        title: {
          text: '▎商家销售统计',
          textStyle: {
            fontSize: 55
          },
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          bottom: '3%',
          right: '6%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: sellerValues,
            barWidth: 66,
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#fff'
              }
            },
            itemStyle: {
              barBorderRadius: [0, 35, 35, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
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
