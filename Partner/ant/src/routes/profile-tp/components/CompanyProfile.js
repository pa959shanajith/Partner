import React from 'react';
import CompanyProfileComponent from './company-pages';

// const StyleSheet_maxWidth = {
//   maxWidth: '1000px',
//   margin: 'auto'
// }
const StyleSheet_maxWidth2 = {
  alignItems: 'center',
  justifyContent: 'center'
}
// const StyleSheet_Heading3 = {
//   color: '#707070',
//   fontSize: '26px',
//   fontWeight: '600',
//   padding: '20px',
//   float: 'left'
// }

class AboutCompany extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  closeModalcallBack = () => {
    this.props.closeModal();
  }

  render(){
    // var closeModal = this.props.closeModal;
    return (
      <div className="row" style={StyleSheet_maxWidth2}>
        <div className="col-lg-12 container">
          {/* <div className="profile-card-v2 h-100 row" style={StyleSheet_maxWidth}>
            <h2 style={StyleSheet_Heading3}>Company Profile</h2> */}
          <CompanyProfileComponent closeModal={this.closeModalcallBack} />
          {/* </div> */}
        </div>
      </div>
    ) 
  }
}

// const AboutCompany = () => {
//   return (
//     <div className="row" style={StyleSheet_maxWidth2}>
//       <div className="col-lg-12 container">
//         {/* <div className="profile-card-v2 h-100 row" style={StyleSheet_maxWidth}>
//           <h2 style={StyleSheet_Heading3}>Company Profile</h2> */}
//         <CompanyProfileComponent />
//         {/* </div> */}
//       </div>
//     </div>
//   )
// }

export default AboutCompany;