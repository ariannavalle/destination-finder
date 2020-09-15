//parse created date and return month day year
const commentDate = date => {
  console.log(date)
  return date.split(" ").splice(1, 3).join(" ");
};

// on page load set hearts to active if city is in user favorites
window.addEventListener('load', () => {
  document.querySelectorAll('.heart-icon').forEach(item => {
    const cityId = item.getAttribute('city-id');

    axios
      .post(`${window.location.origin}/userfav`, { cityId })
      .then(response => {
        // console.log('window load', response.data);
        const city = response.data;
        if (city.isFav) item.src = `${window.location.origin}/images/heart_active.png`;
      })
      .catch(err => console.log(err));

  });

  // selection of the date in the comment media-body
  document.querySelectorAll('.media-body small i').forEach(item => {
    item.innerHTML = commentDate(item.innerHTML);
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
      .post(`${window.location.origin}/post/create/${cityId}`, { content })
      .then(response => {
        // console.log(response.data);
        if (response.data.data === '/login') {
          window.location.href = `${window.location.origin}/login`
        } else {
          let userComment = document.querySelector('#userComments');
          document.querySelector('#addComment').value = "";
          console.log(response.data)
          userComment.innerHTML = response.data.data.concat(userComment.innerHTML);
          // console.log('>>>>>>>>post<<<<<<<');
        }
      })
      .catch(err => console.log(err));

  });
}