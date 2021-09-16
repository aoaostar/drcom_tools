/**
 * @author Pluto <i#aoaostar.com>
 */
function toMac(str) {
    let upper = str.toUpperCase();
    let reg = new RegExp("\\w{1,2}", "g");
    let ma = upper.match(reg);
    return ma.join("-");
}
var vm = new Vue({
    el: '#app',
    data() {
        return {
            status: false,
            loading: true,
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
            client: localStorage.getItem('client'),
            logged: {
                uid: '',
                v4ip: '',
                olmac: 'mac',
            },
            radiusErrorAry: [
                "0||SESSION已过期,请重新登录|The SESSION has been expired, please log in again",
                "0|no errcode|AC认证失败|AC authentication failure",
                "0|Authentication Fail ErrCode=04|上网时长/流量已到上限|Online time / flow rate has been to the limit",
                "0|Authentication Fail ErrCode=05|您的账号已停机，造成停机的可能原因：<br/>1、用户欠费停机<br/>2、用户报停<br/>需要了解具体原因，请访问自助服务系统。|Your account has been shut down",
                "0|Authentication Fail ErrCode=09|本账号费用超支，禁止使用|Online time / flow rate has been to the limit",
                "0|Authentication Fail ErrCode=11|不允许Radius登录|Not allow radius login",
                "0|Authentication Fail ErrCode=80|接入服务器不存在|Access to the server does not exist",
                "0|Authentication Fail ErrCode=81|LDAP认证失败|LDAP Authentication Failure",
                "0|Authentication Fail ErrCode=85|账号正在使用|Accounts are in use",
                "0|Authentication Fail ErrCode=86|绑定IP或MAC失败|IP or MAC Binding Fail",
                "0|Authentication Fail ErrCode=88|IP地址冲突|IP address conflict",
                "0|Authentication Fail ErrCode=94|接入服务器并发超限|Concurrent access to the server overrun",
                "0|err(2)|请在指定的登录源地址范围内登录|Please Login in at the specified source address range",
                "0|err(3)|请在指定的IP登录|Please login at the specified IP",
                "0|err(7)|请在指定的登录源VLAN范围登录|Please login in at specified Vlan scope",
                "0|err(10)|请在指定的Vlan登录|Please login at the specified Vlan",
                "0|err(11)|请在指定的MAC登录|Please login at the specified MAC",
                "0|err(17)|请在指定的设备端口登录|Please login with the specified equipment port",
                "0|userid error1|账号不存在|Account does not exist",
                "0|userid error2|密码错误|Password Error",
                "0|userid error3|密码错误|Password Error",
                "0|auth error4|用户使用量超出限制|Users to use more than limit",
                "0|auth error5|账号已停机|This account has been shut down",
                "0|auth error9|时长流量超支|Time length or flow overruns",
                "0|auth error80|本时段禁止上网|This time on the Internet is prohibited",
                "0|auth error99|用户名或密码错误|The user name or password mistake",
                "0|auth error198|用户名或密码错误|The user name or password mistake",
                "0|auth error199|用户名或密码错误|The user name or password mistake",
                "0|auth error258|账号只能在指定区域使用|This account can only be used in designated areas",
                "0|auth error|用户验证失败|Failed to authenticate user",
                "0|set_onlinet error|用户数超过限制|Users more than limit",
                "0|In use|登录超过人数限制|Log in more than limit",
                "0|port err|上课时间不允许上网|Class time is not allowed to access to the Internet",
                "0|can not use static ip|不允许使用静态IP|Can not use static ip",
                "0|[01], 本帐号只能在指定VLANID使用(0.4095)|本帐号只能在指定VLANID使用|This account can only be used in the specified VLANID",
                "0|Mac, IP, NASip, PORT err(6)!|本帐号只能在指定VLANID使用|This account can only be used in the specified VLANID",
                "1|Oppp error: 32|登录操作频繁，请稍后再试|",
                "1|Oppp error: 1|运营商账号密码错误，错误码为：1|Operator account password error, error code: 1",
                "1|Oppp error: 5|运营商账号在线，错误码为：5|Operator account online, error code: 5",
                "1|Oppp error: 18|运营商账号密码错误，错误码为：18|Operator account password error, error code: 18",
                "1|Oppp error: 21|您的联通帐号只能一个终端在线，请联系联通营业厅进行处理。|Operator account online, error code: 21",
                "1|Oppp error: 26|您的联通手机卡已欠费，请及时充值。|Operator account online, error code: 21",
                "1|Oppp error: 29|您的联通帐号密码错误，请联系联通营业厅处理。|Operator account online, error code: 21",
                "0|Oppp error: userid inuse|运营商账号已被使用|Operator account has been used",
                "0|Oppp error: can't find user|运营商账号无法获取或不存在|Operator account could not be obtained or does not exist",
                "0|bind userid error|绑定运营商账号失败|Bind operator account failed",
                "0|Oppp error: TOO MANY CONNECTIONS|运营商账号在线|Operator account online",
                "0|Oppp error: Timeout|运营商账号状态异常(欠费等)|Operator account status abnormal(arrears, etc.)",
                "0|Oppp error: User dial-in so soon|运营商账号刚下线|Operator account just off the assembly line",
            ]
        }
    },
    created() {
        this.checkStatus()
            .finally(() => {
                this.loading = false
            })
    },
    methods: {
        notify(msg, type = 'success') {
            spop({
                template: msg,
                style: type,
                autoclose: 2000
            });

        },
        httpGet(url) {
            this.loading = true
            return fetch(url, {
                method: 'GET',
                mode: 'cors',
            }).then((res) => {
                return res.text()
            }).then((res) => {
                res = this.jsonp2json(res)
                this.loading = false
                return res
            })

        },
        save() {
            localStorage.setItem('username', this.username)
            localStorage.setItem('password', this.password)
            localStorage.setItem('client', this.client)
            this.notify("保存成功")
        },
        checkStatus() {
            // http://10.254.253.250/drcom/chkstatus?callback=dr1002&v=10032

            return this.httpGet('http://10.254.253.250/drcom/chkstatus?callback=drcom&v=10032')
                .then((res) => {
                    if (res.result == 1) {
                        this.logged = res
                        this.status = true
                    } else {
                        this.status = false
                    }
                })
        },
        jsonp2json(res) {
            res = res.trim()
            res = res.slice('drcom'.length + 1)
            res = res.slice(0, -1)
            return JSON.parse(res)
        },
        matchError(error_msg) {
            var errorMsg = error_msg
            //匹配错误码则显示对应提示
            for (var i = 0; i < this.radiusErrorAry.length; i++) {
                //option_array 0 是否正则匹配 1 正则表达式/错误代码 2 中文错误信息 3 英文错误信息
                var option_array = this.radiusErrorAry[i].split("|");
                var regx = option_array[1];

                if (option_array[0] == 1) { //正则匹配
                    var reg = new RegExp(regx, "g");
                    var result = '';
                    if ((result = reg.exec(error_msg)) != null) {
                        errorMsg = option_array[2];
                        var patter = /\$\{(.*?)\}/g;
                        var sort = "";
                        while ((sort = patter.exec(option_array[2])) != null) {
                            if (sort.length != 2 || isNaN(sort[1]) || result.length < sort[
                                    1]) continue;
                            errorMsg = me.errorMsg.replace(sort[0], result[sort[1]]);
                            break;
                        }
                    }
                } else { //全文匹配
                    if (error_msg === regx) {
                        errorMsg =
                            option_array[2];
                        break;
                    }
                }
            }
            return errorMsg

        },
        login() {

            if (this.status) {
                this.notify("已登录，无需重复登录")
                return
            }
            if (this.loading) {
                return
            }

            this.httpGet(
                    `http://10.254.253.250/drcom/login?callback=drcom&DDDDD=${this.username}&upass=${this.password}&0MKKey=123456&R1=0&R3=0&R6=${this.client}&para=00&v6ip=&R7=0&v=8325`
                )
                .then((res) => {
                    console.log(res.msga)
                    if (res.result == 1) {
                        localStorage.setItem('username', this.username)
                        localStorage.setItem('password', this.password)
                        localStorage.setItem('client', this.client)
                        this.notify("登录成功")
                        this.checkStatus()
                    } else {
                        this.notify(this.matchError(res.msga), 'warning');
                    }
                })
        },
        logout() {
            if (this.status) {
                this.httpGet('http://10.254.253.250/drcom/logout?callback=drcom&v=885')
                    .then((res) => {
                        if (res.result == 1) {
                            this.notify('注销成功，可能一次无法完全注销')
                            this.checkStatus()
                        } else {
                            this.notify('注销失败', 'warning');
                        }
                    })
            } else {

                this.notify('未登录，无需注销')
            }
        }
    }
})