/**
 *试驾预约列表
 */

import React from 'react';
import './style/drive.list.scss';
//import Layout from '../../components/Layout';
import { ListView } from 'antd-mobile';
import Http from '../../utils/http';
//import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SERVER_BASE_PATH} from '../../global.config';
//import DLSheet from './style/drive.list.scss';
import { setTimeout } from 'timers';
const title = '试驾预约列表';

const apis = [
  { "id": "managerList", "url": "/dealer/api/v1/list" },
];

// Http.setDomainUrl("http://121.196.193.149:9020/");
Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);
let data = [];
let mockData = JSON.parse('{"resultCode":1,"data":{"pageNum":1,"pageSize":10,"size":10,"orderBy":null,"startRow":1,"endRow":10,"total":130,"pages":13,"list":[{"driveId":1719,"sex":null,"userName":"飒飒飒飒","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"飒飒飒飒","carType":1,"carCode":"GMC6440E","applyTimeType":null,"applyTime":"2020-07-08 17:18:00","tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"浙C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 15:14:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":"林肯MKC","statusName":"已取消","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1718,"sex":null,"userName":"穆克拉","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"是飒飒啊啊啊啊啊啊啊啊是","carType":1,"carCode":null,"applyTimeType":null,"applyTime":"2018-02-08 14:30:00","tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"皖R8A21X","appreciationEngineer":"17","counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131008,"createDate":"2018-02-05 14:14:50","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":null,"statusName":"已试驾","managerName":"陆丹丹","couselorName":null,"appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1716,"sex":null,"userName":"4AM","userPhone":"13512148624","proviceCode":"430000","cityCode":"4302","address":"111111ssssssssss撒飒飒 ","carType":1,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"皖R8A21X","appreciationEngineer":"17","counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131008,"createDate":"2018-02-05 11:21:42","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"株洲市","appellation":"先生","carName":null,"statusName":"已试驾","managerName":"陆丹丹","couselorName":null,"appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日下午","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1715,"sex":null,"userName":"oppo","userPhone":"13512148624","proviceCode":"430000","cityCode":"4309","address":"wwww我问问","carType":1,"carCode":"GMC6440E","applyTimeType":null,"applyTime":"2020-07-08 19:04:00","tags":null,"remark":null,"dispatchObject":"HY001","manager":"39980","licenseNo":"沪A12345","appreciationEngineer":"7","counselor":"71","driveStartTime":null,"driveEndTime":null,"status":10131009,"createDate":"2018-02-05 10:36:10","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"衡阳虚拟中心","regionName":"益阳市","appellation":"先生","carName":"林肯MKC","statusName":"已反馈","managerName":"陈建峰","couselorName":"岳阳首席顾问","appreciationEngineerName":"鉴赏工程师A","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1714,"sex":null,"userName":"2222","userPhone":"13345667890","proviceCode":"430000","cityCode":"4302","address":"2222","carType":1,"carCode":"GMC6440E","applyTimeType":null,"applyTime":"2018-02-05 15:40:00","tags":null,"remark":null,"dispatchObject":"CS001","manager":"39986","licenseNo":"浙C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131009,"createDate":"2018-02-05 10:33:58","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"株洲市","appellation":"先生","carName":"林肯MKC","statusName":"已反馈","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1713,"sex":null,"userName":"wwwww","userPhone":"13376228901","proviceCode":"430000","cityCode":"4305","address":"111111","carType":1,"carCode":null,"applyTimeType":null,"applyTime":"2018-02-08 10:33:00","tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:33:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"邵阳市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1712,"sex":null,"userName":"mmm","userPhone":"13512148624","proviceCode":"430000","cityCode":"4306","address":"ssssssssssssssssssssssssssssssssss","carType":1,"carCode":"GMC6440B","applyTimeType":null,"applyTime":"2018-02-05 16:01:00","tags":null,"remark":null,"dispatchObject":"CD001","manager":"63","licenseNo":"冀J1N87X","appreciationEngineer":"27","counselor":"6","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 10:33:09","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"常德虚拟中心","regionName":"岳阳市","appellation":"先生","carName":"林肯NAVIGATOR","statusName":"已取消","managerName":"常德虚拟中心经理","couselorName":"首席顾问A","appreciationEngineerName":"鉴赏工程师C","engineerPhone":null,"color":null,"remind":null,"applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1709,"sex":null,"userName":"ww","userPhone":"13156671556","proviceCode":"430000","cityCode":"4302","address":"ww","carType":0,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:31:25","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"株洲市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日上午","carTypeName":"不限","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1707,"sex":null,"userName":"1111","userPhone":"13345667865","proviceCode":"430000","cityCode":"4303","address":"111","carType":1,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:23:44","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"湘潭市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日上午","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null},{"driveId":1706,"sex":null,"userName":"mjy","userPhone":"13512148624","proviceCode":"430000","cityCode":"4307","address":"sssssss","carType":1,"carCode":null,"applyTimeType":null,"applyTime":null,"tags":null,"remark":null,"dispatchObject":null,"manager":null,"licenseNo":null,"appreciationEngineer":null,"counselor":null,"driveStartTime":null,"driveEndTime":null,"status":10131001,"createDate":"2018-02-05 10:17:01","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":null,"regionName":"常德市","appellation":"先生","carName":null,"statusName":"待接单","managerName":null,"couselorName":null,"appreciationEngineerName":null,"engineerPhone":null,"color":null,"remind":null,"applyTimeName":"工作日上午","carTypeName":"SUV","couselorPhone":null,"proviceName":"湖南省","tagsName":null,"key":null}],"firstPage":1,"prePage":0,"nextPage":2,"lastPage":8,"isFirstPage":true,"isLastPage":false,"hasPreviousPage":false,"hasNextPage":true,"navigatePages":8,"navigatepageNums":[1,2,3,4,5,6,7,8]},"errMsg":"","time":"2018-05-28 15:55:36","success":true,"elapsedMilliseconds":0}');

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>todo1</span>
      {props.children}
    </div>
  );
}



