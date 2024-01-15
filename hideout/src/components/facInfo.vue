<template>
  <v-card
    ><v-row v-for="(lvl, name) in stations" :key="name"
      ><v-col>
        {{ name }} <v-col>Max level: {{ lvl.max }}</v-col></v-col
      >
      <v-col>
        <v-text-field
          type="number"
          :rules="[
            v => (v && v <= lvl.max) || 'Cannot exceed max level of ' + lvl.max
          ]"
          v-model="lvl.current"
        />
      </v-col> </v-row
  ></v-card>
</template>

<script>
export default {
  name: "FacilitiesInfo",

  data: () => ({
    stations: {
      "Nutrition Unit": { current: 0, max: 3 },
      Lavatory: { current: 0, max: 3 },
      Workbench: { current: 0, max: 3 },
      Medstation: { current: 0, max: 3 },
      "Intelligence Center": { current: 0, max: 3 },
      "Booze Generator": { current: 0, max: 1 },
      "Water Collector": { current: 0, max: 3 }
    }
  }),
  mounted() {
    this.stations =
      JSON.parse(localStorage.getItem("stations")) || this.stations;
  },
  watch: {
    stations: {
      handler: function() {
        localStorage.setItem("stations", JSON.stringify(this.stations));
        this.$emit("update");
      },
      deep: true
    }
  }
};
</script>

<style></style>
