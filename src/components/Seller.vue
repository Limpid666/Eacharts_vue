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
      allData: null
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef)
    },
    async getData() {
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      console.log(ret)
      this.updataChart()
    },
    updataChart() {
      const sellerNames = this.allData.map((item) => item.name)
      const sellerValues = this.allData.map((item) => item.value)
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
