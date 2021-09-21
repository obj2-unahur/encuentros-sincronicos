// Código tomado de https://github.com/reveal-plantuml/reveal-plantuml.github.io y adaptado a la versión actual de RevealJS.
// TODO: hacer pull request o forkear y crear el propio

import encoder from '../_snowpack/pkg/plantuml-encoder.js';

export default () => ({
  id: 'plantuml',
  init: (deck) => {
    const config = deck.getConfig().plantuml || {};
    const server = config.serverPath || '//www.plantuml.com/plantuml/svg/';

    deck.on('ready', () => {
      document
        .querySelectorAll('.reveal pre code.plantuml')
        .forEach(function (block) {
          const img = document.createElement('object');
          img.type = 'image/svg+xml';
          img.setAttribute('data', server + encoder.encode(block.innerText));

          // TODO: mejorar esto, puede ser con una clase o algún parámetro de configuración
          img.setAttribute('style', 'width: 50%');

          const pre = block.parentElement;
          pre.parentNode.replaceChild(img, pre);
        });
    });
  },
});
