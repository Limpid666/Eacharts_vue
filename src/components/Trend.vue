/* 澈澈 */
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎ ' + showTitle }}</span>
      <span
        class="iconfont title-icon"
        @click="showChoice = !showChoice"
        :style="comStyle"
      >
        &#xe6eb;
      </span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      showChoice: false, // 是否显示可选项
      choiceType: 'map', // 显示的数据类型
      titleFontSize: 0 // 指明标题的字体大小
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category',
          // 紧挨边缘
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        // 坐标大小设置
        grid: {
          left: '3%',
          top: '35%',
          bottom: '1%',
          right: '4%',
          containLabel: true
        },
        // 图表的提示
        tooltip: {
          trigger: 'axis'
        },
        // 控制图表的名称
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('trend')
      console.log(ret)
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)'
      ]
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      const timeArr = this.allData.common.month
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          // 区域面积
          areaStyle: {
            // 颜色渐变
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const legendArr = valueArr.map((item) => item.name)
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        // 图例位置和形状
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 适配
    screenAdapter() {
      // 字体大小
      this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect(currenType) {
      this.choiceType = currenType
      this.updateChart()
      this.showChoice = false
    }
  },
  created() {},
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  computed: {
    selectTypes() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置标题的样式
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #fff;
}
.title-icon {
  margin-left: 10px;
  cursor: pointer;
}
.select-con {
  background: #222733;
}
</style>
