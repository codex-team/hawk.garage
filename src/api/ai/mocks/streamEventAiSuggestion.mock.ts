import {
  consumeAiSuggestionTextStream,
  type AiSuggestionStreamOptions
} from '..';

const MOCK_RESPONSE_TEXT = `
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
1. bar


## Code

Inline \`code\`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Syntax highlighting

\`\`\`js
const foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


## Plugins

The killer feature of \`markdown-it\` is very effective support of
[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :cry: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.


### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O


### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++


### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==Marked text==


### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.`;

const MOCK_STREAM_DELAY = 120;
const MOCK_STREAM_CHUNK_SIZE = 100;

/**
 * Create an abort error compatible with Fetch stream cancellation.
 */
function createAbortError(): DOMException {
  return new DOMException('The AI suggestion stream was aborted.', 'AbortError');
}

/**
 * Wait before emitting the next mock chunk, unless the stream is aborted.
 * @param signal - abort signal for the active stream
 */
function waitForMockChunk(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());

      return;
    }

    let timer: number;

    const onAbort = (): void => {
      window.clearTimeout(timer);
      reject(createAbortError());
    };

    timer = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, MOCK_STREAM_DELAY);

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Build a plain UTF-8 response with a readable text stream.
 * @param signal - abort signal for the active stream
 */
function createMockResponse(signal: AbortSignal): Response {
  const bytes = new TextEncoder().encode(MOCK_RESPONSE_TEXT);

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let start = 0; start < bytes.length; start += MOCK_STREAM_CHUNK_SIZE) {
          await waitForMockChunk(signal);
          controller.enqueue(bytes.slice(start, start + MOCK_STREAM_CHUNK_SIZE));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}

/**
 * Stream a deterministic plain-text suggestion in demo mode.
 * @param options - cancellation signal and text-delta consumer
 */
export default async function mockStreamEventAiSuggestion(
  _projectId: string,
  _eventId: string,
  _originalEventId: string,
  options: AiSuggestionStreamOptions
): Promise<void> {
  await consumeAiSuggestionTextStream(createMockResponse(options.signal), options);
}
