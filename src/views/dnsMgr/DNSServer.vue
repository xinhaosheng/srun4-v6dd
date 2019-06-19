<template>
    <el-row style="width: 500px">
        <el-form :model="formData"
                 :disabled="status.lock"
                 ref="form"
                 size="small"
                 label-width="120px"
                 label-position="left">
            <!-- Title -->
            <el-row class="row">
                <h1>DNS Server 代理服务设置</h1>
            </el-row>
            <!-- 外网 DNS 地址 -->
            <el-row>
                <el-row class="row">
                    <h3>外网 DNS 地址</h3>
                </el-row>
                <!-- 添加按钮 -->
                <el-row class="row">
                    <el-button type="primary"
                               icon="icon ion-md-add"
                               size="small"
                               @click="addTab(status.activeTabId)">添加组合
                    </el-button>
                </el-row>
                <!-- 标签面板 -->
                <el-row class="row">
                    <el-tabs v-model="status.activeTabId"
                             closable
                             type="border-card"
                             @tab-remove="removeTab">
                        <el-tab-pane v-for="(tab, index) in tabData"
                                     :key="index"
                                     :label="tab.title"
                                     :name="tab.name">
                            <el-row class="row">
                                <el-input v-model="tab.content.DnsServer"
                                          placeholder="请输入IPv4 DNS"
                                          size="small"
                                          clearable>
                                    <template slot="prepend">IPv4 DNS 地址:</template>
                                </el-input>
                            </el-row>
                            <el-row class="row">
                                <el-input v-model="tab.content.DnsServer6"
                                          placeholder="请输入IPv6 DNS"
                                          size="small"
                                          clearable>
                                    <template slot="prepend">IPv6 DNS 地址:</template>
                                </el-input>
                            </el-row>

                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-row>
            <!-- 工作模式 -->
            <el-row>
                <el-form-item label="工作模式">
                    <el-radio v-model="formData.DnsServerWorkMode"
                              label="0"
                              border>主备模式
                    </el-radio>
                    <el-radio v-model="formData.DnsServerWorkMode"
                              label="1"
                              border>均衡模式
                    </el-radio>
                </el-form-item>
            </el-row>
            <!-- 线程数目 -->
            <el-row>
                <el-row class="row">
                    <h3>线程数目</h3>
                </el-row>
                <el-form-item label="最大线程数">
                    <el-input placeholder="请输入最大线程数"
                              clearable
                              v-model="formData.MaxThreadNum">
                    </el-input>
                </el-form-item>

                <el-form-item label="最小线程数">
                    <el-input placeholder="请输入最小线程数"
                              clearable
                              v-model="formData.MinThreadNum">
                    </el-input>
                </el-form-item>
            </el-row>
            <!-- 缓存时间 -->
            <el-row>
                <el-row class="row">
                    <h3>缓存时间</h3>
                </el-row>
                <el-form-item label="服务器缓存时间">
                    <el-input placeholder="请输入服务器缓存时间"
                              clearable
                              v-model="formData.CacheTime">
                        <template slot="append">单位 秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="终端的缓存时间">
                    <el-input placeholder="请输入终端的缓存时间"
                              clearable
                              v-model="formData.LiveTime">
                        <template slot="append">单位 秒</template>
                    </el-input>
                </el-form-item>
            </el-row>
            <!-- 是否启用 Https 重定向 -->
            <el-row>
                <el-row class="row">
                    <h3>是否启用 Https 重定向</h3>
                </el-row>
                <el-form-item label="Https 重定向">
                    <el-radio v-model="formData.HttpsRedirect"
                              label="1"
                              border>开启
                    </el-radio>
                    <el-radio v-model="formData.HttpsRedirect"
                              label="0"
                              border>关闭
                    </el-radio>
                </el-form-item>
            </el-row>
            <!-- Portal 地址 -->
            <el-row>
                <el-row class="row">
                    <h3 class="title">Portal 地址</h3>
                </el-row>
                <el-form-item label="Portal v4 地址">
                    <el-input v-model="formData.PortalServer"
                              placeholder="请输入 Portal v4 地址 (最多32位，使用 , 分隔)"
                              :autosize="{ minRows: 2, maxRows: 4}"
                              type="textarea">
                    </el-input>
                </el-form-item>
                <el-form-item label="Portal v6 地址">
                    <el-input v-model="formData.PortalServer6"
                              placeholder="请输入 Portal v6 地址 (最多32位，使用 , 分隔)"
                              :autosize="{ minRows: 2, maxRows: 4}"
                              type="textarea">
                    </el-input>
                </el-form-item>
            </el-row>
            <!-- 本机地址 -->
            <el-row>
                <el-row class="row">
                    <h3>这台机器的地址</h3>
                </el-row>
                <el-form-item label="Https 重定向">
                    <el-input placeholder="请输入本机地址"
                              clearable
                              v-model="formData.MyIp">
                    </el-input>
                </el-form-item>
            </el-row>
        </el-form>
        <!-- Btn-Group -->
        <el-row class="row btn-group">
            <el-button type="warning"
                       v-show="status.lock"
                       size="small"
                       @click="status.lock = false">编辑
            </el-button>
            <el-row v-show="!status.lock">
                <el-col :span="10">
                    <el-button type="primary" size="small" @click="update">保存</el-button>
                </el-col>
                <el-col :span="10" :offset="4">
                    <el-button type="danger" size="small" @click="cancel">取消</el-button>
                </el-col>
            </el-row>
        </el-row>
    </el-row>
