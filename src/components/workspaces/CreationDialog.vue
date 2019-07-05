<template>
  <PopupDialog @close="$emit('close')">
    <div class="workspace-creation-dialog">
      <h1>
        Organize new workspace
      </h1>
      <div class="workspace-creation-dialog__description">
        Workspace will contain your projects. You’ll able to invite team members to join workspace and access projects.
      </div>
    </div>
  </PopupDialog>
</template>

<script>
import { CREATE_WORKSPACE } from '../../store/actions/workspaces';
import PopupDialog from '../PopupDialog';

export default {
  name: 'WorkspaceCreationDialog',
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
  .workspace-creation-dialog {
    max-width: 500px;
    max-height: 300px;

    padding: 30px;
  }
</style>
