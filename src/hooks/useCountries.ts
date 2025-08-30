import countries from 'world-countries';

interface Country {
  value: string;
  label: string;
  flag: string;
  latlng: [number, number];
  region: string;
}

const formattedCountries: Country[] = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

export const useCountries = () => {
  const getAll = (): Country[] => formattedCountries;

  const getByValue = (value: string): Country | undefined => {
    return formattedCountries.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue
  };
};
