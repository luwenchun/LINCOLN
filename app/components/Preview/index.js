import React, { Component } from 'react';
import { Modal, Select } from 'antd';
import './index.scss'
import Default from './defaultTemp';
import NewsImg from './newsImgTemp';
import NewsVedio from './newsVedioTemp';
import Forum from './forumTemp';
import Commit from './commitTemp';
import Activity from './activityTemp';
import Http from '../../utils/http';
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../global.config';
const Option = Select.Option;


const apis = [
    // { "id": "queryDetailNews", "url": "community/news/queryDetailNews", "format": false },
    { "id": "queryDetailArticle", "url": "community/article/queryDetailArticle" },
    { "id": "queryDetailNews", "url": "community/news/queryDetailNews" },
    { "id": "saicActivity", "url": "community/saicActivity" },
    { "id": "queryCommentList", "url": "community/comment/queryCommentList" },      //  查看评论
];
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drives: [
                { Name: 'iPhone4', X: 320, Y: 480 },
                { Name: 'GalaxyS5', X: 360, Y: 640 },
                { Name: 'iPhone5/SE', X: 320, Y: 568 },
                { Name: 'iPhone6/7/8', X: 375, Y: 667 },
                { Name: 'iPhone6/7/8 Plus', X: 414, Y: 736 },
                { Name: 'iPhoneX', X: 375, Y: 812 },
            ],
            current: { Name: 'iPhone4', X: 320, Y: 480 },
            data: {},
            type: '',
            style: {
                width: '320px',
                height: '480px',
                margin: '0 auto',
                background: 'white',
                position: 'relative',
                overflowX: 'hidden'
            }
        }
    }

    selectDrive(i) {
        const { drives, style } = { ...this.state }
        this.setState({
            current: drives[i],
            style: {
                ...style,
                height: drives[i]['Y'] + 'px',
                width: drives[i]['X'] + 'px',
            }
        })
    }

    componentWillMount() {
        if (!this.state.data) {
            const id = Http.getQueryValue('id');
            const type = Http.getQueryValue('type');
            let url = '', query = {};
            if (type == 'Forum') {    // 帖子详情
                url = 'queryDetailArticle';
                query['id'] = id;
            } else if (type == 'Commit') {   // 评论
                url = 'queryCommentList';
                query['businessId'] = id;
                query['businessType'] = 1004;
                query['limit'] = 10;
                query['page'] = 1;
            } else if (type == 'Activity') {   // 活动详情
                url = 'saicActivity';
                query['id'] = id;
            } else {      // 资讯详情
                url = 'queryDetailNews';
                query['saicActivityId'] = id;
            }
            Http.get(url, query, data => {
                if (data) {
                    this.setState({ data, type });
                }
            })
        } else {
            this.setState({ data: this.props.data, type: this.props.type });
        }
    }



    render() {
        const { drives, current, style, type, data } = { ...this.state };
        console.log('nextProps.type===========', JSON.stringify(type))
        console.log('nextProps.data===========', JSON.stringify(data))
        return (
            <div className='phoneDr' style={{ background: '#FAFAFA', paddingBottom: '10px' }}>
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <Select defaultValue={current.Name} onChange={this.selectDrive.bind(this)}>
                        {drives.map((e, i) => {
                            return (<Option value={i} key={i}>{e.Name}</Option>)
                        })}
                    </Select>
                    <span style={{ padding: "5px", border: ".5px solid #ccc", margin: "0 10px 0 20px" }}>{current.X}</span>
                    <span>X</span>
                    <span style={{ padding: "5px", border: ".5px solid #ccc", margin: "0 10px 0 10px" }}>{current.Y}</span>
                </div>
                <div style={style}>
                    {type == 'Default' ? <Default data={data} style={style} /> : ''}
                    {type == 'NewsImg' ? <NewsImg data={data} style={style} /> : ''}
                    {type == 'NewsVedio' ? <NewsVedio data={data} style={style} /> : ''}
                    {type == 'Forum' ? <Forum data={data} style={style} /> : ''}
                    {type == 'Commit' ? <Commit data={data} /> : ''}
                    {type == 'Activity' ? <Activity id={data} /> : ''}
                </div>

            </div>


        )
    }
}

export default View;