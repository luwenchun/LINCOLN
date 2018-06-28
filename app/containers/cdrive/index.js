/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
//import Layout from '../../components/Layout';
import DriveList from './drive.list';
import Http from '../../utils/http'
const title = '试驾预约';

const apis = [
  {"id":"userInfo","url":"bsd/ads","mock":"bsd/ads","format":false},

  {"id":"carInfo","url":"bsd/post", "mock":"user/post","format":false},
];

Http.setDomainUrl("http://localhost:8081/yyauto-web/api/")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

// Http.setRequestHeader(headers).get("userInfo",{"name":"wangdogfen"},(callback)=>{
//   console.log('userInfo--get----callback---->',callback);
// })

// Http.post("carInfo",{"test":"postman"},(callback)=>{
//   console.log('carInfo--post----callback---->',callback);
// })
console.log(Http)


function action() {

  return {
    chunks: ['drive'],
    title,
    component: (
      //<Layout>
        <DriveList title={title} />
     // </Layout>
    ),
  };
}

export default action;
