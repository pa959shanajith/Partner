import { Modal } from 'antd';
import React from 'react';
// import JobSearch from '../../jobsearch';
import JobDetailsCard from './JobDetailsCard';
import JobCandidatesList from './JobCandidatesList';

class ViewShortlistedCompanyDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            jobsData: {},
            showJobDetails: false,
            eventTableShow: false,
            showCandidates: false,
        };
    }

    handleCancel = () => {
        this.props.onClose();
    };

    render() {
        const visible = this.props.visible;
        let jobData = this.props.jobData;
        // let applicantData = this.props.applicantData;
        // let tableData = this.props.tableData;
        // console.log(jobData);
        return (
            <Modal
                visible={visible}
                maskClosable={true}
                onCancel={this.handleCancel}
                footer={null}
                width='100%'
                className="view-shortlist-company-modal"
            >
                <div className="row pt-5">
                    <div className="col-md-8">
                        <JobCandidatesList
                            jobData={jobData}
                        // data={applicantData}
                        // tableData={applicantData}
                        // Reload={this.reloadList}
                        // onChangeTable={this.showDefaultTable.bind(this)}
                        />
                    </div>
                    <div className="col-md-4">
                        <JobDetailsCard
                            clickedEventData={jobData}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
}
export default ViewShortlistedCompanyDetailModal;