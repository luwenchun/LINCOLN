/**
 * 富文本编辑框
 * @type {Component}
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Upload, Icon, message, Form } from 'antd';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichText.scss';

import { EditorState, convertToRaw, convertFromHTML, ContentState, AtomicBlockUtils } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import Preview from './Preview'
import DMCUtil from '../../utils/DMCUtil';
import { UPLOAD_IMAGE_PATH } from '../../global.config'
const FormItem = Form.Item;


/**
 * 空方法
 */
function noop() { }

const editorStateEmpty = EditorState.createEmpty()
let uploadLimit = true;
let uploadNum = 0;
let initCount = true;

class RichText extends Component {

  static propTypes = {
    richOpt: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    richOpt: {},
    onChange: noop
  }

  constructor(props) {
    super(props);


    // //localhost:9900/fed/admin/api/mock/cmyManage/sys/uploadFile
    this.state = {
      uploadUrl: UPLOAD_IMAGE_PATH,
      editorStateEmpty,
      editorTemp: editorStateEmpty,
      isRenderEditor: false,
      multiPicModalVisible: false,
      fileList: [],
      toolbarOpts: {
        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],
        inline: { inDropdown: false },
        list: { inDropdown: false },
        textAlign: { inDropdown: false },
        image: { uploadCallback: this.uploadImageCallBack.bind(this), previewImage: true, alt: { present: false, mandatory: false } },
        link: { inDropdown: false },
        history: { inDropdown: false },

      },
      uploadedImages: [],
    };

