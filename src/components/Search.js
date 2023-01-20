import React from 'react';

import Container from 'react-bootstrap/Container';
import { TbRefresh } from 'react-icons/tb';

import { AsyncPaginate } from 'react-select-async-paginate';

// API Keys
// const key1 = '56991f9c14msh000d620068e4c37p10e847jsn3bf59dbd255c';
const key2 = '170be3b95dmsh21d932dfda4b070p1fd497jsnaad03c51f796';

const Search = ({ city, selectCity }) => {
  const loadOptions = (userInputValue) => {
    return fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?sort=-population&namePrefix=${userInputValue}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': key2,
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data.map((city) => {
            return {
              value: {
                latitude: `${city.latitude}`,
                longitude: `${city.longitude}`,
              },
              label: `${city.name}, ${city.countryCode}`,
              name: `${city.name}`,
              country: `${city.country}`,
            };
          }),
        };
      })
      .catch((err) => console.error(err));
  };

  const selectOption = (cityData) => {
    selectCity(cityData);
  };

  return (
    <Container fluid='md' className='pt-3 d-flex justify-content-center gap-3'>
      <div style={{ maxWidth: '500px' }} className=' flex-grow-1 '>
        <AsyncPaginate
          placeholder='Search City'
          debounceTimeout={500}
          value={city}
          loadOptions={loadOptions} /// kao argument prima ono sto unosimo u search polje (ime grada)
          onChange={selectOption} /// kao argument prima podatke iz opcije koju odaberemo sa liste (podatke odabranog grada tj, podatke koje smo fetchovali)
        />
      </div>
      {city && (
        <TbRefresh className='refresh ' onClick={() => selectCity(city)} />
      )}
    </Container>
  );
};

export default Search;
