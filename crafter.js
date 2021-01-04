const fetch = require("node-fetch");
fs = require("fs");

crafts = {};
let skip = 0;

function getPrices(arg) {
  if (arg) {
    url =
      "https://tarkov-market.com/api/hideout?lang=en&search=&tag=" +
      arg +
      "&sort=profitMinusFeeByHour&hideoutUseAvgPrice=undefined&sort_direction=desc&skip=" +
      skip;
  } else {
    url =
      "https://tarkov-market.com/api/hideout?lang=en&search=&tag=&sort=profitMinusFeeByHour&hideoutUseAvgPrice=undefined&sort_direction=desc&skip=" +
      skip;
  }
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
        "uid=3ad961b4-81e0-40e6-8b9c-b967d18a6b1e; __cfduid=d15052228b2a42c68b5f080137eb7afc51609707645; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZGI4ODgwNC1kYmNmLTQ2NDAtOTkyNS1lOTNlNTg1ODkxZWEiLCJwYXRyZW9uVXNlcklkIjoiMzI0NDczNzEiLCJuYW1lIjoiR2FicmllbCBCZXJnZGFobCIsImVtYWlsIjoiZ2FicmllbC5iZXJnZGFobEBnbWFpbC5jb20iLCJwcm8iOmZhbHNlLCJ1cGRhdGVkIjoiMjAyMS0wMS0wNFQwNDowNToxMC43NzdaIiwiaWF0IjoxNjA5NzMzMTEwfQ.-dBwzlfZCBXjLgGDlc-c_pVjTEsb7sMFT6vrVCkL17U",
    },
    referrer: "https://tarkov-market.com/hideout",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.recipes.length > 0) {
        for (x in data.recipes) {
          short = data.recipes[x];

          let buyPrice = 0;
          inputDict = {};
          for (y in short.input) {
            if (short.input[y].price > short.input[y].avgDayPrice) {
              inputDict[short.input[y].name] = {
                Amount: short.input[y].amount,
                Price: short.input[y].avgDayPrice,
              };
              buyPrice += short.input[y].amount * short.input[y].avgDayPrice;
            } else {
              buyPrice += short.input[y].amount * short.input[y].price;
              inputDict[short.input[y].name] = {
                Amount: short.input[y].amount,
                Price: short.input[y].price,
              };
            }
          }

          let sellPrice = short.output.amount * short.output.avgDayPrice;
          let profit = sellPrice - buyPrice;

          outputDict = {};
          outputDict[short.output.name] = {
            Amount: short.output.amount,
            Price: short.output.avgDayPrice,
          };

          var hms = short.time;
          var a = hms.split(":");
          var hours = (a[0] * 60 + +a[1]) / 60;

          profitHour = (profit / hours).toFixed(0);
          buyPrice = addDot(buyPrice);
          sellPrice = addDot(sellPrice);
          profit = addDot(profit);

          profitHour = addDot(profitHour);

          crafts[short.output.name] = {
            Facility: short.facility.name + " " + short.facility.level,
            Time: short.time,
            BuyPrice: buyPrice + "₽",
            SellPrice: sellPrice + "₽",
            Input: inputDict,
            Output: outputDict,
            Profit: profit + "₽",
            ProfitHour: profitHour + "₽/h",
          };
        }

        skip += 20;
        getPrices(arg);
      } else {
        fs.writeFile("Prices.json", JSON.stringify(crafts), function (err) {
          if (err) return console.log(err);
          console.log("Saved");
        });
      }
    });
}

function reverseString(str) {
  str = str + " ";
  let splitString = str.split("");
  let reverseArray = splitString.reverse();
  let joinArray = reverseArray.join("");
  return joinArray;
}

function addDot(str) {
  str = reverseString(str);
  if (str.charAt(str.length - 1) == "-") {
    str = str.substring(1);
    str = str.slice(0, str.length - 1);
    str = str.match(/.{1,3}/g);
    str = str.join(",");
    str = reverseString(str);
    str = str.substring(1);
    str = "-" + str;
    return str;
  } else {
    str = str.substring(1);
    str = str.match(/.{1,3}/g);
    str = str.join(",");
    str = reverseString(str);
    str = str.substring(1);
    return str;
  }
}

getPrices();
