import { Modal } from 'antd';
import React from 'react';
import EventDetailsCard from './EventDetailsCard';
import EnrolledEventsCandidatesListTable from './EnrolledEventsCandidatesListTable';

class ViewEnrolledEventDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            jobsData: {},
        };
    }

    handleCancel = () => {
        this.props.onClose();
    };

    render() {
        const visible = this.props.visible;
        let clickedEventData = this.props.clickedEventData;
        let applicantData = this.props.applicantData;
        let isSubscribed = this.props.isSubscribed;
        // console.log("clickedEventData", clickedEventData);
        // console.log("applicantData", applicantData);
        // let tableData = this.props.tableData;
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
                        <EnrolledEventsCandidatesListTable
                            eventData={clickedEventData}
                            applicantData={applicantData}
                            isSubscribed={isSubscribed}
                            Reload={this.reload}
                        />
                    </div>
                    <div className="col-md-4">
                        <EventDetailsCard
                            clickedEventData={clickedEventData}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
}
export default ViewEnrolledEventDetailModal;