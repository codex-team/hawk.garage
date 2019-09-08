<template>
  <div class="repetitions-list">
    <div class="repetitions-list__date">
      {{ date }}
    </div>

    <table class="repetitions-list__table">
      <tr
        v-for="repetition in repetitions"
        class="repetitions-list__row"
      >
        <td class="repetitions-list__col">
          <span class="repetitions-list__time">{{ repetition.payload.timestamp | prettyTime }}</span>
        </td>
        <td class="repetitions-list__col">
          <img
            class="repetitions-list__user-photo"
            src="https://as1.ftcdn.net/jpg/02/18/69/42/500_F_218694229_V1sjTE7s6ROXQYGPyUcZSIHatGT4nOK9.jpg"
            alt=""
          >
        </td>
        <td class="repetitions-list__col">
          <span class="repetitions-list__user-name">{{ repetition.payload.user ? repetition.payload.user.name : '' }}</span>
        </td>
        <td class="repetitions-list__col">
          <span class="repetitions-list__user-browser">Firefox 61.0</span>
        </td>
        <td class="repetitions-list__col">
          <span class="repetitions-list__user-screen">1920x946</span>
        </td>
        <td class="repetitions-list__col">
          <span class="repetitions-list__url">/startup/primeliber-com/blog/15598/8-instrumentov-dl…</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RepetitionsTable',
  props: {
    repetitions: {
      type: Array,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
  .repetitions-list {
    &__date {
      margin-bottom: 10px;
      font-size: 14px;
      opacity: 0.6;
    }

    &__table {
      width: 100%;
      margin-left: -10px;
      border-spacing: 0;
    }

    &__row {
      cursor: pointer;
    }

    &__row:nth-child(even) {
      background-color: var(--color-bg-main);
    }

    &__col {
      padding: 6px 10px;
      font-size: 13px;
    }

    &__user-photo {
      width: 24px;
      height: 24px;
      border-radius: 3px;
    }

    &__time {
      width: 40px;
      color: var(--color-text-second);
      letter-spacing: 0.16px;
    }

    &__time,
    &__user-name,
    &__user-browser {
      font-weight: bold;
    }

    &__url {
      color: var(--color-text-second);
    }
  }
</style>
