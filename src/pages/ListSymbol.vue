<template>
  <v-container>
    <FieldBox
      :items="items"
    ></FieldBox>
    <!--      :key="i"
    v-for="(item, i) in items"
      :item="item"-->
  </v-container>

</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import FieldBox from '../components/FieldBox.vue';


  const items = ref([
    {
      title: 'استراتژی',
      open: false,
      children: [
        { title: '1', open: false, children: [
          { title: 'g1', open: false, children: [] },
          { title: 'g2', open: false, children: [] },
          { title: 'g2', open: false, children: [] },
        ] },
        { title: '2', open: false, children: [
          { title: 'g1', open: false, children: [] },
          { title: 'g2', open: false, children: [] },
        ] },
      ],
    },
    {
      title: 'بک تست',
      open: false,
      children: [
        {
          title: 'g',
          open: false,
          children: [
            { title: 'g1', open: false, children: [] },
            { title: 'g2', open: false, children: [] },
            { title: 'g2', open: false, children: [] },
          ],
        },
        { title: 'ggggggggg', open: false, children: [] },
        { title: '3', open: false, children: [] },
      ],
    },
    {
      title: 'سیگنال',
      open: false,
      children: [
        { title: '1', open: false, children: [
          { title: 'g1', open: false, children: [] },
          { title: 'g2', open: false, children: [] },
          { title: 'g2', open: false, children: [] },
        ] },
        { title: '2', open: false, children: [] },
        { title: '3', open: false, children: [
          { title: 'g1', open: false, children: [] },
          { title: 'g2', open: false, children: [
            { title: 'g1', open: false, children: [] },
            { title: 'g2', open: false, children: [] },
            { title: 'g2', open: false, children: [] },
          ] },
          { title: 'g2', open: false, children: [] },
        ] },
      ],
    },
  ])
</script>

<!--
<template>
  <v-container>

    <div
      v-for="(item,index) in items"
      :key="index"
      class="row-box"
    >

      &lt;!&ndash; فیلد اصلی &ndash;&gt;
      <div
        class="input-box"
        :class="{expanded:item.open}"
      >
        <span>{{ item.title }}</span>

        <v-btn icon size="small" @click="toggle(item)">
          +
        </v-btn>
      </div>

      &lt;!&ndash; زیرآیتم‌ها &ndash;&gt;
      <div class="right-items" v-if="item.open">

        &lt;!&ndash; فیلد زیرآیتم &ndash;&gt;
        <div
          v-for="(sub,sIndex) in item.children"
          :key="sIndex"
          class="row-box"
        >
          <div class="input-box sub" :class="{expanded:sub.open}">
            <span>{{ sub.title }}</span>

            <v-btn icon size="x-small" @click="toggle(sub)">
              +
            </v-btn>
          </div>

          &lt;!&ndash; زیرآیتم‌های سطح بعدی &ndash;&gt;
          <div class="right-items" v-if="sub.open">
            <div
              v-for="(c,ci) in sub.children"
              :key="ci"
              class="input-box sub"
            >
              <span>{{ c.title }}</span>
            </div>
          </div>

        </div>

      </div>

    </div>

  </v-container>
</template>

<script setup>
import { ref } from "vue"

const items = ref([
  {
    title:"استراتژی",
    open:false,
    children:[
      { title:"1", open:false, children:[] },
      { title:"2", open:false, children:[] }
    ]
  },
  {
    title:"بک تست",
    open:false,
    children:[
      {
        title:"g",
        open:false,
        children:[
          { title:"g1" },
          { title:"g2" }
        ]
      },
      { title:"ggggggggg", open:false, children:[] },
      { title:"3", open:false, children:[] }
    ]
  },
  {
    title:"سیگنال",
    open:false,
    children:[
      { title:"1", open:false, children:[] },
      { title:"2", open:false, children:[] },
      { title:"3", open:false, children:[] }
    ]
  }
])

function toggle(item){
  item.open = !item.open
}
</script>

<style scoped>

.row-box{
  display:flex;
  align-items:stretch; /* مهم */
  margin-bottom:12px;
}

.input-box{
  width:220px;
  border:1px solid #ccc;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 10px;
  background:white;
}

.input-box.expanded{
  height:auto;
  padding-top:10px;
  padding-bottom:10px;
  align-items:flex-start;
}

.right-items{
  margin-left:15px;
  display:flex;
  flex-direction:column;
  gap:8px;
}

.sub{
  width:180px;

}

</style>
-->


