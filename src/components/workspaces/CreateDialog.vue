<template>
  <PopupDialog>
    <div class="create-workspace-dialog">
      <h1>
        Organize new workspace
      </h1>
      <div class="create-workspace-dialog__description">
        Workspace will contain your projects. You’ll able to invite team members to join workspace and access projects.
      </div>
    </div>
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
  .create-workspace-dialog {
    max-width: 500px;
    max-height: 300px;

    padding: 30px;
  }
</style>
