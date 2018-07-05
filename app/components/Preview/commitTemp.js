import React, { Component } from 'react';
import './commitTemp.scss';
import Http from '../../utils/http';
import Utils from '../../utils/DMCUtil';
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../global.config';
import { Toast } from 'antd-mobile';


const apis = [
    // { "id": "queryDetailNews", "url": "community/news/queryDetailNews", "format": false },
    { "id": "queryCommentList", "url": "community/comment/queryCommentList" },      //  查看评论
    { "id": "addOrCancel", "url": "community/praise/addOrCancel", "format": false },
    { "id": "getOnlyPostStarter", "url": "community/comment/getOnlyPostStarter" },   // 只看楼主
    { "id": "accusationArticleOrComment", "url": "community/article/accusationArticleOrComment" },   // 举报
    { "id": "updatePublishStatus", "url": "community/article/updatePublishStatus" },   // 举报
    { "id": "queryTop3Hot", "url": "community/comment/queryTop3Hot", "format": false },
];


Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

var page = 1, curPage = 1, oldStep = 0;
window.refurbishComment = () => { }
var isScroll = false;  // 节流
var curUrl = 'queryCommentList';
class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data || [],
            style: {
                width: '100%',
                height: 'auto',
                background: 'white',
            },
            isFollow: false,
            query: {
                businessType: 1007,
                businessId: Http.getQueryValue('id') || '',
                limit: 20,
                page: 1,
            },
            upLoading: false,
            downLoading: false,
            isFirstPage: false,
            isLastPage: false,
            contHeight: 0,
            hotData: [],
        }
    }
    /**
     * businessType
     *  (1001, "话题"),
        (1002, "动态"),
        (1003, "活动"),
        (1004, "新闻资讯"),
        (1005, "评论"),
        (1006, "话题跟帖"),
        (1007, "论坛帖子"),
        (1008, "主贴跟帖"),
        (1009, "跟帖评论");
     * 
     */


    /**
     * articleRoleCode:  1 超级管理员 |2 管理员 |3 版主 |4 普通用户 |5 黑名单
     *     
     */



    componentWillMount() {
        if (!this.props.data && !this.props.id) {
            this.props.token ? Http.setRequestHeader({ token: this.props.token }) : '';
            this.getData.bind(this, this.props.query)();
        }
        // this.setState({
        //     data: [{ "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 81, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": "18260295036", "commentContent": "我是二楼,我也写了个一级评论", "commentTime": "2018-03-07", "status": null, "praiseCount": 44, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "科比", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 2, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [{ "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 546, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "大家好", "commentTime": "2018-04-27", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 1, "level": 2, "comment2Id": 81, "comment2UserId": 1, "commenterToName": "保罗", "commenterToPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg" }] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 82, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": "13590282162", "commentContent": "I’m6号,我写了个1级评论", "commentTime": "2018-03-07", "status": null, "praiseCount": 33, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "我是6号", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 6, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 549, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "sdfasdfasdf", "commentTime": "2018-04-28", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "保罗", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 1, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 549, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "sdfasdfasdf", "commentTime": "2018-04-28", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "保罗", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 1, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 547, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "level1", "commentTime": "2018-04-28", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "保罗", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 1, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [{ "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 548, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "level2", "commentTime": "2018-04-28", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "科比", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 1, "level": 2, "comment2Id": 547, "comment2UserId": 1, "commenterToName": "保罗", "commenterToPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg" }] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 545, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "大家好", "commentTime": "2018-04-26", "status": null, "praiseCount": 0, "commenterPhoto": "https://carapptest.gtmc.com.cn/fs01/20180309/a4f6ace1a00293aefaa36f61fda3ef01.jpg", "commenterName": "我是12345", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 12345, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 544, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "大家好", "commentTime": "2018-04-26", "status": null, "praiseCount": 0, "commenterPhoto": "https://carapptest.gtmc.com.cn/fs01/20180309/a4f6ace1a00293aefaa36f61fda3ef01.jpg", "commenterName": "我是12345", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 12345, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 542, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "ni", "commentTime": "2018-04-26", "status": null, "praiseCount": 0, "commenterPhoto": "https://carapptest.gtmc.com.cn/fs01/20180309/a4f6ace1a00293aefaa36f61fda3ef01.jpg", "commenterName": "我是12345", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 12345, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 535, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "为人民服务", "commentTime": "2018-04-26", "status": null, "praiseCount": 0, "commenterPhoto": "https://carapptest.gtmc.com.cn/fs01/20180309/a4f6ace1a00293aefaa36f61fda3ef01.jpg", "commenterName": "我是12345", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 12345, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 109, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": null, "commentContent": "我是6号", "commentTime": "2018-03-07", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "我是6号", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 6, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 108, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": "18625006028", "commentContent": "我是哈登", "commentTime": "2018-03-07", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 23, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 107, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": "18991261230", "commentContent": "我是6号,我来了", "commentTime": "2018-03-07", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "我是6号", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 6, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "commentId": 105, "commentIds": null, "businessType": null, "businessId": null, "currentUserPhone": null, "phone": "18991261230", "commentContent": "我的名字是三楼", "commentTime": "2018-03-07", "status": null, "praiseCount": 0, "commenterPhoto": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "commenterName": "我是回帖人5号", "dealerCode": null, "dealerName": null, "userType": null, "isPraised": null, "userId": 3, "level": 1, "comment2Id": null, "comment2UserId": null, "commenterToName": null, "commenterToPhoto": null, "level2List": [] }]
        // })

        window.refurbishComment = () => {
            this.getData.bind(this)()
        }
    }
    getHotData = query => {
        Http.get('queryTop3Hot', query, res => {
            if (res && res.data && res.data.length) {
                this.setState({ hotData: res.data }, () => {
                    this.getWebviewHeight.bind(this)()
                })
            }
        })
    }

    connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(window.WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady',
                function () {
                    callback(window.WebViewJavascriptBridge)
                }, false);
        }
    }

    getWebviewHeight() {
        setTimeout((_this) => {
            const zxHeight = document.getElementById('app').clientHeight;
            try {
                _this.connectWebViewJavascriptBridge(bridge => {
                    //H5调Android
                    bridge.callHandler('getWebviewHeight', { height: zxHeight }, res => { });
                })
            } catch (error) {

            }

            try {
                window.webkit.messageHandlers.getWebviewHeight.postMessage({ body: zxHeight });
            } catch (error) {

            }

        }, 500, this)
    }



    getData = (query, type) => {
        const parmas = query ? { ...this.state.query, ...query } : { ...this.state.query };
        let url = '';
        let curData = [...this.state.data];
        if (parmas.page == 1) {   // 判断是否滑动第一页
            this.setState({ isFirstPage: true })
        } else {
            this.setState({ isFirstPage: false })
        }

        if (this.props.OnlyPostStarter) {
            url = 'getOnlyPostStarter';
            // delete parmas['userId']
        } else {
            url = 'queryCommentList'
        }

        curData = curUrl == url ? curData : [];
        Http.get(url, parmas, res => {
            let data = [];
            if (url == 'queryCommentList') {
                data = res;
            } else {
                data = res['rows']
                page = (Math.ceil(res['total'] / 20));
            }

            // 资讯去重
            if (parmas['businessType'] == 1004) {
                for (let i = 0, el; i < 3 && (el = data[i]) != undefined; i++) {
                    for (let j = i + 1, e; (e = data[j]) != undefined; j++) {
                        if (el['commentId'] === e['commentId']) {
                            data.splice(i, 1);
                            --i;
                            break;
                        }
                    }
                }
            }

            if (data) {
                if (type == 'up') {   // 向上滑动
                    // 数据逆序从前插入
                    // for (let i = data.length, e; (e = data[i]) != undefined; i--) {
                    //     e.leve2More = false;
                    //     curData.unshift(e);
                    // }
                    // this.setState({ query: parmas, data: curData, upLoading: false });
                    // this.getPage({ page: parmas['page'] + '', tools: page + '' });

                } else if (type == 'down') {  // 向下滑动
                    if (!data.length) return this.setState({ isLastPage: true }) // 是否是最后一页
                    // 数据顺序从后插入
                    data.map(e => {
                        e.leve2More = false;
                        e.More = false;
                        e.threadStarter = this.props.userId == e.userId ? 1 : 0;
                        curData.push(e);
                        Array.isArray(e.level2List) ? e.level2List.map(n => {
                            n.threadStarter = this.props.userId == n.userId ? 1 : 0;
                        }) : ''
                    })

                    if (data.length < 20) {
                        this.setState({ query: parmas, data: curData, downLoading: false, isLastPage: true });
                    } else {
                        this.setState({ query: parmas, data: curData, downLoading: false, isLastPage: false });
                    }

                    curPage = parmas['page'];
                    this.getPage({ page: curPage + '', tools: page + '' });
                } else {  // 选页码
                    data.forEach(e => {
                        e.leve2More = false;
                        e.More = false;
                        e.threadStarter = this.props.userId == e.userId ? 1 : 0;
                        Array.isArray(e.level2List) ? e.level2List.map(n => {
                            n.threadStarter = this.props.userId == n.userId ? 1 : 0;
                        }) : ''

                    })
                    const id = parmas['limit'] - 20 + '';
                    if (data.length < 20) {
                        this.setState({ query: parmas, data, upLoading: false, isLastPage: true }, () => {
                            // this.goView(parmas['limit'], id);
                        })
                    } else {
                        this.setState({ query: parmas, data, upLoading: false, isLastPage: false }, () => {
                            this.goView(parmas['limit'], id);
                        })
                    }

                    curPage = parmas['limit'] / 20;
                    this.getPage({ page: curPage + '', tools: page + '' });
                }

                // const hotData = [...data]
                // hotData.splice(0, 3);
                // for (let i = 0, e; (e = hotData[i]) != undefined; i++) {
                //     if (e.praiseCount < 20) {
                //         hotData.splice(i, 1);
                //         --i;
                //     }
                // }
                // this.setState({ hotData })
                this.getHotData(parmas);




            }
            isScroll = false;
            curUrl = url;  // 更新当前的url
        })
    }

    /**
     * 跳试图
     */
    goView(limit, id) {
        if (limit == 20) return !1;
        setTimeout(() => {
            // document.getElementById(id).scrollIntoView();
            const node = document.getElementById(id);
            node.scrollIntoView();

        }, 500)
    }

    goLogin(type) {
        // IOS
        try {
            window.webkit.messageHandlers.goLogin.postMessage({ body: type });
        } catch (error) { }

        // Andorid
        try {
            window.NativeJavaScriptInterface.goLogin(type);
        } catch (err) { }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.token != nextProps.token) {
            Http.setRequestHeader({ token: nextProps.token });
            this.getData(nextProps.query);
        }

        if (nextProps.query
            && ((this.props.query.limit != nextProps.query.limit)
                || (this.props.query.businessType != nextProps.query.businessType))
            || (nextProps.OnlyPostStarter != this.props.OnlyPostStarter)) {
            this.setState({ upLoading: true }, () => {
                this.getData(nextProps.query);
            })
        }


        page = nextProps.commentNumber;
        page = Math.ceil(page / 20);
    }

    componentDidMount() {
        const _this = this;
        window.onscroll = () => {
            let t = document.documentElement.scrollTop || document.body.scrollTop;
            let isBottom = document.body.scrollHeight - t - 1 < document.body.clientHeight;
            const query = JSON.parse(JSON.stringify(this.state.query));
            const { contHeight } = { ...this.state }
            if (oldStep > t) {   // 向上滑动
                if (!curPage) return !1;
                const id = curPage * 20 - 20 + '';
                let oft = document.getElementById(id);
                if (!oft) return !1;
                oft = oft.offsetTop;
                if (oft >= t && curPage) {
                    --curPage;
                    this.getPage({ page: curPage ? curPage + '' : 1 + '', tools: page + '' });
                };
            } else {      // 向下滑动
                if (isBottom) {    // 到底
                    query.page = (query['limit'] / 20) * query['page'];
                    query['limit'] = 20;
                    ++query.page;
                    console.log(query.page)
                    console.log(page)
                    if (query.page > page || isScroll) {
                        curPage = page;
                        this.getPage({ page: curPage + '', tools: page + '' });
                        return this.setState({ isLastPage: true })
                    };
                    isScroll = true;
                    this.setState({ downLoading: true, query: { ...query } }, () => {
                        this.getData(query, 'down');
                    })
                }
            }

            oldStep = t;
        }

        setTimeout(() => {
            _this.setState({ contHeight: document.querySelector('.Fcent').clientHeight });   // 获取帖子内容的高度
        }, 2000)

    }

    goPinglun(e, t) {
        e.replyFloor = t
        if (this.props.token && this.props.token.length) {
            // IOS
            try {
                window.webkit.messageHandlers.goPinglun.postMessage(e);
            } catch (error) { }

            //调安卓评论方法
            try {
                const string = JSON.stringify(e);
                window.NativeJavaScriptInterface.goPinglun(string);
            } catch (err) { }
        } else {
            this.goLogin('comment');
        }
    }
    goPersonalSpace(e) {
        if (this.props.token && this.props.token.length) {
            // IOS
            try {
                window.webkit.messageHandlers.goPersonalSpace.postMessage({ body: e.userId });
            } catch (error) { }

            //调安卓评论方法
            try {
                window.NativeJavaScriptInterface.goPersonalSpace(e.userId.toString());
            } catch (err) { }
        } else {
            this.goLogin('comment');
        }
    }
    autding(t) {
        const { token } = { ...this.props };
        if (token && token.length) {  // 是否在APP环境内
            Http.post('accusationArticleOrComment', t, res => {
                if (res && res.resultCode == 200) {
                    this.setState({ data })
                } else {
                    Toast.fail(res ? res.errMsg : '后台接口异常')
                }

            });
        }
    }
    remove(t) {
        console.log(t);
        const { data } = { ...this.state };
        const { token } = { ...this.props };
        if (token && token.length) {  // 是否在APP环境内
            Http.post('updatePublishStatus', t, res => {
                if (res && res.resultCode == 200) {
                    this.setState({ data })
                } else {
                    Toast.fail(res ? res.errMsg : '后台接口异常')
                }

            });
        }
    }
    getPage(cur, tools) {   // APP更新评论页数
        // IOS
        try {
            window.webkit.messageHandlers.getpage.postMessage({ cur, tools });
        } catch (error) { }

        // Andorid
        try {
            const string = JSON.stringify({ cur, tools })
            window.NativeJavaScriptInterface.getpage(string);
        } catch (err) { }
    }


    praised(i) {
        const { data } = { ...this.state };
        const { token } = { ...this.props };
        if (token && token.length) {  // 是否在APP环境内
            const query = {
                businessId: data[i]['commentId'],
                businessType: 1008,
            }
            data[i]['isPraised'] = !data[i]['isPraised'];
            if (data[i]['isPraised']) {
                ++data[i]['praiseCount']
            } else {
                --data[i]['praiseCount']
            }
            Http.setRequestHeader({ token });
            Http.post('addOrCancel', query, res => {
                if (res && res.resultCode == 200) {
                    this.setState({ data })
                } else {
                    Toast.fail(res ? res.errMsg : '后台接口异常')
                }

            });
        } else {
            // this.setState({ isFollow: !isFollow })
        }
    }

    /**
     * moreLeve
     * 更多评论
     * 
     */
    moreLeve(i) {
        const { data } = { ...this.state }
        data[i]['leve2More'] = true;
        this.setState({ data });
    }


    previewImg(data, e) {
        let images = [];
        data.imgsDto.forEach((e, i) => {
            images.push(e.photoUrl);
        })
        // IOS
        try {
            window.webkit.messageHandlers.browseImage.postMessage({ body: e.target.currentSrc, images });
        } catch (error) { }

        // Andorid
        try {
            const string = images ? JSON.stringify(images) : ''
            window.NativeJavaScriptInterface.browseImage(e.target.currentSrc, string);
        } catch (err) { }

    }

    toggleMore(i, dataType) {
        const data = [...this.state[dataType]];
        data[i]['More'] = !data[i]['More'];
        this.setState({ [dataType]: data })
    }


    render() {
        const { data, hotData, style, isFollow, upLoading, downLoading, isFirstPage, isLastPage } = { ...this.state }
        const fontFamily = 'PingFangSC-Regular';
        return (
            <div style={style}>
                <div style={{ display: upLoading && !isFirstPage ? 'block' : 'none', textAlign: 'center' }}>
                    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    <span>正在拼命加载……</span>
                </div>

                {hotData.length
                    ? <div>
                        <div style={{ padding: '15px' }}>
                            <span style={{ fontWeight: 800, fontSize: 14, fontFamily: fontFamily, color: '#353535' }}>热门回帖</span>
                        </div>
                        <ul style={{ padding: '0 15px', margin: '0' }}>
                            {hotData.map((e, i) => {
                                return (
                                    <li id={i} key={i} style={{ padding: '10px 0', borderBottom: '.5px solid #EBEBEB' }}>
                                        <p className='cphoto' onClick={this.goPersonalSpace.bind(this, e)} style={{ background: `#000000 url(${e.commenterPhoto ? e.commenterPhoto : require('./images/user.png')}) no-repeat center/100%` }}>
                                        </p>
                                        <p style={{ paddingLeft: 48, lineHeight: '18px', marginBottom: 4 }}>
                                            <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#353535' }}>{e.commenterName}</span>
                                            {/* {e.postFloor
                                                ? <span style={{ float: 'right', fontFamily: fontFamily }}>楼</span>
                                                : ''}
                                            <span style={{ float: 'right', fontFamily: fontFamily, marginRight: '5px' }}>{e.postFloor}</span> */}
                                        </p>
                                        <p style={{ fontFamily: fontFamily, lineHeight: '180%', paddingLeft: 48, color: '#353535', wordBreak: 'break-all', fontSize: 13, marginBottom: 12 }} onClick={this.goPinglun.bind(this, e, 1)}>{e.commentContent}</p>
                                        {e.imgsDto && e.imgsDto.length
                                            ? e.imgsDto.map((v, j) => {
                                                return (
                                                    <div style={{ width: '100%', paddingLeft: 48 }}>
                                                        <img key={j} onClick={this.previewImg.bind(this, e)} style={{ width: '100%', float: 'left', marginBottom: 12, borderRadius: '2px' }} src={v.photoUrl} />
                                                    </div>

                                                )
                                            })
                                            : ''}

                                        {e.level2List && e.level2List.length
                                            ? (
                                                <ul className='Secondary' style={{ borderRadius: '3px', margin: '5px 0 0 55px', padding: '2.9%', background: 'rgb(241,241,241)' }} >
                                                    {e.level2List.map((v, j) => {
                                                        return (
                                                            <li key={j} style={{ margin: '0' }} onClick={this.goPinglun.bind(this, e, 2)}>
                                                                <p style={{ textIndent: '0', color: 'black', wordBreak: 'break-all', fontSize: 12, fontFamily: fontFamily, display: j > 2 && !e.leve2More ? 'none' : 'block' }}>
                                                                    {v.commenterName}
                                                                    {v.blockRole && v.blockRole.articleRoleCode === 3
                                                                        ? '（版主）'
                                                                        : (v.threadStarter ? '（楼主）' : '')}
                                                                    {v.commenterToName != e.commenterName ? ' 回复 ' + v.commenterToName : ''}
                                                                    {'：' + v.commentContent}
                                                                </p>
                                                            </li>
                                                        )
                                                    })}

                                                    <p
                                                        onClick={this.goPinglun.bind(this, e)}
                                                        style={{ display: e.leve2More || e.level2List.length <= 3 ? 'none' : 'block', fontFamily: fontFamily, textAlign: 'right' ,color:'#353535'}}>
                                                        {/* // onClick={this.moreLeve.bind(this, i)}> */}
                                                        更多评论>>
                                                </p>
                                                </ul>
                                            )
                                            : ""

                                        }

                                        <p key={i} style={{ display: 'inline-block', width: '100%', lineHeight: '180%', paddingLeft: 48, paddingTop: 10, paddingBottom: 10, fontFamily: fontFamily, position: 'relative' }}>
                                            <span style={{ verticalAlign: 'middle', fontSize: 12,color:'#9B9B9B' }}>
                                                {Utils.dateName(e.createTime)}
                                            </span>
                                            <div style={{ width: 200, overflow: 'hidden', position: 'absolute', height: '30px', right: 36, top: 10 }}>
                                                <div style={{ width: 200, overflow: 'hidden', height: '30px', position: 'relative' }}>
                                                    {/* <pp className={e.More ? 'addMore' : 'removeMore'}
                                                    style={{ fontFamily: fontFamily, verticalAlign: 'middle', height: '30px', overflow: 'hidden', position:'absolute' }} key={i}>
                                                    <span onClick={this.goPinglun.bind(this, e,1)}
                                                        style={{ padding: '0 .3rem', verticalAlign: 'middle', borderRight: '0.5px solid #EBEBEB' }}>
                                                        回复
                                                    </span>
                                                    <span onClick={this.autding.bind(this, e)}
                                                        style={{ padding: '0 .3rem', verticalAlign: 'middle', color: '#F1C34E', borderRight: '0.5px   solid #EBEBEB' }}>
                                                        举报
                                                    </span>
                                                    <span onClick={this.remove.bind(this, e)}
                                                        style={{ padding: '0 .3rem', verticalAlign: 'middle', color: '#E27E41' }}>
                                                        删除
                                                    </span>
                                                </pp> */}
                                                </div>
                                            </div>
                                            <pp style={{ verticalAlign: "middle", height: 30, display: e.More ? 'none' : 'block', background: 'white', position: 'absolute', right: 0, top: 12 }} onClick={this.praised.bind(this, i)} >
                                                <span style={{ float: 'right', fontFamily: fontFamily ,color:'#999'}}>{e.praiseCount}</span>
                                                <span style={{ float: 'right', width: '14px', marginRight: '5px' }}>
                                                    <img style={{ width: '100%' }} src={require(e.isPraised ? './images/Fabulous Selected@2x.png' : './images/Fabulous default@2x.png')} />
                                                </span>
                                            </pp>

                                            {/* <span onClick={this.toggleMore.bind(this, i, 'hotData')} style={{ float: 'right' }}>
                                                <img style={{ marginLeft: 10,width:18 }} src={require('./images/more@2x.png')} />
                                            </span> */}
                                        </p>

                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    : ''}



                <div style={{ padding: '15px' }}>
                    <span style={{ fontWeight: 800, fontSize: 14, fontFamily: fontFamily, color: '#353535' }}>全部回帖</span>
                </div>
                <ul style={{ padding: '0 15px', margin: '0' }}>
                    {data.length
                        ? data.map((e, i) => {
                            return (
                                <li id={i} key={i} style={{ padding: '10px 0', borderBottom: '.5px solid #EBEBEB' }}>
                                    <p className='cphoto' onClick={this.goPersonalSpace.bind(this, e)} style={{ background: `#000000 url(${e.commenterPhoto ? e.commenterPhoto : require('./images/user.png')}) no-repeat center/100%` }}>
                                    </p>
                                    <p style={{ paddingLeft: 48, lineHeight: '18px', marginBottom: 4 }}>
                                        <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#353535' }}>{e.commenterName}</span>
                                        {e.postFloor
                                            ? <span style={{ float: 'right', fontFamily: fontFamily ,color:'#999'}}>楼</span>
                                            : ''}
                                        <span style={{ float: 'right', fontFamily: fontFamily, marginRight: '5px',color:'#999' }}>{e.postFloor}</span>
                                    </p>
                                    <p style={{ fontFamily: fontFamily, lineHeight: '18px', wordBreak: 'break-all', paddingLeft: 48, color: '#353535', fontSize: 13, marginBottom: 12 }} onClick={this.goPinglun.bind(this, e, 1)}>{e.commentContent}</p>
                                    {e.imgsDto && e.imgsDto.length
                                        ? e.imgsDto.map((v, j) => {
                                            return (
                                                <div style={{ paddingLeft: 48, width: '100%' }}>
                                                    <img onClick={this.previewImg.bind(this, e)} style={{ width: '100%', float: 'left', marginBottom: 12, borderRadius: '2px' }} src={v.photoUrl} />
                                                </div>

                                            )
                                        })
                                        : ''}

                                    {e.level2List && e.level2List.length
                                        ? (<div style={{ width: '100%', paddingLeft: 48 }} >
                                            <ul className='Secondary' style={{ borderRadius: '3px', margin: '5px 0 0 0px', fontSize: 12, padding: '2.9%', background: 'rgb(241,241,241)', float: 'left', width: '100%' }}>
                                                {e.level2List.map((v, j) => {
                                                    return (
                                                        <li key={j} style={{ margin: '0' }} onClick={this.goPinglun.bind(this, e, 2)}>
                                                            <p style={{ textIndent: '0', color: '#7E7E7E', wordBreak: 'break-all', fontFamily: fontFamily, display: j > 2 && !e.leve2More ? 'none' : 'block' }}>
                                                                {v.commenterName}
                                                                {v.blockRole && v.blockRole.articleRoleCode === 3
                                                                    ? '（版主）'
                                                                    : (v.threadStarter ? '（楼主）' : '')}
                                                                {v.commenterToName != e.commenterName ? ' 回复 ' + v.commenterToName : ''}
                                                                {'：' + v.commentContent}
                                                            </p>
                                                        </li>
                                                    )
                                                })}

                                                <p
                                                    onClick={this.goPinglun.bind(this, e)}
                                                    style={{ display: e.leve2More || e.level2List.length <= 3 ? 'none' : 'block', fontFamily: fontFamily, textAlign: 'right' ,color:'#353535'}}>
                                                    {/* // onClick={this.moreLeve.bind(this, i)}> */}
                                                    更多评论>>
                                                </p>
                                            </ul></div>
                                        )
                                        : ""

                                    }

                                    <p key={i} style={{ display: 'inline-block', width: '100%', lineHeight: '180%', paddingLeft: 48, paddingTop: 10, paddingBottom: 10, fontFamily: fontFamily, position: 'relative' }}>
                                        <span style={{ verticalAlign: 'middle', fontSize: 12,color:'#9B9B9B' }}>
                                            {Utils.dateName(e.createTime)}
                                        </span>
                                        <div style={{ width: 200, overflow: 'hidden', position: 'absolute', height: 30, right: 36, top: 10 }}>
                                            <div style={{ width: 200, overflow: 'hidden', height: '30px', position: 'relative' }}>
                                                {/* <ppp className={e.More ? 'addMore' : 'removeMore'}
                                                    style={{ fontFamily: fontFamily, verticalAlign: 'middle', height: 30, overflow: 'hidden', position:'absolute',}}>
                                                    <span onClick={this.goPinglun.bind(this, e)}
                                                        style={{ padding: '0 .3rem', verticalAlign: 'middle', borderRight: '0.5px solid #EBEBEB' }}>
                                                        回复
                                                    </span>
                                                    <span onClick={this.autding.bind(this, e)}
                                                        style={{ padding: '0 .3rem', verticalAlign: 'middle', color: '#F1C34E', borderRight: '0.5px   solid #EBEBEB' }}>
                                                        举报
                                                    </span>
                                                    <span onClick={this.remove.bind(this, e)}
                                                        style={{ padding: '0 .3rem', verticalAlign: 'middle', color: '#E27E41' }}>
                                                        删除
                                                    </span>
                                                </ppp> */}
                                            </div>
                                        </div>
                                        <pp style={{ verticalAlign: "middle", height: 30, display: e.More ? 'none' : 'block', background: 'white', position: 'absolute', right: 0, top: 12 }} onClick={this.praised.bind(this, i)} >
                                            <span style={{ float: 'right', fontFamily: fontFamily ,color:'#999'}}>{e.praiseCount}</span>
                                            <span style={{ float: 'right', width: '14px', marginRight: '5px' }}>
                                                <img style={{ width: '100%' }} src={require(e.isPraised ? './images/Fabulous Selected@2x.png' : './images/Fabulous default@2x.png')} />
                                            </span>
                                        </pp>


                                        {/* <span onClick={this.toggleMore.bind(this, i, 'data')} style={{ float: 'right' }}>
                                            <img style={{  marginLeft: 10 ,width:20}} src={require('./images/more@2x.png')} />
                                        </span> */}
                                    </p>

                                </li>
                            )
                        })
                        : <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <img style={{ width: '1.8rem', marginRight: '.5rem' }} src={require('./images/noComment.png')} />
                            <span>还没有人评论，快来抢沙发~</span>
                        </div>}
                </ul>


                {isLastPage
                    ? ''
                    : <div style={{ display: downLoading ? 'block' : 'none', textAlign: 'center' }}>
                        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        <span>正在拼命加载……</span>
                    </div>}


                {isLastPage && data.length
                    ? <div style={{ textAlign: 'center', padding: '.4rem', marginTop: '.5px solid #ccc' }}>没有更多评论了，一起加入评论吧~</div>
                    : ''}
            </div>


        )
    }
}

export default View;