let NUM_ROWS = 1;
let pageIndex = 0;
let pageNum = 1;
let isLastPage = false;
let isScroll = false;
function genData(pIndex = 0) {
  // debugger;
  const dataBlob = {};
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = (pIndex * 10) + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }

  return dataBlob;
}


class DriveList extends React.Component {
  constructor(props) {
    super(props);
    console.log('props====', props['user']);
    const userInfo = Object.assign({}, props['user']);
    console.log('userInfo====', userInfo);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: '100%',
      params: {
        pageNum: pageNum,
        pageSize: 10,
        userId: '',
        phone: ''
      }
    };

    this.state['params']['userId'] = userInfo['userid'] || 'top317061';
    this.state['params']['phone'] = userInfo['mobile'] || '13120508831';
    console.log('params====', this.state['params']);

  }

  componentDidMount() {

    const that = this;

    console.log('试驾列表传递参数=====', that.state['params']);
    var _data = mockData.data;
    //Http.get('managerList', that.state['params'], function (_data) {
      NUM_ROWS = _data['list'].length;
      data = _data['list'];
      isLastPage = _data['isLastPage']; 
      that.rData = genData();
      that.setState({
        dataSource: that.state.dataSource.cloneWithRows(that.rData),
        isLoading: false,
        hasMore: !isLastPage,
        params: Object.assign(that.state.params, { pageNum: ++pageNum })
      });
    //})

  }

  onEndReached = (event) => {
    const that = this;
    if (isScroll && isLastPage) {
      isScroll = false;
      clearTimeout(ttmout);
      return !1;
    }
 
    that.setState({ isLoading: true });
    const ttmout = setTimeout(() => {
      console.log('试驾列表滚动时传递参数=====', that.state['params']);
      Http.get('managerList', that.state['params'], function (_data) {
        console.log(_data['list']);
        isLastPage = _data['isLastPage'];
        data = _data['list'];
        NUM_ROWS = _data['list'].length;
        ++pageIndex;
        that.rData = { ...that.rData, ...genData(pageIndex) };
        that.setState({
          dataSource: that.state.dataSource.cloneWithRows(that.rData),
          isLoading: false,
          hasMore: !isLastPage,
          params: Object.assign(that.state.params, { pageNum: ++pageNum })
        }, () => { isScroll = true });
      })
    }, 500)



  }

  btnAction(currentItem) {
    const fullUrls = {
      10131001: 'dispatch',
      10131002: 'receipt',
      10131003: 'confirm',
      10131004: 'todo',
      10131005: 'startoff',
      10131006: 'doing',
      10131007: 'done',
      10131008: 'cancel',
      10131009: 'feedback',
      20000000: 'resources',
    }
    let code = currentItem['status'];
    const requireInfo = {
      userId: this.state['params']['userId'],
      mobile: this.state['params']['phone'],
      driveId: currentItem['driveId'],
      carCode: currentItem['carCode']
    }
    console.log('跳转不同详情====', requireInfo);
    //window.location.href = `/saicui/driveDetail/${fullUrls[code]}${Http.transGetParams(requireInfo)}`;
    window.location.href = `/saicui/driveDetail/${Http.transGetParams(requireInfo)}`;
  }



  render() {
    const separator = (sectionID, rowID) => (
      <div className={'separator'} key={`${sectionID}-${rowID}`} />
    );
    let index = 0, ind = 0;

    const row = (rowData, sectionID, rowID) => {
      const obj = data[ind];
      if (index == data.length - 1) {
        index = data.length - 1;
      } else {
        ind = ++index;
      }

      return (
        <div className={'form'} key={rowID}>
          <div className={'header'}>
            <span>{obj['applyTime']}</span>
            <span className={'status'}>{obj['statusName']}</span>

          </div>
          <div className={'content'}>

            <div className={'row'}>
              <div className={'rt'}>NO：</div>
              <div className={'rc'}>{obj['driveId']}</div>
            </div>

            <div className={'row'}>
              <div className={'rt'}>预约时间：</div>
              <div className={'rc'}>{obj['applyTimeName'] ? obj['applyTimeName'] : ''}{obj['applyTimeName'] && obj['applyTime'] ? ' , ' : ''}{obj['applyTime'] ? obj['applyTime'] : ''}</div>
            </div>

            <div className={'row'}>
              <div className={'rt'}>试驾车型：</div>
              <div className={'rc'}>{obj['carTypeName'] ? obj['carTypeName'] : ''}{obj['carTypeName'] && obj['carName'] ? ' , ' : ''}{obj['carName'] ? obj['carName'] : ''}</div>
            </div>

            <div className={'row'}>
              <div className={'rt'}>试驾地址：</div>
              <div className={'rc'}>{(obj['proviceName']?obj['proviceName']:'')+(obj['regionName']?obj['regionName']:'')+(obj['address']?obj['address']:'')}</div>
            </div>

            <div className={'row'}>
              <div className={'rt'}>预约人：</div>
              <div className={'rc'}>{obj['userName'] + ` , ${obj['appellation'] ? obj['appellation'] : '女士'}`}</div>
            </div>

            <div className={'row'}>
              <div className={'rt'}>联系电话：</div>
              <div className={'rc'}>{obj['userPhone']}</div>
              <div className={'toolbox'}>
                <button type="button" className={'btn-primary'} onClick={this.btnAction.bind(this, obj)}>详情</button>
              </div>
            </div>

          </div>
        </div>
      );
    }; 
    return (
      <div className={'wrap'}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? '拼命加载中...' : ''}
          </div>)}
          renderBodyComponent={() => <MyBody />}
          renderRow={row}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={10}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          scrollEventThrottle={1000}
          onEndReachedThreshold={10}
        />
      </div>

    );
  }

}

// const DriveListComp = withStyles(DLSheet)(DriveList);

// function action({ path, query, hash }) {
//   const userInfo = query;
//   console.log('auth传入参数====', userInfo);
//   return {
//     chunks: ['drive.list'],
//     title,
//     component: (
//       <Layout hide={true}>
//         <DriveListComp user={userInfo} />
//       </Layout>
//     ),
//   };
// }

export default DriveList;
