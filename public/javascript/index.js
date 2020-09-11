
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

// post comments on city details page
if (document.querySelector("#submitComment")) {
  document.querySelector("#submitComment").addEventListener('click', event => {
    const commentSection = document.querySelector('#addComment');
    const cityId = document.querySelector('#commentForm').getAttribute('city-id');
    const content = commentSection.value;

    // console.log(content, cityId);
  
    axios
      .post(`${window.location.origin}/post/create/${cityId}`, {
        content
      })
      .then(response => {

        // console.log(response.data.newComment);
        let userComment = document.querySelector('#userComments');
        document.querySelector('#addComment').value = "";
        userComment.innerHTML = response.data.newComment.concat(userComment.innerHTML);
        console.log('>>>>>>>>post<<<<<<<')

      })
      .catch(err => console.log(err));
  });
}