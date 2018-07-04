/**
 *新建试驾单
 */

import React from 'react';
//import Layout from '../../components/Layout';
import Http from '../../utils/http';
//import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import addSheet from './style/drive.add.scss';
const title = '新建试驾单';

const apis = [
  {"id":"driverInfo","url":"dealer/api/v1/driverInfo"},
];

Http.setDomainUrl("/wx/ent/api/");

Http.setMutiApi(apis);
let data = [];
let mockData = JSON.parse('{"resultCode":1,"data":{"pageNum":1,"pageSize":10,"size":10,"orderBy":null,"startRow":1,"endRow":10,"total":130,"pages":13,"list":[{"driveId":1719,"sex":null,"userName":"飒飒飒飒","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"飒飒飒飒","carType":1,"carCode":"GMC6440E","applyTimeType":null,"applyTime":"2020-07-08 17:18:00","tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"浙C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 15:14:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":"林肯MKC","statusName":"已取消","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1718,"sex":null,"userName":"穆克拉","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"是飒飒啊啊啊啊啊啊啊啊是","carType":1,"carCode":null,"applyTimeType":null,"applyTime":"2018-02-08 14:30:00","tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"皖R8A21X","appreciationEngineer":"17","counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131008,"createDate":"2018-02-05 14:14:50","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":null,"statusName":"已试驾","managerName":"陆丹丹","couselorName":null,"appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1716,"sex":null,"userName":"4AM","userPhone":"13512148624","proviceCode":"430000","cityCode":"4302","address":"111111ssssssssss撒飒飒 ","carType":1,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"皖R8A21X","appreciationEngineer":"17","counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131008,"createDate":"2018-02-05 11:21:42","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"株洲市","appellation":"先生","carName":null,"statusName":"已试驾","managerName":"陆丹丹","couselorName":null,"appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日下午","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1715,"sex":null,"userName":"oppo","userPhone":"13512148624","proviceCode":"430000","cityCode":"4309","address":"wwww我问问","carType":1,"carCode":"GMC6440E","applyTimeType":null,"applyTime":"2020-07-08 19:04:00","tags":null,"remark":null,"dispatchObject":"HY001","manager":"39980","licenseNo":"沪A12345","appreciationEngineer":"7","counselor":"71","driveStartTime":null,"driveEndTime":null,"status":10131009,"createDate":"2018-02-05 10:36:10","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"衡阳虚拟中心","regionName":"益阳市","appellation":"先生","carName":"林肯MKC","statusName":"已反馈","managerName":"陈建峰","couselorName":"岳阳首席顾问","appreciationEngineerName":"鉴赏工程师A","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1714,"sex":null,"userName":"2222","userPhone":"13345667890","proviceCode":"430000","cityCode":"4302","address":"2222","carType":1,"carCode":"GMC6440E","applyTimeType":null,"applyTime":"2018-02-05 15:40:00","tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"浙C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131009,"createDate":"2018-02-05 10:33:58","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"株洲市","appellation":"先生","carName":"林肯MKC","statusName":"已反馈","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1713,"sex":null,"userName":"wwwww","userPhone":"13376228901","proviceCode":"430000","cityCode":"4305","address":"111111","carType":1,"carCode":null,"applyTimeType":null,"applyTime":"2018-02-08 10:33:00","tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:33:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"邵阳市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1712,"sex":null,"userName":"mmm","userPhone":"13512148624","proviceCode":"430000","cityCode":"4306","address":"ssssssssssssssssssssssssssssssssss","carType":1,"carCode":"GMC6440B","applyTimeType":null,"applyTime":"2018-02-05 16:01:00","tags":null,"remark":null,"dispatchObject":"CD001","manager":"63","licenseNo":"冀J1N87X","appreciationEngineer":"27","counselor":"6","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 10:33:09","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"常德虚拟中心","regionName":"岳阳市","appellation":"先生","carName":"林肯NAVIGATOR","statusName":"已取消","managerName":"常德虚拟中心经理","couselorName":"首席顾问A","appreciationEngineerName":"鉴赏工程师C","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1709,"sex":null,"userName":"ww","userPhone":"13156671556","proviceCode":"430000","cityCode":"4302","address":"ww","carType":0,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:31:25","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"株洲市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日上午","carTypeName":"不限","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1707,"sex":null,"userName":"1111","userPhone":"13345667865","proviceCode":"430000","cityCode":"4303","address":"111","carType":1,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:23:44","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"湘潭市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日上午","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1706,"sex":null,"userName":"mjy","userPhone":"13512148624","proviceCode":"430000","cityCode":"4307","address":"sssssss","carType":1,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:17:01","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"常德市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日上午","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null}],"firstPage":1,"prePage":0,"nextPage":2,"lastPage":8,"isFirstPage":true,"isLastPage":false,"hasPreviousPage":false,"hasNextPage":true,"navigatePages":8,"navigatepageNums":[1,2,3,4,5,6,7,8]},"errMsg":"","time":"2018-05-28 15:55:36","success":true,"elapsedMilliseconds":0}');


class DriveAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailInfo:{

      }
    };
  }

  componentDidMount() {
  
  }


  btnAction(_name){
    console.log(_name);
    window.location.href = `./drive/${_name}`;
  }

 
  render() {
    const that = this;
    function getData(){
      Http.get('driverInfo',function(data){
        that.state['detailInfo'] = Object.assign({},data);
      })
    }
   
    return (
      <div className={addSheet.wrap}>
            <div className={addSheet['form']}>
            <div className={addSheet['header']}>
              <span>{this.state.detailInfo['applyTime']}</span>
              <span className={addSheet['status']}>{this.state.detailInfo['statusName']}</span>
            
            </div>
          <div className={addSheet['content']}>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>NO：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['driveId']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>试驾车型：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['carCode']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>试驾地址：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['address']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>预约人：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['userName']}</div>
            </div>

            <div className={addSheet['row']}>
              <div className={addSheet['rt']}>联系电话：</div>
              <div className={addSheet['rc']}>{this.state.detailInfo['userPhone']}</div>
              <div className={addSheet['toolbox']}>
                <button type="button" className={addSheet['btn-primary']} onClick={this.btnAction.bind(this,'detail')}>详情</button>
              </div>
            </div>

          </div>
        </div>
      </div>

    );
  }
 
}



export default DriveAdd;
