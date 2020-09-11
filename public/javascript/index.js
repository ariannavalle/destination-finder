// on page load set hearts to active if city is in user favorites
window.addEventListener('load', () => {
  document.querySelectorAll('.heart-icon').forEach(item => {
    const cityId = item.getAttribute('city-id');

    axios
      .post(`${window.location.origin}/userfav`, { cityId })
      .then(response => {

        // console.log('window load', response.data);

        const city = response.data;
        if (city.isFav) {
          item.src = `${window.location.origin}/images/heart_active.png`;
        }
      })
      .catch(err => console.log(err));

  });
}, false);

// targeting heart icon for adding a city to a users fav list
document.querySelectorAll('.heart-icon').forEach(item => {

  item.addEventListener('click', event => {

    const cityId = item.getAttribute('city-id');
    axios
      .post(`${window.location.origin}/fav/`, { cityId })
      .then(response => {

        // console.log(response.data);

        const userFav = response.data;

        if (userFav.isFav) item.src = `${window.location.origin}/images/heart_active.png`;
        else item.src = `${window.location.origin}/images/heart_inactive.png`;

      })
      .catch(err => console.log(err));

  });
});

// comments
if (document.querySelector("#submitComment")) {
  document.querySelector("#submitComment").addEventListener('click', event => {
    const content = document.querySelector('#addComment').value;
    const cityId = document.querySelector('#commentForm').getAttribute('city-id');
  
    const data = {
      content,
      cityId
    }
  
    axios
      .post(`${window.location.origin}/create/${cityId}`, {
        content
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(err => console.log(err));
  });
}