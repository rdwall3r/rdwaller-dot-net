document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  if (!form) return;

  const requiredFields = Array.from(form.querySelectorAll('[required], [aria-required]'));
  const fields = Array.from(form.querySelectorAll('input, textarea, select')).filter(
    function (el) { return el.type !== 'submit'; }
  );

  form.addEventListener('submit', function (e) {
    let hasError = false;
    requiredFields.forEach(function (field) {
      if (!isValid(field)) hasError = true;
    });
    if (hasError) {
      const firstInvalid = requiredFields.find(function (f) {
        return f.getAttribute('aria-invalid') === 'true';
      });
      if (firstInvalid) firstInvalid.focus();
      e.preventDefault();
    }
  });

  requiredFields.forEach(function (field) {
    field.addEventListener('invalid', function () {
      isValid(field);
    });
  });

  fields.forEach(function (field) {
    field.addEventListener('keyup', validateField);
    field.addEventListener('blur', validateField);
  });
});

function validateField(e) {
  const field = e.target;

  if ((e.key === 'Tab' || e.key === 'Shift') && field.value.length === 0) {
    return;
  }

  if (typeof field.checkValidity === 'function') {
    field.checkValidity();
  }

  isValid(field);
}

function isValid(field) {
  const errID = field.id + '-err';
  const errContainer = document.getElementById(errID);
  const msg = field.getAttribute('data-errmsg');
  let validFunc = null;

  switch (field.type) {
    case 'text':
      validFunc = isValidLength;
      break;
    case 'email':
      validFunc = isValidEmail;
      break;
    case 'tel':
      validFunc = isValidTelephone;
      break;
    default:
      if (field.tagName.toLowerCase() !== 'textarea') return true;
      validFunc = isValidLength;
  }

  if (!validFunc(field)) {
    if (field.getAttribute('aria-invalid') === 'true') return false;
    errContainer.setAttribute('role', 'alert');
    errContainer.innerHTML = '<p id="' + errID + '-msg">' + msg + '</p>';
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errID + '-msg');
    return false;
  } else {
    field.removeAttribute('aria-describedby');
    field.setAttribute('aria-invalid', 'false');
    errContainer.removeAttribute('role');
    errContainer.innerHTML = '';
    return true;
  }
}

function isValidLength(field) {
  return field.value.length >= 2;
}

function isValidEmail(field) {
  const value = field.value;
  return value.length > 0 && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
}

function isValidTelephone(field) {
  const value = field.value;
  if (value.length === 0) return true;
  return /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value);
}
