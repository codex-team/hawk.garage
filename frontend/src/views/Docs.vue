<template>
  <article class="yard-doc">
    <header class="yard-doc__header">
      <a class="yard-doc__header-title" href="/">Hawk.so</a>
      <div class="yard-doc__header-caption">Fast and lightweight errors tracking service</div>
    </header>

    <aside class="yard-doc__navigation">
      <div class="yard-doc__navigation-content">
        <a href="#platform-documentation">Platform documentation</a>
        <a href="#getting-started">Getting Started</a>
        <a class="second" href="#create-account">Create account</a>
        <a class="second" href="#register-domain">Register domain</a>
        <a href="#integration">Integration</a>
        <a class="second" href="#add-server-handler">Add server handler</a>
        <a class="second" href="#add-client-catcher">Add client catcher</a>
        <a href="#notifications">Notifications</a>
        <a href="#archiving">Archiving</a>
        <a href="#our-team">Our team</a>
      </div>
    </aside>

    <h1 id="platform-documentation">Platform documentation</h1>
    <p>Hawk.so is a clever and easy-to-use errors tracker. It collects all your code exceptions and errors and helps you to improve an applications.</p>
    <p>Please, welcome to the simple user guide.</p>

    <h2 id="getting-started">Getting Started</h2>
    <p>Integration scheme contains a three steps. Your need to register, add a domain and install one of the Catchers.</p>

    <h3 id="create-account">Create an account</h3>
    <p>
      Follow
      <a href="/join">/join</a> link to access registration form. Leave working email, and we will send you a password. You can change it at any time later.
    </p>
    <p>After that you'll be entranced by internal section. We call it the Garage.</p>

    <h3 id="register-domain">Register domains</h3>
    <p>
      Now, look at the Sidebar. There will appear all your registered domains. Touch «
      <a
        href="/websites/create"
      >Add domain</a>» button to create your first.
    </p>
    <p>
      Fill domain's name and submit a form. Now you have an
      <abbr
        title="It is your personal identifier"
      >Integration Token</abbr>.
    </p>

    <h2 id="integration">Integration</h2>
    <p>All registration procedures passed, next step is an installation of the some error Catchers. They're simple scripts that collect exceptions and deliver them to the Garage.</p>

    <h3 id="add-server-handler">Add the Server Handler</h3>
    <p>Currently, we provide Catchers for the next languages:</p>
    <ul>
      <li>
        <a href="https://github.com/codex-team/hawk.php">PHP</a>
      </li>
      <li>
        <a href="https://github.com/codex-team/hawk.python">Python</a>
      </li>
      <li>
        <a href="https://github.com/codex-team/hawk.android">Android</a>
      </li>
      <li>
        <a href="https://github.com/codex-team/hawk.kotlin">Kotlin</a>
      </li>
      <li>
        <a href="https://github.com/codex-team/hawk.scala">Scala</a>
      </li>
      <li>
        <a href="https://github.com/codex-team/hawk.nodejs">Node.js</a>
      </li>
    </ul>
    <p>This list will be expanded soon. If you can code, you can implement your own Catcher.</p>

    <h3 id="add-client-catcher">Add the Client Handler</h3>
    <p>To deliver JavaScript errors we provide the fast and non-blocking Socket-based Catcher.</p>
    <p>
      <a href="https://github.com/codex-team/hawk.javascript">Get JavaScript Catcher</a>
    </p>
    <p>
      How to use. Include
      <abbr title="HTML script tag">&lt;script&gt;</abbr>tag loaded from the CDN or local cloned exemplar.
    </p>
    <pre>&lt;script src="hawk.js" async&gt;&lt;/script&gt;</pre>
    <p>Next, initialize the module with your Integration Token.</p>
    <pre>&lt;script&gt;
    hawk.init({token: “INTEGRATION_TOKEN”});
