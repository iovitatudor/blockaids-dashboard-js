<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item to="/dashboard">Dashboard</b-breadcrumb-item>
      <b-breadcrumb-item active>Assigned Clients</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <h2 class="page-title">
              Assigned Clients
              <a href="#" @click="initClients">
                <b-icon icon="bootstrap-reboot"></b-icon>
              </a>
            </h2>
          </b-col>
        </b-row>
        <Widget customHeader v-if="clients.length">
          <list-clients :clients="clients"/>
          <div class="text-center" v-if="this.metaClients.totalPages > this.page">
            <b-button class="mt-3" variant="success" @click="initClients()">
              Load more
            </b-button>
          </div>
        </Widget>
        <Widget customHeader v-else>
          <div class="text-center">
            There is no clients yet.
          </div>
        </Widget>
      </b-col>
    </b-row>

  </div>
</template>

<script>

import {mapGetters, mapActions} from "vuex";
import {SetApiError} from "../../api/errors";
import Widget from "../../components/Widget/Widget";
import ListClients from "./components/ListClients";

export default {
  name: "AssignedClients",
  components: {Widget, ListClients},
  data() {
    return {
      modalShow: false,
      page: 0,
    }
  },
  computed: {
    ...mapGetters({
      clients: 'client/getAssignedClients',
      authExpert: 'auth/getAuthExpert',
      metaClients: 'client/getNotAssignedClientsMeta',
    })
  },
  mounted() {
    this.initClients();
    // setTimeout(() => {
    //   this.initClients();
    // }, 60000);
  },
  methods: {
    ...mapActions({
      fetchClients: 'client/fetchAssignedClients',
    }),
    async initClients() {
      try {
        await this.fetchClients(this.authExpert.id, Number(this.page) + 1);
        this.page = this.metaClients.currentPage;
      } catch (err) {
        SetApiError(err);
      }
    }
  }
}
</script>

