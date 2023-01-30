<template>
  <component
    :is="chartType"
    :options="chartOptions"
    :data="mergedChartData"
  />
</template>
<script>
import { getNextFromArrayWrap }  from '@/helpersTMP/array';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

import pattern from 'patternomaly';
import _map from 'lodash/map';
export default {
  name: 'Chart',
  components: {
    Bar,
  },
  props: {
    chartId: {
      type: String,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
    makeAccessible: {
      type: Boolean,
      default: false,
    },
    overridePrimaryLabelRgb: {
      type: Array,
      default: () => [],
    },
    displayPatternedLabels: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultPrimaryLabelRgb: [0, 48, 120],
      minAlpha: 20,
      patterns: [
        'plus','cross','dash','cross-dash','dot','dot-dash','disc','ring','line','line-vertical','weave','zigzag',
        'zigzag-vertical','diagonal','diagonal-right-left','square','box','triangle','triangle-inverted','diamond','diamond-box',
      ],
    };
  },
  computed: {
    mergedChartData() {
      if (this.makeAccessible) {
        // Set the backgroundColur for the labels (in the chartData), optionally with alternating patterns
        const colourGeneratorObj = this.getNextColour(
          this.chartData.datasets.length,
          this.primaryLabelRGB,
          this.minAlpha,
          this.displayPatternedLabels
        );
        return {
          labels: this.chartData.labels,
          datasets: _map(this.chartData.datasets, o => {
            o.backgroundColor = colourGeneratorObj.next().value;
            return o;
          }),
        };
      }
      return this.chartData;
    },
    primaryLabelRGB() {
      if (this.makeAccessible && this.overridePrimaryLabelRgb.length) {
        return this.overridePrimaryLabelRgb;
      }
      else {
        return this.defaultPrimaryLabelRgb;
      }
    },
  },
  methods: {
    getNextColour: function* (numItems, baseColour, minAlpha, showPattern){
      const alphaStep = Math.round((100 - minAlpha) / numItems);
      let currentAlphaStep = 100;
      let pattern = '';
      const patternGeneratorObj = this.getAlternatePattern();
      while (true) {
        if (showPattern) {
          pattern = patternGeneratorObj.next().value;
        }
        const rgba = this.getRGBA(baseColour, currentAlphaStep, pattern);
        yield rgba;
        currentAlphaStep -= alphaStep;
      }
    },
    getNextPattern(index) {
      return getNextFromArrayWrap(this.patterns, index);
    },
    getAlternatePattern: function* (){
      // Alternates between returning the next pattern from an array and no pattern
      let pattern = '';
      let index = 0;
      while (true) {
        if (!pattern) {
          pattern = this.getNextPattern(index);
          index = index + 1;
        }
        else {
          pattern = '';
        }
        yield pattern;
      }
    },
    getRGBA(baseColour, alpha, chosenPattern) {
      const alphaDecimal = alpha / 100;
      const rgba = `rgba(${baseColour}, ${alphaDecimal})`;
      if (chosenPattern) {
        return [
          pattern.draw(chosenPattern, rgba),
        ];
      }
      else {
        return rgba;
      }
    },
  },
};
</script>
