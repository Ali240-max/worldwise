import { createContext, useEffect, useContext, useState } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState(() => {
    const storedCities = localStorage.getItem("cities");
    return storedCities ? JSON.parse(storedCities) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(
    function () {
      localStorage.setItem("cities", JSON.stringify(cities));
    },
    [cities]
  );

  function getCity(id) {
    const city = cities.find((c) => c.id === id);
    setCurrentCity(city);
  }

  async function createCity(newCity) {
    setIsLoading(true);
    try {
      setCities((prevCities) => [...prevCities, newCity]);
    } catch (err) {
      console.error("There was an error creating the city:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    setIsLoading(true);
    try {
      setCities((prevCities) => prevCities.filter((city) => city.id !== id));
    } catch (err) {
      console.error("There was an error deleting the city:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
