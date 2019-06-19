<template>
    <div>
        <el-row class="row">
            <h1>IPv6 地址池管理</h1>
        </el-row>

        <el-row class="row">
            <el-button type="primary" size="small" icon="icon ion-md-add" @click="status.showPanel = true">添加地址池
            </el-button>
        </el-row>

        <el-row class="row">
            <el-table :data="tableData" class="table-container" stripe>
                <!-- Table Panel Start -->
                <el-table-column prop="PoolId" label="ID" min-width="80"></el-table-column>
                <el-table-column prop="Name" label="名称" min-width="100"></el-table-column>
                <el-table-column prop="Start" label="起始地址" min-width="180"></el-table-column>
                <el-table-column prop="Num" label="数量" min-width="80"></el-table-column>
                <el-table-column prop="Prefix" label="前缀" min-width="80"></el-table-column>
                <el-table-column prop="VaildLifetime" label="租期" min-width="80"></el-table-column>
                <el-table-column prop="Domain" label="域名" min-width="180"></el-table-column>
                <el-table-column label="DNS" min-width="270">
                    <template slot-scope="scope">{{scope.row.Dns1 + ' / ' + scope.row.Dns2}}</template>
                </el-table-column>
                <el-table-column label="已分配" min-width="100">
                    <template slot-scope="scope">
                        <el-tag size="medium">{{scope.row.UsedIpNum + ' / ' + scope.row.Num}}</el-tag>
                    </template>
                </el-table-column>
                <!-- Table Panel End -->
                <el-table-column label="操作" min-width="240">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="intro(scope.$index, scope.row)">详情</el-button>
                        <el-button size="mini" type="warning" @click="update(scope.$index, scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="delData(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-dialog title="添加IPv6 地址池" :visible.sync="status.showPanel" :model="formData" width="800px"
                   @closed="closeDialog">
            <el-form label-position="left" size="small" :inline="true" :disabled="status.showIntro" label-width="130px">
                <el-form-item label="名称">
                    <el-input v-model="formData.Name" clearable placeholder="请输入名称"></el-input>
                </el-form-item>

                <el-form-item label="地址数量">
                    <el-input v-model="formData.Num" clearable placeholder="请输入地址数量"></el-input>
                </el-form-item>

                <el-form-item label="起始地址">
                    <el-select v-model="formData.Start" placeholder="请选择起始地址" filterable clearable>
                        <el-option v-for="(item,index) in options.V6Ip" :key="index" :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="本机地址">
                    <el-select v-model="formData.ServerIdentifier" placeholder="请选择本机地址" filterable clearable>
                        <el-option v-for="(item,index) in options.V6Ip" :key="index" :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="前缀">
                    <el-tooltip class="item" effect="dark" content="1-28" placement="top">
                        <el-input v-model="formData.Prefix" clearable placeholder="请输入前缀"></el-input>
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="租期">
                    <el-input v-model="formData.VaildLifetime" clearable placeholder="请输入租期"></el-input>
                </el-form-item>

                <el-form-item label="DNS 服务器 1">
                    <el-select v-model="formData.Dns1" placeholder="请选择DNS 服务器 1" filterable clearable>
                        <el-option v-for="(item,index) in options.Dns" :key="index" :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="DNS 服务器 2">
                    <el-select v-model="formData.Dns2" placeholder="请选择DNS 服务器 2" filterable clearable>
                        <el-option v-for="(item,index) in options.Dns" :key="index" :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="DNS 绑定有效期">
                    <el-input v-model="formData.MacBind" clearable placeholder="请输入 DNS 绑定有效期"></el-input>
                </el-form-item>

                <el-form-item label="域名">
                    <el-input v-model="formData.Domain" clearable placeholder="请输入域名"></el-input>
                </el-form-item>

                <el-form-item label="绑定给 VLANID">
                    <el-input v-model="formData.VlanId" clearable placeholder="请输入 VLANID"></el-input>
                </el-form-item>

                <el-form-item label="无感知认证">
                    <el-radio-group v-model="formData.MacAuth">
                        <el-radio border label="1">启用</el-radio>
                        <el-radio border label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Portal 地址">
                    <el-select v-model="formData.PortalIp" placeholder="请选择 Portal 地址" filterable clearable>
                        <el-option v-for="(item,index) in options.Ip" :key="index" :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="AC_ID 名称">
                    <el-select v-model="formData.AcId"
                               placeholder="请选择 AC_ID 名称"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.acId"
                                   :key="index"
                                   :label="item.NasName"
                                   :value="item.AcId">
                            <span style="float: left">{{ item.NasName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">AC_ID: {{ item.AcId }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" v-show="!status.showIntro">
                <el-button type="danger" @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="update" v-show="status.update">更 新</el-button>
                <el-button type="primary" @click="addData" v-show="!status.update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AddressListIpv6Mgr",
        data() {
            return {
                status: {
                    showPanel: false,                   // 开启面板
                    showIntro: false,                   // 开启详情面板
                    update: false                       // 用户行为 (更新)
                },
                tableData: [],                          // 表格数据
                options: {
                    Ip: [],
                    V4Ip: [],
                    V6Ip: [],
                    Dns: [],
                    acId: []
                },
                formData: {},                           // 表单数据
                formDataCache: "",                      // 表单缓存
                api: this.config.api.dhcpMgr.ipv6Mgr    // 接口地址
            };
        },
        methods: {
            // 获取数据
            getData() {
                let url = this.api.search;

                request.get(url, res => {
                    this.tableData = res.data;
                });
            },
            // 添加数据
            addData() {
                let url = this.api.add,
                    para = this.formData;

                request.post(
                    url,
                    para, {
                        success: () => {
                            this.getData();
                            this.closeDialog();
                        }
                    },
                    "notice"
                );
            },
            // 删除数据
            delData(index, row) {
                let url = this.api.del,
                    para = {
                        PoolId: row.PoolId
                    };

                let send = () => {
                    request.post(
                        url,
                        para, {
                            success: () => {
                                this.getData();
                            }
                        },
                        "notice"
                    );
                };

                this.$confirm("您确定要删除此条数据吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        send();
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            // 更新数据
            update(index, row) {
                if (row) {
                    this.status.showPanel = true;
                    this.status.update = true;
                    this.formData = this.tools.cloneCache(row);
                } else {
                    let url = this.api.update,
                        para = this.formData;
                    request.post(
                        url,
                        para, {
                            success: () => {
                                this.getData();
                                this.closeDialog();
                            }
                        },
                        "notice"
                    );
                }
            },
            // 展示详情
            intro(index, row) {
                this.status.showPanel = true;
                this.status.showIntro = true;
                this.formData = this.tools.cloneCache(row);
            },
            // 关闭对话框
            closeDialog() {
                this.formData = this.tools.cloneCache(this.formDataCache);
                this.status.showPanel = false;
                this.status.update = false;
                this.status.showIntro = false;
            },
            getOptions() {
                (() => {
                    let that = this,
                        url = "/manager/search/ip",
                        para = {
                            All: 1
                        };
                    this.tools.post(url, para, {
                        success(res) {
                            let rule_v4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
                            for (let val of res.data) {
                                that.options.Ip.push({
                                    value: val.Ip
                                });
                                if (rule_v4.test(val.Ip)) {
                                    that.options.V4Ip.push({
                                        value: val.Ip
                                    });
                                } else {
                                    that.options.V6Ip.push({
                                        value: val.Ip
                                    });
                                }
                            }
                        }
                    });
                })();
                (() => {
                    let that = this,
                        url = "/manager/search/dns",
                        para = {
                            All: 1
                        };
                    this.tools.post(url, para, {
                        success(res) {
                            for (let val of res.data) {
                                that.options.Dns.push({
                                    value: val.Dns
                                });
                            }
                        }
                    });
                })();
                (() => {
                    let url = '/search/ac_id';
                    this.tools.get(url,
                        res => {
                            for (let val of res.data) {
                                this.options.acId.push({
                                    AcId: val.AcId,
                                    NasName: val.NasName
                                })
                            }
                        }
                    );
                })();
            }
        },
        mounted() {
            this.getData();
            this.getOptions();
            this.formDataCache = this.tools.cloneCache(this.formData);
        }
    };
</script>