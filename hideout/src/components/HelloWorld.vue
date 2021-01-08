<template>
  <v-container>
    <v-card dark>
      <v-card-title>
        Hideout Crafter
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        item-key="profit"
        :headers="headers"
        :items="myJson"
        :items-per-page="myJson.length"
        :search="search"
        :expanded.sync="expanded"
        show-expand
        class="elevation-1"
        hide-default-footer
        dark
        ><template v-slot:[`item.profit`]="{ item }">
          <v-chip :color="getColor(item.profit)" dark>
            {{ item.profit }}
          </v-chip>
        </template>
        <template v-slot:[`item.profitHour`]="{ item }">
          <v-chip :color="getColor(item.profitHour)" dark>
            {{ item.profitHour }}
          </v-chip>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <h2 v-for="(x, index) in item.input" :key="index">
              {{ x.amount }} {{ index }} {{ x.price }}₽
            </h2>
          </td>
        </template></v-data-table
      >
    </v-card>
  </v-container>
</template>

<script>
import json from "../Prices.json";
export default {
  name: "HelloWorld",

  data: () => ({
    search: "",
    expanded: [],
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Facility", value: "facility" },
      { text: "Buy Price (₽)", value: "buyPrice" },
      { text: "Time", value: "time" },
      { text: "Sell Price (₽)", value: "sellPrice" },
      { text: "Profit (₽)", value: "profit" },
      { text: "Profit / Hour (₽/h)", value: "profitHour" },
    ],
    myJson: json,
  }),
  methods: {
    getColor(i) {
      if (i < 0) return "red";
      else return "green";
    },
  },
};
</script>
<style></style>
