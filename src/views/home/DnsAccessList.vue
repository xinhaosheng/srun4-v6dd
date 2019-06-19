<template>
    <div class="homePage">
        <!-- 标题 -->
        <el-row class="row">
            <h1>DNS 访问列表信息展示</h1>
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

        <el-row class="row table-container">
            <el-table
                    :data="tableData"
                    empty-text="暂无数据"
                    tooltip-effect="dark"
                    stripe
                    @selection-change="select"
            >
                <!-- ID -->
                <el-table-column type="index" width="40" :index="getIndex" fixed></el-table-column>
                <!-- 选择 -->
                <el-table-column type="selection" width="45" fixed></el-table-column>

                <!-- 数据 -->
                <el-table-column prop="Host" label="DNS地址" min-width="180"></el-table-column>
                <el-table-column prop="Ip" label="IP地址" min-width="180"></el-table-column>
                <el-table-column prop="Time" label="DNS访问时间" min-width="180"></el-table-column>
            </el-table>
        </el-row>

        <el-row class="row">
            <el-col :span="18">
                <el-pagination
                        layout="total,sizes, prev, pager, next"
                        :current-page.sync="page.now"
                        :page-size.sync="page.size"
                        :page-sizes="[5, 10, 20]"
                        :total="page.count"
                        background
                        @size-change="changePageSize"
                        @current-change="changePage"
                ></el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "DnsAccessList",
        data() {
            return {
                chartData: "",
                choseTime: "",
                tableData: [],
                page: {
                    now: 1, // 分页 当前页码
                    size: 5, // 分页 单页展示数据 [5, 10, 20]
                    count: 0 // 分页 数据总数
                },
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
                api: this.config.api.home.DnsAccessList  // 接口地址
            };
        },
        methods: {
            // 获取数据
            search() {
                let url = this.api.search,
                    para = {
                        PageSize: this.page.size,
                        PageNum: this.page.now,
                    };

                // 若存在搜索条件
                if (this.choseTime) {
                    para = {
                        PageSize: this.page.size,
                        PageNum: this.page.now,
                        starttime: this.choseTime,
                        endtime: this.choseTime
                    };
                }

                request.post(url, para, {
                    success: (res) => {
                        console.log(res);
                        //   that.chartData = res.data;
                        this.tableData = res.data;
                        this.page.count = res.count;
                    }
                });
            },
            // 获取 index
            getIndex(index) {
                return index + 1;
            },
            // 改变当前页码
            changePage(val) {
                this.page.now = val;
                this.search();
            },
            // 改变单页显示条数
            changePageSize(val) {
                this.page.size = val;
                this.search();
            },
            // 表格选择
            select(val) {
                this.selectItem = val;
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
</style>