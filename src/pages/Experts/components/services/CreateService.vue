<template>
  <div>
    <b-button type="submit" variant="default" size="sm" @click="modalShow = !modalShow">
      <span class="auth-btn-circle">
        <i class="la la-plus"></i>
      </span>
      Add new
    </b-button>
    <b-modal v-model="modalShow" title="Create new service" hide-footer>
      <div class="pb-16">
        <Widget customHeader>
          <div class="lds-ripple-wrapper" v-if="loading">
            <div class="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </div>
          <div v-else>
            <form class="mt" @submit.prevent="save" v-if="collections.length">
              <b-row>
                <b-col md="12">
                  <b-form-group label="Collection" label-for="collection">
                    <b-input-group>
                      <select id="collection"
                              v-model="form.collectionId"
                              class="form-control input-transparent pl-3">
                        <option :value="collection.id"
                                :key="key"
                                v-for="(collection, key) in collections">
                          {{ collection.name }}
                        </option>
                      </select>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group :label="`Title [${defaultLanguage.abbr}]`" label-for="title">
                    <b-input-group>
                      <input id="title"
                             v-model="form.name"
                             class="form-control input-transparent pl-3"
                             type="text"
                             required
                             placeholder="Title"/>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Price" label-for="price">
                    <b-input-group>
                      <input id="price"
                             v-model="form.price"
                             class="form-control input-transparent pl-3"
                             type="number"
                             required
                             placeholder="Price"/>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-form-group :label="`Description [${defaultLanguage.abbr}]`" label-for="description">
                <b-input-group>
            <textarea id="description"
                      v-model="form.description"
                      rows="3"
                      class="form-control input-transparent pl-3"
                      placeholder="Description">
            </textarea>
                </b-input-group>
              </b-form-group>
              <b-row>
                <b-col>
                  <b-form-group :label="`Video [${defaultLanguage.abbr}]`" label-for="video">
                    <b-row>
                      <b-col class="flex-center" md="12">
                        <b-form-file id="inputVideo" size="sm" ref="inputVideo"
                                     @change="handleVideoUpload"></b-form-file>
                      </b-col>
                    </b-row>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Hash" label-for="hash">
                    <b-input-group>
                      <input id="hash"
                             v-model="form.hash"
                             class="form-control input-transparent pl-3"
                             type="text"
                             required
                             placeholder="Hash"/>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="form-widget-footer text-center">
                <b-button type="submit" variant="success" size="md">
                <span class="auth-btn-circle">
                  <i class="la la-save"></i>
                </span>
                  Save
                </b-button>
              </div>
            </form>
            <div class="text-center" v-else>
              You haven't added any collection yet, add one before creating a service.<br> <br>
              <p>
                <router-link to="/dashboard/collections">
                  Add a collection
                </router-link>
              </p>
            </div>
          </div>

        </Widget>
      </div>
      <br>
    </b-modal>
  </div>
</template>

<script>

import {mapGetters, mapActions} from "vuex";
import Widget from "../../../../components/Widget/Widget";
import {SetApiError} from "../../../../api/errors";

export default {
  name: "CreateService",
  components: {Widget},
  props: {
    expertId: {type: Number},
  },
  data() {
    return {
      loading: false,
      modalShow: false,
      form: {
        collectionId: 1,
        name: '',
        description: '',
        price: 0,
        hash: ''
      },
      video: null,
    };
  },
  computed: {
    ...mapGetters({
      collections: 'collection/getCollections',
      defaultLanguage: 'language/getDefaultLanguage',
    }),
  },
  mounted() {
    this.form.collectionId = this.collections[0].id;
  },
  methods: {
    ...mapActions({
      saveService: 'services/saveService',
      onSuccess: 'alert/onSuccess',
    }),
    handleVideoUpload(e) {
      this.video = e.target.files[0];
    },
    async save() {
      this.loading = true;
      const formData = new FormData();
      if (this.video) {
        formData.append('video', this.video);
      }
      formData.append('expert_id', this.expertId);
      formData.append('lang_id', this.defaultLanguage.id);
      Object.keys(this.form).forEach(key => formData.append(key, this.form[key]));
      formData.append('collection_id', this.form.collectionId);

      try {
        const result = await this.saveService(formData);
        this.$emit('addService', result.data);
        this.onSuccess('Service has been created successfully');
        this.modalShow = false;
        this.resetForm();
        this.loading = false;
      } catch (err) {
        SetApiError(err);
        this.loading = false;
      }
    },
    resetForm() {
      this.form.name = '';
      this.form.description = '';
      this.form.price = 0;
      this.form.hash = '';
      // this.$refs.inputVideo.reset();
    }
  }
}
</script>

<style>
.lds-ripple-wrapper {
  display: flex;
  justify-content: center;
  align-content: center;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

</style>
