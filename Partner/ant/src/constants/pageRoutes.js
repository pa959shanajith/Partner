const PAGEROUTES = {
    home: '#/app/dashboard',
}

// dashboard links
PAGEROUTES.dashboardComponentLinks = {
    jobsapplied: '#/app/jobs/saved-jobs/applied-jobs',
    savedjobs: '#/app/jobs/saved-jobs',
    recommendedjobs: '#/app/jobs/recommended-jobs',
    profileviews: '#/app/profile/profile-views' // redirect profile page
}

// footer links
PAGEROUTES.footerLinks = {
    About: 'https://www.shenzyn.com/#/aboutus',
    Career: 'https://www.shenzyn.com/#/search/Shenzyn',
    Help: 'https://www.shenzyn.com/#/contactus',
    Privacy: 'https://www.shenzyn.com/#/privacypolicy',
    Terms: 'https://www.shenzyn.com/#/termscondition',
    Facebook: 'https://www.facebook.com/WeShenzyn/',
    Instagram: 'https://www.instagram.com/we_shenzyn/',
    LinkedIn: 'https://www.linkedin.com/company/shenzyn/',
    YouTube: 'https://www.youtube.com/channel/UCJ3hSpePirYqXCAJo75OIhQ',
    Twitter: 'https://twitter.com/Shenzyn_EW'
}

// header links
PAGEROUTES.JobDetailComponentLinks = {
    jobsdescriptions: '#/app/jobs/job-details',
}
PAGEROUTES.endPointUrl = {
    default: process.env.REACT_APP_API_URL,
    // default: 'http://localhost:8080/',
    // local: 'http://localhost:8080/',
    // stage: 'https://stage-api.shenzyn.com/'
    //stage:'https://api.shenzyn.com/'
}

PAGEROUTES.widgetBot = {
    //STAGE
    stage: {
        server: '912333762531033149',
        channel: '919817261118787594' // 912333762963050541
    },
    //PROD
    prod: {
        server: '912589603133870090', // Shenzyn-Support
        channel: '912589603133870093' // #general
    }

}

PAGEROUTES.equipEndPointUrl = {
    default: process.env.REACT_APP_EQUIP_API_URL,
    //    default: 'http://localhost:5050/', //testing local url
    // local: 'http://localhost:5050/',
    // stage: 'https://equip-stage-api.shenzyn.com/',
    // prod: 'https://eq-api.shenzyn.com/'
}


export default PAGEROUTES;