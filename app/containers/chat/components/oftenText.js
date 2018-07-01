import React from 'react';
import '../style/oftenText.scss';
import Http from './../../../utils/http';
import { SERVER_BASE_PATH } from '../../../global.config';

const apis = [
    { "id": "getWxChatContent", "url": "chat/wx/getWxChatContent", "format": false },
    { "id": "getWxChatDialogue", "url": "chat/wx/getWxChatDialogue", "format": false },
    { "id": "updateDialogueTimes", "url": "chat/wx/updateDialogueTimes", "format": false },
    { "id": "getWxChatMediaContent", "url": "chat/wx/getWxChatMediaContent", "format": false },
];

// Http.setDomainUrl("http://localhost:9019/showroom/api/v1/");
// Http.setDomainUrl("http://lincoln-mp.yonyouauto.com/qy/chat/wx/");
Http.setDomainUrl(SERVER_BASE_PATH);
// Http.setDomainUrl("/wx/pc/api/");

// Http.setDebugger(true);
Http.setMutiApi(apis);

export default class often extends React.Component {
    constructor(props) {
        super(props);
        const many = [...this.props.data.many];
        const often = [...this.props.data.often];
        function addAttr(arr) {
            arr.length
                ? arr.forEach((item, index) => {
                    item.show = false;
                    if (item.childs.length) addAttr(item);
                })
                : null;
        }
        addAttr(many);

        let manyMap = JSON.stringify(many);
        manyMap = JSON.parse(manyMap);
        this.state = {
            inputText: '',
            isDefault: true,
            manyMap,
            many,
            oftenMap: often.slice(0),
            often,
            moreMap: [],
            more: [],
        }
    }
    componentWillMount() {
    }
    componentDidMount() { }
    render() {
        console.log(this.state)
        const oftenItem = this.state.often.map((item, index) => {
            return (
                <li key={index} onClick={this.selectd.bind(this, item)}>
                    <i className={'iconfont'} alt='点'>&#xe600;</i>
                    <span>{item.content}</span>
                </li>
            )
        })

        const manyItem = this.state.many.map((item, index) => {
            return (
                <li key={index} className={'manyOne'}>
                    <p onClick={this.oneClick.bind(this, index)}>
                        <i className={`${'iconfont'} ${item.show ? 'hide' : 'lShow'}`} alt='右箭头'>&#xe603;</i>
                        <i className={`${'iconfont'} ${item.show ? 'lShow' : 'hide'}`} alt='下箭头'>&#xe64b;</i>
                        <span>{item.content.ccontent}</span>
                    </p>
                    {item.childs.map((ite, inde) => {
                        return (
                            <div key={inde} className={`${'manyTwo'} ${item.show ? 'show' : 'hide'}`}>
                                {Array.isArray(ite.childs) && ite.childs.length
                                    ? <p onClick={this.twoClick.bind(this, index, inde)}>
                                        <i className={'iconfont'} alt='加号'>&#xe602;</i>
                                        <span>{ite.content.ccontent}</span>
                                    </p>
                                    : <p onClick={this.selectd.bind(this, ite)}>
                                        <i className={'iconfont'} alt='点'>&#xe600;</i>
                                        <span>{ite.content.ccontent}</span>
                                    </p>}

                                {Array.isArray(ite.childs) && ite.childs.length
                                    ? ite.childs.map((v, i) => {
                                        return (
                                            <div key={i} className={`${'manyThree'} ${ite.show ? 'show' : 'hide'}`}>
                                                {Array.isArray(v.childs) && v.childs.length
                                                    ? <p onClick={this.threeClick.bind(this, index, inde, i)}>
                                                        <i className={'iconfont'} alt='加号'>&#xe602;</i>
                                                        <span>{v.content.ccontent}</span>
                                                    </p>
                                                    : <p onClick={this.selectd.bind(this, v)}>
                                                        <i className={'iconfont'} alt='点'>&#xe600;</i>
                                                        <span>{v.content.ccontent}</span>
                                                    </p>
                                                }

                                                {Array.isArray(v.childs) && v.childs.length
                                                    ? v.childs.map((e, l) => {
                                                        return (
                                                            <div key={l} className={`${'manyFor'} ${v.show ? 'show' : 'hide'}`}>
                                                                <p onClick={this.selectd.bind(this, e)}>
                                                                    <i className={'iconfont'} alt='点'>&#xe600;</i>
                                                                    <span>{e.content.ccontent}</span>
                                                                </p>
                                                            </div>
                                                        )
                                                    })
                                                    : ''
                                                }
                                            </div>
                                        )
                                    })
                                    : ""}

                            </div>
                        )
                    })}
                </li>
            )
        })


        const More = this.state.more.map((item, index) => {
            return (
                <li key={index} className={'manyOne'}>
                    <p onClick={this.moreClick.bind(this, index)}>
                        <i className={`${'iconfont'} ${item.show ? 'hide' : 'lShow'}`} alt='右箭头'>&#xe603;</i>
                        <i className={`${'iconfont'} ${item.show ? 'lShow' : 'hide'}`} alt='下箭头'>&#xe64b;</i>
                        <span>{item.content.content}</span>
                    </p>
                    {item.childs.length ? item.childs.map((ite, inde) => {
                        return (
                            <div key={inde} className={`${'manyTwo'} ${item.show ? 'show' : 'hide'}`}>
                                <p onClick={this.moreTClick.bind(this, index, inde, ite)}>
                                    <i className={'iconfont'} alt='点'>&#xe600;</i>
                                    <span>{ite.tagName}</span>
                                </p>

                            </div>
                        )
                    }) : ''}
                </li>
            )
        })
        return (
            <div className={`${'often'} ${this.props.oftenShow || this.props.manyShow ? 'show' : 'hide'}`}>
                <input type="text" value={this.state.inputText} onChange={this.search.bind(this)} />
                <span className={'iconfont'} onClick={this.cancel.bind(this)} alt='叉叉'>&#xe633;</span>
                <i className={'iconfont'} alt='搜索'>&#xe607;</i>
                <ul>
                    {this.props.oftenShow ? oftenItem : manyItem}
                </ul>
            </div>
        )
    }
    oftenClick() {
        this.setState({ isDefault: true });
        this.filterOften();
    }
    manyClick() {
        this.setState({ isDefault: false });
        this.filterMany();
        this.filterMore();
    }
    search(event) {
        this.setState({ inputText: event.target.value }, () => {
            // 筛选
            if (this.props.oftenShow) {   // 常见对白
                this.filterOften();
            } else {      // 常见内容
                this.filterMany();
                this.filterMore();
            }
        })
    }
    moreClick(index) {
        const more = Object.assign([], this.state.more);
        more[index].childrenShow = !more[index].childrenShow;
        this.setState({ more });
    }
    moreTClick(i, index, obj) {
        // debugger;
        console.log(obj)
        const more = Object.assign([], this.state.more);
        const val = more[i].children[index].tagName;
        const typeName = more[i]['firstName'];
        // this.setState({})
        this.props.check({
            contentType: obj.content.type,
            content: val,
            media_id: obj.media_id,
            type: obj.content.type === 'news' ? 'mpnews' : obj.content.type,
            url: obj.content['down_url'] || obj.content['url'],
            media: true,
            obj,
        });
    }
    filterOften() {
        let arr = [];
        const reg = this.state.inputText;
        this.state.oftenMap.map((item, index) => {
            if (item.content.toLowerCase().indexOf(reg.toLowerCase()) != -1) {
                arr.push(item);
            }
        })
        this.setState({ often: arr });
    }
    oneClick(index) {
        const many = Object.assign([], this.state.many);
        many[index].show = !many[index].show;
        this.setState({ many });
    }
    twoClick(i, index) {
        let many = [...this.state.many];
        many[i].childs[index].show = !many[i].childs[index].show;
        this.setState({ many });
    }
    threeClick(i, inde, index) {
        let many = [...this.state.many];
        many[i].childs[inde].childs[index].show = !many[i].childs[inde].childs[index].show
        this.setState({ many });
    }

