import { Form, Icon, Button } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import CandidateTabPane from './CandidateTabPane';


const StyleSheet_DefaultButton = {
    color: '#fff',
    fontSize: '15px',
    background: 'linear-gradient(270deg, #B446FF 0%, #6D68FE 28%, #4C46E6 70%, #9700FF 100%)',
    border: '1px solid #E3E3E3',
    borderRadius: '5px',
    width: '140px',
    height: '38px',
    margin: '4px 8px'
}


class CandidateDetails extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="candidate-details">
                <div className="pt-2 pb-2">
                    <div className="col-12" style={{ borderBottom: '1px solid #D9D9D9' }}>
                        <div className="row">
                            <div className="col-2">
                                <img className="candidate-profilepic-detail-pane" src={"https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png"} alt="Profile" />
                            </div>
                            <div className="col-7">
                                <h4 style={{ color: '#000000', fontSize: '24px', paddingBottom: '10px' }}>Name Name</h4>
                                <h4 style={{ color: '#848484', fontSize: '18px', paddingBottom: '10px' }}>Java Developer</h4>
                                <h4 style={{ color: '#848484', fontSize: '18px', paddingBottom: '10px' }}>2 Years</h4>
                            </div>
                            <div className="col-2 text-center">
                                <div>
                                    <a href={() => false} className="icon-btn mx-1 icon-btn-sm btn-linkedin"><Icon type="linkedin" /></a>
                                    <a href={() => false} className="icon-btn mx-1 icon-btn-sm btn-github"><Icon type="github" /></a>
                                </div>
                                <Button style={StyleSheet_DefaultButton} icon="video-camera">Video Profile</Button>
                                <Button style={StyleSheet_DefaultButton}>Resume</Button>

                            </div>
                        </div>
                    </div>
                </div>

                <CandidateTabPane />
            </div>
        );
    }

}

const WrappedCandidateDetails = Form.create()(withRouter(CandidateDetails));

export default WrappedCandidateDetails;