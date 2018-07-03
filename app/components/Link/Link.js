/**
 * link
 */

import React from 'react';
import PropTypes from 'prop-types';
// import history from '../../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  handleClick = event => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    // debugger;
    // this.props.history.push(this.props.to);
    // history.push(this.props.to);
  };

  render() {
    const {children } = this.props;
    return (
      // <a href={to} {...props} onClick={this.handleClick}>
      <a>
        {children}
      </a>
    );
  }
}

export default Link;
