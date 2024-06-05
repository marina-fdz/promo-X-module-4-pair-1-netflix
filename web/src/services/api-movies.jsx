// login


const getMoviesFromApi = async () => {
  console.log('Se están pidiendo las películas de la app');
  const response = await fetch('//localhost:4000/movies');
  const data = await response.json();
  return data;
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi
};

export default objToExport;
