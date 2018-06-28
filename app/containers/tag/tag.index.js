/**
 *咨询标签列表
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import TagEdit from './TagComp';
import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';


const title = '咨询标签';

class Tag extends React.Component {
  constructor(props) {
    super(props);
    
    const Authorization = props.currentAuthorization
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>资讯标签</title>
          <meta name="description" content="资讯标签" />
        </Helmet>
        <TagEdit />
      </div>
    );
  };

}
//const TagComp = withStyles(s)(Tag);
// function action({ path, query, hash, Authorization }) {

//   const currentAuthorization = DMCUtil.getCurrent(Authorization)
//   return {
//     chunks: ['tag.index'],
//     title,
//     component: (
//       <div>
//         <TagComp currentAuthorization={currentAuthorization} />
//       </div>
//     ),
//   };
// }



export default Tag;
