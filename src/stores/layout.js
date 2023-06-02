import { defineStore } from "pinia";
import axios from "axios";

export default defineStore("PINIA_LAYOUT", {
  state: () => ({
    menuBg: "#0b4577",
    width: "200px",
    isCollapse: false,
    requestToken: [],
  }),
  actions: {
    addRequestToken(config) {
      let url = `${config.url}&${config.method}`;
      config.cancelToken = new axios.CancelToken((c) => {
        this.requestToken.push({ c, url });
      });
    },
    removeRequestToken(config) {
      let url = `${config.url}&${config.method}`;
      for (let i = 0; i < this.requestToken.length; i++) {
        if (this.requestToken[i].url === url) {
          this.requestToken[i].c();
          this.requestToken.splice(i, 1);
          break;
        }
      }
    },
    cleatRequestToken() {
      for (let i = 0; i < this.requestToken.length; i++) {
        this.requestToken[i].c();
        this.requestToken.splice(i, 1);
      }
    },
  },
});
