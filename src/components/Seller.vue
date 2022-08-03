/* 澈澈 */ /* -- 商家销售统计 -- */
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
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, 'chalk')
      const initOption = {
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        title: {
          text: '▎商家销售统计',
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
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#fff'
              }
            },
            itemStyle: {
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
      this.chartInstance.setOption(initOption)
      // 鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get('seller')
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
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
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
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
      console.log(titleFontSize)
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          lineStyle: {
            width: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  created() {},
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  }
}
</script>
<style scoped lang="scss"></style>
