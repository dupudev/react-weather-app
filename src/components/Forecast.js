import React from 'react';
import Container from 'react-bootstrap/Container';

import { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';

const Forecast = ({ forecast }) => {
  const forecastRow = useRef();

  const { events } = useDraggable(forecastRow);

  return (
    <div
      {...events}
      className='forecast'
      style={{
        width: '100%',
        marginTop: '4px',
      }}
    >
      <Container fluid='md'>
        <div
          ref={forecastRow}
          className='forecast-row d-flex gap-2 overflow-auto text-white'
        >
          {forecast.list.map((item, idx) => {
            return (
              <div key={idx} className='forecast-item text-center'>
                <h4 className='m-0'>
                  {new Date(item.dt * 1000).getHours()}:00
                </h4>
                <img
                  style={{
                    width: '100px',
                    height: '100px',
                  }}
                  src={`./img/${item.weather[0].icon}.svg`}
                />
                <p className='text-capitalize'>{item.weather[0].main}</p>
                <div>
                  <p className='fs-1 m-0 position-relative'>
                    {Math.round(item.main.temp)}
                    <span
                      style={{
                        position: 'absolute',
                        fontSize: '20px',
                        fontWeight: '500',
                        top: '0',
                        right: '24px',
                      }}
                    >
                      o
                    </span>
                  </p>
                  <p className='m-0'>
                    {Math.round(item.main.temp_max)}&deg; /
                    {Math.round(item.main.temp_min)}&deg;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default Forecast;
