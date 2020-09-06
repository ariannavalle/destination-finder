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
});