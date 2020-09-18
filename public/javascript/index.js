// delete comments from details page
const deleteCommentBtn = () => {
  document.querySelectorAll(".delete-btn").forEach(deleteBtn => {
    deleteBtn.addEventListener('click', event => {
      const postId = deleteBtn.getAttribute('comment-id');
      const cityId = deleteBtn.getAttribute('city-id');

      const data = {
        postId,
        cityId
      };

      axios
        .post(`${window.location.origin}/post/delete`, data)
        .then(response => {
          // console.log(response.data)
          const { wasDeleted } = response.data;
          if (wasDeleted) deleteBtn.parentElement.remove();
        })
        .catch(err => console.log(err));

    });
  });
}
//parse created date and return month day year
const commentDate = date => {
  // console.log(date)
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

  // add event listeners to all comment delete buttons
  deleteCommentBtn();

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
  
    axios
      .post(`${window.location.origin}/post/create/${cityId}`, { content })
      .then(response => {
        // console.log(response.data);
        if (response.data.data === '/login') {
          window.location.href = `${window.location.origin}/login`
        } else {
          let userComment = document.querySelector('#userComments');
          document.querySelector('#addComment').value = "";
          // console.log(response.data)
          userComment.innerHTML = response.data.data.concat(userComment.innerHTML);
          // reapply event listeners to comment delete buttons
          deleteCommentBtn();
        }
      })
      .catch(err => console.log(err));

  });
}

// signup form and user messages
if (document.querySelector('#signup-btn')) {
  document.querySelector('#signup-btn').addEventListener('click', event => {
    const email = document.querySelector('#inputEmail').value;
    const username = document.querySelector('#inputUsername').value;
    const password = document.querySelector('#inputPassword').value;
    const textCenter = document.querySelector('.text-center');
    const errorContainer = document.querySelector('.error-container');

    const data = {
      email,
      username,
      password
    }

    axios
      .post(`${window.location.origin}/signup`, data)
      .then(response => {
        const { status, errorMessage } = response.data;

        if (status) {
          textCenter.innerHTML = `<br>
                                  <div id="successful-signup" class="form-signin">
                                    <h1 class="h3 mb-3 font-weight-normal">Thank you for</h1>
                                    <h1 class="h3 mb-3 font-weight-normal">Signing up!</h1>
                                    <a href="/login"><button class="btn btn-lg btn-primary btn-block">Go to login</button></a>
                                  </div>`;
        } else {
          errorContainer.innerHTML = `<p class="alert alert-danger alert-dismissible fade show">${errorMessage}</p>`;
        }
        
      })
      .catch(err => console.log(err));
  })
}
