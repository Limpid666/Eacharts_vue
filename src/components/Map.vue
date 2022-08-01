/* 澈澈 */
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>
<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
export default {
  name: '',
  components: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {}
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
      const ret = await axios.get('http://localhost:6060/static/map/china.json')
      console.log(ret)
      this.$echarts.registerMap('china', ret.data)
      this.chartInstance.on('click', async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        // 判断里面有没有provinceInfo.key的数据
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get(
            'http://localhost:6060' + provinceInfo.path
          )
          console.log(ret)
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
      const initOption = {
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        title: {
          text: '▎ 商家分布',
          left: 20,
          top: 20
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 横着变成竖轴
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('map')
      this.allData = ret
      console.log(this.allData)
      this.updataChart()
    },
    updataChart() {
      const legendArr = this.allData.map((item) => item.name)
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          // 涟漪效果
          rippleEffect: {
            scale: 5,
            brushType: 'stroke' // 空心涟漪的效果
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      // offsetParent：获取带有定位的最近父元素
      const titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2, // 图例之间的间隔
          itemStyle: {
            fontSize: titleFontSize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  },
  created() {},
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  }
}
</script>
<style scoped lang="scss"></style>