<!--
<script lang="ts" setup>
  import { SymbolStore } from '../stores/Symbol.ts';
  import { onMounted, ref } from 'vue';
  import { SymbolModel } from '../models/SymbolModel.ts';
  import { ActiveModel } from '../models/Active.ts';
  import { AuthStore } from '../stores/auth.ts';
  import { BookmarkModel } from '../models/BookmarkModel.ts';
  import { SearchSymbolModel } from '../models/SearchSymbolModel.ts';

  const symbolModel = ref<SymbolModel>(new SymbolModel());
  const activeModel = ref<ActiveModel>(new ActiveModel());
  const dialog = ref(false);
  const symbolStore = SymbolStore();
  const alertBookmark = ref(false);
  const alertActive = ref(false);
  const messageSnackbar = ref('');
  const colorSnackbar = ref('');
  const snackbar = ref(false);
  const symbolType=ref('');
  const exchange =ref('');
  const active=ref<boolean>(false);
  const bookmark=ref<boolean>(false);
  const name =ref('');
  const authStore = AuthStore();
  import type { DataTableHeader } from 'vuetify'
  import { computed } from 'vue'

  const headers = computed<DataTableHeader[]>(() => {
    const baseHeaders: DataTableHeader[] = [
      { key: 'index', title: 'ردیف', align: 'center' },
      { key: 'name', title: 'نام نماد', align: 'center' },
      { key: 'exchange', title: 'نام صرافی', align: 'center' },
      { key: 'symbolType', title: 'نوع بازار', align: 'center' },
      { key: 'bookmark', title: 'نشان شده', align: 'center' },
    ];

    if (authStore.me?.role === 'ROLE_ADMIN') {
      baseHeaders.push({ key: 'active', title: 'وضعیت', align: 'center' });
    }

    return baseHeaders;
  });
  const exchangeItem =['Nobitex', ' Wallex', 'Toobit']
  const symbolTypeItem =['Feature', 'Spot']

  onMounted(async () => {
    await symbolStore.fetchItems();
    await symbolStore.getSymbol();
  })
  const clickConfirmBookmark = async () => {
    symbolModel.value.bookmark = !symbolModel.value.bookmark;
    await symbolStore.updateBookmark({ symbolId: symbolModel.value.id });
    alertBookmark.value = false;
    symbolModel.value = new SymbolModel();
  };

  const clickBookmark = async (item: SymbolModel) => {
    symbolModel.value = item
    alertBookmark.value = true;
  }
  const canselBookmark = async () => {
    alertBookmark.value = false;
    symbolModel.value = new SymbolModel();
  }

// create symbol by admin
  const createSymbol = async () => {
    await symbolStore.Createsymbol(symbolModel.value);
    if (symbolStore.error) {
      snackbar.value=true
      messageSnackbar.value='خطا در ثبت'
      colorSnackbar.value='red'
      dialog.value = true;
    }
    else{
      symbolModel.value = new SymbolModel();

      snackbar.value = true;
      messageSnackbar.value = 'ثبت نماد با موفقیت انجام شد'
      colorSnackbar.value = 'green'

      setTimeout(() => {
        dialog.value = false;
      }, 1000);
    }
  }
  const closeSymbol = async () => {
    symbolModel.value = new SymbolModel();
    dialog.value = false;
  }
  const openCreateSymbol = async () => {
    dialog.value = true;
  }


  const searchSymbolModel=ref<SearchSymbolModel>(new SearchSymbolModel());
  const fields =computed(() => [
    { type: 'text', name: 'name', title: 'نماد' ,md:3 },
    {
      type: 'select',
      name: 'exchange',
      title: 'صرافی',
      items: [
        { name:'Nobitex', id: 'Nobitex' },
        { name:'Wallex', id: 'Wallex' },
        { name:'Toobit', id: 'Toobit' },
      ],
      itemTitle: 'name',
      itemValue: 'id',md:3,
    },
    {
      type: 'select',
      name: 'symbolType',
      title: 'نوع سیمبل',
      md:3,
      items: [
        { name:'Feature', id: 'Feature' },
        { name:'Spot', id: 'Spot' },
      ],
      itemTitle: 'name',
      itemValue: 'id',
    },
    { type: 'checkbox', name:'bookmark', md:2, title:'بوک مارک' },
    ...(authStore.me?.role === 'ROLE_ADMIN'
      ? [{ type: 'checkbox', name: 'active', md: 2, title: 'فعال' }]
      : []),
  ]);


  const isActive = async () => {
    // await symbolStore.Isactive({ symbolId: symbolModel.value.id });
    symbolModel.value.active = !symbolModel.value.active;
    await symbolStore.isActive(activeModel.value);
    alertActive.value = false;
  }
  const clickActive = async (item: SymbolModel) => {
    activeModel.value.symbolId = item.id;
    symbolModel.value = item
    alertActive.value = true;
  }
  const canselActive = async () => {
    alertActive.value = false;
    symbolModel.value = new SymbolModel();
  }


  // اعمال فیلتر
  const runFilter = async () => {
    await symbolStore.searchSymbol(searchSymbolModel.value.name, searchSymbolModel.value.active, searchSymbolModel.value.exchange, searchSymbolModel.value.symbolType, searchSymbolModel.value.bookmark)
    console.log('filtered symbols: ', symbolStore.symbols)
  }

