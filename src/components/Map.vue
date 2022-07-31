/* 澈澈 */
<template>
  <div class="com-container">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: '',
  components: {},
  data() {
    return {
      chartInstance: null,
      allData: null
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    async initChart() {
      const chartInstance = this.$echarts.init(this.$refs.mapRef)
      const ret = await axios.get('http://localhost:6061/static/map/china.json')
      console.log(ret)
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        geo: {
          type: 'map',
          map: 'china'
        }
      }
      chartInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('map')
      this.allData = ret
      console.log(this.allData)
      this.updataChart()
    },
    updataChart() {
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
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
