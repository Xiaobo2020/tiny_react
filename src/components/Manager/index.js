import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import PropTypes from 'prop-types';

import Sider from '../Sider';
import BucketContent from '../BucketContent';
import SettingPage from '../../containers/SettingPage';

import './index.css';

const { Sider: SiderContainer, Content: ContentContainer } = Layout;

class Manager extends Component {
  constructor (props) {
    super(props);
    this.state = { view: 'content' };
    this.viewChange = this.viewChange.bind(this);
  }
  viewChange (view = 'content') {
    this.setState({ view });
  }
  render () {
    const { isAuth } = this.props;
    const { view } = this.state;

    return isAuth !== true ? (
      <Redirect to="/login" />
    ) : (
      <div className="manager-container">
        <Layout className="manager-layout">
          <SiderContainer className="manager-sider">
            <Sider onViewChange={this.viewChange}/>
          </SiderContainer>
          <ContentContainer className="manager-content">
            {
              view === 'setting' ? (
                <SettingPage onBack={() => this.viewChange('content')}/>
              ) : (
                <BucketContent />
              )
            }
          </ContentContainer>
        </Layout>
      </div>
    );
  }
}

Manager.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

export default Manager;
