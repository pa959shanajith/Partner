import React from 'react'
import { withRouter } from "react-router-dom";
import { Modal, Button, Form, Steps, Progress } from 'antd';
import ResumeUpload from './ResumeUpload'
import ListOfUploadedUsers from './ListOfUploadedUsers'
import { connect } from 'react-redux';
import { multipleFiles, setButtonValue, setMultiplefileslist } from 'actions/settingsActions';
import partnerService from "../../../services/partnerService";
const Step = Steps.Step;

class MultipleFileUpload extends React.Component {
  constructor(props) {
    super()
    this.ResumeUploadref = React.createRef();
    this.ListOfUploadedUsersref = React.createRef()
    let email = localStorage.getItem('email');
    let companyName = localStorage.getItem('companyName');
    let isPartner = JSON.parse(localStorage.getItem('isPartner'));
    let ObjectId = localStorage.getItem('ObjectID');
    let jobId = localStorage.getItem('jobId');
    let contactNo = localStorage.getItem('contactNo');
    let partnerType = localStorage.getItem('partnerType');

    this.state = {
      emailId: email,
      companyName: companyName,
      isPartnerAdmin: isPartner,
      ObjectId: ObjectId,
      jobId: jobId,
      contactNo: contactNo,
      partnerType: partnerType,
      current: 0,
      value: true,
      steps: [
        {
          title: 'Files',
          content: <ResumeUpload ref={this.ResumeUploadref} />,
        },
        {
          title: 'Submit',
          content: <ListOfUploadedUsers />,
        },
      ],
      fileLength: {},
      filePercentage: 0,
      success: 0,
      failed: 0,
      closeModal: false
    }
    this.partnerService = new partnerService();

  }

  handleCancel = () => {
    this.props.onClose();
    this.props.reload();
    this.setState({ current: 0, filePercentage: 0, success: 0, failed: 0, closeModal: false })
    const { handleMultipleUpload, handletablechange } = this.props
    let listOfFiles = [];
    let tablefiles = [];
    handleMultipleUpload(listOfFiles)
    handletablechange(tablefiles)

  }

  next = () => {
    switch (this.state.current) {
      case 0:
        this.ResumeUploadref.current.validateFields((err, fieldValues) => {
            // console.log(fieldValues, ' its field', err, 'err');
            if (err) {
              return
            }
            else {
              this.setState({ current: this.state.current + 1 });
            }
          })
      break;
      case 1:
      default:
        break;
    }
  }

  // prev = () => {
  //   switch (this.state.current) {
  //     case 0:
  //       break;
  //   }
  //   this.setState({ current: this.state.current - 1 });
  // };

  submitProfiles = () => {
    const { tablefiles } = this.props;
    let valueArray = [...tablefiles];
    if (tablefiles.length) {
      for (let index = 0; index < tablefiles.length; index++) {
        let element = tablefiles[index];
        let index_value = index + 1;
        let data = {
          name: element.name,
          email: element.emailId,
          phone: element.mobileno,
          experience: element.experince,
          ctc: element.expectedctc,
          notice: element.noticePeriod,
          comments: element.comments,
          profileSubmittedBy: this.state.emailId,
          jobId: this.state.jobId,
          ObjectId: this.state.ObjectId,
          companyName: this.state.companyName,
          applicantLastCompany: element.currentCompany || "",
          resumeUrl: element.resumeURL,
          isPartner: this.state.isPartnerAdmin,
          // dniCategory: element.dniCategory === 'Other' ? profileData.dniCategory : fieldValues.dniCategory,
          partnerEmail: this.state.emailId,
          partnerCompany: this.state.companyName,
          partnerContactNo: this.state.contactNo,
          partnerType: this.state.partnerType
        }
        this.partnerService.addJobCandidateProfileTo(data).then((d) => {
          //show succes and proceed to close
          if (d.data.status === true) {
            let percentage = Math.round((100 * index_value) / valueArray.length);
            this.setState({ filePercentage: percentage, success: this.state.success + 1 });
            if (index_value === valueArray.length) {
              this.setState({ closeModal: true })
            }
            // message.success(d.data.message, 5);
          }
        }).catch((err) => {
          // message.error(err.data.message,5);
          console.log(err, ' its err');
          this.setState({ failed: this.state.failed + 1 })
          if (index_value === valueArray.length) {
            this.setState({ closeModal: true })
          }
        })


      }
    }
  }

  onStepsChange = current => {
    this.setState({ current });
  };

  renderSteps = () => (
    <>
      <Steps current={this.state.current} onChange={this.onStepsChange}>
        {this.state.steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{this.state.steps[this.state.current].content}</div>
      <div className="steps-action d-flex">
        {this.state.current < this.state.steps.length - 1 && (
          <Button disabled={!this.props.buttonValue} type="primary" onClick={() => this.next()}>
            Next
          </Button>
        )}
        {!this.state.closeModal && this.state.current === this.state.steps.length - 1 && (
          <Button type="primary" onClick={() => this.submitProfiles()}>
            Submit
          </Button>
        )}
        {this.state.closeModal && this.state.current === this.state.steps.length - 1 && (
          <Button type="primary" onClick={() => this.handleCancel()}>
            Done
          </Button>
        )}
        {/* {!this.state.closeModal && this.state.current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
            Previous
          </Button>
        )} */}
        {this.state.current === this.state.steps.length - 1 && (
          <Progress type="circle" percent={this.state.filePercentage} width={50} />
        )}
        {this.state.current === this.state.steps.length - 1 && (
          <div className="ml-2 d-flex">
            <h4 className="p-3">success - {this.state.success}</h4>
            <h4 className="p-3">failed - {this.state.failed}</h4>
          </div>
        )}

      </div>
    </>
  )

  render() {
    return (
      <div>
        <Modal
          destroyOnClose={true}
          visible={this.props.visible}
          maskClosable={false}
          onCancel={this.handleCancel}
          footer={null}
          width='65%'>
          {this.renderSteps()}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  buttonValue: state.settings.value,
  tablefiles: state.settings.tablefiles
});

const mapDispatchToProps = dispatch => ({
  handleMultipleUpload: (listOfFiles) => {
    dispatch(multipleFiles(listOfFiles));
  },
  updateValue: (value) => {
    dispatch(setButtonValue(value));
  },
  handletablechange: (tablefiles) => {
    dispatch(setMultiplefileslist(tablefiles));
  }
});

const WrappedMultipleFileUploadModal = Form.create()(withRouter(connect(mapStateToProps, mapDispatchToProps)(MultipleFileUpload)));
export default WrappedMultipleFileUploadModal;
