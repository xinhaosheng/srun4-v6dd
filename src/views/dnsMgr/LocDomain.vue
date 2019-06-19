<template>
    <div>
        <el-row class="row">
            <!-- Title -->
            <el-col :span="12">
                <h1>本地域名解析</h1>
            </el-col>
            <!-- Add Rule -->
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <el-button type="primary"
                               size="small"
                               icon="icon ion-md-add"
                               @click="status.showAddPanel = true">添加规则
                    </el-button>
                </el-row>
            </el-col>
        </el-row>

        <el-row class="row" :gutter="20">
            <!-- LocalHost -->
            <el-col :span="6">
                <el-input v-model="search.Host"
                          placeholder="请输入主机名"
                          size="small"
                          clearable
                          @keyup.enter.native="getData">
                </el-input>
            </el-col>
            <!-- V4Ip -->
            <el-col :span="6">
                <el-input v-model="search.Ip"
                          placeholder="请输入 IP 地址"
                          size="small"
                          clearable
                          @keyup.enter.native="getData">
                </el-input>
            </el-col>
            <!-- Btn Group -->
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <el-button type="success"
                               size="small"
                               icon="icon ion-md-refresh"
                               @click="load">加载生效
                    </el-button>
                    <el-button type="primary"
                               size="small"
                               icon="icon ion-md-search"
                               @click="getData">搜索项目
                    </el-button>
                </el-row>
            </el-col>
        </el-row>

        <el-row class="row table-container">
            <el-table :data="tableData"
                      empty-text="暂无数据"
                      tooltip-effect="dark"
                      stripe
                      @selection-change="select">
                <!-- ID -->
                <el-table-column type="index" width="40" :index="getIndex" fixed></el-table-column>
                <!-- 选择 -->
                <el-table-column type="selection" width="45" fixed></el-table-column>

                <!-- 数据 -->
                <el-table-column prop="LocalHost" label="主机名" min-width="180"></el-table-column>
                <el-table-column prop="V4Ip" label="IPv4 地址" min-width="180"></el-table-column>
                <el-table-column prop="V6Ip" label="IPv6 地址" min-width="180"></el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   @click="update(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button size="mini"
                                   type="danger"
                                   @click="delData(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-row class="row">
            <el-col :span="18">
                <el-pagination layout="total,sizes, prev, pager, next"
                               :current-page.sync="page.now"
                               :page-size.sync="page.size"
                               :page-sizes="[5, 10, 20]"
                               :total="page.count"
                               background
                               @size-change="changePageSize"
                               @current-change="changePage">
                </el-pagination>
            </el-col>
            <el-col :span="6">
                <el-row type="flex" justify="end">
                    <el-button type="danger" size="small" @click="delData">批量删除</el-button>
                </el-row>
            </el-col>
        </el-row>

        <el-dialog title="添加规则" :visible.sync="status.showAddPanel" @closed="closeDialog">

            <el-form label-position="left"
                     label-width="120px">

                <!-- 添加按钮 -->
                <el-row class="row">
                    <el-button type="primary"
                               size="small"
                               icon="icon ion-md-add"
                               @click="addTab(status.activeTabId)">添加组合
                    </el-button>
                </el-row>

                <!-- 标签面板 -->
                <el-tabs v-model="status.activeTabId"
                         type="card"
                         closable
                         @tab-remove="removeTab">

                    <!-- 面板 -->
                    <el-tab-pane v-for="(tab, index) in tabData"
                                 :key="index"
                                 :label="tab.title"
                                 :name="tab.name"
                                 size="small">

                        <el-form-item label="主机名">
                            <el-input v-model="tab.content.LocalHost"
                                      placeholder="请输入主机名"
                                      clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="IPv4 地址">
                            <el-select v-model="tab.content.V4Ip"
                                       placeholder="请选择 IPv4 地址"
                                       filterable
                                       clearable>
                                <el-option v-for="item in options.V4Ip"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="IPv6 地址">
                            <el-select v-model="tab.content.V6Ip"
                                       placeholder="请选择 IPv6 地址"
                                       filterable
                                       clearable>
                                <el-option v-for="item in options.V6Ip"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value"
                                           filterable
                                           clearable>
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-tab-pane>
                </el-tabs>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="addData">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑规则" :visible.sync="status.showEditPanel" @closed="closeDialog">

            <el-form v-model="editData"
                     label-position="left"
                     label-width="120px">

                <!-- 标签面板 -->
                <el-form-item label="主机名">
                    <el-input v-model="editData.LocalHost"
                              placeholder="请输入主机名"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item label="IPv4 地址">
                    <el-select v-model="editData.V4Ip"
                               placeholder="请选择 IPv4 地址"
                               filterable
                               clearable>
                        <el-option v-for="item in options.V4Ip"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="IPv6 地址">
                    <el-select v-model="editData.V6Ip"
                               placeholder="请选择 IPv4 地址"
                               filterable
                               clearable>
                        <el-option v-for="item in options.V6Ip"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                                   filterable
                                   clearable>
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "LocDomain",
        data() {
            return {
                status: {
                    showAddPanel: false,            // 开启添加规则面板
                    showEditPanel: false,           // 开启编辑规则面板
                    activeTabId: '1',               // 当前活动 TabID
                    tabNum: 1                       // 当前 Tab 数量
                },
                search: {
                    Host: '',                       // 搜索项目 Host
                    Ip: ''                          // 搜索项目 Ip
                },
                page: {
                    now: 1,                         // 分页 当前页码
                    size: 5,                        // 分页 单页展示数据 [5, 10, 20]
                    count: 0                        // 分页 数据总数
                },
                tabData: [{
                    title: '规则 1',                 // 标签页名称
                    name: '1',
                    content: {}                     // 标签页内容
                }],
                editData: {},                           // 编辑数据
                tableData: [],                          // 表格数据
                selectItem: [],                         // 选择项目
                options: {
                    LocalHost: [],
                    V4Ip: [],
                    V6Ip: []
                },
                api: this.config.api.dnsMgr.locDomain   // 接口地址
            }
        },
        methods: {
            // 获取表格数据
            getData() {
                let url = this.api.search,
                    para = {
                        PageSize: this.page.size,
                        PageNum: this.page.now,
                        Host: this.search.Host ? this.search.Host : undefined,
                        Ip: this.search.Ip ? this.search.Ip : undefined
                    };

                request.post(url, para, {
                    success: res => {
                        this.tableData = res.data;
                        this.page.count = res.count;
                    }
                });
            },
            // 删除数据
            delData(index) {
                // 发送请求
                let send = () => {
                    let url = this.api.del,
                        para = {
                            Ids: ''
                        };
                    para.Ids = typeof index === 'number' ? [this.tableData[index].Id] : (() => {
                        let arr = [];
                        for (let val of this.selectItem) {
                            arr.push(val.Id);
                        }
                        return arr;
                    })();
                    request.post(url, para, {
                        success: () => {
                            this.getData();
                        }
                    }, 'notice');
                };

                // 删除前确认
                let confirm = () => {
                    this.$confirm('您确定要删除吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        send();
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                };

                // 根据参数数据类型判断用户操作 (单个删除/批量删除)
                typeof index === 'number' ? confirm() : (() => {
                    if (this.selectItem.length === 0) {
                        return this.$notify.error({
                            title: '错误',
                            message: '至少选择一条数据'
                        });
                    }
                    confirm();
                })();
            },
            // 添加数据
            addData() {
                let url = this.api.add,
                    para = (() => {
                        let arr = [];
                        for (let val of this.tabData) {
                            arr.push(val.content)
                        }
                        return arr;
                    })();

                request.post(url, para, {
                    success: () => {
                        this.getData();
                        this.closeDialog();
                    }
                }, 'notice');
            },
            // 更新数据
            update(index, row) {
                // 发送请求
                let send = () => {
                    let url = this.api.update,
                        para = [this.editData];
                    request.post(url, para, {
                        success: () => {
                            this.getData();
                            this.closeDialog();
                        }
                    }, 'notice');
                };

                // 开启编辑面板
                let openDialog = () => {
                    this.editData = this.tools.cloneCache(row);
                    this.status.showEditPanel = true;
                };

                // 根据参数数据类型判断用户操作 (更新数据/开启面板)
                typeof index === 'number' ? openDialog() : send();
            },
            // 加载生效
            load() {
                request.get(this.api.load, res => {
                    if (res.code === 200) {
                        this.$notify({
                            title: '成功',
                            message: res.message,
                            type: 'success'
                        });
                    }
                });
            },
            // 获取 index
            getIndex(index) {
                return index + 1;
            },
            // 表格选择
            select(val) {
                this.selectItem = val;
            },
            // 添加规则组合
            addTab() {
                if (this.tabData.length >= 5) {
                    this.$notify.error({
                        title: '错误',
                        message: '最多添加5组数据'
                    });
                    return false
                }
                let newTabName = ++this.status.tabNum + '';
                this.tabData.push({
                    title: `规则 ${this.status.tabNum}`,
                    name: newTabName,
                    content: {}
                });
                this.status.activeTabId = newTabName;
            },
            // 删除规则组合
            removeTab(targetName) {
                if (this.tabData.length === 1) {
                    this.$notify.error({
                        title: '错误',
                        message: '至少保留一组数据'
                    });
                    return false
                }
                let tabs = this.tabData,
                    activeName = this.status.activeTabId;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) activeName = nextTab.name;
                        }
                    });
                }
                this.status.activeTabId = activeName;
                this.tabData = tabs.filter(tab => tab.name !== targetName);
            },
            // 关闭对话框
            closeDialog() {
                this.status.showAddPanel = false;
                this.status.showEditPanel = false;

                this.editData = {};
                this.tabData = [{
                    title: '规则 1',
                    name: '1',
                    content: {}
                }];
                this.status.activeTabId = '1';
                this.status.tabNum = 1;
            },
            // 改变当前页码
            changePage(val) {
                this.page.now = val;
                this.getData();
            },
            // 改变单页显示条数
            changePageSize(val) {
                this.page.size = val;
                this.getData();
            },
            getOptions() {
                let url = '/manager/search/ip',
                    para = {All: 1};
                request.post(url, para, {
                    success: res => {
                        let rule_v4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
                        for (let val of res.data) {
                            if (rule_v4.test(val.Ip)) {
                                this.options.V4Ip.push({value: val.Ip})
                            } else {
                                this.options.V6Ip.push({value: val.Ip})
                            }
                        }
                    }
                });
            },
        },
        mounted() {
            this.getData();
            this.getOptions();
        }
    }
</script>
