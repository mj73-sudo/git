<!--<script setup lang="ts" generic="T extends Record<string, any>">-->
<!--  import { AuthStore } from '../stores/auth.ts';-->
<!--  import { computed, defineEmits, defineProps, ref } from 'vue';-->
<!--  import type { FieldDefinition } from '../models/FieldDefinition.Model';-->
<!--  import type { UserModel } from '../models/auth/UserModel.ts';-->

<!--  const props = defineProps<{ fields: FieldDefinition<T>[]; modelValue: T }>();-->
<!--  const emit = defineEmits<{ (e: 'update:modelValue', value: T): void; (e: 'submit', data: T): void }>();-->
<!--  //validate Form&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--  const formRef = ref();-->
<!--  //-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--  const localData = ref<T>({ ...props.modelValue });-->
<!--  const currentStep = ref(0);-->

<!--  const fieldsForCurrentStep = computed(() =>-->
<!--    props.fields.filter(f => (f.step ?? 0) === currentStep.value));-->

<!--  const nextStep = async () => {-->
<!--    const { valid } = await formRef.value.validate();-->
<!--    if (valid && currentStep.value < Math.max(...props.fields.map(f => f.step ?? 0))) {-->
<!--      currentStep.value++;-->
<!--    }-->
<!--  };-->

<!--  const prevStep = () => {-->
<!--    if (currentStep.value > 0) currentStep.value&#45;&#45;;-->
<!--  };-->

<!--  const submitStep = async () => {-->
<!--    const { valid } = await formRef.value.validate();-->

<!--    if (valid) emit('submit', localData.value); // ارسال داده‌ها به والد-->
<!--  };-->


<!--  const showPassword = ref<Record<string, boolean>>({})-->

<!--  props.fields.forEach(f => {-->
<!--    if (f.type === 'password') showPassword.value[f.name as string] = false-->
<!--  })-->
<!--  //is Filevisible-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--  const isFieldVisible = (field: FieldDefinition<unknown>) => {-->
<!--    if (!field.visibleIf || field.visibleIf.length === 0) return true;-->
<!--    return field.visibleIf.every((cond: { field: string; equals: unknown }) => {-->
<!--      return localData.value[cond.field] === cond.equals;-->
<!--    });-->
<!--  };-->
<!--  //defaultValue for select-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--  props.fields.forEach(field=>{-->
<!--    if(field.defaultValue !==undefined){-->
<!--      localData.value[field.name]=field.defaultValue-->
<!--    }-->
<!--  })-->
<!--  //role&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--  const authStore = AuthStore();-->
<!--  const userRole = ref<UserModel['role']>(authStore.me.role);-->

<!--  const isVisible = (field: FieldDefinition<unknown>) => {-->
<!--    if (!field.permissions?.visibility) return true;-->
<!--    return field.permissions.visibility.includes(userRole.value);-->
<!--  };-->
<!--  const isFieldEditable = (field: FieldDefinition<unknown>) => {-->
<!--    if (!field.permissions?.canEdit) return true;-->
<!--    return field.permissions.canEdit.includes(userRole.value);-->
<!--  };-->
<!--</script>-->

<!--<template>-->
<!--  <v-form ref="formRef">-->
<!--    <v-row>-->
<!--      <v-col-->
<!--        v-for="field in fieldsForCurrentStep"-->
<!--        :key="field.name"-->
<!--        :md="field.md || 12"-->
<!--      >-->
<!--        <v-text-field-->
<!--          v-if="(field.type === 'text' || field.type === 'number') && isFieldVisible(field as any) && isVisible(field as any) && isVisible(field)"-->
<!--          v-model="localData[field.name]"-->
<!--          density="comfortable"-->
<!--          :disabled="!isFieldEditable(field as any)"-->
<!--          :label="field.title"-->
<!--          :placeholder="field.placeholder"-->
<!--          :rules="field.rules"-->
<!--          :type="field.type === 'number' ? 'number' : 'text'"-->
<!--          variant="outlined"-->
<!--        >-->

<!--          <template v-if="field.hint" #append-inner>-->
<!--            <v-tooltip location="top">-->
<!--              <template #activator="{ props: tooltipProps }">-->
<!--                <v-icon-->
<!--                  v-bind="tooltipProps"-->
<!--                  color="primary"-->
<!--                  small-->
<!--                  style="cursor: pointer"-->
<!--                >-->
<!--                  mdi-help-circle-->
<!--                </v-icon>-->
<!--              </template>-->
<!--              {{ field.hint }}-->
<!--            </v-tooltip>-->
<!--          </template>-->
<!--        </v-text-field>-->

