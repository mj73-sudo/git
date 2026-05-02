<script setup lang="ts" generic="T extends Record<string, any>">
  import { defineEmits, defineProps, watch } from 'vue';
  import type { FieldDefinition } from '../models/FieldDefinition.Model.ts';
  import Stepper from './Stepper.vue';
  import MainsForm from './MainsForm.vue';

  const props = defineProps<{
    fields: FieldDefinition<T>[];
    modelValue: T;
    type ?: 'mainForm' | 'stepper';
  }>();


  const emit = defineEmits<{
    (e: 'update:modelValue', value: T): void;
  }>();
  const localData = reactive({ ...props.modelValue }) as T;

  watch(localData, val => {
    emit('update:modelValue', val);
  }, { deep: true });
</script>

<template>
  <component
    :is="props.type === 'stepper' ? Stepper : MainsForm"
    :fields="props.fields"
    :model-value="localData"
  />
</template>
