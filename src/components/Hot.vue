/* 澈澈 */ /* -- 热销商品销售金额占比统计 -- */
<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
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
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotproductData')
  },
  methods: {
    toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updataChart()
    },
    toRight() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updataChart()
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, 'chalk')
      const initOption = {
        title: {
          text: '▎热销商品销售金额占比统计',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach((item) => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach((item) => {
              retStr += `${item.name}:${
                parseInt((item.value / total) * 100) + '%'
              }<br/>`
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              show: true
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get('hotproduct')
      this.allData = ret
      console.log(this.allData)
      this.updataChart()
    },
    updataChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => item.name
      )
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children
          }
        }
      )
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [{ data: seriesData }]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6
      console.log(this.titleFontSize)
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ],
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
    }
  },
  created() {
    this.$socket.registerCallBack('hotproductData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotproductData',
      chartName: 'hotproduct',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  computed: {
    catName() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translate(-50%);
  cursor: pointer;
  color: #fff;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translate(-50%);
  cursor: pointer;
  color: #fff;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #fff;
}
</style>
