import { useEffect, useState, useRef } from 'react';
import Search from './components/Search';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

// API Keys
const key1 = '56991f9c14msh000d620068e4c37p10e847jsn3bf59dbd255c';
// const key2 = '170be3b95dmsh21d932dfda4b070p1fd497jsnaad03c51f796';

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
  const [loadCount, setLoadCount] = useState(0);

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
    setLoadCount((prev) => ++prev);
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
          `https://duckduckgo-image-search.p.rapidapi.com/search/image?q=${resJson.name}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': key1,
              'X-RapidAPI-Host': 'duckduckgo-image-search.p.rapidapi.com',
            },
          }
        )
          .then((response) => response.json())
          .then((resJson) => {
            console.log(resJson);
            const backgroundUrl =
              resJson.results[
                Math.round(Math.random() * resJson.results.length)
              ].image;
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
    setLoadCount((prev) => ++prev);
    setLoading(true);
    setImageLoaded(false);
    setLocationRejected(false);

    const animations = document.getAnimations();
    animations.forEach((animations) => {
      animations.reverse();
    });

    const backgroundImage = new Image();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${cityData.value.latitude}&lon=${cityData.value.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af
    `
    )
      .then((response) => response.json())
      .then((weatherJson) => {
        setCity(cityData);
        fetch(
          `https://duckduckgo-image-search.p.rapidapi.com/search/image?q=${cityData.name}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': key1,
              'X-RapidAPI-Host': 'duckduckgo-image-search.p.rapidapi.com',
            },
          }
        )
          .then((response) => response.json())
          .then((resJson) => {
            console.log(resJson);
            const backgroundUrl =
              resJson.results[
                Math.round(Math.random() * resJson.results.length)
              ].image;
            backgroundImage.src = backgroundUrl;
            backgroundImage.onload = () => {
              app.current.style.backgroundImage = `linear-gradient(rgba(32,32,32, 0.9), rgba(55,55,55,0.3)), url(${backgroundUrl})`;
              setLoading(false);
              setBackgroundLoaded(true);

              fetch(
                `https://api.openweathermap.org/data/2.5/forecast?cnt=8&units=metric&lat=${cityData.value.latitude}&lon=${cityData.value.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af`
              )
                .then((response) => response.json())
                .then((forecastJson) => {
                  setForecast(forecastJson);
                  setWeatherCity(weatherJson);
                  setImageLoaded(true);

                  setTimeout(() => {
                    animations.forEach((animation) => {
                      animation.cancel();
                      animation.reverse();
                    });
                  }, 1000);
                })
                .catch((err) => console.log(err));
            };
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

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
        className='blur'
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
        <Search city={city} selectCity={selectCity} />
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
