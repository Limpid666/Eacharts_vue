/* 澈澈 */
<template>
  <div class="com-container">
    <div class="com-chart" ref="stockRef"></div>
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
      // 当前显示页数
      currentIndex: 0,
      timerId: null
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stockRef, 'chalk')
      const initOption = {
        title: {
          text: '▎库存和销售量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get('stock')
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
      this.startInterval()
    },
    updateChart() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          radius: [110, 100],
          // 关闭鼠标移入到饼图时的动画效果
          hoverAnimation: false,
          // 隐藏指示线
          labelLine: {
            show: false
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          center: centerArr[index],
          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.stockRef.offsetWidth / 100) * 3.6
      const innerRadius = titleFontSize * 2.8
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          },
          series: [
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [outterRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            }
          ]
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart() // 在更改完currentIndex之后 , 需要更新界面
      }, 5000)
    }
  },
  created() {},
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('stockData')
  }
}
</script>
<style scoped lang="scss"></style>