    filterMore() {
        let arr = [], current = [0, 0];
        const reg = this.state.inputText;
        for (let p = 0, temp; (temp = this.state.moreMap[p]) != undefined; p++) {
            for (let o = 0, tem; (tem = temp.children[o]) != undefined; o++) {
                let obj = {
                    firstName: temp.firstName,
                    childrenShow: true,
                    children: [tem]
                };
                if (tem['tagName'].indexOf(reg) != -1) {
                    // arr.push(Object.assign({}, obj));
                    if (!arr.length) {        // 初始化
                        arr.push(obj);
                    } else if (current[0] == p) {    // 二级标签整合
                        arr[arr.length - 1].children.push(tem);
                    } else {      // 一级标签整合
                        arr.push(obj);
                    }
                    // 更新下标 
                    current[0] = p;
                    current[1] = o;
                }
            }
        }
        this.setState({ more: arr });
    }
    filterMany() {
        const reg = this.state.inputText.trim();
        let many = JSON.stringify(this.state.manyMap);
        many = JSON.parse(many);
        if (!reg.length) return this.setState({ many });
        // 一级遍历
        for (let p = 0, temp; (temp = many[p]) != undefined; p++) {
            if (temp['childs'].length) {
                // 二级遍历
                for (let o = 0, tem; (tem = temp.childs[o]) != undefined; o++) {

                    // 三级遍历
                    for (let l = 0, te; (te = tem.childs[l]) != undefined; l++) {

                        // 四级标签遍历
                        for (let m = 0, t; (t = te.childs[m]) != undefined; m++) {
                            if (t['content']['ccontent'].indexOf(reg) == -1) {
                                many[p]['childs'][o]['childs'][l]['childs'].splice(m, 1);
                                --m;
                                continue;
                            } else {
                                t.show = true;
                            }
                        }

                        te.show = true;
                        if (te['content']['ccontent'].indexOf(reg) == -1 && !te['childs'].length) {  // 如果三级是叶子
                            many[p]['childs'][o]['childs'].splice(l, 1);
                            --l;
                            continue;
                        }

                    }

                    tem.show = true;
                    if (!tem['childs'].length && tem['content']['ccontent'].indexOf(reg) == -1) {   // 如果二级是叶子
                        many[p]['childs'].splice(o, 1);
                        --o;
                        continue;
                    }

                }

                temp.show = true;
            }
            // 如果一级是叶子
            if (temp['content']['ccontent'].indexOf(reg) == -1 && !temp['childs'].length) {
                many.splice(p, 1);
                --p;
                continue;
            }


        }
        console.log(many)
        this.setState({ many });
    }
    selectd(value) {
        let obj = {};
        if (typeof (value['content']) === 'object') {
            const id = value['id'];
            value.isDefault = this.state.isDefault;
            obj.id = value.id;
            obj.url = value.content.localUrl;
            obj.title = value.content.title;
            obj.mediaId = value.content.mediaId;
            obj.media = true;
            obj.fid = value.content.fid;
            obj.description = value.content.description;
            obj.content = value.content.type === 'text' ? value.content.description : value.content.title;
            obj.contentType = value.content.type;
            Http.get('updateDialogueTimes', { id }, () => {
                // 更新频次
            })
        } else {
            obj.isDefault = this.state.isDefault;
            obj.content = value.content;
            obj.contentType = 'text';
            obj.media = false;
        }
        this.props.check(obj);
    }
    cancel() {
        this.props.cancel(false);
    }
}
