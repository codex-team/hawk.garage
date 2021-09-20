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
    top: "65px",
    left: "215px",
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
| popoverProps    | **PopoverPositionStyle**  | { top: "unset", right:"unset", bottom:"unset", left:"unset"} | Popover position relative to the `body` tag|

### PopoverPositionStyle description

| Option  | Type        | Description              |
| --------| ------------| ------------------------ |
| top     | **String**  | `top` position relative to the `body` tag |
| right   | **String**  | `right` position relative to the `body` tag |
| bottom  | **String**  | `bottom` position relative to the `body` tag |
| left    | **String**  | `left` position relative to the `body` tag |
