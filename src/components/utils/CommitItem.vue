<template>
  <div class="commit-item">
    <div class="commit-item__left">
      <div
        class="commit-item__left-title"
        :title="commit.title"
      >
        {{ commit.title }}
      </div>
      <div class="commit-item__meta">
        <EntityImage
          :id="(commit.author || '').charCodeAt(0).toString(16)"
          class="commit-item__left-image"
          :name="commit.author"
          size="16"
        />
        <span
          class="commit-item__left-author"
          :title="commit.author"
        >
          {{ commit.author }}
        </span>
        <span class="commit-item__left-relative-time">
          {{ $t('event.suspectedCommits.committed') }}
          {{ commit.date | prettyRelativeTimeStr }}
        </span>
      </div>
    </div>
    <div class="commit-item__right">
      <div
        class="commit-item__right-hash-block"
        :title="commit.hash"
      >
        <span class="commit-item__right-hash">{{ short(commit.hash) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import EntityImage from './EntityImage.vue';

export default {
  name: 'CommitItem',
  components: { EntityImage },
  props: {
    commit: {
      type: Object,
      required: true,
    },
  },
  methods: {
    short(hash) {
      return hash ? hash.slice(0, 7) : '';
    },
  },
};
</script>

<style>
.commit-item {
  display: flex;
  flex-direction: row;
}

.commit-item__left {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
}

.commit-item__left-title {
  max-width: 600px;
  margin-bottom: 6px;
  overflow: hidden;
  color: var(--color-text-main);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.commit-item__left-image {
  display: inline-flex;
}

.commit-item__left-author {
  display: inline-block;
  color: var(--color-text-second);
  vertical-align: middle;
}

.commit-item__left-relative-time {
  color: var(--color-text-second);
  font-weight: normal;
  vertical-align: middle;
}

.commit-item__meta {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.commit-item__right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: auto;
}

.commit-item__right-hash-block {
  padding: 5px 10px;
  line-height: normal;
  background-color: var(--color-bg-code-fragment);
  border-radius: 5px;
}

.commit-item__right-hash {
  display: block;
  color: var(--color-text-second);
  font-size: 11px;
  font-family: var(--font-monospace);
  line-height: 14px;
}
</style>


