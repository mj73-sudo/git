<script lang="ts" setup>
  import { StrategyModel } from '../models/StrategyModel.ts';
  import { ConditionModel } from '../models/ConditionModel.ts';
  import { ParamModel } from '../models/ParamModel.ts';
  import { onMounted, ref } from 'vue';
  import { useStrategyStore } from '../stores/Strategy.ts';
  import router from '../router';
  import { SymbolStore } from '../stores/Symbol.ts';
  import { ExitConditionsModel } from '../models/ExitConditionsModel.ts';
  import type { VForm } from 'vuetify/components';

  const strategymodel = ref<StrategyModel>(new StrategyModel());
  const tpSlForm = ref();
  const isformvalid = ref(false);


  //------------------------------------------------------------------
  const sourceModel = ref<ParamModel[]>([]);
  const targetModel = ref<ParamModel[]>([]);
  const strategystore = useStrategyStore();

  const items = ['مشخصات استراتژی', 'شروط', 'بازبینی'];
  const signaltype = ['LONG', 'SHORT'];
  const indicatorTypes = strategystore.indicators;
  const operatortypes = ['GreaterThan', 'SmallerThan', 'CrossUp', 'CrossDown'];
  const resolutionTypes = ['1', '5', '15'];

  const step = ref(1);
  const validStep1 = ref<VForm | null>(null)
  const validEntryForm = ref(false);
  const validExiteForm = ref(false);
  const showPreview = ref(false);
  const formStep1 = ref<VForm | null>(null);
  const formCondition = ref<VForm | null>(null);
  const formConditionRefs = ref<(VForm | null)[]>([]);
  const formExitCondition = ref<(VForm | null)[]>([]);

  const headers = [
    { key: 'index', title: 'ردیف' },
    { key: 'sourceType', title: 'اندیکاتور اول' },
    { key: 'targetType', title: 'اندیکاتور دوم' },
    { key: 'operator', title: 'عملگر' },
    { key: 'resolution', title: 'بازه زمانی' },
    { key: 'delete', title: 'حذف شرط' },
  ];
  //Exit Strategy--------------------------------------------
  const exitHeaders = [
    { key: 'index', title: 'ردیف' },
    { key: 'sourceType', title: 'اندیکاتور اول' },
    { key: 'targetType', title: 'اندیکاتور دوم' },
    { key: 'operator', title: 'عملگر' },
    { key: 'resolution', title: 'بازه زمانی' },
    { key: 'delete', title: 'حذف شرط' },
  ];
  const exitOperatortypes = ['GreaterThan', 'SmallerThan', 'CrossUp', 'CrossDown'];
  const exitResolutionTypes = ['1', '5', '15'];
  const exitModel = ref('tp/sl');
  const exitConditions = ref<ExitConditionsModel[]>([new ExitConditionsModel()])
  const enterConditions = ref<ConditionModel[]>([new ConditionModel()])

  // onMount---------------------------------------------------------
  const symbolStore = SymbolStore();
  const props = defineProps<{ id: string }>()
  onMounted(async () => {
    await symbolStore.getSymbol();
    await strategystore.getAllIndicator();
    await strategystore.canCreateStrategy();
    await strategystore.getEdit(props.id);
    await strategystore.getStrategy();
    await strategystore.fetchItems();
    strategymodel.value=strategystore.editStrategy;
    exitConditions.value = strategystore.editStrategy.exitConditions || [];
    enterConditions.value = strategystore.editStrategy.conditions || [];
    if (exitConditions.value.length > 0) {
      exitModel.value = 'strategy'
    } else if (
      strategymodel.value.tp !== null ||
      strategymodel.value.sl !== null
    ) {
      exitModel.value = 'tp/sl'
    } else {
      exitModel.value = null
    }
  })

  function setExitStrategy() {
    exitModel.value = 'strategy'

    if (exitConditions.value.length === 0) {
      exitConditions.value.push(new ExitConditionsModel())
    }
  }

  //indicatorparm---------------------------------------------------------------------



  const normalizeExitModel = () => {
    if (exitModel.value === 'tp/sl') {
      // TP/SL فعال → Strategy Exit کاملاً حذف
      strategymodel.value.exitConditions = null;
    }

    if (exitModel.value === 'strategy') {
      // Strategy Exit فعال → TP/SL نال
      strategymodel.value.tp = null;
      strategymodel.value.sl = null;

    }
  };


  async function changeExitFirst (indicatorType: string, index: number) {
    await strategystore.getParam(indicatorType);
    exitConditions.value[index].sourceParams = []
    strategystore.indicatorParams.forEach(p => {
      exitConditions.value[index].sourceParams!.push({ key: p, value: 0 });
    });
  }

  async function changeExitSecond (indicatorType: string, index: number) {
    await strategystore.getParam(indicatorType);
    exitConditions.value[index].targetParams = []
    strategystore.indicatorParams.forEach(p => {
      exitConditions.value[index].targetParams!.push({ key: p, value: 0 });
    });
  }

  const addExit = async (index: number) => {
    const lastIndex = exitConditions.value.length - 1;
    const form = formExitCondition.value[lastIndex];
    const isValid = await form?.validate();
    if (!isValid?.valid) return;
    exitConditions.value.push({ ...exitConditions.value[index] });
    /*exitConditions.value.push(new ExitConditionsModel())*/
    sourceModel.value = [];
    targetModel.value = [];
  };


  async function resettp () {
    exitConditions.value = [new ExitConditionsModel()];
  }

  async function resetExit () {
    strategymodel.value.tp = null;
    strategymodel.value.sl = null;
  }

  //----------------------------------------------------------------
  const add = async (index: number) => {

    const lastIndex = enterConditions.value.length - 1;
    const form = formConditionRefs.value[lastIndex];
    const isValid = await form?.validate();
    if (!isValid?.valid) return;

    /*  const isValid = await formCondition.value?.validate();
  if (!isValid.valid) return;*/
    enterConditions.value.push({ ...enterConditions.value[index] });
    /*
conditions.value.push(new ConditionModel())
*/
    /* newcondition.value.sourceParams = sourceModel.value;
newcondition.value.targetParams = targetModel.value;


newcondition.value = new ConditionModel();
sourceModel.value = [];
targetModel.value = [];*/
    /*
conditions.value[index] = new ConditionModel()
*/
    sourceModel.value = [];
    targetModel.value = [];

  };


  //-------------------------------exite-condition-----------------------

  const removeEnterCondition = (index: number) => {
    enterConditions.value.splice(index, 1);
  };
  const removeExitCondition = (index: number) => {
    exitConditions.value.splice(index, 1);
  };
  const sendSymolId = (index: number[]) => {
    strategymodel.value.symbolIds = index;
  }


  const validateBeforeCreate = async () => {

    // مرحله 1: ولیدیشن فرم اصلی
    const mainForm = await formStep1.value?.validate();
    if (!mainForm?.valid) {
      alert('لطفا تمامی فیلدها را پر کنید');
      return false;
    }

    // مرحله 2: شرط‌های ورود
    const filteredEnter = enterConditions.value.filter(cond => {
      return cond.sourceType || cond.targetType || cond.operator;
    });

    if (filteredEnter.length === 0) {
      alert('حداقل یک شرط ورود الزامی است.');
      return false;
    }

    const lastIndexEnter = enterConditions.value.length - 1;
    const formEnter = formConditionRefs.value[lastIndexEnter];
    const enterValid = await formEnter?.validate();

    if (!enterValid?.valid) {
      alert('فیلدهای ورود به معامله نباید خالی باشد');
      return false;
    }

    // -------------------------
    // بررسی TP / SL
    // -------------------------

    const tp = strategymodel.value.tp;
    const sl = strategymodel.value.sl;

    const validTp = tp !== null && tp !== '' && tp !== undefined;
    const validSl = sl !== null && sl !== '' && sl !== undefined;

    const hasAnyTpSl = validTp || validSl;
    const hasFullTpSl = validTp && validSl;

// -------------------------
// بررسی Strategy Exit
// -------------------------

    const hasAnyExit = exitConditions.value.some(cond =>
      cond.sourceType || cond.targetType || cond.operator
    );

// -------------------------
// حالت 1: هیچ خروجی انتخاب نشده
// -------------------------

    if (!hasAnyTpSl && !hasAnyExit) {
      alert('باید یکی از حالت‌های خروج را مشخص کنید.');
      return false;
    }



// -------------------------
// حالت 2: هر دو نوع خروج پر شده
// -------------------------

    if (hasAnyTpSl && hasAnyExit) {
      alert('نمی‌توانید همزمان TP/SL و خروج استراتژی داشته باشید.');
      return false;
    }

// -------------------------
// حالت 3: TP/SL ناقص
// -------------------------

    if (hasAnyTpSl && !hasFullTpSl) {
      alert('هر دو فیلد TP و SL باید پر شوند.');
      return false;
    }

// -------------------------
// حالت 4: بررسی فرم Strategy Exit
// (فرقی ندارد toggle روی چه حالتی باشد)
// -------------------------

    if (!hasAnyTpSl && hasAnyExit) {

      const lastIndexExit = exitConditions.value.length - 1;
      const formExit = formExitCondition.value[lastIndexExit];

      const exitValid = await formExit?.validate();

      if (!exitValid?.valid) {
        alert('فیلدهای خروج به معامله نباید خالی باشد');
        return false;
      }
      strategymodel.value.tp = null;
      strategymodel.value.sl = null;
    }
    return true;
  };


  const create = async () => {
    const isValid = await validateBeforeCreate()
    if (!isValid) return
    await normalizeExitModel();
    await strategystore.updateStrategy(strategymodel.value);
    await strategystore.fetchItems();

  }

  async function changeFirst (indicatorType: string, index: number) {
    /*   sourceModel.value = [];
await strategystore.getParam(indicatorType);
/!*    conditions.value[index].sourceParams =
  strategystore.params.map(p => ({
    key: p.name,
    value: 0,
  }))
  *!/*/
    /*   sourceModel.value = [];
await strategystore.getParam(indicatorType);
strategystore.indicatorParams.forEach(param => {
  sourceModel.value.push({ key: param, value: 0 });
});*/
    await strategystore.getParam(indicatorType)
    enterConditions.value[index].sourceParams = []; // اول خالی کن
    strategystore.indicatorParams.forEach(p => {
      enterConditions.value[index].sourceParams!.push({
        key: p,
        value: 0,
      })
    })
  }

  async function changeSecond (indicatorType: string, index: number) {
    /*
targetModel.value = [];
*/
    await strategystore.getParam(indicatorType);
    /* strategystore.params.forEach(param => {
  targetModel.value.push({ key: param, value: 0 });
});*/
    enterConditions.value[index].targetParams =
      strategystore.indicatorParams.map(p => ({
        key: p,
        value: 0,
      }))
  }


  async function prview () {
    showPreview.value = true;
  }

