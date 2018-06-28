/**
 * 自定义富文本预览
 * @type {Component}
 */

import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import  './Preview.scss'
import {DMCUtil} from '../../utils/DMCUtil'

class Preview extends Component {

    constructor(Props){
        super(Props)
    }

    static propTypes = {
        contentAsHtml:PropTypes.string,
    }

    display = (target) => {
        const { contentAsHtml } = this.props
        console.log('contentAsHtml==',contentAsHtml)
    }

    render(){
        return(
            <div className={'preview-wrapper'}>
                <div className={'preview-opt-wrapper'} onClick={this.display.bind(this,event)}>
                    <div className={'preview-button'}><i className={'iconfont'}>&#xe7c1;</i></div>
                </div>

                <div id='modalID' className={'modal'}>
                    <div className={'modal-container'}>
                    
                    </div>
                </div>

            </div>
        )
    }

}

export default Preview