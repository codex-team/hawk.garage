# Confirmation window component

With confirm plugin you can open confirmation window component in other Vue components.

## Usage

### Window opening

```vue
this.$confirm.open({
  title: 'Delete project',
  actionType: 'deletion',
  continueButtonText: 'Delete',
});
```

### Window closing

```vue
this.$confirm.close();
```

### Opening parameters

| Option | Type | Default value | Description |
| --- | --- | --- | --- |
| title | **String** | `'Confirm'` | Text displays in window title |
| description | **String** | `''` | Description of confirmation action |
| continueButtonText | **String** | `'Continue'` | Displays in continue button |
| onConfirm | **Function** | `() => {}` | Callback that calls on action confirm |
| actionType | **enum ActionType** | `ActionType.SUBMIT` | Type of confirmation action |
