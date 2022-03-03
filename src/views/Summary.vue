<template>
  <el-row v-if="!loading">
    <el-col :span="5">
      <div class="summaryBoxDesign">
        <div class="textCenter summaryNumbersDesign confirmed">
          <span>{{ globalSummary[0].TotalConfirmed }}</span>
        </div>
        <div class="textCenter confirmedText summaryTextDesign">
          <span>Confirmed</span>
        </div>
      </div>
    </el-col>
    <el-col :span="5">
      <div class="summaryBoxDesign">
        <div class="textCenter summaryNumbersDesign recovered">
          <span>{{ globalSummary[0].TotalRecovered }}</span>
        </div>
        <div class="textCenter recoveredText summaryTextDesign">
          <span>Recovered</span>
        </div>
      </div>
    </el-col>
    <el-col :span="5">
      <div class="summaryBoxDesign">
        <div class="textCenter summaryNumbersDesign deaths">
          <span>{{ globalSummary[0].TotalDeaths }}</span>
        </div>
        <div class="textCenter deathsText summaryTextDesign">
          <span>Deaths</span>
        </div>
      </div>
    </el-col>
  </el-row>
  <div class="mainContent row">
    <el-row>
      <div style="flex: auto" class="search">
        <el-select-v2
          v-model="selectedCountry"
          :options="arrCountries"
          placeholder="Select country"
          style="width: 240px; vertical-align: middle"
          allow-create
          filterable
          clearable
          @change="handleCountrySearch(selectedCountry)"
          @clear="dataReload"
        />
      </div>
      <div class="tabel">
        <el-table
          :data="data"
          style="width: 50%; border: 1px solid #f1f1f1; border-radius: 8px"
          v-if="!tabelReload"
        >
          <el-table-column prop="Country" label="Country" width="220" />
          <el-table-column
            prop="TotalConfirmed"
            label="Confirmed"
            width="180"
          />
          <el-table-column
            prop="TotalRecovered"
            label="Recovered"
            width="180"
          />
          <el-table-column prop="TotalDeaths" label="Deaths" />
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="summaryDataForCountries.length"
          @current-change="setPage"
          v-if="paginationReload"
        >
        </el-pagination>
      </div>
      <div class="noDataMessage">{{ noDataMessage }}</div>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

export default {
  name: "Summary",
  setup() {
    let objCountries = reactive({});
    let arrCountries = reactive([]);
    let selectedCountry = ref("");

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

    let page = ref(1);
    let pageSize = ref(6);
    let summaryDataForCountries = reactive([]);
    let globalSummary = reactive([]);
    let loading = ref(true);
    let data = reactive([]);
    let tabelReload = ref(true);
    let paginationReload = ref(true);
    let noDataMessage = ref("");

    const getSummary = async () => {
      await axios
        .get("https://api.covid19api.com/summary")
        .then((response) => {
          response.data.Countries.forEach((element) => {
            summaryDataForCountries.push(element);
          });
          globalSummary.push(response.data.Global);
          loading.value = false;
        })
        .catch((error) => console.log(error));
    };

    const pagedTableData = () => {
      data.length = 0;
      let slicedData = summaryDataForCountries.slice(
        pageSize.value * page.value - pageSize.value,
        pageSize.value * page.value
      );

      slicedData.forEach((element) => {
        data.push(element);
      });
      tabelReload.value = false;
    };

    const setPage = (val = 1) => {
      page.value = val;
      pagedTableData();
    };

    const handleCountrySearch = (selectedCountry) => {
      data.length = 0;
      for (let i = 0; i < summaryDataForCountries.length; i++) {
        if (selectedCountry === summaryDataForCountries[i].Slug) {
          data.push(summaryDataForCountries[i]);
        }
      }
      tabelReload.value = false;
      paginationReload.value = false;
      if (data.length === 0) {
        noDataMessage.value = "No data found for selected country.";
        tabelReload.value = true;
      } else {
        noDataMessage.value = "";
      }
    };

    const dataReload = () => {
      data.length = 0;
      setPage();
      paginationReload.value = true;
      noDataMessage.value = "";
    };

    onMounted(async () => {
      getCountries();
      await getSummary();
      setPage();
    });

    return {
      summaryDataForCountries,
      globalSummary,
      loading,
      selectedCountry,
      arrCountries,
      setPage,
      handleCountrySearch,
      data,
      tabelReload,
      paginationReload,
      dataReload,
      noDataMessage,
    };
  },
};
</script>

<style>
.textCenter {
  text-align: center;
}
.summaryBoxDesign {
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.summaryNumbersDesign {
  font-size: 30px;
  font-weight: 700;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
}
.summaryTextDesign {
  padding: 8px;
  font-size: 18px;
}
.confirmedNumber {
  color: red;
  background-color: #fdf5f5;
}
.confirmedText {
  color: #e7453e;
  background-color: #f7d6d7;
}
.recoveredNumber {
  color: #4da16a;
  background-color: #f0fff4;
}
.recoveredText {
  color: #4da16a;
  background-color: #c6f6d5;
}
.deathsNumber {
  color: #718096;
  background-color: #edf2f7;
}
.deathsText {
  color: #71809c;
  background-color: #e2e8f0;
}

.search {
  margin-bottom: 15px;
}
.pagination {
  margin-top: 15px;
}
.noDataMessage {
  font-size: 18;
  margin-top: 50px;
  font-weight: 600;
  text-align: center;
}
.el-row {
  justify-content: space-evenly;
}
</style>
