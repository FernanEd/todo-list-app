import { ICON } from './icons.js';

function factoryFormElement({ title, fields, button }, { fieldsValues }) {
  let newForm = document.createElement('form');
  newForm.classList.add('modal-form');

  let formHeader = document.createElement('div');
  formHeader.classList.add('form-header');

  let formClose = document.createElement('div');
  formClose.classList.add('form-close', 'btn', 'btn-secondary');
  formClose.innerHTML = ICON.cross;

  let formTitle = document.createElement('h2');
  formTitle.classList.add('form-title');
  formTitle.innerText = title;

  formHeader.append(formClose);
  formHeader.append(formTitle);

  newForm.append(formHeader);

  let relativeIndx = 0;

  for (let field of fields) {
    let newField = document.createElement('div');
    newField.classList.add('form-field');

    let fieldName = document.createElement('label');
    fieldName.innerText = field.name;

    let fieldInput;

    if (field.type !== 'textarea') {
      fieldInput = document.createElement('input');
      fieldInput.setAttribute('type', field.type);
    } else {
      fieldInput = document.createElement('textarea');
    }

    fieldInput.setAttribute('name', field.name);
    fieldInput.setAttribute('id', field.id);

    if (field.required) fieldInput.setAttribute('required', '');

    if (field.type === 'number' || field.type === 'date') {
      fieldInput.setAttribute('min', field.minrange);
      fieldInput.setAttribute('max', field.maxrange);
    }

    newField.append(fieldName);
    newField.append(fieldInput);

    newForm.append(newField);

    //Ad values if they exist

    if (fieldsValues) fieldInput.value = fieldsValues[relativeIndx];

    relativeIndx++;
  }

  let formSubmit = document.createElement('button');
  formSubmit.classList.add('form-submit', 'btn', 'btn-primary', 'btn-long');
  formSubmit.innerText = button;

  newForm.append(formSubmit);

  return newForm;
}

function launchForm(formObj, submitHandler, formValuesObj = {}) {
  let formElement = new factoryFormElement(formObj, formValuesObj);
  let bg = document.createElement('div');
  bg.classList.add('modal-bg');
  bg.append(formElement);

  let content = document.querySelector('#content');
  content.append(bg);

  let closeBtn = formElement.querySelector('.form-close');

  closeBtn.addEventListener(
    'click',
    (e) => {
      formElement.reset();
      content.removeChild(bg);
    },
    { once: true }
  );

  formElement.addEventListener(
    'submit',
    (e) => {
      e.preventDefault();
      submitHandler(formElement);
      closeBtn.click();
    },
    { once: true }
  );
}

export { factoryFormElement, launchForm };
