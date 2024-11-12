function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const rp = require('request-promise');
module.exports = class extends Base {
    ddAction() {
        var _this = this;

        return _asyncToGenerator(function* () {
            // this.body = 'hello world!';
            const name = _this.post('name');
            const address = _this.post('address');
            console.log('_______________name___address', name, address);
            let store = {
                name,
                address,
                phone: 12321
            };
            const dd = yield _this.model('store').add(store);
            console.log('////ddd', dd);
            return _this.success();
        })();
    }
    loginByWeixinAction() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            // const code = this.post('code');
            const fullUserInfo = _this2.post('info');
            const code = fullUserInfo.code;
            const userInfo = JSON.parse(fullUserInfo.rawData);
            console.log('userInfo');
            console.log(code);
            console.log(userInfo);
            console.log('userInfo');
            let currentTime = parseInt(new Date().getTime() / 1000);
            const clientIp = ''; // 暂时不记录 ip test git
            // 获取openid
            const options = {
                method: 'GET',
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                qs: {
                    grant_type: 'authorization_code',
                    js_code: code,
                    secret: think.config('weixin.secret'),
                    appid: think.config('weixin.appid')
                }
            };
            let sessionData = yield rp(options);
            sessionData = JSON.parse(sessionData);
            if (!sessionData.openid) {
                return _this2.fail('登录失败1');
            }
            // 验证用户信息完整性
            const crypto = require('crypto');
            const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData + sessionData.session_key).digest('hex');
            if (fullUserInfo.signature !== sha1) {
                return _this2.fail('登录失败2');
            }
            // 解释用户数据
            const WeixinSerivce = _this2.service('weixin', 'api');
            const weixinUserInfo = yield WeixinSerivce.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
            if (think.isEmpty(weixinUserInfo)) {
                return _this2.fail('登录失败3');
            }
            // 根据openid查找用户是否已经注册
            let userId = yield _this2.model('user').where({
                weixin_openid: sessionData.openid
            }).getField('id', true);
            let is_new = 0;
            if (think.isEmpty(userId)) {
                // 注册
                const buffer = Buffer.from(userInfo.nickName);
                let nickname = buffer.toString('base64');
                userId = yield _this2.model('user').add({
                    username: '微信用户' + think.uuid(6),
                    password: sessionData.openid,
                    register_time: currentTime,
                    register_ip: clientIp,
                    last_login_time: currentTime,
                    last_login_ip: clientIp,
                    mobile: '',
                    weixin_openid: sessionData.openid,
                    avatar: userInfo.avatarUrl || '',
                    gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
                    nickname: nickname,
                    country: userInfo.country,
                    province: userInfo.province,
                    city: userInfo.city
                });
                is_new = 1;
            }
            sessionData.user_id = userId;
            // 查询用户信息
            const newbuffer = Buffer.from(userInfo.nickName);
            let nickname = newbuffer.toString('base64');
            // 更新登录信息
            yield _this2.model('user').where({
                id: userId
            }).update({
                last_login_time: currentTime,
                last_login_ip: clientIp,
                avatar: userInfo.avatarUrl,
                nickname: nickname,
                country: userInfo.country,
                province: userInfo.province,
                city: userInfo.city
            });
            const newUserInfo = yield _this2.model('user').field('id,username,nickname,gender, avatar').where({
                id: userId
            }).find();
            newUserInfo.nickname = Buffer.from(newUserInfo.nickname, 'base64').toString();
            const TokenSerivce = _this2.service('token', 'api');
            const sessionKey = yield TokenSerivce.create(sessionData);
            if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
                return _this2.fail('登录失败4');
            }
            return _this2.success({
                token: sessionKey,
                userInfo: newUserInfo,
                is_new: is_new
            });
        })();
    }
    logoutAction() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            return _this3.success();
        })();
    }
};
//# sourceMappingURL=auth.js.map