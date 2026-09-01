# Changelog

## 0.x.x



### 0.4

- 0.4.1 - ...

#### 0.4.0

- Fixed: workspace settings now correctly works both for direct visits and router-segue.
- Fixed problem with opening Team after new workspace creation
- Affected components go to typescript. 
- Improved router links inheritance
- Improved project structure: 
-- `projects` folder renamed to `project`. 
-- Project Settings moved to `/project/settings`
-- `workspaces` renamed to `workspace`
- Improve settings components naming and consistence:
-- Base popup layout now named `Layout.vue`
-- Main settings (account/workspace/project) now named `General.vue`
- `PopupWindow` component now contains the `content` slot. It allows incapsulating data-fetching at `Layout.vue` (see `Workspace/Layout.vue`)
- Fix `abbreviation` filter when it accepts string like `Word   ` (with spaces)

### 0.3.x

- 0.3.0 - `New` - event grouping dates now stored in unix timestamp

### 0.2.x

- 0.2.0 - `New` - Changelog started 
- 0.2.1 - `New` - Add "ripple" amimation effect to clickable elements
- 0.2.2 - `New` - `JS Events`: User-Agent and Window size details added 
 
