# UiCheckboxWithLabel

Checkbox component with label.

## Usage

### In Vue component

```vue
<UiCheckboxWithLabel
  name="shouldSaveCard"
  v-model="shouldSaveCard"
  label="Save my card"
/>
```

### Props

| Prop name | Type | Default value | Description |
| --------- | ---- | ------------- | ----------- |
| name | **String** | `''` | Name of checkbox linked with label in form data |
| value | **Boolean** | `null` | Value for binding with v-model |
| label | **String** | `'Checkbox label'` | Text for displaying as label |
