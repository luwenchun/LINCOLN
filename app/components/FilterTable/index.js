
import React from 'react';
import { Checkbox, Row, Col, Button, Icon } from 'antd'
import'./index.scss';

let plainOptions = [];

class FilterTable extends React.Component {
  state = {
    show: false,
    mockData: [],
    checkedList: [],
    switch: true,
    checkAll: false,
    indeterminate: true,
  }
  componentDidMount() {
  }


  onChange(checkedList) {
    const plainOptions = [...this.state.checkedList]
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }


  onCheckAllChange(e) {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }



  componentWillReceiveProps(nextProps) {
    if (this.state.switch && nextProps.columns) {
      const checkedList = [];
      nextProps.columns.map((e, i) => {
        checkedList.push(e.key);
      })
      this.setState({
        mockData: [...nextProps.columns],
        checkedList,
        switch: false
      })
      plainOptions = checkedList;
    }
  }

  shadeClick() {
    const { checkedList } = { ...this.state };
    const mockData = [...this.state.mockData];
    let width = 0;
    this.setState({ show: false });
    for (let i = 0, e; (e = mockData[i]) != undefined; i++) {
      let filter = true;
      for (let j = 0, f; (f = checkedList[j]) != undefined; j++) {
        e.key === f ? filter = false : !1;
      }
      if (filter) {
        mockData[i].width ? width += mockData[i].width : !1;
        mockData.splice(i, 1);
        --i;
      }
    }
    this.props.onChange(mockData, width);
  }

  render() {
    const { mockData, checkedList, show } = { ...this.state }
    return (
      <div className='filterTable'>
        <div style={{ textAlign: 'right' }}>
          <Button type="default" shape="circle"
            onClick={() => { this.setState({ show: !show }) }}>
            <Icon type="appstore" />
          </Button>
        </div>
        <div className='shade' style={{ display: show ? 'block' : 'none' }} onClick={this.shadeClick.bind(this)}></div>
        <div className='grounp' style={{ display: show && mockData.length ? 'block' : 'none' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange.bind(this)}
            checked={this.state.checkAll}
          >
            反/全选
          </Checkbox>
          <Checkbox.Group
            value={checkedList}
            onChange={this.onChange.bind(this)}>
            {mockData.map((e, i) => (
              <Row span={24} key={i} style={{ width: '100%' }}>
                <Checkbox value={e.key} disabled={mockData[i + 1] == undefined}>{e.title}</Checkbox>
              </Row>
            ))}
          </Checkbox.Group>
        </div>

      </div>
    );
  }
}

export default FilterTable;
