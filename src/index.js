import { DOM_DISPLAY as DOM } from './dom-interaction.js';

import {
  factoryTask as Task,
  factoryProject as Project,
  USER_MODULE as USER,
} from './data-logic.js';

//Start display

DOM.updateDisplay();

//Make the menu work for Mobiles

(() => {
  let menuBtn = document.querySelector('#project-mini-menu-btn');
  let returnBtn = document.querySelector('#project-return-btn ');

  let projectMini = document.querySelector('#project-mini');
  let projectSection = document.querySelector('#project-main');
  let listSection = document.querySelector('#list-main');

  menuBtn.addEventListener('click', (e) => {
    projectMini.style.display = 'none';
    listSection.style.display = 'none';

    projectSection.style.display = 'initial';
  });

  returnBtn.addEventListener('click', (e) => {
    projectMini.style.display = 'initial';
    listSection.style.display = 'initial';

    projectSection.style.display = 'none';
  });
})();
