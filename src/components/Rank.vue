/* 澈澈 */ /* -- 地区销售排行 -- */
<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
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
      startValue: 0,
      endValue: 9,
      timerId: null
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
    this.$socket.unRegisterCallBack('rankData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          left: '5%',
          top: '40%',
          bottom: '5%',
          right: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      // 鼠标移出图表停止定时器
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 鼠标移出图表启动定时器
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get('rank')
      this.allData = ret
      console.log(this.allData)
      // 排序
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updataChart()
      this.startInterval()
    },
    updataChart() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const proviceArr = this.allData.map((item) => item.name)
      const valueArr = this.allData.map((item) => item.value)
      const dataOption = {
        xAxis: {
          data: proviceArr
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6
      console.log(titleFontSize)
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
    },
    // 定时器
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updataChart()
      }, 2000)
    }
  },
  created() {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  }
}
</script>
<style scoped lang="scss"></style>