    this.handleMutlUploadChange.bind(this)
    this.beforeUpload.bind(this)




  }

  uploadImageCallBack = (file) => {
    //const {uploadImageUrl} = this.props.richOpt
    //const uploadImageUrl = '//10.180.8.90:9827/api/cmyManage/sys/uploadFile'
    //const uploadImageUrl = '//localhost:9900/fed/admin/api/mock/cmyManage/sys/uploadFile'
    const { uploadUrl } = this.state
    // const uploadUrl = '//carapp.gtmc.com.cn/api/cmyManage/sys/uploadFile'
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        //xhr.open('POST', '//localhost:9900/fed/admin/api/mock/cmyManage/sys/uploadFile');
        xhr.open('POST', `${uploadUrl}`);
        xhr.withCredentials = true;
        const data = new FormData();
        data.append('photo', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const imageLink = response['data']['url'];
          // debugger;
          const linkResponse = { ...response, ...{ data: { link: imageLink } } };
          // console.log('linkResponse====', linkResponse)
          resolve(linkResponse);
        });
        xhr.addEventListener('error', () => {
          const error = xhr.responseText && xhr.responseText.length ? JSON.parse(xhr.responseText) : '';
          reject(error);
        });
      }
    );
  }

  onEditorStateChange = (editorState) => {

    let currentContentAsRaw = convertToRaw(editorState.getCurrentContent())
    let contentAsHtml = draftToHtml(currentContentAsRaw)


    this.setState({
      editorState: editorState,
      editorTemp: editorState
    }, () => {
      let currentContentAsRaw = convertToRaw(this.state.editorTemp.getCurrentContent())
      let contentAsHtml = draftToHtml(currentContentAsRaw)
      //console.log('contentAsHtml---update--->',contentAsHtml)
    });

    this.props.onChange(contentAsHtml)

  };

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.defaultValue === 'undefined' && initCount) {
      initCount = false
      this.setState({
        editorState: EditorState.createEmpty()
      })
    }
    return !1
  }

  setFieldValue = (val) => {

    const contentBlock = htmlToDraft(val);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);

    const editorState = EditorState.createWithContent(contentState)

    this.setState({
      editorState,
    })
  }

  componentDidMount() {
    const { props, setFieldValue } = this
    this.setState({
      isRenderEditor: true
    }, () => {
      const defaultValue = props.defaultValue
      if (typeof defaultValue === 'undefined' || defaultValue === '' || defaultValue === null) {
        return
      } else {

        setFieldValue(defaultValue)

      }

    })

  }

  setMultiPicModalVisible = (isVisible) => {
    this.setState({
      multiPicModalVisible: isVisible
    }, () => {
      if (!isVisible) {
        this.setState({
          uploadedImages: []
        })
      }
    })

  }

  showMultiPictureModal = () => {
    this.setMultiPicModalVisible(true)
  }

  beforeUpload = (info, fileList) => {
    if (uploadLimit) {
      uploadNum = fileList.length
      uploadLimit = !uploadLimit
    }
  }

  checkUploadDone = (fileList = []) => {
    let isAllDone = false, len = fileList.length;

    if (uploadNum === len) {

      for (let i = 0; i < len; i++) {

        if (fileList[i]['status'] === 'done' || typeof fileList[i]['response'] !== 'undefined') {
          isAllDone = !0
        } else {
          isAllDone = !1
          break
        }

      }

    }


    return isAllDone

  }



  handleMutlUploadChange = (info) => {
    const { uploadUrl } = this.state
    const { fileList } = info
    const isDone = this.checkUploadDone(fileList)

    if (isDone) {

      uploadLimit = true
      const tempImages = [...this.state.uploadedImages]
      let imgURLAsArr = []
      fileList.map((item, index) => {
        // debugger;
        const path = item['response']['data']
        imgURLAsArr.push({ uid: item['uid'], url: path.url });

      })

      this.setState({
        uploadedImages: [...tempImages, ...imgURLAsArr]
      }, () => {
        // console.log('-----current_images--->',this.state.uploadedImages)
      })

    }

  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  onRemoveUploaded = (file) => {
    const uploadedImages = [...this.state.uploadedImages]


    for (let i = 0, elem; (elem = uploadedImages[i]) != undefined; i++) {

      if (elem['uid'] === file['uid']) {
        uploadedImages.splice(i, 1);
        this.setState({ uploadedImages }, () => {
          //console.log('after-RemoveUploaded---->',this.state.uploadedImages)
        })
        break
      }

    }


  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  addImage = (src, width = 'auto', height = 'auto', alt = 'image') => {

    const { editorTemp } = this.state
    const { onEditorStateChange } = this
    const entityData = { src: src, height: height + 'px', width: width + 'px' };

    const entityKey = editorTemp.getCurrentContent().createEntity('IMAGE', 'MUTABLE', entityData).getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorTemp,
      entityKey,
      ' '
    )

    onEditorStateChange(newEditorState)


  }

  handleMutlConfirm = () => {
    // console.log('uploadedImages---->',this.state.uploadedImages)

    const uploadedImages = [...this.state.uploadedImages];

    uploadedImages.map((item, index) => {
      let timeId = setTimeout(() => {
        this.addImage(item['url'])
        clearTimeout(timeId)
      }, 10 * index)

    })

    this.setMultiPicModalVisible(false)
  }


  render() {
    const { handleMutlUploadChange, setMultiPicModalVisible, handlePreview, onRemoveUploaded, handleMutlConfirm, beforeUpload } = this
    const { getFieldDecorator } = this.props.form
    const { editorState, isRenderEditor, toolbarOpts, fileList, uploadUrl } = this.state;



    const genPictureBtn = () => {
      return (
        <div className={'multi-picture-opt-wrapper'} onClick={this.showMultiPictureModal.bind(this, event)}>
          <div className={'multi-picture-button'}><i className={'iconfont'}>&#xe7bd;</i></div>
        </div>
      )
    }

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">添加</div>
      </div>
    );

    return (
      <div>
        {isRenderEditor
          ? <Editor
            editorState={editorState}
            wrapperClassName={'dmc-editor-wrapper'}
            editorClassName={'dmc-editor'}
            onEditorStateChange={this.onEditorStateChange}
            localization={{
              locale: 'zh',
            }}
            toolbar={toolbarOpts}
            toolbarCustomButtons={[genPictureBtn()]}
          />
          : null
        }

        <div>
          <Modal
            title="批量图片上传"
            wrapClassName={'multi-picture-wrapper'}
            width={'80%'}
            visible={this.state.multiPicModalVisible}
            onOk={() => handleMutlConfirm()}
            onCancel={() => setMultiPicModalVisible(false)}
            destroyOnClose={true}
          >
            <div>
              <Form>
                <FormItem>
                  {getFieldDecorator('fileList', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                  })(
                    <Upload
                      name="photo"
                      action={uploadUrl}
                      listType="picture-card"
                      showUploadList={{ showPreviewIcon: false }}
                      supportServerRender={true}
                      multiple={true}
                      beforeUpload={beforeUpload}
                      onPreview={handlePreview}
                      onChange={handleMutlUploadChange}
                      onRemove={onRemoveUploaded}
                    >
                      {uploadButton}
                    </Upload>
                  )}
                </FormItem>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    )
  }

}

const RichTextWithForm = Form.create()(RichText)

export default RichTextWithForm;
