import React from 'react'
import Carousel from 'react-slick';
import "../../../styles/slick/slick.css";
import "../../../styles/slick/slick-theme.css";

const boxStyle = {
  width: '100%',
  display: 'inline-block',
  background: 'bisque',
  height: '300px',
  margin: '20px'
}

class EventsCarousel extends React.Component {
  constructor() {
    super();
    this.state = {
      galleryItems: [1, 2, 3, 4, 5, 6].map((i) => <h2 key={i}>{i}</h2>),
    }
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 2
    };
    return (
      <div className="events pt-4 pb-5">
        <Carousel {...settings}>
        <div style={{boxStyle}}>
          <h3>1</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>2</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>3</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>4</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>5</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>6</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>7</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>8</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>9</h3>
        </div>
        <div style={{boxStyle}}>
          <h3>10</h3>
        </div>
      </Carousel>
      </div>
    );
  }
}

export default EventsCarousel;