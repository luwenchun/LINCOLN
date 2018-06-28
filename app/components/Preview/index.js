import React, { Component } from 'react';
import './index.scss'
import { Form, Button, Row, Col, Modal, Select } from 'antd';

const Option = Select.Option;

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
            data: this.props.data || {},
            style: {
                width: '320px',
                height: '480px'
            }
        }
        console.log("=======&&&&", this.props.data)
    }

    selectDrive(i) {
        const { drives } = { ...this.state }
        this.setState({
            current: drives[i],
            style: {
                width: drives[i]['X'] + 'px',
                height: drives[i]['Y'] + 'px',
            }
        })
    }

    render() {
        const { drives, current, data, style } = { ...this.state }
        return (
            <div style={{ background: '#FAFAFA', paddingBottom: '10px' }}>
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
                <div className="feto" style={style}>
                    <div className="tit">
                        {data.titleImage
                            ? <img alt="背景图片" src={data.titleImage} />
                            : ""}
                    </div>
                    <ul>
                        <li>
                            <h2>{data.title}</h2>
                        </li>
                        <li>
                            <div>
                                <img alt="用户头像" src={require('./api/template/img/user2@3x.png')} />
                            </div>
                            <div>
                                <span className="mas">{data.releaseNumber}</span>
                                <span className="mass masd">
                                    <img alt="眼睛" src={require('./api/template/img/eye.png')} />
                                </span>
                                <span className="times">1.5万</span>
                                <span>1小时前</span>
                            </div>
                            <div>
                                <img alt="加号" src={require('./api/template/img/add.png')} />
                                <span>关注</span>
                            </div>
                        </li>
                        <li className="newsSummary">
                            <img alt="圈圈" src={require('./api/template/img/Oval 2@3x.png')} />
                            <div dangerouslySetInnerHTML={{ __html: data.newsSummary }}></div>
                        </li>
                        <li className="rcontent" dangerouslySetInnerHTML={{ __html: data.content }}>
                        </li>
                    </ul>
                </div>
            </div>


        )
    }
}

export default View;