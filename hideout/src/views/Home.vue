<template>
  <div class="flex">
    <dataTable class="col" ref="table" />

    <facInfo @update="update()" class="col" ref="info" />
  </div>
</template>

<script>
import dataTable from "../components/dataTable.vue";
import facInfo from "../components/facInfo.vue";

export default {
  name: "Home",
  components: {
    dataTable,
    facInfo
  },
  methods: {
    update() {
      console.log("updateing");
      this.$refs.table.update();
    }
  }
};
</script>
<style>
.flex {
  display: flex;
}
.col {
  flex: 1;
}
</style>
