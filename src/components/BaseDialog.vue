<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: Boolean,
    title: String,
    text: String,
    width: {
      type: Number,
      default: 500,
    },
    confirmText: {
      type: String,
      default: 'تایید',
    },
    cancelText: {
      type: String,
      default: 'انصراف',
    },
    confirmColor: {
      type: String,
      default: 'primary',
    },
    cancelColor: {
      type: String,
      default: 'grey',
    },
    actionSize: {
      type: String,
      default: 'normal', // small | normal | large
    },
    icontext:{
    type:String,
  default:'null',
  }
  })


  const actionBtnClass = computed(() => {
    if (props.actionSize==='small'){
      return 'px-6 py-3'
    }
    else if(props.actionSize==='large'){
      return 'px-10 py-5'
    }
    else if (props.actionSize==='xl'){
      return 'px-16 py-5'
    }
  })
  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

  const dialog = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  function onConfirm () {
    emit('confirm')
    dialog.value = false
  }

  function onCancel () {
    emit('cancel')
    dialog.value = false
  }
</script>


<template>

  <v-dialog v-model="dialog" persistent transition="fade-transition" :width="width">

    <v-card
      class="dialog-glass pa-5"
      elevation="0"
      rounded="md"
    >

      <v-card-title
        class="text-h7 font-weight-bold "
        style="font-family: 'Shabnam', sans-serif"
      >
        <v-icon>{{icontext}}</v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text
        class="text-body-1 text-grey-darken-3 text-center mt-0"
        style="font-family: 'Shabnam', sans-serif"
      >
        <slot>
          {{ text }}
        </slot>
      </v-card-text>

      <v-card-actions class="mt-0 d-flex justify-center ">


        <v-btn
          :class="['rounded-lg d-flex', actionBtnClass]"
          :color="confirmColor"
          variant="flat"
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>


        <v-btn
          :class="['rounded-lg d-flex', actionBtnClass]"
          :color="cancelColor"
          variant="outlined"
          @click="onCancel"
        >
          {{ cancelText }}
        </v-btn>
      </v-card-actions>

    </v-card>

  </v-dialog>
</template>
