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
        item-key="id"
        :headers="headers"
        :items="crafts"
        :items-per-page="crafts.length"
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
            <h2>
              Input
            </h2>
            <h3 v-for="(x, index) in item.input" :key="index">
              {{ x.amount }} {{ index }} {{ x.price }}₽
            </h3>
            <h2>
              Output
            </h2>
            <h3 v-for="(x, index) in item.output" :key="index">
              {{ x.amount }} {{ index }} {{ x.price }}₽
            </h3>
            <h3>
              {{ item.require[0] }}
            </h3>
          </td>
        </template></v-data-table
      >
    </v-card>
    <v-card>
      <!-- {{ crafts }} -->
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",

  data() {
    return {
      search: "",
      expanded: [],
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Facility", value: "facility" },
        { text: "Buy Price (₽)", value: "buyPrice" },
        { text: "Time", value: "time" },
        { text: "Sell Price (₽)", value: "sellPrice" },
        { text: "Profit (₽)", value: "profit" },
        { text: "Profit / Hour (₽/h)", value: "profitHour" }
      ],
      crafts: [],
      skip: 0
    };
  },
  created() {
    this.getPrices();
  },
  mounted() {
    this.stations =
      JSON.parse(localStorage.getItem("stations")) || this.stations;
  },
  computed: {
    log(arg) {
      return arg;
    }
  },
  methods: {
    getColor(i) {
      if (i < 0) return "red";
      else return "green";
    },
    update() {
      this.stations =
        JSON.parse(localStorage.getItem("stations")) || this.stations;
      console.log("updatatererig");
      this.skip = 0;
      this.crafts = [];
      this.getPrices();
    },
    getPrices(arg) {
      let url;
      if (arg) {
        url =
          "https://tarkov-market.com/api/hideout?lang=en&search=&tag=" +
          arg +
          "&sort=profitMinusFeeByHour&hideoutUseAvgPrice=undefined&sort_direction=desc&skip=" +
          this.skip;
      } else {
        url =
          "https://tarkov-market.com/api/hideout?lang=en&search=&tag=&sort=profitMinusFeeByHour&hideoutUseAvgPrice=undefined&sort_direction=desc&skip=" +
          this.skip;
      }
      // console.log(url);

      fetch(url, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
          "if-none-match": 'W/"1fb2c-7g1gXmRXlJblcFG7O5lL4ixQFho"',
          "sec-ch-ua":
            '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie:
            "uid=3ad961b4-81e0-40e6-8b9c-b967d18a6b1e; __cfduid=d15052228b2a42c68b5f080137eb7afc51609707645; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZGI4ODgwNC1kYmNmLTQ2NDAtOTkyNS1lOTNlNTg1ODkxZWEiLCJwYXRyZW9uVXNlcklkIjoiMzI0NDczNzEiLCJuYW1lIjoiR2FicmllbCBCZXJnZGFobCIsImVtYWlsIjoiZ2FicmllbC5iZXJnZGFobEBnbWFpbC5jb20iLCJwcm8iOmZhbHNlLCJ1cGRhdGVkIjoiMjAyMS0wMS0wNFQwNDowNToxMC43NzdaIiwiaWF0IjoxNjA5NzMzMTEwfQ.-dBwzlfZCBXjLgGDlc-c_pVjTEsb7sMFT6vrVCkL17U"
        },
        referrer: "https://tarkov-market.com/hideout",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors"
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.recipes.length > 18) {
            data.recipes = data.recipes.substring(9, data.recipes.length);
            data.recipes = atob(data.recipes);
            data.recipes = decodeURIComponent(data.recipes);
            data.recipes =
              "[{" + data.recipes.substring(3, data.recipes.length);
            // console.log(data.recipes)
            data.recipes = JSON.parse(data.recipes);
            let x;
            for (x in data.recipes) {
              let short;
              short = data.recipes[x];

              let buyPrice = 0;
              let inputDict = {};
              let y;
              for (y in short.input) {
                if (short.input[y].price > short.input[y].avgDayPrice) {
                  inputDict[short.input[y].name] = {
                    amount: short.input[y].amount.toFixed(0),
                    price: short.input[y].avgDayPrice.toFixed(0)
                  };

                  buyPrice +=
                    short.input[y].amount * short.input[y].avgDayPrice;
                } else {
                  buyPrice += short.input[y].amount * short.input[y].price;
                  inputDict[short.input[y].name] = {
                    amount: short.input[y].amount,
                    price: short.input[y].price
                  };
                }
              }

              let sellPrice = short.output.amount * short.output.avgDayPrice;
              let profit = sellPrice - buyPrice;
              let outputDict = {};
              outputDict[short.output.name] = {
                amount: short.output.amount.toFixed(0),
                price: short.output.avgDayPrice.toFixed(0)
              };
              let id = short.uid + this.skip + Math.random;

              var hms = short.time;
              var a = hms.split(":");
              var hours = (a[0] * 60 + +a[1]) / 60;

              let profitHour = (profit / hours).toFixed(0);

              if (
                this.stations[short.facility.name] &&
                parseInt(this.stations[short.facility.name].current) <
                  short.facility.level
              ) {
                continue;
              }

              this.crafts.push({
                facility: short.facility.name + " " + short.facility.level,
                name: short.output.name,
                time: short.time,
                buyPrice: buyPrice.toFixed(0),
                sellPrice: sellPrice,
                input: inputDict,
                output: outputDict,
                profit: profit.toFixed(0),
                profitHour: profitHour,
                id: id,
                require: short.require
              });
            }

            this.skip += 20;
            this.getPrices(arg);
          }
        });
    }
  }
};
</script>
<style></style>
