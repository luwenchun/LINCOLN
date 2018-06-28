
/**
 * 表情包转换
 * @param {String} str 
 */
export const expression = str => {
    const imgUrl = 'http://lincoln-mp.yonyouauto.com/pc/assets/images/';
    if (typeof str !== 'string') return !1;
    str = str.replace(/\/::\)/g, `<img src="${imgUrl}微笑.png" />`);
    str = str.replace(/\/::~/g, `<img src="${imgUrl}伤心.png" />`);
    str = str.replace(/\/::B/g, `<img src="${imgUrl}美女.png" />`);
    str = str.replace(/\/::\|/g, `<img src="${imgUrl}发呆.png" />`);
    str = str.replace(/\/:8-\)/g, `<img src="${imgUrl}墨镜.png" />`);
    str = str.replace(/\/::</g, `<img src="${imgUrl}大哭.png" />`);
    str = str.replace(/\/::\$/g, `<img src="${imgUrl}羞.png" />`);
    str = str.replace(/\/::X/g, `<img src="${imgUrl}闭嘴.png" />`);
    str = str.replace(/\/::Z/g, `<img src="${imgUrl}睡.png" />`);
    str = str.replace(/\/::’\(/g, `<img src="${imgUrl}哭.png" />`);
    str = str.replace(/\/::-\|/g, `<img src="${imgUrl}尴尬.png" />`);
    str = str.replace(/\/::@/g, `<img src="${imgUrl}怒.png" />`);
    str = str.replace(/\/::P/g, `<img src="${imgUrl}调皮.png" />`);
    str = str.replace(/\/::D/g, `<img src="${imgUrl}龇牙.png" />`);
    str = str.replace(/\/::O/g, `<img src="${imgUrl}惊讶.png" />`);
    str = str.replace(/\/::\(/g, `<img src="${imgUrl}难过.png" />`);
    str = str.replace(/\/::\+/g, `<img src="${imgUrl}酷.png" />`);
    str = str.replace(/\/:–b/g, `<img src="${imgUrl}囧.png" />`);
    str = str.replace(/\/::Q/g, `<img src="${imgUrl}抓狂.png" />`);
    str = str.replace(/\/::T/g, `<img src="${imgUrl}吐.png" />`);
    str = str.replace(/\/:,@P/g, `<img src="${imgUrl}偷笑.png" />`);
    str = str.replace(/\/:,@-D/g, `<img src="${imgUrl}愉快.png" />`);
    str = str.replace(/\/::d/g, `<img src="${imgUrl}白眼.png" />`);
    str = str.replace(/\/:,@o/g, `<img src="${imgUrl}傲慢.png" />`);
    str = str.replace(/\/::g/g, `<img src="${imgUrl}饥饿.png" />`);
    str = str.replace(/\/:\|-\)/g, `<img src="${imgUrl}困.png" />`);
    str = str.replace(/\/::!/g, `<img src="${imgUrl}吓.png" />`);
    str = str.replace(/\/::L/g, `<img src="${imgUrl}汗.png" />`);
    str = str.replace(/\/::\>/g, `<img src="${imgUrl}高兴.png" />`);
    str = str.replace(/\/::,@/g, `<img src="${imgUrl}闲.png" />`);
    str = str.replace(/\/:,@f/g, `<img src="${imgUrl}奋斗.png" />`);
    str = str.replace(/\/::-S/g, `<img src="${imgUrl}咒骂.png" />`);
    str = str.replace(/\/:\?/g, `<img src="${imgUrl}疑问.png" />`);
    str = str.replace(/\/:,@x/g, `<img src="${imgUrl}虚.png" />`);
    str = str.replace(/\/:,@@/g, `<img src="${imgUrl}晕.png" />`);
    str = str.replace(/\/:,@!/g, `<img src="${imgUrl}哀.png" />`);
    str = str.replace(/\/:!!!/g, `<img src="${imgUrl}鬼.png" />`);
    str = str.replace(/\/:xx/g, `<img src="${imgUrl}打击.png" />`);
    str = str.replace(/\/:bye/g, `<img src="${imgUrl}拜拜.png" />`);
    str = str.replace(/\/:wipe/g, `<img src="${imgUrl}汗.png" />`);
    str = str.replace(/\/:dig/g, `<img src="${imgUrl}抠鼻.png" />`);
    str = str.replace(/\/:handclap/g, `<img src="${imgUrl}鼓掌.png" />`);
    str = str.replace(/\/:&-\(/g, `<img src="${imgUrl}糗.png" />`);
    str = str.replace(/\/:B-\)/g, `<img src="${imgUrl}坏笑.png" />`);
    str = str.replace(/\/:\<@/g, `<img src="${imgUrl}左亨.png" />`);
    str = str.replace(/\/:@>/g, `<img src="${imgUrl}右哼.png" />`);
    str = str.replace(/\/::-O/g, `<img src="${imgUrl}困.png" />`);
    str = str.replace(/\/:\>\-\|/g, `<img src="${imgUrl}看.png" />`);
    str = str.replace(/\/:P-\(/g, `<img src="${imgUrl}委屈.png" />`);
    str = str.replace(/\/::’\|/g, `<img src="${imgUrl}想哭.png" />`);
    str = str.replace(/\/:X-\)/g, `<img src="${imgUrl}阴险.png" />`);
    str = str.replace(/\/::\*/g, `<img src="${imgUrl}亲.png" />`);
    str = str.replace(/\/:@x/g, `<img src="${imgUrl}吓.png" />`);
    str = str.replace(/\/:8\*/g, `<img src="${imgUrl}可怜.png" />`);
    str = str.replace(/\/:pd/g, `<img src="${imgUrl}刀.png" />`);
    str = str.replace(/\/:<W>/g, `<img src="${imgUrl}西瓜.png" />`);
    str = str.replace(/\/:beer/g, `<img src="${imgUrl}啤酒.png" />`);
    str = str.replace(/\/:basketb/g, `<img src="${imgUrl}篮球.png" />`);
    str = str.replace(/\/:oo/g, `<img src="${imgUrl}拼乓.png" />`);
    str = str.replace(/\/:coffee/g, `<img src="${imgUrl}咖啡.png" />`);
    str = str.replace(/\/:eat/g, `<img src="${imgUrl}吃饭.png" />`);
    str = str.replace(/\/:pig/g, `<img src="${imgUrl}猪头.png" />`);
    str = str.replace(/\/:rose/g, `<img src="${imgUrl}鲜花.png" />`);
    str = str.replace(/\/:fade/g, `<img src="${imgUrl}枯萎.png" />`);
    str = str.replace(/\/:showlove/g, `<img src="${imgUrl}唇.png" />`);
    str = str.replace(/\/:heart/g, `<img src="${imgUrl}爱.png" />`);
    str = str.replace(/\/:break/g, `<img src="${imgUrl}心碎.png" />`);
    str = str.replace(/\/:cake/g, `<img src="${imgUrl}生日.png" />`);
    str = str.replace(/\/:li/g, `<img src="${imgUrl}闪电.png" />`);
    str = str.replace(/\/:bome/g, `<img src="${imgUrl}炸弹.png" />`);
    str = str.replace(/\/:kn/g, `<img src="${imgUrl}小刀.png" />`);
    str = str.replace(/\/:ladybug/g, `<img src="${imgUrl}虫.png" />`);
    str = str.replace(/\/:footb/g, `<img src="${imgUrl}足球.png" />`);
    str = str.replace(/\/:shit/g, `<img src="${imgUrl}臭.png" />`);
    str = str.replace(/\/:moon/g, `<img src="${imgUrl}月亮.png" />`);
    str = str.replace(/\/:sun/g, `<img src="${imgUrl}太阳.png" />`);
    str = str.replace(/\/:gift/g, `<img src="${imgUrl}礼物.png" />`);
    str = str.replace(/\/:hug/g, `<img src="${imgUrl}伙伴.png" />`);
    str = str.replace(/\/:strong/g, `<img src="${imgUrl}赞.png" />`);
    str = str.replace(/\/:weak/g, `<img src="${imgUrl}差.png" />`);
    str = str.replace(/\/:share/g, `<img src="${imgUrl}握手.png" />`);
    str = str.replace(/\/:v/g, `<img src="${imgUrl}优.png" />`);
    str = str.replace(/\/:@\)/g, `<img src="${imgUrl}恭.png" />`);
    str = str.replace(/\/:jj/g, `<img src="${imgUrl}勾.png" />`);
    str = str.replace(/\/:@@/g, `<img src="${imgUrl}顶.png" />`);
    str = str.replace(/\/:bad/g, `<img src="${imgUrl}坏.png" />`);
    str = str.replace(/\/:lvu/g, `<img src="${imgUrl}lvu.png" />`);
    str = str.replace(/\/:no/g, `<img src="${imgUrl}no.png" />`);
    str = str.replace(/\/:ok/g, `<img src="${imgUrl}好的.png" />`);
    str = str.replace(/\/:love/g, `<img src="${imgUrl}love.png" />`);
    str = str.replace(/\/:\<L\>/g, `<img src="${imgUrl}l吻.png" />`);
    str = str.replace(/\/:jump/g, `<img src="${imgUrl}跳.png" />`);
    str = str.replace(/\/:shake/g, `<img src="${imgUrl}怕.png" />`);
    str = str.replace(/\/:\<O\>/g, `<img src="${imgUrl}尖叫.png" />`);
    str = str.replace(/\/:circle/g, `<img src="${imgUrl}圈.png" />`);
    str = str.replace(/\/:kotow/g, `<img src="${imgUrl}拜.png" />`);
    str = str.replace(/\/:turn/g, `<img src="${imgUrl}天使.png" />`);
    str = str.replace(/\/:skip/g, `<img src="${imgUrl}跳跳.png" />`);
    str = str.replace(/\[挥手\]/g, `<img src="${imgUrl}天使.png" />`);
    str = str.replace(/\/:\#-0/g, `<img src="${imgUrl}激动.png" />`);
    str = str.replace(/\[街舞\]/g, `<img src="${imgUrl}舞.png" />`);
    str = str.replace(/\/:kiss/g, `<img src="${imgUrl}kiss.png" />`);
    str = str.replace(/\/:\<&/g, `<img src="${imgUrl}瑜伽.png" />`);
    str = str.replace(/\/:&\>/g, `<img src="${imgUrl}太极.png" />`);
    return str;
}

