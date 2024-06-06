// login


const getMoviesFromApi = async (x) => {
  const queryParams = `?genre=${x.genre}`
  console.log(x, "holis");
  console.log('Se están pidiendo las películas de la app');
  const response = await fetch('//localhost:4000/movies' + queryParams);
  const data = await response.json();
  return data;
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi
};

export default objToExport;
