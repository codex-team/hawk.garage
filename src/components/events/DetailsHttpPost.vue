<template>
  <DetailsBase class="details-http-post">
    <template #header>
      POST PARAMS
    </template>
    <template #content>
      <div class="event-details__content-block">
        <div class="event-details__key">
          article_text
        </div>
        <div class="event-details__value">
          <JsonViewer
            class="details-http-post__json-viewer"
            :value="jsonData"
            theme="json-viewer-theme"
          />
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from './DetailsBase';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'DetailsHttpPost',
  components: {
    DetailsBase,
    JsonViewer,
  },
  data() {
    return {
      jsonData: {
        bool: true,
        string: 'lol',
        total: 25,
        limit: 10,
        skip: 0,
        data: [
          {
            id: '5968fcad629fa84ab65a5247',
            firstname: 'Ada',
            lastname: 'Lovelace',
            awards: null,
            known: [
              'mathematics',
              'computing',
            ],
            position: {
              lat: 44.563836,
              lng: 6.495139,
            },
            description: `Augusta Ada King, Countess of Lovelace (née Byron; 10 December 1815 – 27 November 1852) was an English mathematician and writer,
            chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer,
            the Analytical Engine. She was the first to recognise that the machine had applications beyond pure calculation,
            and published the first algorithm intended to be carried out by such a machine.
            As a result, she is sometimes regarded as the first to recognise the full potential of a "computing machine" and the first computer programmer.`,
            bornAt: '1815-12-10T00:00:00.000Z',
            diedAt: '1852-11-27T00:00:00.000Z',
          }, {
            id: '5968fcad629fa84ab65a5246',
            firstname: 'Grace',
            lastname: 'Hopper',
            awards: [
              'Defense Distinguished Service Medal',
              'Legion of Merit',
              'Meritorious Service Medal',
              'American Campaign Medal',
              'World War II Victory Medal',
              'National Defense Service Medal',
              'Armed Forces Reserve Medal',
              'Naval Reserve Medal',
              'Presidential Medal of Freedom',
            ],
            known: null,
            position: {
              lat: 43.614624,
              lng: 3.879995,
            },
            description: `Grace Brewster Murray Hopper (née Murray; December 9, 1906 – January 1, 1992)
            was an American computer scientist and United States Navy rear admiral.
            One of the first programmers of the Harvard Mark I computer,
            she was a pioneer of computer programming who invented one of the first compiler related tools.
            She popularized the idea of machine-independent programming languages, which led to the development of COBOL,
            an early high-level programming language still in use today.`,
            bornAt: '1815-12-10T00:00:00.000Z',
            diedAt: '1852-11-27T00:00:00.000Z',
          },
        ],
      },
    };
  },
};
</script>

<style>
  .details-http-post {
    .event-details__value {
      width: 100%;
    }

    &__json-viewer {
      width: 100%;
    }
  }

  .json-viewer-theme {
    width: 100%;
    overflow: auto;
    color: #525252;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace;
    white-space: nowrap;
    background: var(--color-bg-sidebar);

    .jv-ellipsis {
      display: inline-block;
      padding: 0 4px 2px 4px;
      color: #000;
      font-size: 0.9em;
      line-height: 0.9;
      vertical-align: 2px;
      background-color: var(--color-text-main);
      border-radius: 3px;
      cursor: pointer;
      user-select: none;
    }
    .jv-button { color: #49b3ff }
    .jv-key { margin-right: 3px; color: #953D87; }
    .jv-item {
      &.jv-array { color: #fff }
      &.jv-boolean { color: #fc1e70 }
      &.jv-function { color: #067bca }
      &.jv-number { color: #75EA52 }
      &.jv-object { color: #fff }
      &.jv-undefined { color: #e08331 }
      &.jv-string {
        display: inline-flex;
        color: #D94848;
        white-space: normal;
        word-break: break-word;
      }
    }
    .jv-code {
      overflow: visible;
      .jv-toggle {
        width: 0;
        height: 0;
        margin-right: 3px;
        border: 5px solid transparent;
        border-right: 0;
        border-left: 5px solid var(--color-text-second);

        &:before {
          padding: 0 2px;
          border-radius: 2px;
        }
        &:hover {
          &:before {
            background: #eee;
          }
        }
      }
    }

    .jv-node::after {
      color: #fff
    }
  }
</style>
