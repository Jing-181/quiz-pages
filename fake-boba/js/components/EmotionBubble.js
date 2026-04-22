export default {
  name: 'EmotionBubble',
  props: {
    message: { type: String, default: '' },
    show: { type: Boolean, default: false },
  },
  template: '\
    <div class="emotion-bubble" :class="{ show }">{{ message }}</div>',
};
