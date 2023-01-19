import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { useEffect, useState, useRef } from 'react';
import Search from './components/Search';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

// API Keys
const key1 = '56991f9c14msh000d620068e4c37p10e847jsn3bf59dbd255c';
const key2 = '321f8ff9e0msh7c5090d3b1fd871p1054ebjsn2bdefb61939b';
const key3 = '8d06f4bde1msh3c15db9f2553d5bp10e026jsn75a446530be1';

const App = () => {
  const app = useRef();
  const blur = useRef();

  const [city, setCity] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [weatherCity, setWeatherCity] = useState(null);
  const [locationRejected, setLocationRejected] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  ///--------------------------------------------
  ///-----/  Load weather by geolocation   /-----
  ///--------------------------------------------

  useEffect(() => {
    getGeoLocation();
  }, []);

  const getGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      geolocationAccepted,
      geolocationRejected,
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  //!--------------------------------------------
  //!------/   If geolocation is rejected  /-----
  //!--------------------------------------------

  const geolocationRejected = () => {
    setLocationRejected(true);
  };

  //*--------------------------------------------
  //*-----/   If geolocation is accepted   /-----
  //*--------------------------------------------

  const geolocationAccepted = (position) => {
    const backgroundImage = new Image();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af
    `
    )
      .then((response) => response.json())
      .then((resJson) => {
        setWeatherCity(resJson);
        setCity({
          value: {
            latitude: `${resJson.coord.lat}`,
            longitude: `${resJson.coord.lon}`,
          },
          label: `${resJson.name}, ${resJson.sys.country}`,
          name: `${resJson.name}`,
        });

        fetch(
          `https://bing-image-search1.p.rapidapi.com/images/search?count=5&q=${resJson.name}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': key3,
              'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com',
            },
          }
        )
          .then((response) => response.json())
          .then((resJson) => {
            const backgroundUrl =
              resJson.value[Math.floor(Math.random() * resJson.value.length)]
                .contentUrl;
            backgroundImage.src = backgroundUrl;
            backgroundImage.onload = () => {
              app.current.style.backgroundImage = `linear-gradient(rgba(32,32,32, 0.9), rgba(55,55,55,0.3)), url(${backgroundUrl})`;
              setBackgroundLoaded(true);
              setImageLoaded(true);

              fetch(
                `https://api.openweathermap.org/data/2.5/forecast?cnt=8&units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af`
              )
                .then((response) => response.json())
                .then((resJson) => {
                  setForecast(resJson);
                })
                .catch((err) => console.log(err));
            };
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  ///--------------------------------------------
  ///-------/   Load weather by search   /-------
  ///--------------------------------------------

  const selectCity = (cityData) => {
    setLoading(true);
    setImageLoaded(false);

    if (!locationRejected) {
      blur.current.style.backdropFilter = 'blur(5px)';
    }

    const backgroundImage = new Image();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${cityData.value.latitude}&lon=${cityData.value.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af
    `
    )
      .then((response) => response.json())
      .then((resJson) => {
        setWeatherCity(resJson);

        fetch(
          `https://bing-image-search1.p.rapidapi.com/images/search?count=5&q=${cityData.name}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': key3,
              'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com',
            },
          }
        )
          .then((response) => response.json())
          .then((resJson) => {
            const backgroundUrl =
              resJson.value[Math.floor(Math.random() * resJson.value.length)]
                .contentUrl;
            backgroundImage.src = backgroundUrl;
            backgroundImage.onload = () => {
              app.current.style.backgroundImage = `linear-gradient(rgba(32,32,32, 0.9), rgba(55,55,55,0.3)), url(${backgroundUrl})`;
              blur.current.style.backdropFilter = 'blur(0)';
              setBackgroundLoaded(true);
              setLocationRejected(false);
              setImageLoaded(true);
              setLoading(false);

              fetch(
                `https://api.openweathermap.org/data/2.5/forecast?cnt=8&units=metric&lat=${cityData.value.latitude}&lon=${cityData.value.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af`
              )
                .then((response) => response.json())
                .then((resJson) => {
                  setForecast(resJson);
                })
                .catch((err) => console.log(err));
            };
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  console.log(loading);
  return (
    <div
      ref={app}
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className='App'
    >
      <div
        ref={blur}
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: '1',
          transition: '0.2s ease-in-out',
        }}
      ></div>

      <div
        style={{
          position: 'relative',
          zIndex: '2',
        }}
      >
        <Search city={city} setCity={setCity} selectCity={selectCity} />
        {!locationRejected && backgroundLoaded ? (
          <>
            {weatherCity && forecast ? (
              <>
                <CurrentWeather
                  city={city}
                  weatherCity={weatherCity}
                  imageLoaded={imageLoaded}
                  refreshWeather={selectCity}
                  backgroundLoaded={backgroundLoaded}
                />
                <Forecast forecast={forecast}></Forecast>
              </>
            ) : null}
          </>
        ) : locationRejected && !loading ? (
          <p className='loading-text text-center mt-5 pt-5'>
            Allow location access, or enter location manually.
          </p>
        ) : (
          <div className='loader-container'>
            {city ? (
              <p className='loading-text'>
                Loading Weather for <br /> {city.label}
              </p>
            ) : (
              <p className='loading-text'>
                Getting location... <br />
                &nbsp;
              </p>
            )}
            <div className='loader'>
              <div className='dot'></div>
              <div className='dot'></div>
              <div className='dot'></div>
              <div className='dot'></div>
              <div className='dot'></div>
            </div>
          </div>
        )}
      </div>
      {loading && (
        <div
          style={{
            zIndex: '-1',
          }}
          className='loader-container'
        >
          {city ? (
            <p className='loading-text'>
              Loading Weather for <br /> {city.label}
            </p>
          ) : (
            <p className='loading-text'> Getting location...</p>
          )}
          <div className='loader'>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
