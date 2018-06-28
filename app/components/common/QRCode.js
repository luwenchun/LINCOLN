import QRCode from 'qrcode';
import React from 'react';
import DMCUtil from '../../utils/DMCUtil'
import { Button, Row, Col } from 'antd';
import { SERVER_BASE_PATH } from '../../global.config'

class ActEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            htmlStr: ''
        }
    }

    /**
 * @description 通过URL生成二维码
 */
    genQRCodeWithUrl = (url) => {
        const _this = this;
        const objStr = `{"TYPE":"2","URL":"${SERVER_BASE_PATH}/${url} "}`
        const objAsStr = JSON.stringify(objStr)

        return (async () => {
            console.log(objStr,'====objStr=====')
            let str = await QRCode.toString(url ? objStr : 'http://www.baidu.com')
            
            _this.setState({ htmlStr: str })
            return str
        })()

    }

    componentDidMount() {
        this.genQRCodeWithUrl()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.URL && nextProps.URL.length) {
            this.genQRCodeWithUrl(nextProps.URL)
        }
    }

    render() {

        return (
            <div style={{ display:this.props.show ?'block':'none', position: 'fixed', zIndex: 999, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.6)' }}>
                <div style={{ width: '30%', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: 'white' }}>
                    <div dangerouslySetInnerHTML={{ __html: this.state.htmlStr }}></div>
                    <div style={{ textAlign: 'center', padding: '0 0 30px 0' }}>
                        <Button type="default" htmlType="button" style={{ marginRight: '20px' }} onClick={() => { this.props.OK(true) }}>取消</Button>
                        <Button type="primary" htmlType="button" onClick={() => { this.props.OK(true) }}>确定</Button>
                    </div>
                </div>
            </div>
        )
    }

}


export default ActEdit;