//Mainform---------------------------------------------------
/* const field1 =computed(() => [
   { type: 'text', name: 'name',md:3, title: 'نام استراتژی' ,
     rules: [(v: unknown) => !!v || 'نام استراتژی الزامی است'],
   },
   {
     type: 'select',
     name: 'signalType',
     title: 'نوع سیگنال',
     items: signaltype, // 👈 هر چی بخوای میدی
     itemTitle: 'name',md:3,
     itemValue: 'id',
     rules: [(v: unknown) => !!v || 'نوع سیگنال الزامی است'],
   },
   {
     type: 'multi',
     name: 'symbolIds',
     title: 'انتخاب نماد',
     items: symbolStore.symbols,
     itemTitle: 'name',md:3,
     itemValue: 'id',
     rules: [(v: unknown[]) => Array.isArray(v) && v.length > 0 || 'حداقل یک نماد انتخاب شود'],

   },

 ]);


 const field2 = computed(() => [
   // اندیکاتور اول
   {
     type: 'select',
     name: 'sourceType',
     title: 'اندیکاتور اول',
     items: strategystore.indicators,
     itemTitle: 'name',
     itemValue: 'id',
     md: 6,
     rules: [(v: unknown) => !!v || 'اجباری'],
     onUpdate: (value: string | null) => {
       if (value !== null) changeFirst(value);
     },
   },

   // پارامترهای اندیکاتور اول
   ...sourceModel.value.map((item, index) => ({
     type: 'text',
     name: `sourceParam_${index}`,
     title: item.key,
     md: 3,
     modelValue: item.value,
     rules: [(v: number) => v >= 0 || 'باید مثبت باشد'],
     onUpdate: (val: number) => {
       item.value = val;
     },
   })),

   // اندیکاتور دوم
   {
     type: 'select',
     name: 'targetType',
     title: 'اندیکاتور دوم',
     items: strategystore.indicators,
     itemTitle: 'name',
     itemValue: 'id',
     md: 6,
     rules: [(v: unknown) => !!v || 'اجباری'],
     onUpdate: (value: string | null) => {
       if (value !== null) changeSecond(value);
     },
   },

   // پارامترهای اندیکاتور دوم
   ...targetModel.value.map((item, index) => ({
     type: 'text',
     name: `targetParam_${index}`,
     title: item.key,
     md: 3,
     modelValue: item.value,
     rules: [(v: number) => v >= 0 || 'باید مثبت باشد'],
     onUpdate: (val: number) => {
       item.value = val;
     },
   })),

   // عملگر
   {
     type: 'select',
     name: 'operator',
     title: 'عملگر',
     items: operatortypes,
     itemTitle: 'name',
     itemValue: 'id',
     md: 4,
     rules: [(v: unknown) => !!v || 'الزامی است'],
   },

   // بازه زمانی
   {
     type: 'select',
     name: 'resolution',
     title: 'بازه زمانی',
     items: resolutionTypes,
     itemTitle: 'name',
     itemValue: 'id',
     md: 4,
     rules: [(v: unknown) => !!v || 'بازه زمانی الزامی است'],
   },
 ]);*/
