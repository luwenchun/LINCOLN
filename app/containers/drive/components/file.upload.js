/**
 * 资料文件上传
 */
import React from 'react';
import '../style/drive.upload.scss';
import $ from 'jquery';
import Ui from '../../../utils/weixin';
import Http from '../../../utils/http';
import {SERVER_BASE_PATH} from '../../../global.config';

let _this;

const apis = [
    {"id":"uploadAgreement","url":"/dealer/api/v1/driveAgreement", format:false}
];

Http.setDomainUrl(SERVER_BASE_PATH)
Http.setMutiApi(apis);

export default class FUploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            driveId: props.id || '',
            items: [
                {id: 'u-1', value: '一'},
                {id: 'u-2', value: '二'}
            ]
        };
        this.ref = {1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六"};
        _this = this;
    }

    componentDidMount() {
        $('.cdrive-upload').on('click', '.icon-reduce', function(e) {
            let li = $(this).parents('li'),
                id = li.attr('data-id');
            _this.remove(id);
        });

        $('.cdrive-upload').on('click', '.icon-plus', function(e) {
            let li = $(this).parents('li');
            _this.addFile();
        });
    }   

    addFile() {
        let len = _this.state.items.length,
            newVal = ++len;

        if (len > 6) {
            Ui.toast('最多只能添加6个附件');
            return;
        }    

        this.state.items.length = 0;
        for (let i = 1; i <= newVal; i++) {
            _this.state.items.push({id: 'u-' + i, value: _this.ref[i]});
        }
        
        this.setState({items: _this.state.items});
    }

    remove(id) {
        let len = _this.state.items.length,
            i;

        for (i = 0; i < len; i++) {
            if (_this.state.items[i].id == id) {
                _this.state.items.splice(i, 1);
                break;
            }
        }    

        len = _this.state.items.length;
        _this.state.items.length = 0;
        for (let i = 1; i <= len; i++) {
            _this.state.items.push({id: 'u-' + i, value: _this.ref[i]});
        }
        
        this.setState({items: _this.state.items});
    }

    upload(o) {
        let target = o.target,
            name   = target.name,
            li = $(target).parents('li'),
            process = li.get(0).querySelector('.upload-progress'),
            url = 'http://localhost:3000/api/upload/single';

        function fileSelected() {
            let file = target.files[0];
            if (file) {
                let fileSize = 0;
                if (file.size > 1024 * 1024) {
                    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                } else {
                    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                }
                
                // file.name, file.type
                uploadFile();
            }
        }    

        function uploadFile() {
            let fd = new FormData();
            fd.append(name, target.files[0]);
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", url);
            xhr.send(fd);
        }

        function uploadProgress(evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                process.innerHTML = percentComplete.toString() + '%';
            }
        }

        function uploadComplete(evt) {
            Ui.toast("上传成功");
            setTimeout(() => {
                process.innerHTML = '';
            }, 1500);
        }

        function uploadFailed(evt) {
            Ui.toast("上传失败");
        }

        function uploadCanceled() {
            Ui.toast('上传被取消');
        }

        fileSelected();
    }

    chooseImage() {
        Ui.wxReady(function() {
            Ui.selectImage().then((ids) => {
                if (Array.isArray(ids) && ids.length > 0) {
                    Ui.loading(false, '上传中...');
                    _this.upImage(ids[0], () => {
                        Ui.loading(true);
                    });
                }
            });
        });
    }

    upImage(id, callback) {
        Ui.wxReady(function() {
            Ui.uploadImage(id).then((sId) => {
                let params = {
                    driveId: _this.state.driveId || '',
                    driveMediaIdList: [sId]
                };
                Http.post('uploadAgreement', params, (res) => {
                    if (res && res.errMsg) {
                        Ui.toast(res.errMsg);
                    } else {
                        Ui.toast('上传失败');
                    }

                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            });
        });
    }

    render() {
        const list = this.state.items,
              len = list.length;
        let show = 'block';      

        if (this.props.show) {
            show = this.props.show;
        }      

        if (this.props.id) {
            this.state.driveId = this.props.id; 
        }

        return (
            <ul className={"mui-table-view cdrive-upload"} style={{display: show}}>
		        <li className={"mui-table-view-cell"}>
                    <span className={'ui-header'}><i></i><span>资料上传</span></span>
		        </li>
                {
                    list.map((item, i) => {
                        let act = (len - 1) == i ? 'icon-plus' : 'icon-reduce';
                        return (
                            <li className={"mui-table-view-cell"} key={i} data-id={item.id}>试驾协议{item.value}
                                <div className={'upload-progress'}></div>
                                <div className={'buttons'}>
                                    <a className={'icon-photo'} href="javascript:void(0)" onClick={this.chooseImage}>
                                        {/* <input type="file" name={'upload_' + i} className={'upload-file'} onChange={this.upload}/> */}
                                    </a> 
                                    <a className={act} href="javascript:void(0)"></a>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>  
        );
    }
 }