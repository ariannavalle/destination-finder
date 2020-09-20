document.addEventListener("DOMContentLoaded", function (event) {
  let checkboxes = document.querySelectorAll("input[type=checkbox]");
  let radioBtns = document.querySelectorAll("input[type=radio]");
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
    [...radioBtns].forEach(radioBtn => {
      radioBtn.addEventListener('change', function (event) {
        if (radioBtn.checked) {
          [...radioBtns].forEach(otherBtn => { otherBtn.parentElement.className = "btn btn-outline-primary" })
          radioBtn.parentElement.className = "btn btn-primary";
        }
        else {
          radioBtn.parentElement.className = "btn btn-outline-primary";
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


$('.heart-icon').ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

function hasTouch() {
  return 'ontouchstart' in document.documentElement
         || navigator.maxTouchPoints > 0
         || navigator.msMaxTouchPoints > 0;
}

if (hasTouch()) { // remove all the :hover stylesheets
  try { // prevent exception on browsers not supporting DOM styleSheets properly
    for (var si in document.styleSheets) {
      var styleSheet = document.styleSheets[si];
      if (!styleSheet.rules) continue;

      for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
        if (!styleSheet.rules[ri].selectorText) continue;

        if (styleSheet.rules[ri].selectorText.match(':hover')) {
          styleSheet.deleteRule(ri);
        }
      }
    }
  } catch (ex) {}
}