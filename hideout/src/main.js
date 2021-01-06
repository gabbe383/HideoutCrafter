import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyD8ZYCqBBWBh9G4WLAJ1j7y8IBMl7qYMk0",
  authDomain: "hideoutcalc.firebaseapp.com",
  projectId: "hideoutcalc",
  storageBucket: "hideoutcalc.appspot.com",
  messagingSenderId: "816655470941",
  appId: "1:816655470941:web:51688bf1cdd231044958b4",
  measurementId: "G-DJJNWFNPE2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export { firebase };
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
