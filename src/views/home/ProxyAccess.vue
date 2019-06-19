<template>
    <div class="homePage">
        <!-- 标题 -->
        <el-row class="row">
            <h1>Proxy 代理访问图表</h1>
        </el-row>
        <!-- 搜索 -->
        <el-row class="choseTime">
            <!-- 时间范围选择 -->
            <el-date-picker value-format="yyyy-MM-dd HH-mm-ss"
                            v-model="choseTime"
                            size="small"
                            type="datetimerange"
                            style="margin-right: 20px"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="left"></el-date-picker>
            <!-- 搜索按钮 -->
            <el-button type="primary"
                       size="small"
                       icon="el-icon-search"
                       style="vertical-align: top"
                       @click="search">查询
            </el-button>
        </el-row>
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="chartBar"></div>
    </div>
</template>

<script>
    export default {
        name: "ProxyAccess",
        data() {
            return {
                // chartBar: null,
                chartData: "",
                choseTime: "",

                // 选择器快捷选项
                pickerOptions: {
                    shortcuts: [
                        {
                            text: "最近一周",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近一月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近三个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                },
                /// api接口    ProxyAccess
                api: this.config.api.home.ProxyAccess // 接口地址
            };
        },
        methods: {
            search() {
                let nowTime = new Date(),
                    today = `${nowTime.getFullYear()}-${nowTime.getMonth() +
                    1}-${this.tools.timeAdd0(nowTime.getDate())}`;

                let url = this.api.search,
                    para = {
                        starttime: `${today} 00:00:00`,
                        endtime: `${today} 23:59:59`
                    };

                // 若存在搜索条件
                if (this.choseTime) {
                    para = {
                        starttime: this.choseTime[0],
                        endtime: this.choseTime[1]
                    };
                }

                request.post(url, para, {
                    success: res => {
                        this.chartData = res.data;
                        this.createCharts();
                    }
                });
            },
            createCharts() {
                // 基于准备好的dom，初始化echarts实例
                let chartBar = this.$echarts.init(document.getElementById("chartBar"));
                let option = {
                    // backgroundColor: "transparent",
                    title: {
                        // "text": "DNS访问图表",
                        x: "4%",
                        top: "4%"
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "value",
                        //boundaryGap: [0, 0.01]
                        data: []
                    },
                    yAxis: {
                        type: "category",
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        data: []
                    },

                    series: [
                        {
                            name: "代理数",
                            type: "bar",
                            stack: "总和",
                            barMaxWidth: 35,
                            barGap: "10%",
                            itemStyle: {
                                normal: {
                                    color: "rgba(0,191,183,1)",
                                    barBorderRadius: 0,
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: "red"
                                        },
                                        position: "right",
                                        formatter: function (p) {
                                            return p.value > 0 ? p.value : "";
                                        }
                                    }
                                }
                            },
                            data: []
                        }
                    ]
                };
                for (let i = 0; i < this.chartData.length; i++) {
                    if (this.chartData[i] === undefined) {
                        this.chartData[i] = {
                            ProxyCount: 0,
                            DNS: 0
                        };
                    }
                    // 代理数
                    option.yAxis.data[i] = this.chartData[i].Dns;
                    option.xAxis.data[i] = this.chartData[i].Dns;
                    option.series[0].data[i] = this.chartData[i].ProxyCount;
                }
                // 使用刚指定的配置项和数据显示图表。
                chartBar.setOption(option);
            }
        },
        mounted() {
            this.search();
        },
    };
</script>

<style scoped lang="less">
    .homePage {
        height: 100%;

        .choseTime {
            margin-bottom: 20px;
        }
    }

    #chartBar {
        width: 100%;
        height: calc(100% - 115px);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
    }
</style>