<!--        <v-select-->
<!--          v-else-if="(field.type === 'combo') && isFieldVisible(field as any) && isVisible(field as any) && isVisible(field as any)"-->
<!--          v-model="localData[field.name]"-->
<!--          clearable-->
<!--          density="comfortable"-->
<!--          :disabled="!isFieldEditable(field as any)"-->
<!--          :hint="field.hint"-->
<!--          :items="field.options"-->
<!--          :label="field.title"-->
<!--          persistent-hint-->
<!--          :placeholder="field.placeholder"-->
<!--          :rules="field.rules"-->
<!--          variant="outlined"-->
<!--        />-->
<!--        <v-select-->
<!--          v-else-if="(field.type === 'select' || field.type === 'multi')&& isFieldVisible(field as any) && isVisible(field as any) && isVisible(field as any)"-->
<!--          v-model="localData[field.name as any]"-->
<!--          clearable-->
<!--          density="comfortable"-->
<!--          :disabled="!isFieldEditable(field as any)"-->
<!--          :item-title="field.itemTitle || 'title'"-->
<!--          :item-value="field.itemValue || 'value'"-->
<!--          :items="field.items || []"-->
<!--          :label="field.title"-->
<!--          :multiple="field.type === 'multi'"-->
<!--          :placeholder="field.placeholder"-->
<!--          :rules="field.rules"-->
<!--          variant="outlined"-->
<!--          @update:model-value="field.onUpdate ? field.onUpdate($event) : null"-->
<!--        />-->

<!--        <v-checkbox-->
<!--          v-else-if="(field.type === 'checkbox')&& isFieldVisible(field as any) && isVisible(field as any) && isVisible(field as any)"-->
<!--          v-model="localData[field.name as string]"-->
<!--          :disabled="!isFieldEditable(field as any)"-->
<!--          :label="field.title"-->
<!--          :placeholder="field.placeholder"-->
<!--          :rules="field.rules"-->
<!--        />-->

<!--        <v-text-field-->
<!--          v-else-if="(field.type === 'password') && isFieldVisible(field as any) && isVisible(field as any) && isVisible(field as any)"-->
<!--          v-model="localData[field.name as string]"-->
<!--          :append-inner-icon="showPassword[field.name as string] ? 'mdi-eye-off' : 'mdi-eye'"-->
<!--          density="comfortable"-->
<!--          :disabled="!isFieldEditable(field as any)"-->
<!--          :error="field.error?.()"-->
<!--          :error-messages="field.error?.() ? field.errorMessage : ''"-->
<!--          :label="field.title"-->
<!--          :placeholder="field.placeholder"-->
<!--          prepend-inner-icon="mdi-lock"-->
<!--          :rules="field.rules"-->
<!--          :type="showPassword[field.name as string] ? 'text' : 'password'"-->
<!--          variant="outlined"-->
<!--          @click:append-inner="showPassword[field.name as string] = !showPassword[field.name as string]"-->
<!--        />-->

<!--        <v-textarea-->
<!--          v-else-if="(field.type === 'textarea') && isFieldVisible(field as any) && isVisible(field as any)"-->
<!--          v-model="localData[field.name as any]"-->
<!--          auto-grow-->
<!--          density="comfortable"-->
<!--          :disabled="!isFieldEditable(field as any)"-->
<!--          :label="field.title"-->
<!--          :placeholder="field.placeholder"-->
<!--          :rules="field.rules"-->
<!--          variant="outlined"-->
<!--        >-->
<!--          <template v-if="field.hint" #append-inner>-->
<!--            <v-tooltip location="top">-->
<!--              <template #activator="{ props: tooltipProps }">-->
<!--                <v-icon color="primary" small v-bind="tooltipProps">mdi-help-circle</v-icon>-->
<!--              </template>-->
<!--              {{ field.hint }}-->
<!--            </v-tooltip>-->
<!--          </template>-->
<!--        </v-textarea>-->
<!--        <v-file-input-->
<!--          v-else-if="(field.type === 'file') && isFieldVisible(field as any) && isVisible(field as any)"-->
<!--          v-model="localData[field.name as string]"-->
<!--          :accept="field.allowedFileTypes?.map(t => '.' + t).join(',')"-->
<!--          :counter="!!field.maxFiles"-->
<!--          dense-->
<!--          :disabled="!isFieldEditable(field as any)"-->
<!--          :label="field.title"-->
<!--          :multiple="!!(field.maxFiles && field.maxFiles > 1)"-->
<!--          outlined-->
<!--          :placeholder="field.placeholder"-->
<!--          :rules="field.rules"-->
<!--        />-->

<!--        <div v-else-if="field.type === 'info'" class="my-4 v-card-title-item ">-->
<!--          {{ field.content }}-->
<!--        </div>-->

<!--      </v-col>-->
<!--    </v-row>-->


<!--    <v-row class="mt-4" justify="space-between">-->
<!--      <v-col cols="6">-->
<!--        <v-btn-->
<!--          v-if="currentStep > 0"-->
<!--          color="secondary"-->
<!--          variant="outlined"-->
<!--          @click="prevStep"-->
<!--        >-->
<!--          قبلی-->
<!--        </v-btn>-->
<!--      </v-col>-->

<!--      <v-col class="text-end" cols="6">-->
<!--        <v-btn-->
<!--          v-if="currentStep < Math.max(...props.fields.map(f => f.step ?? 0))"-->
<!--          color="primary"-->
<!--          @click="nextStep"-->
<!--        >-->
<!--          بعدی-->
<!--        </v-btn>-->

<!--        <v-btn-->
<!--          v-else-->
<!--          color="success"-->
<!--          @click="submitStep"-->
<!--        >-->
<!--          ارسال-->
<!--        </v-btn>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </v-form>-->

<!--</template>-->
