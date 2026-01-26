import { useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Slick from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';

function Slider({ slides, autoplay = true, autoplaySpeed = 3000, height = '400px' }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = React.useRef(null);
  const theme = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    beforeChange: (current, next) => setCurrentSlide(next),
    customPaging: (i) => (
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: i === currentSlide ? theme.palette.primary.main : 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      />
    ),
    appendDots: (dots) => (
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1.5,
          zIndex: 10,
          '& li': {
            margin: 0,
            listStyle: 'none',
          },
        }}
      >
        {dots}
      </Box>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        boxShadow: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(255,107,122,0.2)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <Slick ref={sliderRef} {...settings}>
        {slides.map((slide) => (
          <Box
            key={slide.id}
            sx={{
              position: 'relative',
              height: height,
              overflow: 'hidden',
              display: 'flex !important',
            }}
          >
            {/* Slide Image */}
            <Box
              component="img"
              src={slide.image}
              alt={slide.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />

            {/* Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: { xs: '2rem', md: '4rem' },
              }}
            >
              {/* Content */}
              <Box
                sx={{
                  color: 'white',
                  animation: 'slideInLeft 0.8s ease-out',
                  '@keyframes slideInLeft': {
                    from: {
                      opacity: 0,
                      transform: 'translateX(-50px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                }}
              >
                {slide.subtitle && (
                  <Box
                    sx={{
                      fontSize: { xs: '0.8rem', md: '1rem' },
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      mb: 1,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {slide.subtitle}
                  </Box>
                )}

                <Box
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                    mb: 2,
                    lineHeight: 1.2,
                  }}
                >
                  {slide.title}
                </Box>

                {slide.description && (
                  <Box
                    sx={{
                      fontSize: { xs: '0.9rem', md: '1.1rem' },
                      mb: 3,
                      maxWidth: '500px',
                      lineHeight: 1.6,
                      textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
                    }}
                  >
                    {slide.description}
                  </Box>
                )}

                {slide.cta && (
                  <Box
                    component="a"
                    href={slide.ctaLink || '#'}
                    sx={{
                      display: 'inline-block',
                      px: 3,
                      py: 1.5,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: theme.shape.borderRadius,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 16px ${theme.palette.primary.main}44`,
                      },
                    }}
                  >
                    {slide.cta}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Slick>

      {/* Navigation Arrows */}
      <IconButton
        onClick={handlePrevious}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          color: theme.palette.primary.main,
          zIndex: 10,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'white',
            transform: 'translateY(-50%) scale(1.1)',
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          color: theme.palette.primary.main,
          zIndex: 10,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'white',
            transform: 'translateY(-50%) scale(1.1)',
          },
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* CSS Overrides for Slick Carousel - CENTERED DOTS */}
      <style>{`
        .slick-slider {
          position: relative;
        }

        .slick-dots {
          position: absolute !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          justify-content: center !important;
          gap: 12px !important;
          width: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 10;
        }

        .slick-dots li {
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
          display: inline-block !important;
        }

        .slick-dots li button {
          display: block !important;
          width: 12px !important;
          height: 12px !important;
          padding: 0 !important;
          cursor: pointer !important;
          border: none !important;
          outline: none !important;
          background-color: rgba(255,255,255,0.5) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }

        .slick-dots li button:before {
          display: none !important;
        }

        .slick-dots li.slick-active button {
          background-color: #e94560 !important;
        }

        .slick-dots li button:hover {
          background-color: #e94560 !important;
        }

        .slick-track {
          display: flex;
        }

        .slick-slide {
          margin: 0 !important;
        }
      `}</style>
    </Box>
  );
}

export default Slider;
