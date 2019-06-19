<template>
    <el-row style="width: 500px">
        <!-- Form -->
        <el-form :model="formData"
                 :disabled="status.lock"
                 ref="form"
                 size="small"
                 label-width="120px"
                 label-position="left">
            <!-- Title -->
            <el-row class="row">
                <h1>DHCP 服务设置</h1>
            </el-row>
            <!-- 服务类型 -->
            <el-row style="min-width:600px;">
                <el-row class="row">
                    <h3>服务类型</h3>
                </el-row>
                <el-form-item label="服务类型">
                    <el-radio-group v-model="formData.servermode">
                        <el-radio border label="1">IPv4</el-radio>
                        <el-radio border label="2">IPv6</el-radio>
                        <el-radio border label="0">IPv4 + IPv6</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>
            <!-- 网卡名称 -->
            <el-row>
                <el-row class="row">
                    <h3>网卡名称</h3>
                </el-row>
                <el-form-item label="网卡名称">
                    <el-input v-model.trim="formData.ifname"
                              clearable
                              placeholder="请输入网卡名称">
                    </el-input>
                </el-form-item>
            </el-row>
            <!-- 线程数目 -->
            <el-row>
                <el-row class="row">
                    <h3>线程数目</h3>
                </el-row>
                <el-form-item label="最大线程数">
                    <el-input-number placeholder="请输入最大线程数"
                                     v-model.trim="formData.maxthreadnum"
                                     :min="4"
                                     style="width: 200px"
                                     :max="64"></el-input-number>

                </el-form-item>
                <el-form-item label="最小线程数">

                    <el-input-number placeholder="请输入最小线程数"
                                     v-model.trim="formData.minthreadnum"
                                     style="width: 200px"
                                     :min="4"
                                     :max="64"></el-input-number>

                </el-form-item>
            </el-row>
        </el-form>
        <!-- Btn-Group -->
        <el-row class="row btn-group">
            <el-button type="warning"
                       size="small"
                       v-show="status.lock"
                       @click="status.lock = false">编辑
            </el-button>
            <el-row v-show="!status.lock">
                <el-col :span="10">
                    <el-button type="primary"
                               size="small"
                               @click="update">保存
                    </el-button>
                </el-col>
                <el-col :span="10" :offset="4">
                    <el-button type="danger"
                               size="small"
                               @click="cancel">取消
                    </el-button>
                </el-col>
            </el-row>
        </el-row>
    </el-row>
</template>

<script>
    export default {
        name: "DHCPServer",
        data() {
            return {
                status: {
                    lock: true                              // 状态锁定
                },
                formData: {},                               // 表单数据
                formDataCache: '',                          // 表单缓存
                api: this.config.api.dhcpMgr.dhcpServer     // 接口地址
            }
        },
        methods: {
            getData() {
                let url = this.api.search;
                request.get(url, res => {
                    if (res.code === 300) {
                        this.status.lock = false;
                    } else {
                        this.formData = res.data;
                        this.formDataCache = this.tools.cloneCache(res.data);
                    }
                })
            },
            update() {
                let url = this.api.update;
                let para = {
                    "maxthreadnum": this.formData.maxthreadnum.toString(),
                    "minthreadnum": this.formData.minthreadnum.toString(),
                    "ifname": this.formData.ifname,
                    "servermode": this.formData.servermode
                };
                request.post(url, para, {
                    success: () => {
                        this.getData();
                        this.status.lock = true;
                    }
                }, 'notice');
            },
            cancel() {
                this.formData = this.tools.cloneCache(this.formDataCache);
                this.status.lock = true;
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>