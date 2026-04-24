export default {
  name: 'ShakeProgress',
  props: {
    progress: { type: Number, default: 0 },
  },
  computed: {
    dashOffset: function () {
      return 251.2 - (this.progress / 100) * 251.2;
    },
  },
  template: '\
    <div class="shake-area">\
      <svg class="shake-progress-ring" width="90" height="90" viewBox="0 0 90 90">\
        <defs>\
          <linearGradient id="shakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">\
            <stop offset="0%" stop-color="#FF6B8A"/>\
            <stop offset="100%" stop-color="#FFB74D"/>\
          </linearGradient>\
        </defs>\
        <circle class="shake-progress-ring-bg" cx="45" cy="45" r="40"/>\
        <circle class="shake-progress-ring-fill" cx="45" cy="45" r="40"\
                :style="{ strokeDashoffset: dashOffset }"/>\
      </svg>\
      <slot></slot>\
      <p class="shake-count-text">{{ Math.floor(progress) }}%</p>\
    </div>',
};
