/**
 * 试驾预约评价
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http'
import FeebackRank from './components/feeback.rank';
import Helper from '../../utils/helper';
import './style/drive.feedback.scss';
import Ui from '../../utils/weixin';
import {SERVER_BASE_PATH} from '../../global.config';

const title = '试驾预约评价';
const apis = [
  { "id": "driverInfo", "url": "/dealer/api/v1/driverInfo", format: false },
  { "id": "feedBackList", "url": "/dealer/api/v1/feedBackList" },
  { "id": "driveComment", "url": "/dealer/api/v1/driveEvaluation", format: false },
  { "id": "driveEvalList", "url": "/dealer/api/v1/getEvaluationItem", format: false },
];

Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

let _this;

class CDriveFeedback extends React.Component {
  constructor(props) {
    super(props);
    let params = Helper.getUrlParams();
    this.state = {
        driveType: decodeURIComponent(params['type']) || '',
        driveId: params['id'] || '',
        driveEvaluation: []
    };
    this.init();
    _this = this;
  }

  init() {
    Http.get('driveEvalList', {}, (res) => {
        if (res && res.data) {
            this.setState({
                driveEvaluation: res.data
            });
        }
    });
  }

  componentDidMount() {

  }


  subComment() {
     /*  let serviceFeedbacks = Helper.getData('feedback_rank', true),
          params = {
             s1: serviceFeedbacks['f1'],
             s2: serviceFeedbacks['f2'],
             s3: serviceFeedbacks['f3'],
             s4: serviceFeedbacks['f4'],
             suggestion: document.querySelector('textarea[name="desc"]').value
          }; */
          let serviceFeedbacks = Helper.getData('feedback_rank', true),
              params = [];

          _this.state.driveEvaluation.forEach((v) => {
             v.itemList.forEach((item) => {
                 let el, p;
                 el = document.querySelector('textarea[name="desc' + item.id + '"]');
                 p = {
                    driveId: _this.state.driveId,
                    itemId: item.id,
                    evaluationType: item.evaluationMethod,
                    evaluationResult: item.evaluationMethod === 1 ? 
                        serviceFeedbacks['f' + item.id] || 0 :
                        el ? el.value : ''
                 };
                 params.push(p);
             });
          });
          Helper.clear('feedback_rank'); 

      Http.post('driveComment', params, (res) => {
        if (res && res.data) {
            Ui.toast(res.data.errorMsg);
            setTimeout(() => {
                document.location.href = '/wchat/cdriveList';
            }, 1500);
        } else {
            Ui.toast('预约评价提交失败');
        }
      });

  }


  render() {
    const that = this;
    const info = this.state.driverInfo;
    const fList = this.state.feedBackList;

    let liItem = function(props) {
        let item = null;

        if (props.evaluationMethod == 2) {
            item = <div className={'cdrive-bottom-text'}>
                      <h5>{props.evaluationItem}</h5> 
                      <textarea name={"desc" + props.id}></textarea>
                   </div>;
        } else {
            item = <div className={'cdrive-ev-item'}>
                    {props.evaluationItem}
                    <div className={"mui-badge"}>
                        <FeebackRank id={"f" + props.id}/> 
                    </div>
                </div>;
        }

        return (
            <li className={'mui-table-view-cell'} key={props.id}>
                {item}
            </li> 
        );
    }

    let FeedbackItems = function(props) {
        let title = <span className={'title'}>{that.state.driveType}</span>;
        let num = Math.floor(Math.random() * 10000);

        if (props.evaluationType !== '试驾车型') {
            title = '';
        }

        return (
            <div className={"mui-card"} key={"feed" + num}>
                {props.evaluationType === '无' ? ('') : (<div className={"mui-card-header"}>{props.evaluationType}{title}</div>)}
                
                <div className={"mui-card-content"}>
                    <div className={"mui-card-content-inner"}>
                        <ul className={'mui-table-view'}>
                            {
                                props.itemList.map((val, index) => {
                                    return (
                                        liItem(val)
                                    );
                                })
                            }
                        </ul>   
                    </div>
                </div>
            </div>
        );
    }

    return (
       <div className={'mui-content cdrive-feedback'}>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content="{title}" />
            </Helmet>
          {
              this.state.driveEvaluation.map((item, i) => {
                 return (
                    FeedbackItems(item)
                 );
              })
          }  

          {/* <div className={"mui-card"}>
            <div className={"mui-card-header"}>试驾车型<span className={'title'}>{this.state.driveType}</span></div>
            <div className={"mui-card-content"}>
              <div className={"mui-card-content-inner"}>
                 <ul className={'mui-table-view'}>
                    <li className={'mui-table-view-cell'}>
                       服务体验
                       <div className={"mui-badge"}>
                          <FeebackRank id="f1"/> 
                       </div>
                    </li>
                    <li className={'mui-table-view-cell'}>
                       车辆状态
                       <div className={"mui-badge"}>
                          <FeebackRank id="f2"/> 
                       </div>
                    </li>
                 </ul>   
              </div>
            </div>
          </div>
          <div className={"mui-card"}>
            <div className={"mui-card-header"}>销售顾问/鉴赏工程师</div>
            <div className={"mui-card-content"}>
              <div className={"mui-card-content-inner"}>
                 <ul className={'mui-table-view'}>
                    <li className={'mui-table-view-cell'}>
                       专业度
                       <div className={"mui-badge"}>
                          <FeebackRank id="f3"/> 
                       </div>
                    </li>
                    <li className={'mui-table-view-cell'}>
                       服务态度
                       <div className={"mui-badge"}>
                          <FeebackRank id="f4"/> 
                       </div>
                    </li>
                 </ul>   
              </div>
            </div>
          </div> 
          <div className={'cdrive-bottom-text'}>
               <h5>意见建议</h5> 
               <textarea name="desc"></textarea>
               <button className={'mui-btn mui-btn-primary mui-btn-block'} onClick={this.subComment}>提交评价</button>
          </div> */}
          <div className={'cdrive-feedback-btn'}>
             <button className={'mui-btn mui-btn-primary mui-btn-block'} onClick={this.subComment}>提交评价</button>
          </div>    
       </div>
    );
  }

}

export default CDriveFeedback;
