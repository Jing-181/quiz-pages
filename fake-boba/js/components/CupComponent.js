import { TOPPING_STYLES } from '../data/constants.js';

export default {
  name: 'CupComponent',
  props: {
    liquidColor: { type: String, default: '#C4956A' },
    liquidHeight: { type: Number, default: 70 },
    cupType: { type: String, default: 'classic' }, // classic | fat | tall
    showStraw: { type: Boolean, default: true },
    showIce: { type: Boolean, default: false },
    iceCount: { type: Number, default: 0 },
    toppings: { type: Array, default: function () { return []; } },
    showSteam: { type: Boolean, default: false },
    size: { type: String, default: 'normal' }, // normal | mini | home
    tilted: { type: Boolean, default: false },
    wobbling: { type: Boolean, default: false },
    pouring: { type: Boolean, default: false },
  },
  computed: {
    toppingItems: function () {
      var items = [];
      for (var i = 0; i < this.toppings.length; i++) {
        var name = this.toppings[i];
        var style = TOPPING_STYLES[name];
        if (!style) continue;
        if (style.shape === 'layer') {
          // Cream layer is handled separately in template
          continue;
        }
        items.push({
          name: name,
          style: style,
          left: 15 + (i * 23) % 70,
          bottom: 5 + (i * 17) % 40,
        });
      }
      return items;
    },
    hasCreamLayer: function () {
      return this.toppings.indexOf('芝士奶盖') >= 0;
    },
  },
  template: `
    <div class="cup-wrapper" :class="[size, { tilted }]">
      <div class="cup-straw" v-if="showStraw"></div>
      <div class="cup-rim" :class="size"></div>
      <div class="cup-body" :class="[cupType, size, { pouring, wobbling }]">
        <div class="cup-liquid" :style="{ height: liquidHeight + '%', background: liquidColor }">
          <div class="liquid-wave"></div>
          <!-- Topping dots rendered inside liquid -->
          <div v-for="item in toppingItems"
               :key="item.name + '-' + item.left"
               class="cup-topping-dot"
               :style="{
                 left: item.left + '%',
                 bottom: item.bottom + '%',
                 width: item.style.size + 'px',
                 height: item.style.size + 'px',
                 borderRadius: item.style.shape === 'circle' || item.style.shape === 'ellipse' ? '50%' : (item.style.shape === 'square' ? '3px' : '2px'),
                 background: getToppingBackground(item.style),
                 boxShadow: getToppingBoxShadow(item.style),
                 transform: item.style.shape === 'ellipse' ? 'scaleY(0.65)' : ''
               }">
          </div>
        </div>
        <!-- Ice cubes -->
        <div class="cup-ice-container" v-if="showIce">
          <div v-for="i in iceCount" :key="'ice-'+i"
               class="ice-cube"
               :class="'ice-cube-' + ((i % 3) + 1)"
               :style="{ left: (10 + (i*17) % 75) + '%', top: (10 + (i*23) % 50) + '%', animationDelay: (i * 0.5) + 's' }">
          </div>
        </div>
        <!-- Cream layer for 芝士奶盖 -->
        <div v-if="hasCreamLayer" class="cream-layer spread"></div>
        <!-- Cup highlight/glass effect -->
        <div class="cup-highlight"></div>
      </div>
      <!-- Steam -->
      <div class="steam-container" v-if="showSteam">
        <div class="steam-line"></div>
        <div class="steam-line"></div>
        <div class="steam-line"></div>
      </div>
    </div>`,
  methods: {
    getToppingBackground: function (style) {
      if (style.extra && style.extra.indexOf('background:') === 0) {
        return undefined; // handled via extra CSS
      }
      if (style.extra && style.extra.indexOf('box-shadow') === 0) {
        return style.color;
      }
      if (style.extra && style.extra.indexOf('transform:') === 0) {
        return style.color;
      }
      return style.color;
    },
    getToppingBoxShadow: function (style) {
      if (style.extra && style.extra.indexOf('box-shadow') === 0) {
        return style.extra.replace('box-shadow:', '').trim();
      }
      return undefined;
    },
  },
};
