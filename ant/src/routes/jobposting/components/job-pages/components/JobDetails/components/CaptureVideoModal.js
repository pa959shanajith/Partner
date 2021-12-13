import React from 'react';
import { Modal, Button, Steps} from 'antd';
import partnerService from '../../../../../../../services/partnerService';
const Step = Steps.Step;

class CaptureVideoModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            current: 0,
            disableNext: true,
            disablePrev: true,
            disableUpload: true
        };
        this.next = this.next.bind(this);
        this.partnerService = new partnerService();
    }

    componentDidMount(){ 
    }
    componentWillReceiveProps(props){
        if(props.visible == false){
            this.setState({
                loading: false,
                current: 0,
                disableNext: true,
                disablePrev: true,
                disableUpload: true
            });
        } 
    }

    handleOk = () => {
        this.setState({ loading: true });
        this.uploadVideoJD(window.getVideoJDs());
        setTimeout(() => {
            this.handleCancel();
            this.setState({ loading: false });
        }, 3000);
    };
  
    handleCancel = () => {
        window.destroyVideoJD();
        this.props.onClose();
    };
    next(){
        if(this.state.current == 3) return;
        var currentIndex = this.state.current + 1;
        var disableNextBtn = true;
        var disableUploadBtn = true;
        if(this.state.current == 2) disableUploadBtn = false;

        this.setState({current: currentIndex, disableNext: disableNextBtn, disableUpload: disableUploadBtn});
        window.disposeVideo();
    }
    renderBtnSet(){
        return (
            <div className="btn-set">
                <Button id="next" type="primary" disabled={this.state.disableNext} className="jd-next" onClick={this.next}>Next</Button>
            </div>
        );
    }
    enableDisable(btnNext){
        this.setState({disableNext: btnNext});
    }
    preview(index){
        window.playVideo(index);
    }
    retake(index){
        var id = index - 1;
        this.setState({current: id});
        window.retake(id);
    }
    goToPreview(){
        this.setState({current: 3});
        window.disposeVideo();
    }
    findVideo(arrayObj, _id){
        var i = arrayObj.length;
        while(i--){
          if( arrayObj[i] && arrayObj[i].id === _id ){ 
            return arrayObj[i];
          }
        }
        return undefined;
      }
    uploadVideoJD(videoJDFiles){
        if(videoJDFiles.length < 3){
          console.log("There must be 3 videos");
          return;
        }
        var firstVideo = this.findVideo(videoJDFiles, "1");
        var secondVideo = this.findVideo(videoJDFiles, "2");
        var thirdVideo = this.findVideo(videoJDFiles, "3");
        var jobId = JSON.parse(localStorage.getItem('jobId'));
        if(!jobId) jobId = 1;
        const formData = new FormData();
        formData.append("uploads[]", firstVideo.data, jobId+"_1");
        formData.append("uploads[]", secondVideo.data, jobId+"_2");
        formData.append("uploads[]", thirdVideo.data, jobId+"_3");
        
        //Space for Server call 
        this.partnerService.uploadVideoJD(formData, jobId).then((response) =>{
            console.log("Successfully Uploaded VideoJD");
        }).catch((err) =>{
            console.log(err);
        });
    }
    render() {
      const { loading, current } = this.state;
      const visible = this.props.visible;
      if(visible && (current >= 0 && current < 3)) window.startRecording(this);
      return (
        <div>
          <Modal
            visible={visible}
            title="Capture Video JD"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            footer={[
              <Button key="submit" disabled={this.state.disableUpload} type="primary" loading={loading} onClick={this.handleOk}>Upload</Button>,
            ]}
            width='80%'
            className="capture-video-modal"
          >
            
            <div className="box box-default box-left">
                <div className="box-body">
                    <Steps direction="vertical" current={this.state.current}>
                        <Step title="Who are we ?" />
                        <Step title="What are we looking for ?" />
                        <Step title="Who should apply ?" />
                        <Step title="Preview" />
                    </Steps>
                </div>
            </div>
            <div className="box box-default box-right">
                <div className="steps-content"></div>
                
                <div className="box-body video-container">
                    <div className="content clearfix" style={{minHeight: '25em'}} id="tab-sections">
                        {current == 0 ?(
                        <section id="jd-video-p-1" >
                            <div className="vd-h-1">
                                <video className="video-js vjs-default-skin" id="play1" muted="" playsInline=""></video>
                            </div>
                            {this.renderBtnSet()}
                        </section>
                        ):""}
                        {current == 1 ?(
                        <section id="jd-video-p-2" >
                            <div className="vd-h-2">
                                <video className="video-js vjs-default-skin" id="play2" muted="" playsInline=""></video>
                            </div>
                            {this.renderBtnSet()}
                        </section>
                        ):""}
                        {current == 2 ?(
                        <section id="jd-video-p-3">
                            <div className="vd-h-3">
                                <video className="video-js vjs-default-skin" id="play3" muted="" playsInline=""></video>
                            </div>
                            {this.renderBtnSet()}
                        </section>
                        ):""}
                        {current == 3 ?(
                        <section id="jd-video-p-4">
                            <div className="">
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <video className="video-js vjs-default-skin" id="play4" muted="" playsInline=""></video>
                                        </div>
                                    </div>
                                    <div className="row" style={{marginTop: '5px'}}>
                                        <div className="col-sm-4">
                                            <div className="btn-pre">
                                                <div className="ant-steps-item-icon"><span className="ant-steps-icon">1</span></div>
                                                <Button type="primary" onClick={(id) => this.preview("1")}><span>Preview</span></Button>
                                                <Button type="primary" onClick={(id) => this.retake(1)} className="ml5"><span>Retake</span></Button>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="btn-pre">
                                                <div className="ant-steps-item-icon"><span className="ant-steps-icon">2</span></div>
                                                <Button type="primary" onClick={(id) => this.preview("2")}><span>Preview</span></Button>
                                                <Button type="primary" onClick={(id) => this.retake(2)} className="ml5"><span>Retake</span></Button>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="btn-pre fright">
                                                <div className="ant-steps-item-icon"><span className="ant-steps-icon">3</span></div>
                                                <Button type="primary" onClick={(id) => this.preview("3")}><span>Preview</span></Button>
                                                <Button type="primary" onClick={(id) => this.retake(3)} className="ml5"><span>Retake</span></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        ):""}
                    </div>
                </div>
            </div>
          </Modal>
        </div>
      );
    }
  }
  export default CaptureVideoModal;