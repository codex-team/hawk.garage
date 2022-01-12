# Popover component

With Popover plugin you can open popover component on other Vue components.

## Usage

### Popover opening

```js
this.$popover.open({
  component: <any vue component>,
  componentProps: {
    <props of vue component>,
  },
  popoverProps: {
    showBelowElement: this.$refs['events-count-circle'].$el,
  },
});
```

### Popover closing

```js
this.$popover.close();
```

### Opening parameters

| Option          | Type                      | Default value | Description              |
| --------------- | ------------------------- | ------------- | ------------------------ |
| component       | **Vue<Component>**        | `null`        | Any Vue Component        |
| componentProps  | **Object**                | `null`        | Props object of passed Vue Component |
| popoverProps    | **Object**  | { showBelowElement: someElement} | Element to place popover below its center|