</script>

<template>
  <v-container max-width="100%">
    <v-card class="rounded-lg elevation-1">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        <v-row align="center" dense>
          <v-col class="d-flex align-center" cols="12" md="10">
            <v-icon class="me-2" size="30">mdi-currency-usd</v-icon>
            <span class="text-h6 font-weight-bold" style="font-family: 'Shabnam', sans-serif;">
              جدول نمادها
            </span>
          </v-col>
          <v-col class="d-flex justify-md-end mt-2 mt-md-0" cols="12" md="2">
            <v-btn
              v-if="authStore.me?.role === 'ROLE_ADMIN'"
              class="text-white"
              color="primary"
              variant="elevated"
              @click="openCreateSymbol"
            >
              ایجاد نماد
            </v-btn>
          </v-col>
        </v-row>

        &lt;!&ndash; فرم جستجو و دکمه فیلتر &ndash;&gt;
&lt;!&ndash;        <v-row class="mt-3" dense>
          <v-col cols="12" md="9">
            <MainsForm v-model="searchSymbolModel" :fields="fields" />
          </v-col>
          <v-col class="d-flex justify-md-start justify-center mt-2 mt-md-0" cols="12" md="3">
            <v-btn
              class="w-100"
              color="primary"
              variant="elevated"
              @click="runFilter"
            >
              اعمال فیلتر
            </v-btn>
          </v-col>
        </v-row>&ndash;&gt;&ndash;&gt;

        <v-row class="align-center mt-12" dense>
          &lt;!&ndash; نام نماد &ndash;&gt;
          <v-col cols="12" md="2">
            <v-text-field
              v-model="searchSymbolModel.name"
              clearable
              density="comfortable"
              hide-details
              label="نماد"
              placeholder="نماد موردنظر"
              outlined
              color="primary"            />
          </v-col>

          &lt;!&ndash; صرافی &ndash;&gt;
          <v-col cols="12" md="2">
            <v-select
              v-model="searchSymbolModel.exchange"
              clearable
              density="comfortable"
              hide-details
              :items="exchangeItem"
              label="صرافی"
              outlined
              color="primary"            />
          </v-col>

          &lt;!&ndash; نوع سیمبل &ndash;&gt;
          <v-col cols="12" md="2">
            <v-select
              v-model="searchSymbolModel.symbolType"
              clearable
              density="comfortable"
              hide-details
              :items="symbolTypeItem"
              label="نوع سیمبل"
              outlined
              color="primary"            />
          </v-col>

          &lt;!&ndash; بوکمارک &ndash;&gt;
          <v-col cols="12" md="2">
            <v-checkbox
              v-model="searchSymbolModel.bookmark"
              dense
              hide-details
              label="بوکمارک"
                outlined
                  color="primary"
            />
          </v-col>

          &lt;!&ndash; اکتیو &ndash;&gt;
          <v-col cols="12" md="2">
            <v-checkbox
              v-if="authStore.me.role === 'ROLE_ADMIN'"
              v-model="searchSymbolModel.active"
              dense
              hide-details
              label="فعال"
              outlined
              color="primary"
            />
          </v-col>

          &lt;!&ndash; دکمه اعمال فیلتر &ndash;&gt;
          <v-col class="d-flex justify-center align-center" cols="12" md="2">
            <v-btn
              color="primary"
              style="width: 100%;"
              variant="elevated"
              @click="runFilter"

            >
              اعمال فیلتر
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-row class="mt-2 align-center text-h6 font-weight-bold text-grey-darken-3'" cols="12" dense>
        <v-col>
          <v-data-table-server
            v-model:items-per-page="symbolStore.pagination.itemsPerPage"
            class="custom-table"
            :headers="headers"
            item-key="id"
            :items="symbolStore.symbols"
            :items-length="symbolStore.totalItems"
            :page="symbolStore.pagination.page"
            show-current-page
            @update:items-per-page="symbolStore.setItemsPerPage"
            @update:page="symbolStore.setPage"
          >
            <template #item.bookmark="{ item }">
              <v-icon
                class="cursor-pointer align-center "
                :color="item.bookmark ?'success ' : 'error'"
                @click.stop="clickBookmark(item)"
              >
                {{ item.bookmark ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
              </v-icon>
            </template>

            <template #item.active="{ item }">
              <v-icon
                class="cursor-pointer align-center"
                :color="item.active ? 'success' : 'error'"
                @click="clickActive(item)"
              >
                {{ item.active ? 'mdi-check-circle' : 'mdi-check-circle-outline' }}
              </v-icon>
            </template>

            <template #item.index="{ index }">
              <span>{{ index + 1 }}</span>

            </template>

            <template #item.name="{ item }">
              <span class="font-weight-medium text-blue-darken-3">{{ item.name }}</span>
            </template>
          </v-data-table-server>
          <v-dialog v-model="alertBookmark" max-width="450" persistent>
            <v-card class="pa-6 rounded-xl elevation-12 text-center" style="background:linear-gradient(135deg, #ffffff, #ffffff);">
              &lt;!&ndash; آیکون هشدار &ndash;&gt;
              <v-card-title class="justify-center d-flex align-center">
                <v-icon color="#1976D2" size="36" class="me-2">
                  {{ symbolModel.bookmark ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
                </v-icon>
                <span class="text-h6 font-weight-bold" style="font-family: 'Shabnam', sans-serif;">
        {{ symbolModel.bookmark ? 'آیا از حذف نشان مطمئن هستید؟' : 'آیا از نشان کردن مطمئن هستید؟' }}
      </span>
              </v-card-title>

              <v-card-text class="mt-4 text-gray-darken-1">
                این عملیات به سرعت اعمال می‌شود و می‌توانید بعداً تغییر دهید.
              </v-card-text>

              <v-card-actions class="justify-center mt-6 gap-4">
                <v-btn
                  color="success"
                  variant="elevated"
                  class="rounded-lg px-6"
                  height="44"
                  @click="clickConfirmBookmark"
                >
                  بله
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  class="rounded-lg px-6"
                  height="44"
                  @click="canselBookmark"
                >
                  خیر
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


          <v-dialog v-model="alertActive" max-width="400" persistent>
            <v-card class="pa-4 text-center">
              <v-card-title class="text-h6 font-weight-bold">
                {{ symbolModel.active ? 'آیا از غیر فعال کردن مطمعن هستید' : 'آیا از فعال کردن مطمعن هستید' }}
              </v-card-title>
              <v-card-actions class="justify-center mt-3">
                <v-btn color="success" variant="tonal" @click="isActive">بله</v-btn>
                <v-btn color="error" variant="tonal" @click="canselActive">خیر</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

<v-container>
          <v-dialog v-model="dialog"  max-width="420">
            <v-card class="pa-4 rounded-xl elevation-12">
              <v-card-title class="text-h6 d-flex align-center">
                <v-icon class="me-1" color="primary">mdi-update</v-icon>
                <strong>ایجاد نماد</strong>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="symbolModel.name"
                  label="نام نماد"
                  required
                  variant="outlined"
                />

                <v-select
                  v-model="symbolModel.exchange"
                  :items="exchangeItem"
                  label="نام صرافی"
                  required
                  variant="outlined"
                />
                <v-select
                  v-model="symbolModel.symbolType"
                  :items="symbolTypeItem"
                  label="نوع سیمبل"
                  required
                  variant="outlined"
                />
                <v-checkbox
                  v-model="symbolModel.active"
                  color="indigo"
                  hide-details
                  label="فعال"
                />
                <v-row dense>
                  <v-col cols="6">
                    <v-btn
                      block
                      class="rounded-lg text-white"
                      color="primary"
                      height="44"
                      variant="flat"
                      @click="createSymbol"
                    >
                      ثبت
                    </v-btn>
                  </v-col>
                  <v-snackbar v-model="snackbar" :color="colorSnackbar" timeout="500">
                    {{ messageSnackbar }}
                  </v-snackbar>

                  <v-col class="pl-1" cols="6">
                    <v-btn
                      block
                      color="grey"
                      height="44"
                      variant="flat"
                      @click="closeSymbol"
                    >
                      بستن
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
</v-container>
        &lt;!&ndash;        <v-alert
            v-model="alertBookmark"
            border="start"
            border-color="orange"
            class="d-flex flex-column align-center mt-3"
            density="comfortable"
            type="warning"
          >
            <div class="text-center mb-3" style="font-weight: bold;">
              آیا از انتخاب خود مطمئن هستید؟
            </div>

            <div class="d-flex gap-3">
              <v-btn color="success" variant="tonal" @click="clickConfirmBookmark">بله</v-btn>
              <v-btn color="error" variant="tonal" @click="canselBookmark">خیر</v-btn>
            </div>
          </v-alert>&ndash;&gt;
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

  <style lang="scss" scoped>


  .custom-table ::v-deep table {
    border-collapse: collapse;
    border-spacing: 0 2px;
    background-color: #ececec;

  }

  .custom-table ::v-deep th {
    background-color: #ececec !important;
    border: 10px !important;

  }

  .custom-table ::v-deep td {
    background-color: #ffffff;
    height: 60px;

  }

  </style>
-->
