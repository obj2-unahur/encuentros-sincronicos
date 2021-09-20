import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js';
import PlantUml from './plantUml';

import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/beige.css';
import '../public/css/github-dark-dimmed.css';

const slide = new Reveal({
  hash: true,
  plugins: [Markdown, Highlight],
  plugins: [Markdown, Highlight, Zoom, PlantUml],
});

slide.initialize();
