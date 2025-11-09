<template>
  <div>
    <Placeholder />
    <Placeholder />

    <div class="empty-list">
      <div class="empty-list__picture" />
      {{ $t('layout.aside.emptyProjectsList') }}
      <template v-if="isAdmin">
        {{ $t('layout.aside.createFirstProjectLabel') }}
      </template>

      <UiButton
        v-if="isAdmin"
        :content="$t('layout.aside.createFirstProjectButton')"
        submit
        @click="createProjectButtonClicked"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import UiButton from '../utils/UiButton.vue';
import Placeholder from './ProjectPlaceholder.vue';
import { Workspace } from '../../types/workspaces';
import { SET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';

export default Vue.extend({
  name: 'EmptyProjectsList',
  components: {
    UiButton,
    Placeholder,
  },
  props: {
    /**
     * Workspace whose information should be displayed
     */
    workspace: {
      type: Object as PropType<Workspace>,
      required: true,
    },
  },
  computed: {
    /**
     * Shows whether the current user is an admin for this workspace
     */
    isAdmin(): boolean {
      return this.$store.getters.isCurrentUserAdmin(this.workspace.id);
    },
  },
  methods: {
    /**
     * Shows the Create Project modal
     */
    createProjectButtonClicked(): void {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'ProjectCreationDialog' });
    },
  },
});
</script>

<style scoped>
.empty-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 240px;
  margin: 0 auto;
  padding: 34px 0;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  text-align: center;

  &__picture {
    display: inline-block;
    width: 76px;
    height: 64px;
    margin: 0 auto 25px;
    background-image: url("../../assets/hawk-flying.svg");
  }

  .ui-button {
    display: inline-block;
    width: auto;
    margin: 20px auto 0;
    padding: 10px 15px;
    background-image: linear-gradient(-70deg, rgba(255, 255, 255, 0) 20%, rgba(255,255,255, 0.7) 45%, rgba(255,255,255, 0.7) 55%, rgba(255, 255, 255, 0) 80%) !important;
    background-repeat: no-repeat;
    background-position: -120px 0;
    box-shadow: 0 5px 24px rgba(25, 137, 255, 0.4);
    animation: reflection 4s linear infinite;
  }
}

@keyframes reflection {
  0%, 30% {
    background-position: -120px 0;
  }
  70% {
    background-position: 200px 0;
  }
  70.01% {
    background-position: -120px 0;
  }
}
</style>
