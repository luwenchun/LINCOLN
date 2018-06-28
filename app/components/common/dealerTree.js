import React from 'react';
import { TreeSelect } from 'antd';
import Http from '../../utils/http';
import Divider from 'antd/lib/divider';
import DMCUtil from '../../utils/DMCUtil'
import { SERVER_BASE_PATH } from '../../global.config'

const TreeNode = TreeSelect.TreeNode;

const apis = [
    { "id": "dealerList", "url": "/material/mediaList"},
];

const Authorization = DMCUtil.getJWTFromCookie()
Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);
Http.setRequestHeader(Authorization)

class Tree extends React.Component {
    state = {
        value: undefined,
        dealerList: [],
    }
    onChange = (value, label, extra) => {
        console.log(value, label);
        let arr = [];
        let { dealerList } = {...this.state};
        for (let j = 0, a; (a = dealerList[j]) != undefined; j++) {
            // 如果选中的是一级菜单
            if (a.value == value) {
                // 二级菜单遍历
                for (let k = 0, b; (b = a['children'][k]) != undefined; k++) {
                    // 三级菜单遍历
                    for (let l = 0, c; (c = b['children'][l]) != undefined; l++) {
                        // 获取最后一级叶子节点
                        for (let m = 0, d; (d = c['children'][m]) != undefined; m++) {
                            arr.push(d.value);
                        }
                    }
                }
                break;
            } else { // 如果是二级或三级菜单
                for (let k = 0, b; (b = a['children'][k]) != undefined; k++) {
                    // 如果选中的是二级菜单
                    if (b.value == value) {
                        // 三级菜单遍历
                        for (let l = 0, c; (c = b['children'][l]) != undefined; l++) {
                            // 获取最后一级叶子节点
                            for (let m = 0, d; (d = c['children'][m]) != undefined; m++) {
                                arr.push(d.value);
                            }
                        }
                        break;
                    } else {
                        // 三级菜单遍历
                        for (let l = 0, c; (c = b['children'][l]) != undefined; l++) {
                            // 选中的就是三级菜单
                            if (c.value == value) {
                                // 获取最后一级叶子节点
                                for (let m = 0, d; (d = c['children'][m]) != undefined; m++) {
                                    arr.push(d.value);
                                }
                            } else {  // 那就是选中的最后一个叶子节点
                                for (let m = 0, d; (d = c['children'][m]) != undefined; m++) {
                                    if (d.value == value) {
                                        arr.push(d.value);
                                        break;
                                    }
                                }
                            }
                            break;
                        }

                    }
                }
            }
        }
        console.log(arr,'====selected===')
        this.setState({ value });
        this.props.selected({ label, value: arr.join() })
        // this.props.selected({ value, label, })

    }
    componentWillMount() { }

    componentWillReceiveProps(nextProps) {
        const { value } = nextProps
        if (value === undefined || value === null || value === '') {
            this.setState({
                value: undefined
            })
        }
    }


    componentDidMount() {
        const _this = this;
        Http.get('dealerList', (result) => {
            if (result === 1) {
                _this.props.NoDealer(true);
            } else {
                _this.setState({ dealerList: result.rows });
            }
        })
    }

    render() {
        function domNode(arr) {
            return arr && arr.length
                ? arr.map((item, index) => {
                    return (
                        <TreeNode value={item.value} disableCheckbox={!!item['children']} title={item.label} key={item.value + '-' + index}>
                            {item['children']
                                ? domNode(item['children'])
                                : ''
                            }
                        </TreeNode>
                    )
                })
                : !1;
        }

        const dealerNode = domNode(this.state.dealerList);
        return (
            <div style={{ display: 'inline-block', width: '100%' }}>
                {dealerNode
                    ? <TreeSelect
                        // value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择"
                        allowClear
                        treeDefaultExpandAll={false}
                        onChange={this.onChange}
                    >
                        {dealerNode}

                    </TreeSelect>
                    : ''
                }
            </div>

        );
    }
}

export default Tree;