&lt;/script&gt;</pre>

    <h4>Source map support</h4>
    <p>Hawk supports JS SourceMaps for showing more useful information from your minified bundle. There a few conditions:</p>
    <ol>
      <li>
        Bundle ends with line contains anchor to the source map, like
        <code>//# sourceMappingURL=all.min.js.map</code>. It can be absolute or relative (relatively the bundle) path.
      </li>
      <li>Source map are publicly available by its URL.</li>
      <li>
        On every rebuilding you are updating the
        <abbr title="Initialization parameter">revision</abbr> and pass it with `init` method. It can be heximal-hash or simply file's modification timestamp.
      </li>
    </ol>
    <pre>hawk.init({token: 'INTEGRATION_TOKEN', revision: 12345654345})</pre>
    <h3 id="notifications">Notifications</h3>
    <p>
      You can get notifications about catched errors to the Email, Telegram or Slack. For the last two types, we use Webhooks, so you free to use an any webhook bot, for example, our —
      <a
        target="_blank"
        href="https://github.com/codex-bot/Webhooks/blob/master/README.md"
      >@codex_bot</a>.
    </p>
    <p>
      Note about Webhook's query format. It is a POST-request with the
      <abbr
        title="POST field"
      >message</abbr> field contains notification's text.
    </p>
    <p>
      To setup a Notifications, open the
      <a
        href="https://hawk.so/garage/settings"
        target="_blank"
      >Settings</a> page, find a Project and click on the «Configure Webhooks» button. Then add Webhook endpoints for the Slack or Telegram and press «Save». Don't forget to activate checkboxes for the selected types.
    </p>

    <h3 id="archiving">Archiving</h3>
    <p>Hawk now in a public beta stage. So we allow to collect up to 10 000 events of different types by a Project. You can have a several Projects at one account.</p>

    <h3 id="our-team">Our team</h3>
    <p>
      <a href="//ifmo.su">CodeX</a> is a small team of enthusiasts. We love web-development, build a social and media services and trying to grow ourselves.
    </p>
    <p>
      Please, leave a feedback on the our email
      <a
        href="mailto:team@ifmo.su?subject=Hawk"
      >team@ifmo.su</a>. We REALLY appreciate this. And thanks for reading.
    </p>
  </article>
</template>

<style lang="postcss">
@import url("../stylesheets/variables.css");

/**
 * Static article page
 * Uses in Platfor'm working on windows and even with the added watch options to my config, it doesn't work, unfortunately. – Gilian Dec 10 '18 at 8:40entation
 */
.yard-doc {
  position: relative;
  max-width: 600;
  margin: 80px;
  padding: 15px;
  font-size: 16.8px;
  line-height: 1.5em;

  a {
    text-decoration: none;
  }
  /**
     * Hawk.so header
     * =================
     */
  &__header {
    margin-bottom: 80px;

    &-title {
      font-size: 53px;
      font-weight: 800;
      line-height: 1.4em;
    }

    &-caption {
      font-size: 24px;
      color: var(--grayText);
    }
  }

  /**
     * Navigation
     * =================
     */
  &__navigation {
    position: sticky;
    top: 30px;
    font-size: 15px;

    &-content {
      position: absolute;
      top: 0;
      left: -300px;

      @media all and (max-width: 1250px) {
        left: -220px;
      }
    }

    @media all and (max-width: 1100px) {
      position: static;
      margin: -30px 0 60px;

      &-content {
        position: static;
      }
    }

    a {
      display: block;
      border-bottom: 1px solid color(var(--linkColor) alpha(20%)) !important;
    }

    .second {
      margin-left: 2em;
    }
  }

  /**
     * Article content
     * =================
     */
  h1 {
    font-weight: 800;
    margin-bottom: 1em;
    line-height: 1.1em;
  }

  h2 {
    margin-top: 2em;
    font-weight: 800;
  }

  h3 {
    margin: 1.3em 0 0.5em;
  }

  a {
    color: var(--linkColor);
    border-bottom: 1px solid color(var(--linkColor) alpha(50%));
    cursor: pointer;

    &:hover {
      color: var(--hoverColor);
      border-bottom-color: color(var(--hoverColor) alpha(50%));
    }
  }

  pre {
    @media (--mobile) {
      white-space: pre-line;
    }
  }

  abbr {
    display: inline-block;
    background: color(var(--pinkColor) alpha(7%));
    padding: 0 7px;
    margin-right: 0.2em;
    border-radius: 2px;
    color: var(--pinkColor);
    text-decoration: none;
    font-size: 0.9em;
  }

  ul,
  ol {
    li {
      margin: 0.6em 0;
      list-style-position: inside;
    }
  }

  ul li {
    list-style-type: disc;
  }

  ol li {
    list-style-type: decimal;
  }

  code {
    color: #888;
  }
}
</style>
