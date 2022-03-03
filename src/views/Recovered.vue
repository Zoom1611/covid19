<template>
  <div style="flex: auto" class="countrySelectionBox">
    <div>Country selection:</div>
    <el-select-v2
      v-model="selectedCountry"
      :options="arrCountries"
      placeholder="Please select"
      style="width: 240px; vertical-align: middle"
      allow-create
      filterable
      class="countrySelectionSelect"
    />
  </div>
  <div class="block dateSelectionBox">
    <div>Date selection (from/to):</div>
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
      class="dateSelectionPicker"
    >
    </el-date-picker>
  </div>
  <div class="getResultsButton">
    <el-button type="info" @click="getResults(selectedCountry, dateRange)"
      >Get results</el-button
    >
  </div>
  <div class="chartBox">
    <LineChart class="lineChart" :chartData="testData" :options="options" />
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, reactive, ref, defineComponent } from "@vue/runtime-core";
import moment from "moment";
import { LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  name: "Confirmed",
  components: { LineChart },
  setup() {
    let objCountries = reactive({});
    let arrCountries = reactive([]);
    let selectedCountry = ref("Croatia");

    const getCountries = () => {
      axios
        .get("https://api.covid19api.com/countries")
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            objCountries = {
              value: response.data[i].Slug,
              label: response.data[i].Country,
            };
            arrCountries.push(objCountries);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getConfirmedPositiveCases = (
      selectedCountry = "croatia",
      dateFrom = oneWeekBeffore,
      dateTo = today
    ) => {
      testData.labels = [];
      cases = [];
      testData.datasets[0].data = [];
      axios
        .get(
          `https://api.covid19api.com/country/${selectedCountry}/status/recovered?from=${dateFrom}&to=${dateTo}`
        )
        .then((response) => {
          console.log(response);
          for (let i = 0; i < response.data.length; i++) {
            testData.labels.push(moment(response.data[i].Date).format("L"));
            cases.push(response.data[i].Cases);
          }
          testData.datasets[0].data = cases;
          console.log(testData.labels);
          console.log(testData.datasets.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    let cases = reactive([]);
    const testData = reactive({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ["#123E6B"],
        },
      ],
    });

    const options = reactive({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Recovered cases",
          padding: {
            top: 10,
            bottom: 30,
          },
          font: {
            size: 20,
          },
        },
      },
    });

    let today = moment(new Date()).format("YYYY-MM-DD");
    let oneWeekBeffore = moment().subtract(60, "d").format("YYYY-MM-DD");

    const dateRange = ref([oneWeekBeffore, today]);

    onMounted(() => {
      getCountries();
      getConfirmedPositiveCases();
    });

    const getResults = (selectedCountry, selectedDate) => {
      let dateFrom = moment(selectedDate[0]).format("YYYY-MM-DD");
      let dateTo = moment(selectedDate[1]).format("YYYY-MM-DD");
      getConfirmedPositiveCases(selectedCountry, dateFrom, dateTo);
    };
    return {
      arrCountries,
      selectedCountry,
      dateRange,
      getResults,
      testData,
      options,
    };
  },
});
</script>

<style>
.countrySelectionBox {
  margin-top: 20px;
}
.countrySelectionSelect {
  margin-top: 5px;
}
.dateSelectionBox {
  margin-top: 10px;
}
.dateSelectionPicker {
  margin-top: 5px;
}
.getResultsButton {
  margin-top: 10px;
}
.chartBox {
  display: flex;
  justify-content: center;
}
.lineChart {
  width: 95%;
}
</style>