</script>

<template class="v-home">

  <!--  <div style="background-color: #b81212"></div>-->
  <v-container
    class="mx-auto d-flex flex-column justify-center align-center mt-8 mb-8"
    style="background-color: #ffffff ; border-radius: 25px;"
  >
    <v-card
      class="justify-center max-auto "
      elevation="0"
      style="background-color: #ffffff"
      width="90%"
    >
      <v-card-title>
        <!-- عنوان اصلی -->
        <v-row>
          <v-col cols="12">
            <v-icon class="me-2" color="primary">mdi-lightbulb-on-outline</v-icon>
            <span class="text-h6 font-weight-bold">ایجاد استراتژی شخصی</span>
          </v-col>
        </v-row>

        <!-- زیرنویس بزرگ -->
        <v-row class="mt-0">
          <v-col cols="12">
            <span class="text-grey text-lg-subtitle-1 font-medium">
              ایجاد استراتژی‌های معاملاتی سفارشی با چند شرط
            </span>
          </v-col>
        </v-row>
      </v-card-title>

      <v-form ref="formStep1" class="mt-4">
        <v-row class="mt-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="strategymodel.name"
              class="custom"
              color="primary"
              density="comfortable"
              label="نام استراتژی"
              outlined
              rounded="lg"
              clearable
              :rules="[v => !!v || 'نام استراتژی الزامی است']"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="symbolStore.symbols"
              class="custom"
              color="primary"
              density="comfortable"
              item-color="primary"
              item-title="name"
              item-value="id"
              :items="symbolStore.symbols"
              label="نام سیمبل"
              multiple
              outlined
              rounded="lg"
              :rules="[v=>(v&& v.length>0)|| 'نام سیمبل الزامی هست']"
              variant="outlined"
              @update:model-value="sendSymolId"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="strategymodel.signalType"
              class="custom"
              color="primary"
              density="comfortable"
              :items="signaltype"
              clearable
              label="نوع سیگنال "
              outlined
              rounded="lg"
              :rules="[v => !!v || 'نوع سیگنال الزامی است']"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-divider class="custom-divider  mt-5" />

      </v-form>
      <v-card-title class="mt-5">
        <!-- عنوان اصلی -->
        <v-row>
          <v-col cols="12">
            <v-icon class="me-0" color="primary">mdi-lightbulb-on-outline</v-icon>
            <span class="text-h6 font-weight-bold">ورود به معامله</span>
          </v-col>
        </v-row>
      </v-card-title>
      <!-- Card Title -->


      <!-- Entry Form -->
      <v-container class="d-flex flex-column" style="background-color: #ffffff;">
        <template v-for="(condition, index) in enterConditions" :key="index">

          <v-card
            class=" px-10"
            flat
            rounded="xl"
            style="background-color: #fff8f8; border-color: black"
            width="100%"
          >
            <v-card-title>
              <span class="text-h6 font-weight-bold">شرط{{ index + 1 }}</span>
            </v-card-title>
            <v-form
              :key="index"
              :ref="el => formConditionRefs[index] = el as VForm | null"
              v-model="validEntryForm"
            >
              <v-row class="mt-4" density="comfortable">
                <!-- اندیکاتور اول -->
                <v-col cols="12" md="6">
                  <v-autocomplete
                    clearable
                    v-model="condition.sourceType"
                    color="primary"
                    density="comfortable"
                    :items="strategystore.indicators"
                    label="اندیکاتور اول"
                    :rules="[v => !!v || 'اجباری']"
                    variant="outlined"
                    @update:model-value="(val) => changeFirst(val, index)"
                  />
                </v-col>

                <!-- پارامترهای اندیکاتور اول -->
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col v-for="(item, index) in condition.sourceParams" :key="index" cols="12" md="12">
                      <v-text-field
                        v-model.number="item.value"
                        color="primary"
                        density="comfortable"
                        :label="item.key"
                        rounded="lg"
                        :rules="[v => v > 0 || 'باید مثبت باشد']"
                        variant="outlined"
                        clearable
                      />
                    </v-col>
                  </v-row>
                </v-col>


                <!-- اندیکاتور دوم -->
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="condition.targetType"
                    color="primary"
                    density="comfortable"

                    :items="strategystore.indicators"
                    label="اندیکاتور دوم"
                    :rules="[v => !!v || 'اجباری']"
                    variant="outlined"
                    @update:model-value="(val) => changeSecond(val, index)"
                    clearable
                  />
                </v-col>

                <!-- پارامترهای اندیکاتور دوم -->
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col v-for="(item, index) in condition.targetParams" :key="index" cols="12" md="12">
                      <v-text-field
                        v-model.number="item.value"
                        color="primary"
                        density="comfortable"
                        :label="item.key"
                        rounded="lg"
                        :rules="[v => v > 0 || 'باید مثبت باشد']"
                        variant="outlined"
                        clearable
                      />
                    </v-col>
                  </v-row>
                </v-col>


                <v-col cols="12" md="4">
                  <v-select
                    v-model="condition.resolution"
                    color="primary"
                    density="comfortable"
                    :items="exitResolutionTypes"
                    label="بازه زمانی"
                    rounded="lg"
                    clearable
                    :rules="[v => !!v || 'بازه زمانی الزامی است']"

                    variant="outlined"
                  />
                </v-col>

                <!-- عملگر -->
                <v-col cols="12" md="4">
                  <v-select
                    v-model="condition.operator"
                    color="primary"
                    density="comfortable"
                    :items="operatortypes"
                    label="عملگر"
                    rounded="lg"
                    :rules="[v => !!v || 'انتخاب عملگر الزامی است']"
                    clearable
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex justify-center mt-3" cols="12" md="4">
                  <v-icon
                    color="red"
                    :disabled="enterConditions.length=== 1 "
                    icon="mdi-delete"
                    size="large"
                    @click="removeEnterCondition(index)"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <v-row v-if="index < enterConditions.length - 1" class="my-4">
            <v-col class="d-flex align-center justify-center" cols="12">
              <v-divider class="custom-divider" />
              <span class="mx-4 font-weight-bold text-black">
                AND
              </span>
              <v-divider class="custom-divider" />
            </v-col>
          </v-row>
        </template>
      </v-container>

      <!-- Add Button------------------------------------------->

      <v-row class="px-8 py-2" justify="center">
        <v-col cols="12" md="12">
          <v-btn
            block
            class="mb-2 rounded-lg dashed-btn"
            height="45"
            prepend-icon="mdi-plus"
            rounded="4"
            variant="tonal"
            @click="add"
          >
            افزودن شرط ورود
          </v-btn>
        </v-col>
        <v-divider class="custom-divider" />
      </v-row>

      <v-card-title class=" mt-5">
        <v-icon class="me-2" color="primary">mdi-lightbulb-off-outline</v-icon>
        خروج از معامله
      </v-card-title>

      <!-- MODE SWITCH -->

      <!-- Exit Mode Selector -->


      <v-row class="mt-4 pa-4" density="comfortable">
        <v-col cols="12" md="6">
          <v-btn
            block
            :color="exitModel === 'tp/sl' ? '#2479fd' : 'white lighten-3'"
            height="50"
            @click="exitModel = 'tp/sl';"
          >
            TP / SL
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            block
            :color="exitModel === 'strategy' ? '#2479fd' : 'white lighten-3'"
            height="50"
            @click="setExitStrategy"
          >
            STRATEGY
          </v-btn>
        </v-col>
      </v-row>


      <!-- TP / SL Mode -->

      <v-container v-if="exitModel === 'tp/sl' ">
        ّ
        <v-card
          class=" px-10"
          flat
          rounded="xl"
          style="background-color: #fff8f8"
          width="100%"
        >
          <v-form
            ref="tpSlForm"
          >
            <v-row class="mt-1">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="strategymodel.tp"
                  color="success"
                  density="comfortable"
                  label="حدسود"
                  rounded="lg"
                  :rules="[v => v > 0 || 'باید مثبت باشد']"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="strategymodel.sl"
                  color="error"
                  density="comfortable"
                  label="حدضرر"
                  rounded="lg"
                  :rules="[v => v > 0 || 'باید مثبت باشد']"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-container>

      <!-- v-formmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm -->
      <v-container
        v-if="exitModel === 'strategy'"
        class="d-flex justify-center flex-column"
      >
        <template v-for="(exitecondition, index) in exitConditions" :key="index">
          <v-card
            class=" px-10 py-5 "
            flat
            outlined
            rounded="xl"
            style="background-color: #f9fafb"
            width="100%"
          >
            <v-card-title class="mb-5">
              <span class="text-h6 font-weight-bold ">شرط{{ index + 1 }}</span>
            </v-card-title>
            <v-form
              :key="index"
              :ref="el => formExitCondition[index] = el as VForm | null"
              v-model="validExiteForm"
            >
              <v-row class="mb-4" density="comfortable">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="exitecondition.sourceType"
                    color="primary"
                    density="comfortable"
                    :items="strategystore.indicators"
                    label="اندیکاتور اول"
                    :rules="[v => !!v || 'اجباری']"
                    variant="outlined"
                    clearable
                    @update:model-value="(val) => changeExitFirst(val,index)"
                  />
                </v-col>


                <!-- پارامترهای اندیکاتور اول -->
                <v-col cols="12" md="6">
                  <v-row density="comfortable">
                    <v-col v-for="(item, index) in exitecondition.sourceParams" :key="index" cols="12" md="12">
                      <v-text-field
                        v-model.number="item.value"
                        color="primary"
                        density="comfortable"
                        :label="item.key"
                        rounded="lg"
                        :rules="[v => v > 0 || 'باید مثبت باشد']"
                        variant="outlined"
                        clearable
                      />
                    </v-col>
                  </v-row>
                </v-col>


                <!-- اندیکاتور دوم -->
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="exitecondition.targetType"
                    color="primary"
                    density="comfortable"
                    :items="strategystore.indicators"
                    label="اندیکاتور دوم"
                    rounded="lg"
                    :rules="[v => !!v || 'اجباری']"
                    variant="outlined"
                    clearable
                    @update:model-value="(val) => changeExitSecond(val, index)"
                  />
                </v-col>

                <!-- پارامترهای اندیکاتور دوم -->
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col v-for="(item, index) in exitecondition.targetParams" :key="index" cols="12" md="12">
                      <v-text-field
                        v-model.number="item.value"
                        color="primary"
                        density="comfortable"
                        clearable
                        :label="item.key"
                        rounded="lg"
                        :rules="[v => v > 0 || 'باید مثبت باشد']"

                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-col>


                <v-col cols="12" md="4">
                  <v-select
                    v-model="exitecondition.resolution"
                    color="primary"
                    density="comfortable"
                    :items="exitResolutionTypes"
                    clearable
                    label="بازه زمانی"
                    rounded="lg"
                    :rules="[v => !!v || 'بازه زمانی الزامی است']"

                    variant="outlined"
                  />
                </v-col>
                <!-- عملگر -->
                <v-col cols="12" md="4">
                  <v-select
                    v-model="exitecondition.operator"
                    class="custom-select"
                    color="primary"
                    density="comfortable"
                    :items="exitOperatortypes"
                    label="عملگر"
                    clearable
                    rounded="lg"
                    :rules="[v => !!v || 'انتخاب عملگر الزامی است']"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex justify-center mt-3" cols="12" md="4">
                  <v-icon
                    color="red"
                    :disabled="exitConditions.length=== 1 "
                    icon="mdi-delete"
                    size="large"
                    @click="removeExitCondition(index)"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <v-row v-if="index < exitConditions.length - 1" class="my-4">
            <v-col class="d-flex align-center justify-center" cols="12">
              <v-divider class="custom-divider" />
              <span class="mx-3 font-weight-bold text-black">
                AND
              </span>
              <v-divider class="custom-divider" />
            </v-col>
          </v-row>
        </template>
      </v-container>
      <v-divider class="custom-divider" />
      <v-row v-if="exitModel==='strategy'" class="pa-4" justify="center">
        <v-col class="d-flex justify-center" cols="12" md="12">
          <v-btn
            block
            class="rounded-lg dashed-btn"
            height="45"
            prepend-icon="mdi-plus"
            rounded="4"
            variant="tonal"
            @click="addExit"
          >
            افزودن شرط خروج
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="pa-5" justify="center">
        <v-col cols="12" md="10">
          <v-btn
            append-icon="mdi-checkbox-marked-circle"
            block
            class=" mb-4"
            color="primary"
            height="48"
            rounded="4"
            variant="flat"
            @click="create"
          >
            ایجاد استراتژی
          </v-btn>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn
            append-icon="mdi-eye"
            block
            class="mb-4"
            height="48"
            rounded="4"
            variant="outlined"
            @click="prview"
          >
            پیش نمایش
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- preview------------------------------------------------------------------------------------------ -->

    <v-card
      v-if="showPreview"
      class=" pa-6"
      flat
      max-width="100%"
      style="direction: rtl; background: #f9fafb; border-radius: 8px; "
      width="90%"
    >
      <v-card-title class="text-h5 font-weight-bold mb-6">بازبینی اطلاعات</v-card-title>
      <v-list density="comfortable">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              📝 نام استراتژی: <span class="text-body-1">{{ strategymodel.name || '—' }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              📈 نوع سیگنال: <span class="text-body-1">{{ strategymodel.signalType || '—' }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="font-weight-bold my-4">لیست شروط:</div>
      <v-list density="comfortable">
        <v-list-item v-for="(cond, i) in enterConditions" :key="i" class="mb-3">
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              {{ i + 1 }}. {{ cond.sourceType }} ({{ cond.sourceParams?.map((p: any) => p.value).join(',') }})
              {{ cond.operator }} {{ cond.targetType }} ({{ cond.targetParams?.map((p: any) => p.value).join(',') }})
              <span class="text-primary"> (⏱ {{ cond.resolution }}) </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="font-weight-bold my-4">لیست خروج:</div>
      <v-list v-if="exitModel==='strategy'" density="comfortable">
        <v-list-item v-for="(cond, i) in exitConditions" :key="i" class="mb-3">
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              {{ i + 1 }}. {{ cond.sourceType }} ({{ cond.sourceParams?.map((p: any) => p.value).join(',') }})
              {{ cond.operator }} {{ cond.targetType }} ({{ cond.targetParams?.map((p: any) => p.value).join(',') }})
              <span class="text-primary"> (⏱ {{ cond.resolution }}) </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="exitModel==='tp/sl'" density="comfortable">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            <span class="text-success"> حدسود:{{ strategymodel.tp }} </span>
            <span class="text-error"> حدضرر:{{ strategymodel.sl }} </span>
          </v-list-item-title>
        </v-list-item-content>


      </v-list>
    </v-card>
  </v-container>
</template>
<style lang="scss" scoped>

.exit-add-btn {
  background: linear-gradient(135deg, #ff8c00, #ffb347);
  color: black;
  font-weight: bold;
  border-radius: 12px;
}

.dashed-btn {
  border: 2px dashed rgba(0, 0, 0, 0.4) !important;
}

.custom-divider {
  border: 1px solid #000000; // پررنگ و مشکی
}

:deep(.v-field) {
  background-color: #ffffff;
}

</style>
