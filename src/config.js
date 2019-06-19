/*
 * @Author: xr@srun.com
 * @Date: 2019-04-01 09:52:15
 * @Last Modified by: chenjie
 * @Last Modified time: 2019-05-05 11:15:23
 */

const config = {
    ENV: 'dev',                                                                // 开发环境 (dev / prod)
    reqUrl: `${location.protocol}//${location.hostname}`,                      // 请求地址
    reqPort: 9001,                                                             // 请求端口
    api: {
        // login: '/users/login',                                              // POST 登录
        // logout: '/users/logout',                                            // GET  注销
        dnsMgr: {
            dnsServer: {
                update: '/dns/server/save',
                search: '/dns/server/search'
            },
            locDomain: {
                add:'/dns/local/analysis/save',
                del:'/dns/local/analysis/delete',
                update:'/dns/local/analysis/update',
                search:'/dns/local/analysis/search',
                load: '/dns/local/analysis/reload'
            },
            blackList: {
                add: '/dns/black/save',
                del: '/dns/black/delete',
                update: '/dns/black/update',
                search: '/dns/black/search',
                load: '/dns/black/reload'
            },
            DNSRule: {
                search: '/dns/customer/search',
                dns: '/dns/local/search',
                prd: '/manager/search/product',
                grup: '/manager/search/user/group',
                add: '/manager/search/address',
                del: '/dns/local/delete',
                dnslc: '/dns/local/save',
                dnsdefa: '/dns/default/search',
                dnsudta: '/dns/default/update',
                address: '/manager/search/address',
                dnsdedel: '/dns/default/delete',
                dnscustoupdate: '/dns/customer/update',
                dnscustosave: '/dns/customer/save',
                dnsdefaultsave: "/dns/default/save",
                managersearchdns: "/manager/search/dns",
                managerserchmac: "/manager/search/mac",
                dnscustomerdelete: "/dns/customer/delete"
            }
        },
        dhcpMgr: {
            dhcpServer: {
                update: '/config/save',
                search: '/config/search'
            },
            ipv4Mgr: {
                add: '/ipv4/add',
                del: '/ipv4/delete',
                update: '/ipv4/update',
                search: '/ipv4/all'
            },
            ipv4List: {
                search: '/ipv4/search',
                getPool: '/ipv4/query'
            },
            ipv6Mgr: {
                add: '/ipv6/add',
                del: '/ipv6/delete',
                update: '/ipv6/update',
                search: '/ipv6/all'
            },
            ipv6List: {
                search: '/ipv6/search',
                getPool: '/ipv6/query'
            }
        },
        controlPanel: {
            ControlPanel: {
                flag: '4',
                getData: '/manager/search/ip',
                addData: '/manager/add/ip',
                delData: '/manager/del/more'
            }
        },
        home: {
            Home: {
                search: '/dns/journaling',
            },
            DnsAccessList: {
                search: '/dns/dnslog',
            },
            Black: {
                search: '/dns/balcklist'
            },
            ProxyAccess: {
                search: '/proxy/journaling'
            }
        }
    },
    // aes: {
    //     key: '52756SRUN_HELPER',                                            // KEY
    //     iv: 'ZBWTUJ_GHRHUWQER'                                              // 向量
    // },
};

if (config.ENV === 'dev') {
    config.reqUrl = 'http://192.168.0.151';
    config.reqPort = 9001;
    console.info("[DD]: 当前为开发模式");
}

export default config;
