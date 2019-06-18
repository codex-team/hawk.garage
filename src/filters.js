import Vue from 'vue';

Vue.filter('spacedNumber', function (value) {
  if (typeof value !== 'number') return value;

  const count = value.toString();

  if (count.length === 4) return `${count.slice(0, 1)} ${count.slice(1)}`;
  return value;
});
