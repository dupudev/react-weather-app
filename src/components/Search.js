import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';

const Search = ({ city, setCity, selectCity }) => {
  const loadOptions = (userInputValue) => {
    const key1 = '56991f9c14msh000d620068e4c37p10e847jsn3bf59dbd255c';
    const key2 = '321f8ff9e0msh7c5090d3b1fd871p1054ebjsn2bdefb61939b';

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
    setCity(cityData);
    selectCity(cityData);
  };

  return (
    <div style={{ maxWidth: '500px' }} className='mx-auto'>
      <AsyncPaginate
        placeholder='Search city'
        debounceTimeout={500}
        value={city}
        loadOptions={loadOptions} /// kao argument prima ono sto unosimo u search polje (ime grada)
        onChange={selectOption} /// kao argument prima podatke iz opcije koju odaberemo sa liste (podatke odabranog grada tj, podatke koje smo fetchovali)
      />
    </div>
  );
};

export default Search;
