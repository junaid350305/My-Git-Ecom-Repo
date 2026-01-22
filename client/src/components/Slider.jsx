import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderComponent = ({ slides }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            {slide.title && (
              <h2
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  color: "white",
                  textShadow: "2px 2px 6px black",
                }}
              >
                {slide.title}
              </h2>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
