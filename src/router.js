import Vue from "vue";
import Router from "vue-router";

// 图表
import Home from '@/views/home/Home'
import Black from '@/views/home/Black'
import DnsAccessList from '@/views/home/DnsAccessList'
import ProxyAccess from '@/views/home/ProxyAccess'

// DNS 管理
import DNSRule from '@/views/dnsMgr/DNSRule'
import DNSServer from '@/views/dnsMgr/DNSServer'
import LocDomain from '@/views/dnsMgr/LocDomain'
import BlackList from '@/views/dnsMgr/BlackList'

// DHCP 管理
import DHCPServer from '@/views/dhcpMgr/DHCPServer'
import AddressListIpv4Mgr from '@/views/dhcpMgr/AddressListIpv4Mgr'
import AddressListIpv4 from '@/views/dhcpMgr/AddressListIpv4'
import AddressListIpv6Mgr from '@/views/dhcpMgr/AddressListIpv6Mgr'
import AddressListIpv6 from '@/views/dhcpMgr/AddressListIpv6'

// setting
import Setting from '@/views/setting/Setting'
// setting 子路由
import Set_ip from '@/views/setting/modules/Ip'
import Set_deviceAddress from '@/views/setting/modules/DeviceAddress'
import Set_userAddress from '@/views/setting/modules/UserAddress'
import Set_port from '@/views/setting/modules/Port'
import Set_mac from '@/views/setting/modules/Mac'
import Set_dns from '@/views/setting/modules/Dns'
import Set_product from '@/views/setting/modules/Product'
import Set_userGroup from '@/views/setting/modules/UserGroup'

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                title: 'DNS 访问图表'
            },
        },
        {
            path: '/Black',
            name: 'Black',
            component: Black,
            meta: {
                title: '黑名单日志图表'
            },
        },
        {
            path: '/DnsAccessList',
            name: DnsAccessList,
            component: DnsAccessList,
            meta: {
                title: 'DNS 日志图表'
            },
        },
        {
            path: '/ProxyAccess',
            name: ProxyAccess,
            component: ProxyAccess,
            meta: {
                title: 'Proxy 代理访问图表'
            },
        },
        {
            path: '/home',
            name: 'Gen',
            component: Home
        },
        {
            path: '/dnsRule',
            name: 'DNSRule',
            component: DNSRule,
            meta: {
                title: 'DNS 多运营商代理设置'
            }
        },
        {
            path: '/dnsServer',
            name: 'DNSServer',
            component: DNSServer,
            meta: {
                title: 'DNS 服务设置'
            }
        },
        {
            path: '/locDomain',
            name: 'LocDomain',
            component: LocDomain,
            meta: {
                title: '本地域名解析'
            }
        },
        {
            path: '/blackList',
            name: 'BlackList',
            component: BlackList,
            meta: {
                title: '黑名单设置'
            }
        },
        {
            path: '/dhcpServer',
            name: 'DHCPServer',
            component: DHCPServer,
            meta: {
                title: 'DHCP 服务设置'
            }
        },
        {
            path: '/addressListIpv4Mgr',
            name: 'AddressListIpv4Mgr',
            component: AddressListIpv4Mgr,
            meta: {
                title: 'IPv4 地址池管理'
            }
        },
        {
            path: '/addressListIpv4',
            name: 'AddressListIpv4',
            component: AddressListIpv4,
            meta: {
                title: 'IPv4 地址列表'
            }
        },
        {
            path: '/addressListIpv6Mgr',
            name: 'AddressListIpv6Mgr',
            component: AddressListIpv6Mgr,
            meta: {
                title: 'IPv6 地址池管理'
            }
        },
        {
            path: '/addressListIpv6',
            name: 'AddressListIpv6',
            component: AddressListIpv6,
            meta: {
                title: 'IPv6 地址列表'
            }
        },
        {
            path: '/setting',
            name: 'Setting',
            component: Setting,
            children: [{
                path: 'ip',
                name: 'Ip Input',
                component: Set_ip,
                meta: {
                    title: 'IP 地址录入'
                }

            }, {
                path: 'deviceAddress',
                name: 'Device Address Manager',
                component: Set_deviceAddress,
                meta: {
                    title: '设备地址管理'
                }
            }, {
                path: 'userAddress',
                name: 'User Address Manager',
                component: Set_userAddress,
                meta: {
                    title: '用户源地址管理'
                }
            }, {
                path: 'port',
                name: 'Port Manager',
                component: Set_port,
                meta: {
                    title: '端口号管理'
                }
            }, {
                path: 'mac',
                name: 'Mac Manager',
                component: Set_mac,
                meta: {
                    title: 'Mac 地址管理'
                }
            }, {
                path: 'dns',
                name: 'DNS Server IP Manager',
                component: Set_dns,
                meta: {
                    title: 'DNS Server IP 管理'
                }
            }, {
                path: 'product',
                name: 'Product Manager',
                component: Set_product,
                meta: {
                    title: '产品管理'
                }
            }, {
                path: 'userGroup',
                name: 'User Group Manager',
                component: Set_userGroup,
                meta: {
                    title: '用户组管理'
                }
            }]
        }
    ]
});

export default router;