import Vue from "vue";
import axios from "axios";

export default {
  install() {
    Vue.prototype.$http = axios;
  }
};
