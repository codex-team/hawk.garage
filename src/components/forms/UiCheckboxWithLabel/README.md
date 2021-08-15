# UiCheckboxWithLabel

Checkbox component with label.

## Usage

### In Vue component

```vue
<UiCheckboxWithLabel
  id="payment-details__should-save-card"
  v-model="shouldSaveCard"
  label="Save my card"
/>
```

### Props

| Prop name | Type | Default value | Description |
| --------- | ---- | ------------- | ----------- |
| id | **String** | `null` | ID of checkbox linked with label |
| value | **Boolean** | `null` | Value for binding with v-model |
| label | **String** | `'Checkbox label'` | Text for displaying as label |
