# Notifier window component

With Notifier plugin you can open Notifier window component in other Vue components.

## Usage

### Window opening

```js
this.$notify.open({
  description: "The new version is available.",
  notifierButtons: [
    {
      text: "Refresh",
      type: "SUBMIT",
      onClick: () => {
        window.location.reload();
      }
    }
  ]
});
```

### Window closing

```js
this.$notify.close();
```

### Opening parameters

| Option          | Type                      | Default value | Description              |
| --------------- | ------------------------- | ------------- | ------------------------ |
| description     | **String**                | `''`          | Description of Notifier  | \  |
| notifierButtons | **type NotifierButton[]** | []            | Array of Notifier Button |

### Notifier button type

| Option  | Type         | Description          |
| ------- | ------------ | -------------------- |
| text    | **String**   | Notifier button Text | \  |
| type    | **String**   | Notifier button Type | \  |
| onClick | **Function** | `() => {}`           | Callback that calls on button click |
