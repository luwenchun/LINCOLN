/**
 * @description 公共方法库
 * @todo 支持服务端渲染
 */
import _ from 'lodash'
import Cookies from 'js-cookie';
import Store from 'store'


class DMCUtil {
  constructor() {
    this.Version = '1.0.0'
  }


  /**
   * 自定义实现选择器
   * @param {String} target 
   */
  sizzle(target) {

  }

  /**
   * 是否存在指定的class
   * @param {String} className 
   */
  hasClass(className) {

  }

  /**
   * 添加class
   * @param {String} className 
   */
  addClass(className) {

  }

  /**
   * 移除class
   * @param {String} className 
   */
  removeClass(className) {

  }

  getCurrent(Authorization) {
    //webJwt
    let cookie = Cookies.get()['webJwt']

    return cookie
  }


  getJWTFromCookie(_key = 'webJwt') {
    window.Cookies = Cookies
    let requiredCookies = {}
    if (location.host != "localhost:3000") {
      Cookies.set('Admin-Token', 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ4bSIsIm5hbWUiOiLnhormoqYiLCJ1c2VySWQiOiI4NDEiLCJ0ZWxQaG9uZSI6IjEyMzQ1Njc4OTAiLCJyZW1hcmsiOiIiLCJkZWFsZXJDb2RlIjoiMDAwMDAiLCJkZWFsZXJOYW1lIjoi5bm_5rG95Liw55Sw5rG96L2m5pyJ6ZmQ5YWs5Y-4IiwidXNlck5hbWUiOiLnhormoqYiLCJraWNrT3V0IjpmYWxzZSwiZXhwIjoxNTY3MTUyNTA5fQ.Qv8emyno9Zx_PFnv_ZcHZFYD8KmL9s9HfKBJgtYzY7rSlAXsiR3NtYh5Jaa7ziA9C2cZwcMdTNVr4ePMExgmyao59OyyUoZyTXtSUjILb9bosrnJtdjkwKxjl5cDeP6Uof-T5hv6LTYlHDruB1EY_jXBjv--LDCPsgCeREpxR40')
      Cookies.set('JSESSIONID', 'eyJhbGciOiJSUzI1NiJ9')
      requiredCookies = { 'Admin-Token': Cookies.get()['Admin-Token'], 'JSESSIONID': Cookies.get()['JSESSIONID'] }
    } else {
      Cookies.set('webJwt', 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ4bSIsIm5hbWUiOiLnhormoqYiLCJ1c2VySWQiOiI4NDEiLCJ0ZWxQaG9uZSI6IjEyMzQ1Njc4OTAiLCJyZW1hcmsiOiIiLCJkZWFsZXJDb2RlIjoiMDAwMDAiLCJkZWFsZXJOYW1lIjoi5bm_5rG95Liw55Sw5rG96L2m5pyJ6ZmQ5YWs5Y-4IiwidXNlck5hbWUiOiLnhormoqYiLCJraWNrT3V0IjpmYWxzZSwiZXhwIjoxNTY3MTUyNTA5fQ.Qv8emyno9Zx_PFnv_ZcHZFYD8KmL9s9HfKBJgtYzY7rSlAXsiR3NtYh5Jaa7ziA9C2cZwcMdTNVr4ePMExgmyao59OyyUoZyTXtSUjILb9bosrnJtdjkwKxjl5cDeP6Uof-T5hv6LTYlHDruB1EY_jXBjv--LDCPsgCeREpxR40')
      requiredCookies = { 'Authorization': Cookies.get()['webJwt'] }
    } 

    //  console.log('*****************',requiredCookies)
    //let jwt = Cookies.get()[_key]
    return requiredCookies
  }

  getQueryValue(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let subString = location.href.split('?')[1] || '';
    let r = subString.match(reg);
    if (r != null) return decodeURI(r[2]); return null;
  }

  getMutiQueryValue(_arr = []) {
    let resultObj = {};
    _arr.forEach((item, index) => {
      resultObj[item] = this.getQueryValue(item);
    })

    return resultObj;
  }


}

/**
  * 类初始方法
  */
() => init = {



}

export default new DMCUtil
