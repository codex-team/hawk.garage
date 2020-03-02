<template>
  <div class="project-overview__chart">
    <div class="project-overview__chart-info">
      <span class="project-overview__chart-info__today"> today </span>
      <span class="project-overview__chart-info__highlight"> {{ todayCount }} </span>
      <span
        v-if="difference > 0"
        class="project-overview__chart-info-increase"
      >
        {{ difference }}
      </span>
      <span
        v-else-if="difference < 0"
        class="project-overview__chart-info-decrease"
      >
        {{ -difference }}
      </span>
      <span
        v-else
        class="project-overview__chart-info-equal"
      >
        {{ difference }}
      </span>
    </div>
    <svg class="project-overview__chart-body">
      <defs>
        <linearGradient
          id="chart"
          gradientTransform="rotate(90)"
        >
          <stop
            offset="0%"
            style="stop-color:rgba(61, 133, 210, 0.22);"
          />
          <stop
            offset="100%"
            style="stop-color:#ff4c4c;"
          />
        </linearGradient>
      </defs>
      <polyline
        class="chart_body-polyline"
        fill="none"
        stroke="url(#chart)"
        stroke-width="2.5"
        :points="pointsStr"
      />
    </svg>
    <div class="project-overview__chart-days">
      <span
        v-for="(day, index) in visibleDays"
        :key="index"
        class="project-overview__chart-day"
      >
        {{ day.date }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Chart',
  data() {
    return {
      days: [
        { date: '13 feb', totalCount: 500 },
        { date: '14 feb', totalCount: 800 },
        { date: '15 feb', totalCount: 100 },
        { date: '16 feb', totalCount: 50 },
        { date: '17 feb', totalCount: 25 },
        { date: '18 feb', totalCount: 75 },
        { date: '19 feb', totalCount: 25 },
        { date: '20 feb', totalCount: 1000 },
        { date: '21 feb', totalCount: 900 },
        { date: '22 feb', totalCount: 850 },
        { date: '23 feb', totalCount: 900 },
        { date: '24 feb', totalCount: 150 },
        { date: '25 feb', totalCount: 300 },
        { date: '26 feb', totalCount: 400 },
        { date: '27 feb', totalCount: 650 },
        { date: '28 feb', totalCount: 750 },
      ],
      pointsStr: '' as string,
    };
  },
  computed: {
    todayCount(): number {
      return this.days.slice(-1)[0].totalCount;
    },

    yesterdayCount(): number {
      return this.days.slice(-2, -1)[0].totalCount;
    },

    difference(): number {
      return this.todayCount - this.yesterdayCount;
    },

    visibleDays() {
      return this.days.slice(1, -1);
    },
  },
  mounted() {
    const step = this.$el.offsetWidth / (this.days.length - 1);

    const points : string[] = [];

    const minCount = Math.min(...this.days.map(day => day.totalCount));
    const maxCount = Math.max(...this.days.map(day => day.totalCount));

    this.days.forEach((day, index) => {
      const pointX = index * step;
      const pointY = 2 + (day.totalCount - minCount) / (maxCount - minCount) * 100;

      points.push(pointX + ' ' + pointY);
    });

    this.pointsStr = points.join(', ');
  },
});
</script>
<style>
  .project-overview__chart {
    height: 215px;
    margin: 16px 15px 0;
    background-color: var(--color-bg-main);
    position: relative;

    &-info {
      padding: 15px 0 20px 0;
      min-width: 100px;
      float: right;
      color: var(--color-text-main);
      font-size: 13px;

      &__today {
        opacity: 0.6;
      }

      &__highlight {
        margin-left: 6px;
        font-weight: bold;
      }

      &-increase, &-decrease, &-equal {
        position: relative;
        font-size: 13px;
        font-weight: bold;
        color: #f15454;
        margin-left: 32px;
        padding-right: 15px;
      }

      &-increase {
        color: #f15454;
      }

      &-decrease {
        color: #2ccf6c;
      }

      &-equal {

      }

      &-increase::before, &-decrease::before, &-equal::before {
        content: '';
        position: absolute;
        left: -18px;
        top: 4px;
        border: 5.5px solid transparent;
        border-top: 9px solid #2ccf6c;
      }

      &-increase::before {
        border-top-color: #f15454;;
        transform: rotate(180deg) translateY(7px);
      }

      &-decrease::before {

      }

      &-equal::before {

      }
    }

    &-body {
      transform: scale(1, -1);
      width: 100%;
      height: 105px;
    }

    &-days {
      position: absolute;
      bottom: 15px;
      display: flex;
      justify-content: space-between;
      width: 93.75%;
      margin-left: 3.125%;
    }

    &-day {
      text-align: center;
      opacity: 0.3;
      font-size: 10px;
      flex: 1;
      color: var(--color-text-main);
    }
  }
</style>
