<template>
    <div>
        <el-row class="row">
            <h1>IPv6 地址列表</h1>
        </el-row>
        <el-row class="row" :gutter="20">
            <el-col :span="6">
                <el-select v-model="search.pool"
                           placeholder="请选择地址池"
                           size="small"
                           style="width: 100%"
                           filterable
                           clearable
                           @change="getData"
                           @keyup.enter.native="getData">
                    <el-option v-for="(item,index) in pool"
                               :key="index"
                               :label="item.Name"
                               :value="item.PoolId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-input v-model="search.ip"
                          placeholder="请输入IP地址"
                          size="small"
                          clearable
                          @keyup.enter.native="getData">
                </el-input>
            </el-col>
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <el-button type="primary"
                               size="small"
                               icon="icon ion-md-search"
                               @click="getData">搜索项目
                    </el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="row">
            <el-table :data="tableData" class="table-container" stripe>
                <!-- Table Panel Start -->
                <el-table-column prop="Hip" label="IP" min-width="180"></el-table-column>
                <el-table-column prop="AddTime" label="承租日期" min-width="160"></el-table-column>
                <el-table-column prop="UpdateTime" label="续租日期" min-width="160"></el-table-column>
                <el-table-column prop="VaildLifetime" label="租期剩余" min-width="160"></el-table-column>
                <el-table-column prop="MacBind" label="	MAC 绑定剩余" min-width="180"></el-table-column>
                <el-table-column prop="Mac" label="	MAC" min-width="150"></el-table-column>
                <el-table-column prop="Uuid" label="UUID" min-width="100"></el-table-column>
                <el-table-column prop="VendorName" label="系统标识" min-width="80"></el-table-column>
                <el-table-column prop="VendorId" label="系统 ID" min-width="80"></el-table-column>
                <el-table-column prop="PoolId" label="地址池" min-width="80"></el-table-column>
                <!-- Table Panel End -->
            </el-table>
        </el-row>
        <el-row class="row">
            <el-pagination layout="total,sizes, prev, pager, next"
                           background
                           :current-page.sync="page.now"
                           :page-size.sync="page.size"
                           :page-sizes="[5, 10, 20]"
                           :total="page.count"
                           @size-change="changePageSize"
                           @current-change="changePage">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "AddressListIpv6",
        data() {
            return {
                pool: [],                               // IPv6 地址池列表
                search: {},                             // 搜索项目
                page: {
                    now: 1,                             // 当前页码
                    size: 5,                            // 单页数据 [5， 10， 20]
                    count: 0                            // 数据总数
                },
                tableData: [],                          // 表格数据
                api: this.config.api.dhcpMgr.ipv6List   // 数据接口
            }
        },
        methods: {
            // 获取数据
            getData() {
                let url = this.api.search,
                    para = {
                        PoolId: this.search.pool,
                        PageNum: this.page.now,
                        PageSize: this.page.size,
                        UserIp: this.search.ip ? this.search.ip : undefined
                    };

                request.post(url, para, {
                    success: res => {
                        this.tableData = res.data;
                        this.page.count = res.count;
                    }
                })
            },
            // 改变当前页码
            changePage(val) {
                this.page.now = val;
                this.getData();
            },
            // 改变单页显示数据条数
            changePageSize(val) {
                this.page.size = val;
                this.getData();
            },
            getOptions() {
                (() => {
                    let that = this,
                        url = this.api.getPool;
                    this.tools.get(url, res => {
                        for (let key in res.data) {
                            that.pool.push({
                                PoolId: key,
                                Name: res.data[key]
                            })
                        }
                        that.search.pool = that.pool[0].PoolId;
                        that.getData();
                    })
                })();
            }
        },
        mounted() {
            this.getOptions();
        }
    }
</script>
