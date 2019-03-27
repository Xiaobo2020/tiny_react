import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notification, Modal } from 'antd';
import BucketItem from '../BucketItem';
import './index.css';

const openNotification = (type, message) => {
  notification[type]({
    message,
    duration: 2
  });
}

const getSelectedIndex = (buckets, selected) => buckets.reduce((prev, cur, index) => cur['name'] === selected ? index : prev, -1);

const Title = <div style={{textAlign: 'center'}}>删除存储空间</div>

class FilterList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: false,
      waitToBeDeleted: '',
      confirmLoading: false
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }
  handleSelect (e, bucketobj = {}) {
    e.preventDefault();
    if (bucketobj['name'] === this.props.selected) {
      return;
    }
    this.props.selectBucket(bucketobj['name']);

    let zone = bucketobj['zone'];
    let domains = bucketobj['domains'];
    if (zone === '') {
      this.props.fetchBucketZone(bucketobj['name']);
    }
    if (domains.length === 0) {
      this.props.fetchBucketDomain(bucketobj['name']);
    }
  }
  handleDelete (e, bucketObj = {}) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      visible: true,
      waitToBeDeleted: bucketObj['name']
    });
  }
  closeModal (e) {
    if (e) e.preventDefault();
    this.setState({
      visible: false,
      waitToBeDeleted: '',
      confirmLoading: false
    });
  }
  handleOk (e) {
    e.preventDefault();
    this.setState({ confirmLoading: true });

    let { waitToBeDeleted } = this.state;
    let { selected, buckets, selectBucket, deleteBucket, fetchBuckets } = this.props;
    deleteBucket(waitToBeDeleted).then(res => {
      this.closeModal();
      openNotification('success', `Delete ${waitToBeDeleted} successfully!`);
    }).catch(err => {
      this.closeModal();
      openNotification('error', `Delete ${waitToBeDeleted} failed!`);
      console.error(err);
    }).then(() => {
      fetchBuckets().then(() => {
        if (waitToBeDeleted === selected) {
          selectBucket(buckets.length === 0 ? '': buckets[0]['name']);
        }
      }).catch(err => {
        openNotification('error', `Fetch buckets failed!`);
        console.error(err);
      });
    })
  }

  componentDidMount () {
    const { selected, buckets} = this.props;
    if (selected === '') {
      if (buckets.length !== 0) {
        this.props.selectBucket(buckets[0]['name']);
      }
    } else {
      if (buckets.length === 0 || getSelectedIndex(buckets, selected) === -1) {
        this.props.selectBucket('');
      }
    }
  }
  render () {
    const { buckets, filterText, selected } = this.props;
    return (
      <div className="bucket-list">
        {
          buckets.map((item, index) => {
            return (
              <BucketItem
                show={item['name'].indexOf(filterText) !== -1}
                active={item['name'] === selected}
                text={item['name']}
                key={index}
                onSelect={e => this.handleSelect(e, item)}
                onDelete={e => this.handleDelete(e, item)}/>
            );
          })
        }
        <Modal
          title={Title}
          closable={false}
          maskClosable={false}
          okText="确认"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.closeModal}
          confirmLoading={this.state.confirmLoading}
          cancelButtonProps={{ disabled: this.state.confirmLoading }}>
          是否确认删除存储空间：{this.state.waitToBeDeleted}?
        </Modal>
      </div>
    );
  }
}

FilterList.propTypes = {
  filterText: PropTypes.string,
  selected: PropTypes.string,
  buckets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      zone: PropTypes.string,
      domains: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  fetchBuckets: PropTypes.func.isRequired,
  deleteBucket: PropTypes.func.isRequired,
  selectBucket: PropTypes.func.isRequired,
  fetchBucketZone: PropTypes.func.isRequired,
  fetchBucketDomain: PropTypes.func.isRequired
};

FilterList.defaultProps = {
  filterText: '',
  selected: '',
  buckets: []
};

export default FilterList;
