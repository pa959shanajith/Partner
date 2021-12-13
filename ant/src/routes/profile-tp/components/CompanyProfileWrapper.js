import React from 'react';
import { Modal } from 'antd';
import CompanyProfile from './CompanyProfile';

class JobSearchWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfileModal: false,
      visible: false,
    }
  }
  handleCancel = () => {
    this.props.onClose();
  };

  closeModalCallBack = () => {
    this.props.onClose();
    
  }

  render() {
    const visible = this.props.visible;
    // var onClose = this.props.onClose;
    return (
      <Modal
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={null}
        width='40%'
        className="training-profile-modal"
      >
        <CompanyProfile closeModal={this.closeModalCallBack} />
      </Modal>
    );
  }
}

export default JobSearchWrapper;