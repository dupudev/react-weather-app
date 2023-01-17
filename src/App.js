import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { useEffect, useState } from 'react';
import Search from './components/Search';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

const key1 = '56991f9c14msh000d620068e4c37p10e847jsn3bf59dbd255c';
const key2 = '321f8ff9e0msh7c5090d3b1fd871p1054ebjsn2bdefb61939b';

const App = () => {
  const [city, setCity] = useState(null);
  const [cityImage, setCityImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(true);

  const [weatherCity, setWeatherCity] = useState(null);

  const [initialCityImage, setInitialCityImage] = useState(null);
  const [initialCityImageLoaded, setInitialCityImageLoaded] = useState(false);

  const [locationRejected, setlocationRejected] = useState(false);

  const [forecast, setForecast] = useState(null);

  ///Geo location accepted _______________________________________________________

  const geolocationAccepted = (position) => {
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
              'X-RapidAPI-Key': key2,
              'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com',
            },
          }
        )
          .then((response) => response.json())
          .then((resJson) => {
            setInitialCityImage(
              resJson.value[Math.floor(Math.random() * resJson.value.length)]
                .contentUrl
            );
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.log(err));

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?cnt=8&units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af`
    )
      .then((response) => response.json())
      .then((resJson) => setForecast(resJson))
      .catch((err) => console.log(err));
  };

  ///Geo location rejected _______________________________________________________

  const geolocationRejected = (position) => {
    setlocationRejected(true);
  };
  ///___________________________________________________________________

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

  useEffect(() => {
    getGeoLocation();
  }, []);

  const selectCity = (cityData) => {
    setInitialCityImageLoaded(true);
    setImageLoaded(false);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${cityData.value.latitude}&lon=${cityData.value.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af
    `
    )
      .then((response) => response.json())
      .then((resJson) => setWeatherCity(resJson))
      .catch((err) => console.log(err));

    fetch(
      `https://bing-image-search1.p.rapidapi.com/images/search?count=5&q=${cityData.name}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': key2,
          'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((resJson) =>
        setCityImage(
          resJson.value[Math.floor(Math.random() * resJson.value.length)]
            .contentUrl
        )
      )
      .catch((err) => console.error(err));

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?cnt=8&units=metric&lat=${cityData.value.latitude}&lon=${cityData.value.longitude}&appid=dbd21099bf102ac8bb8725685c1ac9af`
    )
      .then((response) => response.json())
      .then((resJson) => setForecast(resJson))
      .catch((err) => console.log(err));
  };

  return (
    <div className='App'>
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: '-1',
          backgroundImage:
            'linear-gradient(rgba(32,32,32, 0.9), rgba(55,55,55,0.3))',
        }}
      ></div>

      <img
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: '-3',
          objectFit: 'cover',
          transition: 'all 0.5s ease-in-out',
          opacity: initialCityImageLoaded ? '1' : '0',
        }}
        src={initialCityImage}
        onLoad={() => setInitialCityImageLoaded(true)}
      />

      <img
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: '-2',
          objectFit: 'cover',
          transition: 'all 0.3s ease-in-out',
          filter: imageLoaded ? 'blur(0)' : 'blur(10px)',
        }}
        src={cityImage}
        onLoad={() => setImageLoaded(true)}
      />

      <Container fluid='md' className='py-3'>
        <Search city={city} setCity={setCity} selectCity={selectCity} />
        {weatherCity && forecast && initialCityImageLoaded ? (
          <CurrentWeather
            city={city}
            weatherCity={weatherCity}
            imageLoaded={imageLoaded}
            refreshWeather={selectCity}
          />
        ) : locationRejected ? (
          <h5 className='text-center text-white mt-5 pt-5'>
            Allow Weather App to access your location, or enter location
            manually.
          </h5>
        ) : (
          <div className='loader'>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
          </div>
        )}
      </Container>
      {weatherCity && forecast && initialCityImageLoaded ? (
        <Forecast forecast={forecast}></Forecast>
      ) : locationRejected ? null : (
        <div className='loader'>
          <div className='dot'></div>
          <div className='dot'></div>
          <div className='dot'></div>
          <div className='dot'></div>
          <div className='dot'></div>
        </div>
      )}
    </div>
  );
};

export default App;

// style={{
//   backgroundImage: `linear-gradient(rgba(32,32,32, 0.9), rgba(55,55,55,0.3)), url(${cityImage})`,
// }}
