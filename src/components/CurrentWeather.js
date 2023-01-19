import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { TbRefresh } from 'react-icons/tb';

const CurrentWeather = ({ city, weatherCity, imageLoaded, refreshWeather }) => {
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date();

  return (
    <Container fluid='md' className='pb-3 '>
      <div
        style={{ color: 'white' }}
        className='current-weather overflow-hidden mt-5 mb-4 pb-4'
      >
        <div className='d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <h2 className='weather-city d-inline-block m-0'>
              {city.name}, {weatherCity.sys.country}
            </h2>
            {!imageLoaded && (
              <div className='spinner'>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
              </div>
            )}
          </div>

          <TbRefresh className='refresh' onClick={() => refreshWeather(city)} />
        </div>
        <p className='weather-date mb-0'>
          {month[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </p>
        <div className=' d-flex flex-column flex-md-row align-items-start justify-content-between gap-5 '>
          <div className='weather-info pt-4'>
            <div className='d-flex align-items-center justify-content-start'>
              <div className='d-inline-block text-center'>
                <img
                  className='weather-icon'
                  src={`./img/${weatherCity.weather[0].icon}.svg`}
                  alt=''
                />
                <p className='weather-description mb-0 text-center text-capitalize'>
                  {weatherCity.weather[0].description}
                </p>
              </div>
              <div className='ms-3'>
                <p className='mb-2 mt-3 weather-temp position-relative'>
                  {Math.round(weatherCity.main.temp)}
                  <span className='weather-stepen'>o</span>
                </p>
                <p className='weather-min-max text-center m-0'>
                  {Math.round(weatherCity.main.temp_max)}&deg; /&nbsp;
                  {Math.round(weatherCity.main.temp_min)}&deg;
                </p>
              </div>
            </div>
          </div>
          <Row
            xs={2}
            sm={3}
            md={1}
            className='weather-details d-flex flex-wrap flex-md-column gy-3'
          >
            {/* Feels like */}
            <Col className='d-flex'>
              <div className='weather-detail-img'>
                <img
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                  src='./img/thermometer.svg'
                />
              </div>
              <div className='weather-detail-text mt-2'>
                <p className='mb-0'>
                  <span style={{ fontWeight: '300' }} className=''>
                    Feels like
                  </span>
                </p>
                <p className='mb-0' style={{ fontWeight: '600' }}>
                  {Math.round(weatherCity.main.feels_like)}&nbsp;&deg;C
                </p>
              </div>
            </Col>

            {/* Humidity */}
            <Col className='d-flex'>
              <div className='weather-detail-img'>
                <img
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                  src='./img/humidity.svg'
                />
              </div>
              <div className='weather-detail-text mt-2'>
                <p className='mb-0'>
                  <span style={{ fontWeight: '300' }} className=''>
                    Humidity
                  </span>
                </p>
                <p className='mb-0' style={{ fontWeight: '600' }}>
                  {Math.round(weatherCity.main.humidity)} %
                </p>
              </div>
            </Col>

            {/* Atmospheric pressure */}
            <Col className='d-flex'>
              <div className='weather-detail-img'>
                <img
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                  src='./img/barometer.svg'
                />
              </div>
              <div className='weather-detail-text mt-2'>
                <p className='mb-0'>
                  <span style={{ fontWeight: '300' }} className=''>
                    Pressure
                  </span>
                </p>
                <p className='mb-0' style={{ fontWeight: '600' }}>
                  {Math.round(weatherCity.main.pressure)} mbar
                </p>
              </div>
            </Col>

            {/* Wind speed */}
            <Col className='d-flex'>
              <div className='weather-detail-img'>
                <img
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                  src='./img/windsock.svg'
                />
              </div>
              <div className='weather-detail-text mt-2'>
                <p className='mb-0'>
                  <span style={{ fontWeight: '300' }} className=''>
                    Wind speed
                  </span>
                </p>
                <p className='mb-0' style={{ fontWeight: '600' }}>
                  {Math.round(weatherCity.wind.speed)} m/s
                </p>
              </div>
            </Col>

            {/* Cloudiness */}
            <Col className='d-flex'>
              <div className='weather-detail-img'>
                <img
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                  src='./img/cloudy.svg'
                />
              </div>
              <div className='weather-detail-text mt-2'>
                <p className='mb-0'>
                  <span style={{ fontWeight: '300' }} className=''>
                    Cloudiness
                  </span>
                </p>
                <p className='mb-0' style={{ fontWeight: '600' }}>
                  {Math.round(weatherCity.clouds.all)} %
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default CurrentWeather;
