/**
 * 微信api相关接口调用
 */
const fs = require('fs'),
      request = require('request'),
      querystring = require('querystring'),
      URL = require('url'),
      crypto = require('crypto'),
      express = require('express'),
      multer = require('multer'),
      router = express.Router();

let api   = null,
    _this = null;

const CACHE_FILE = '/data/token.json',
      JSAPI_TICKET = '/data/jsapi_ticket.json',  
      APP_ID = 'wxb96f88e9e9b4f17e',
      APP_SECRET = '5b8ba7f2ca4b7a6e158462ea7db80990';

class WxApi {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        _this = this; 

        //this.init();
    }

    /**
     * 获取AccessToken
     * @param {Function} callback
     * @return Boolean
     */
    getAccessToken(callback) {
        if (typeof callback === 'undefined') {
            return false;
        }
        
        fs.readFile(__dirname + CACHE_FILE, function(err, data) {
            if (err) return;

            data = data.indexOf('expire') !== -1 ? JSON.parse(data) : {expire_time: 0};
            let currentTime = Math.floor(new Date().getTime() / 1000);
            if (data.expire_time < currentTime) {
                let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`;

                _this.httpRequest(url).then((res) => {
                    res = JSON.parse(res);
                    let token = res.access_token;

                    if (token) {
                        data.expire_time  = currentTime + 7000;
                        data.access_token = token;
                        fs.writeFile(__dirname + CACHE_FILE, JSON.stringify(data), (err) => {
                            if (err) throw err;
                        });

                        callback(token);
                    }
                }).catch((err) => {
                    console.log('Some error has been occured: ' + err);  
                });
            } else {
                callback(data.access_token);
            }
        });

        return true;
    }

    /**
     * 获取JSAPI TICKET
     * @param {Function} callback 
     * @return Boolean
     */
    getJsApiTicket(callback) {
        if (typeof callback === 'undefined') {
            return false;
        }

        const curTime = Math.floor(new Date().getTime() / 1000);

        fs.readFile(__dirname + JSAPI_TICKET, (err, data) => {
            data = data.indexOf('expire') !== -1 ? JSON.parse(data) : {expire_time: 0};

            if (data.expire_time < curTime) {
                _this.getAccessToken((token) => {
                    let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;

                    _this.httpRequest(url).then((res) => {
                        res = JSON.parse(res);
                        let ticket = res.ticket;

                        if (ticket) {
                            data.expire_time  = curTime + 7000;
                            data.jsapi_ticket = ticket;
                            fs.writeFile(__dirname + JSAPI_TICKET, JSON.stringify(data), (err) => {
                                if (err) throw err;
                            });

                            callback(ticket);
                        }
                    });
                });
            } else {
                callback(data.jsapi_ticket);
            }
        });

        return true;
    }
//http://www.cnblogs.com/txw1958/p/weixin-js.html
    /**
     * 获取签名信息
     * @param {Function} callback
     * @return
     */
    getSignConfig(callback) {
        return new Promise((resolve, reject) => {
            this.getJsApiTicket((ticket) => {
                let url = URL.parse(this.req.url),
                    timestamp = Math.floor(new Date().getTime() / 1000),
                    str = '',
                    nonceStr = '',
                    signature,
                    protocol = (url.protocol === 'https' || url.port === 443) ? 'https://'
                    : 'http://';
                url = protocol + url.host + url.path;
                nonceStr = createNonceStr();
                str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    
                let sha1 = crypto.createHash('sha1'),
                    sign;
                sha1.update(str);
                signature = sha1.digest('hex');
    
                function createNonceStr($len = 16) {
                    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                        str = "", i;
    
                    for (i = 0; i < $len; i++) {
                        str += chars.substr((Math.random() * Math.floor(chars.length - 1)), 1);
                    }
    
                    return str;
                }

                sign = {
                    appId: APP_ID,
                    nonceStr: nonceStr,
                    timestamp: timestamp,
                    url: url,
                    signature: signature,
                    rawString: str
                };
   
                resolve(sign);
            });
        });
        
    }

    /**
     * Method to retrieve the remote data 
     * @param {String} url 
     * @param {String} method
     * @param {Object} params
     * @return
     */
    httpRequest(url, method, params) {
        if (! url) return false;
        method = method || "GET";

        return new Promise((resolve, reject) => {
            if (method === 'GET') {
                request.get({
                    url: url,
                    encoding: 'utf8'
                }, function(error, response, body) {
                    if (response && response.statusCode == 200){
                        resolve(body);
                    } else {
                        reject(response)
                    }
                });
            } else if (method === 'POST') { 
                request.post({
                    url: url,
                    encoding: 'utf8'
                }, function(error, response, body) {
                    if (response && response.statusCode == 200){
                        resolve(body);
                    } else {
                        console.log(response.statusCode);
                    }
                });
            } else { 
                let rand = Math.floor(Math.random()*100000000).toString(), 
                    reqParams = {
                        headers: {"Connection": "close"},
                        url: url,
                        method: 'POST',
                        json: true,
                        body: params
                    };

                request(reqParams, function (error, response, body) {
                      if (response && response.statusCode == 200) {
                           resolve(body);
                      } else {
                           console.log('error: '+ response.statusCode, body, response)
                      }
                    }
                );
            }
            
        });
    }

    init() {
        let act = this.req.query.id || "",
            result = {data: {}, success: false},
            actions;

        actions = {
            token: () => {
                this.getAccessToken((token) => {
                    result.data.token = token;
                    result.success = true;
                    this.res.send(JSON.stringify(result));
                });
            },
            jsapi: () => { 
                this.getJsApiTicket((ticket) => {
                    result.data.ticket = ticket;
                    result.success = true;
                    this.res.send(JSON.stringify(result));
                });
            },
            sign: () => {
                this.getSignConfig().then((sign) => {
                    result.data = sign;
                    result.success = true;
                    this.res.send(JSON.stringify(result));
                });
            }
        };

        if (actions[act] != null) {
            actions[act]();
        } else {
            this.res.end(JSON.stringify(result));
        }  
    }
}

router.get('/wx', function(req, res, next) {
    api = new WxApi(req, res);
    api.init();
});

// Test Data
const SERVER_URL = 'http://121.196.193.149:9020'; 
router.get('/dealer/api/v1/driveType', function(req, res, next) {
    let apiTest = new WxApi(req, res);
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/driveType').then((data) => {
        res.send(data);
    });
});
// 试驾车型
router.get('/dealer/api/v1/carType', function(req, res, next) {
    let apiTest = new WxApi(req, res);
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/carType').then((data) => {
        res.send(data);
    });
});
// 获取附件销售店
router.get('/dealer/api/v1/nearDealer', function(req, res, next) {
    let apiTest = new WxApi(req, res); 
    let queryStr = querystring.stringify(req.query); 
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/nearDealer?' + queryStr).then((data) => {
        res.send(data);
    });
});
// 预约提交
router.post('/dealer/api/v1/commitDrive', function(req, res, next) {
    let apiTest = new WxApi(req, res),
        data = ''; 

    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        let val = JSON.parse(data);
        apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/commitDrive', 'PUT', val).then((resData) => {
            res.send(resData);
        });
    });
    
});
// 取消预约
router.post('/dealer/api/v1/disDrive', function(req, res, next) {
    let apiTest = new WxApi(req, res),
        data = ''; 

    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {   
        let val = JSON.parse(data);
        let queryStr = querystring.stringify(val);  console.log(queryStr);
        apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/disDrive?' + queryStr, 'POST').then((resData) => {
            res.send(resData);
        });
    });
});
// 试驾列表
router.get('/dealer/api/v1/userDriveList', function(req, res, next) {
    let apiTest = new WxApi(req, res); 
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/userDriveList').then((data) => {
        res.send(data);
    });
});
// 二维码
router.get('/dealer/api/v1/getQrcode', function(req, res, next) {
    let apiTest = new WxApi(req, res); 
    let queryStr = querystring.stringify(req.query);
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/getQrcode?' + queryStr).then((data) => {
        res.send(data);
    });
});
// 试驾明细
router.get('/dealer/api/v1/userDriveInfo', function(req, res, next) {
    let apiTest = new WxApi(req, res); 
    let queryStr = querystring.stringify(req.query); 
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/userDriveInfo?' + queryStr).then((data) => {
        res.send(data);
    });
});
// 预约评价
router.get('/dealer/api/v1/getEvaluationItem', function(req, res, next) {
    let apiTest = new WxApi(req, res); 
    let queryStr = querystring.stringify(req.query); 
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/getEvaluationItem?' + queryStr).then((data) => {
        res.send(data);
    });
});
// 预约评价提交
router.post('/dealer/api/v1/driveEvaluation', function(req, res, next) {
    let apiTest = new WxApi(req, res),
        data = ''; 

    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        let val = JSON.parse(data); console.log(val);
        apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/driveEvaluation', 'PUT', val).then((resData) => {
            res.send(resData);
        });
    });
});
// 试驾评价列表
router.get('/dealer/api/v1/evaluationResult', function(req, res, next) {
    let apiTest = new WxApi(req, res); 
    let queryStr = querystring.stringify(req.query); 
    apiTest.httpRequest(SERVER_URL + '/dealer/api/v1/evaluationResult?' + queryStr).then((data) => {
        res.send(data);
    });
});

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/uploads/');
        },
        filename: function (req, file, cb) {
            //file.originalname上传文件的原始文件名
            var changedName = (new Date().getTime())+'-'+file.originalname;
            cb(null, changedName);
        }
    })
});
// 协议上传
router.post('/upload/single', upload.single('upload_0'), (req,res) => {
    console.log(req.file);
    res.json({
        code: '0000',
        type:'single',
        originalname: req.file.originalname
    })
});

module.exports = router;