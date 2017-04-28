<template>
  <i class="material-icons" @click="recognize">keyboard_voice</i>
</template>

<script>
import Modernizr from 'modernizr';

/**
 * Workaround the issue that Modernizr return a function instead of a
 * @param {string} prop - the name of class to be prefixed
 * @param {Object} obj - object to be checked
 * @return {class} prefixed class
 */
function prefixedClass(prop, obj) {
  return obj[Modernizr.prefixed(prop, obj, false)];
}

export default {
  name: 'speech-recognition',
  props: ['options'],
  methods: {
    recognize() {
      const SpeechRecognition = prefixedClass('SpeechRecognition', window);
      const SpeechGrammarList = prefixedClass('SpeechGrammarList', window);

      const map = new Map(this.options);
      const names = [...map.keys()];
      const grammar = `
      #JSGF V1.0;
      grammar option;
      public <option> = '${names.join('|')}';
      `;

      const list = new SpeechGrammarList();
      list.addFromString(grammar, 1);

      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        alert(event.results);
      };

      recognition.start();
    },
  },
};
</script>
