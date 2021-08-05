# Notifier window component

With Notifier plugin you can open Notifier window component in other Vue components.

## Usage

### Window opening

```vue
 this.$notify.open({
    description: "The new version is available.",
    notifierButtons:[{
      buttonText: "Refresh",
      buttonType: "SUBMIT",
      onConfirm: () => {
        window.location.reload();
      }
    }]
});
```

### Window closing

```vue
this.$notify.close();
```

### Opening parameters

| Option | Type | Default value | Description |
| --- | --- | --- | --- |
| description | **String** | `''` | Description of Notifier |\
| notifierButtons | **type NotifierButton[]** | [] | Array of Notifier Button |


### Notifier button type

| Option | Type | Description |
| --- | --- | --- |
| buttonText | **String** | Notifier button Text |\
| buttonType | **String** | Notifier button Type |\
| onConfirm | **Function** | `() => {}` | Callback that calls on button click |