// 解决IOS微信页面后退无法刷新
export const pushHistory = () => {
    if (window.__wxjs_is_wkwebview) {
        window.addEventListener("popstate", function (e) {
            //这里监听到了后退事件
            self.location.reload();
        }, false);
        var state = {
            title: "",
            url: "#"
        };
        window.history.replaceState(state, "", "#");
    }
}

/**
 * 消息提示层
 * @param {String} message 
 */
export const Toast = message => {
    let Toast = document.createElement('div');
    let ToastSpan = document.createElement('span');
    Toast.style.position = 'absolute';
    Toast.style.zIndex = 99;
    Toast.style.top = 0;
    Toast.style.left = 0;
    Toast.style.right = 0;
    Toast.style.bottom = 0;
    ToastSpan.style.position = 'absolute';
    ToastSpan.style.color = 'white';
    ToastSpan.style.backgroundColor = 'rgba(0,0,0,.4)';
    ToastSpan.style.top = '50%';
    ToastSpan.style.left = '50%';
    ToastSpan.style.transform = 'translate(-50%,-50%)';
    ToastSpan.style.borderRadius = '5px';
    ToastSpan.style.padding = '.2rem .5rem';
    ToastSpan.innerHTML = message;
    Toast.appendChild(ToastSpan);
    document.body.appendChild(Toast);
    setTimeout(() => {
        document.body.removeChild(Toast)
    }, 1500);
}