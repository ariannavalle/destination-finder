
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

$('.heart-icon').ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});