</template>

<script>
    export default {
        name: "DNSServer",
        data() {
            return {
                status: {
                    lock: true,                         // 状态锁定
                    activeTabId: '1'                    // 活动标签
                },
                // 面板
                tabData: [{
                    title: '规则 1',
                    name: '1',
                    content: {
                        DnsServer: '',
                        DnsServer6: ''
                    }
                }],
                tabCache: '',                           // 规则面板缓存
                formData: {},                           // 表单数据
                formCache: '',                          // 表单缓存
                tabNum: 1,                              // 总 tab (包括已删除)
                api: this.config.api.dnsMgr.dnsServer   // 接口地址
            }
        },
        methods: {
            // 获取数据
            getData() {
                let url = this.api.search;

                request.get(url, res => {
                    if (res.code === 300) return this.status.lock = false;

                    let dns_v4 = res.data.DnsServer.split(','),
                        dns_v6 = res.data.DnsServer6.split(','),
                        arr = [];

                    for (let i = 0; i < dns_v4.length; i++) {
                        arr.push({
                            title: `规则 ${i + 1}`,
                            name: i + 1 + '',
                            content: {
                                DnsServer: dns_v4[i],
                                DnsServer6: dns_v6[i]
                            }
                        })
                    }

                    this.tabData = arr;
                    this.formData = res.data;
                    this.tabCache = arr;
                    this.formCache = res.data;
                });
            },
            // 更新数据
            update() {
                let url = this.api.update,
                    para = this.formData,
                    DnsServer = '',
                    DnsServer6 = '';

                for (let val of this.tabData) {
                    DnsServer += `,${val.content.DnsServer}`;
                    DnsServer6 += `,${val.content.DnsServer6}`;
                }

                para.DnsServer = DnsServer.substring(1, this.length);
                para.DnsServer6 = DnsServer6.substring(1, this.length);

                request.post(url, para, {
                    success: () => {
                        this.getData();
                        this.status.lock = true;
                    }
                }, 'notice');
            },
            // 添加规则组合
            addTab() {
                if (this.tabData.length >= 5) return this.$notify.error({
                    title: '错误',
                    message: '最多添加5组数据'
                });

                let newTabName = ++this.tabNum + '';

                this.tabData.push({
                    title: `规则 ${this.tabNum}`,
                    name: newTabName,
                    content: {
                        DnsServer: '',
                        DnsServer6: ''
                    }
                });
                this.status.activeTabId = newTabName;
            },
            // 删除规则组合
            removeTab(targetName) {
                if (this.status.lock) return this.$notify.error({
                    title: '错误',
                    message: '若要删除规则，请先点击编辑数据'
                });

                if (this.tabData.length === 1) return this.$notify.error({
                    title: '错误',
                    message: '至少保留一组数据'
                });

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
            // 取消编辑
            cancel() {
                this.status.lock = true;
                this.tabData = this.tools.cloneCache(this.tabCache);
                this.formData = this.tools.cloneCache(this.formCache);
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>