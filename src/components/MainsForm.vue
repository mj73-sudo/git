<script setup lang="ts" generic="T extends Record<string, any>">
  import { defineEmits, defineProps, ref, watch } from 'vue';
  import type { FieldDefinition } from '../models/FieldDefinition.Model';
  import { VForm } from 'vuetify/components';
  import type { UserModel } from '../models/auth/UserModel.ts';
  import { AuthStore } from '../stores/auth.ts';

  const props = defineProps<{
    fields: FieldDefinition<T>[];
    modelValue: T; }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: T): void;
  }>();

  const localData = ref<T>({ ...props.modelValue });

  watch(localData, val => {
    emit('update:modelValue', val);
  }, { deep: true });

  const showPassword = ref<Record<string, boolean>>({})

  props.fields.forEach(f => {
    if (f.type === 'password') showPassword.value[f.name as string] = false
  })
  //is Filevisible for show or hiden field---------------------------------------------
  const isFieldVisible = (field: FieldDefinition<unknown>) => {
    if (!field.visibleIf || field.visibleIf.length === 0) return true; //show
    return field.visibleIf.every((cond: { field: string; equals: unknown }) => {
      return localData.value[cond.field] === cond.equals;// show !== hide
    });
  };
  //defaultValue for select---------------------------------------------------
  props.fields.forEach(field=>{
    if(field.defaultValue !==undefined){
      localData.value[field.name]=field.defaultValue
    }
  })
  //role------------------------------------------------------
  const authStore = AuthStore();
  const userRole = ref<UserModel['role']>(authStore.me.role);

  const isVisible = (field: FieldDefinition<unknown>) => {
    if (!field.permissions?.visibility) return true;
    return field.permissions.visibility.includes(userRole.value??'');
  };
  const isFieldEditable = (field: FieldDefinition<unknown>) => {
    if (!field.permissions?.canEdit) return true;
    return field.permissions.canEdit.includes(userRole.value ?? '');
  };


  /*const colSize = computed(() => {
    const count = props.fields.length;
    if (count <= 2) return 5;
    if (count === 3) return 4;
    if (count === 4) return 3;
    if (count >= 5) return 6;
    return 12;
  });*/
</script>

<template>

  <v-row>
    <v-col
      v-for="field in props.fields"
      :key="String(field.name)"
      class="d-flex"
      cols="12"
      :md="field.md"
    >
      <v-text-field
        color="primary"

        v-if="(field.type === 'text' || field.type === 'number') && isFieldVisible(field as any) && isVisible(field as any)"
        v-model="localData[field.name as string]"
        density="comfortable"
        :disabled="!isFieldEditable(field as any)"
        :label="field.title"
        :placeholder="field.placeholder"
        :rules="field.rules"
        :type="field.type === 'number' ? 'number' : 'text'"
        variant="outlined"
      >

        <template v-if="field.hint" #append-inner>
          <v-tooltip location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon
                v-bind="tooltipProps"
                color="primary"
                small
                style="cursor: pointer"
              >
                mdi-help-circle
              </v-icon>
            </template>
            {{ field.hint }}
          </v-tooltip>
        </template>
      </v-text-field>

      <v-select
        v-else-if="(field.type === 'combo') && isFieldVisible(field as any) && isVisible(field as any) && isVisible(field as any)"
        v-model="localData[field.name as any]"
        clearable
        color="primary"
        density="comfortable"
        :disabled="!isFieldEditable(field as any)"
        :hint="field.hint"
        :items="field.options"
        :label="field.title"
        persistent-hint
        :placeholder="field.placeholder"
        :rules="field.rules"
        variant="outlined"
      />
      <v-select
        color="primary"

        v-else-if="(field.type === 'select' || field.type === 'multi')&& isFieldVisible(field as any) && isVisible(field as any)"
        v-model="localData[field.name as any]"
        clearable
        density="comfortable"
        :disabled="!isFieldEditable(field as any)"
        :item-title="field.itemTitle || 'title'"
        :item-value="field.itemValue || 'value'"
        :items="field.items || []"
        :label="field.title"
        :multiple="field.type === 'multi'"
        :placeholder="field.placeholder"
        :rules="field.rules"
        variant="outlined"
        @update:model-value="field.onUpdate ? field.onUpdate($event) : null"
      />

      <v-checkbox
        color="primary"

        v-else-if="(field.type === 'checkbox')&& isFieldVisible(field as any) && isVisible(field as any) "
        v-model="localData[field.name as string]"
        :disabled="!isFieldEditable(field as any)"
        :label="field.title"
        :placeholder="field.placeholder"
        :rules="field.rules"
      />

      <v-text-field
        color="primary"

        v-else-if="(field.type === 'password') && isFieldVisible(field as any) && isVisible(field as any)"
        v-model="localData[field.name as string]"
        :append-inner-icon="showPassword[field.name as string] ? 'mdi-eye-off' : 'mdi-eye'"
        density="comfortable"
        :disabled="!isFieldEditable(field as any)"
        :error="field.error?.()"
        :error-messages="field.error?.() ? field.errorMessage : ''"
        :label="field.title"
        :placeholder="field.placeholder"
        prepend-inner-icon="mdi-lock"
        :rules="field.rules"
        :type="showPassword[field.name as string] ? 'text' : 'password'"
        variant="outlined"
        @click:append-inner="showPassword[field.name as string] = !showPassword[field.name as string]"
      />

      <v-textarea
        color="primary"

        v-else-if="(field.type === 'textarea') && isFieldVisible(field as any) && isVisible(field as any)"
        v-model="localData[field.name as any]"
        auto-grow
        density="comfortable"
        :disabled="!isFieldEditable(field as any)"
        :label="field.title"
        :placeholder="field.placeholder"
        :rules="field.rules"
        variant="outlined"
      >
        <template v-if="field.hint" #append-inner>
          <v-tooltip location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon color="primary" small v-bind="tooltipProps">mdi-help-circle</v-icon>
            </template>
            {{ field.hint }}
          </v-tooltip>
        </template>
      </v-textarea>
      <v-file-input
        color="primary"

        v-else-if="(field.type === 'file') && isFieldVisible(field as any) && isVisible(field as any)"
        v-model="localData[field.name as string]"
        :accept="field.allowedFileTypes?.map(t => '.' + t).join(',')"
        :counter="!!field.maxFiles"
        dense
        :disabled="!isFieldEditable(field as any)"
        :label="field.title"
        :multiple="!!(field.maxFiles && field.maxFiles > 1)"
        outlined
        :placeholder="field.placeholder"
        :rules="field.rules"
      />

      <div v-else-if="field.type === 'info'" class="my-4 v-card-title-item ">
        {{ field.content }}
      </div>


      <v-btn v-if="field.type === 'create'" block color="primary" @click="field.onClick?.()">
        {{ field.title }}
      </v-btn>


      <template v-if="field.hint">
        <v-tooltip #activator="{ props: tooltipProps }" location="top">
          <v-icon color="primary" small v-bind="tooltipProps">mdi-help-circle</v-icon>
          {{ field.hint }}
        </v-tooltip>
      </template>

    </v-col>
  </v-row>
</template>
