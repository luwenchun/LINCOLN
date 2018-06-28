/**
 * Mui相关插件调用类
 * @author Michael
 * @version 1.0.0 
 */
import '../components/mui/css/mui.min.scss';
import mui from '../components/mui/js/mui.min.js';
import '../components/mui/js/mui.pullToRefresh.js';
import '../components/mui/js/mui.pullToRefresh.material.js';
import { call } from 'redux-saga/effects';

class MuiPlugin {
    constructor() {
        mui.init();
        this.timePicker = null;
    }

    toast(msg) {
        mui.toast(msg, { duration:'long', type:'div'});
    }

    alert(title, msg, buttons, callback) {
        buttons = buttons || ['确定'];
        mui.alert(title, msg, buttons, callback, 'div');
    }
    /**
     * 加载选择器
     * @param {Array} data 
     * @param {Function} callback 
     */
    loadPicker(data, callback) {
        let userPicker = new mui.PopPicker();
            userPicker.setData(data); console.log(userPicker)
        userPicker.show((items) => {
          if (typeof callback !== 'undefined') {
              callback(items[0]);
          }
        });
        return userPicker;
    }
    /**
     * 加载日期选择器
     * @param {Object} target 
     * @param {Object} options 
     */
    loadTimePicker(target, options, callback) {
        if (! target) return false;

        if (this.timePicker) {
            this.timePicker.show((rs) => {
                target.innerText = rs.text;
                if (typeof callback !== 'undefined') {
                    callback(rs.text);
                }
                this.timePicker.dispose();
                this.timePicker = null;
            });
        } else {
            options = options || {};
            this.timePicker = new mui.DtPicker(options);
            this.timePicker.show((rs) => {
                target.innerText = rs.text;
                if (typeof callback !== 'undefined') {
                    callback(rs.text);
                }
                this.timePicker.dispose();
                this.timePicker = null;
            });
        }

        return true;
    }
    /**
     * 下拉加载
     * @param {String} el 
     * @param {Function} load 
     */
    scrollerRefresh(el, load) {
        if (typeof load === 'undefined') {
            return false;
        }

        el = mui(document.querySelector(el));
        
        if (el == null) {
            return false;
        }
 
        el.pullToRefresh({
            up: {
                callback: function() {
                    var self = this;
                    setTimeout(function() {
                        load(self.element, () => {
                            self.endPullUpToRefresh();
                        });
                    }, 500);
                }
            },
        });
    }

    $(selector) {
        return mui(selector);
    }
}

export default new MuiPlugin;