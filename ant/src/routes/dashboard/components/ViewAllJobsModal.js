import { Modal } from 'antd';
import React from 'react';
import JobSearch from '../../jobsearch/components/JobSearch';

class ViewAllJobsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            jobSearchCompanySelected: ''
        };
    }

    handleCancel = () => {
        this.props.onClose();
    };

    render() {
        const visible = this.props.visible;
        let companyName = this.props.companyName;
        let showOnlyAssignedJobs = this.props.showOnlyAssignedJobs
        // console.log(companyName);
        return (
            <Modal
                visible={visible}
                maskClosable={true}
                destroyOnClose={true}
                onCancel={this.handleCancel}
                footer={null}
                width='100%'
                className="view-shortlist-company-modal"
            >
                <JobSearch companyName={companyName} showOnlyAssignedJobs={showOnlyAssignedJobs} />
            </Modal>
        );
    }
}
export default ViewAllJobsModal;