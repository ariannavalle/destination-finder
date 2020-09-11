// on load
document.addEventListener('load', () => {
  document.querySelectorAll('.heart-icon').forEach(item => {

    axios
      .get(`http://localhost:3000/userfav`)
      .then(response => {

        console.log(response.data);

        const favs = response.data;
        const cityId = item.getAttribute('city-id');
        if (favs.includes(cityId)) {
          item.src = "http://localhost:3000/images/heart_active.png";
        }
      })
      .catch(err => console.log(err));

  });
});

// targeting heart icon for adding a city to a users fav list
document.querySelectorAll('.heart-icon').forEach(item => {

  item.addEventListener('click', event => {

    const cityId = item.getAttribute('city-id');
    axios
      .post(`http://localhost:3000/fav/`, { cityId })
      .then(response => {

        console.log(response.data);
        item.src = "http://localhost:3000/images/heart_active.png";

        const userFav = response.data;
      })
      .catch(err => console.log(err));

  });
});

// comments
document.querySelector("#submitComment").addEventListener('click', event => {
  const content = document.querySelector('#addComment').value;
  const cityId = document.querySelector('#commentForm').getAttribute('city-id');

  const data = {
    content,
    cityId
  }

  axios
    .post(`http://localhost:3000/create/${cityId}`, {
      content
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(err => console.log(err));
});