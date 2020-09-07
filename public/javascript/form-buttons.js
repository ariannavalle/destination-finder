document.addEventListener("DOMContentLoaded", function (event) {
  let checkboxes = document.querySelectorAll("input[type=checkbox]");
  [...checkboxes].forEach(checkbox => {
    checkbox.addEventListener('change', function (event) {
      if (checkbox.checked) {
        checkbox.parentElement.className = "btn btn-primary";
      }
      else {
        checkbox.parentElement.className = "btn btn-outline-primary";
      }
    });
  });

  let favorites = document.querySelectorAll(".heart-icon");
  [...favorites].forEach(fav => {
    fav.addEventListener('click', function (event) {
      if (fav.getAttribute("src") === "images/heart_inactive.png") {
        fav.setAttribute("src", "images/heart_active.png");
      }
      else {
        fav.setAttribute("src", "images/heart_inactive.png");
      }
    })
  });
});


