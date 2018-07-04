
// 本地测试环境 ;
// export const SERVER_BASE_PATH = 'http://carowner.yonyouauto.com/qy/';
// export const UPLOAD_IMAGE_PATH = 'http://carowner.yonyouauto.com/qy/material/uploadFile'

// 林肯生产环境
//  export const SERVER_BASE_PATH = 'http://lincoln-mp.yonyouauto.com/qy/'
//  export const UPLOAD_IMAGE_PATH = 'http://lincoln-mp.yonyouauto.com/qy/material/uploadFile'


let SERVER_BASE;
let UPLOAD_IMAGE;
if(process.env.NODE_ENV==='development'){
    SERVER_BASE = 'http://carowner.yonyouauto.com/qy/'
    UPLOAD_IMAGE = 'http://carowner.yonyouauto.com/qy/cmyManage/sys/uploadFile' 
}else{
    SERVER_BASE = '/qy/'
    UPLOAD_IMAGE = '/qy/cmyManage/sys/uploadFile'
}

export const SERVER_BASE_PATH =SERVER_BASE
export const UPLOAD_IMAGE_PATH =UPLOAD_IMAGE