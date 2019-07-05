<template>
  <PopupDialog>
    Create Workspace
  </PopupDialog>
</template>

<script>
import { CREATE_WORKSPACE } from '../../store/actions/workspaces';
import PopupDialog from '../PopupDialog';

export default {
  name: 'CreateWorkspaceDialog',
  data() {
    return {
      name: '',
      description: '',
      image: '',
      message: ''
    };
  },
  methods: {
    /**
     * Creates new workspace
     */
    async createWorkspace() {
      try {
        const workspaceInfo = {
          name: this.name,
          description: this.description,
          image: this.image
        };

        const createdWorkspace = await this.$store.dispatch(CREATE_WORKSPACE, workspaceInfo);

        this.$router.push({ name: 'workspace-settings', params: { workspaceId: createdWorkspace.id } });
      } catch (e) {
        this.message = e;
      }
    }
  },
  components: {
    PopupDialog
  }
};
</script>

<style>
  .create-workspace {
    margin: 50px;

    > * {
      display: block;
      margin-bottom: 10px;
    }
  }
</style>
