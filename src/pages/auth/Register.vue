<script setup lang="ts">
  import router from "../../router";

  const form = ref()
  import { ref } from 'vue';
  import { RegisterModel } from '../../models/auth/RegisterModel.ts';
  import { AuthStore } from '../../stores/auth.ts';

  const authStore = AuthStore()
  const registermodel = ref<RegisterModel>(new RegisterModel());
  const showpassword = ref<boolean>(false);
  const isformValid = ref<boolean>(false);
  const snackbar=ref<boolean>(false)
  const snackbarcolor = ref<string>('')
  const snackbarmessage=ref<string>('')


  const doRegister = async () => {
    console.log(registermodel.value);
    await authStore.registerUser(registermodel.value);
    if (authStore.error === '') {
      snackbarcolor.value ='success';
      snackbarmessage.value='ثبت نام با موفقیت انجام شد';
      snackbar.value=true;
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
    else {
      snackbarcolor.value ='error';
      snackbarmessage.value=authStore.error;
      snackbar.value=true;
    }
  }
  const nameRules = [
    (value: string) => {
      if (value) return true;
      return 'نام نمیتواند خالی باشد';
    },
  ];
  const passwordRules = [
    (value: string) => {
      if (value?.length > 8) return true;
      return 'طول رمز عبور حداقل باید هشت کاراکتر باشد ';
    },
  ];
  const emailRules = [
    (value: string) => {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) return true;
      return 'ایمیل صحیح نیست ';
    },
  ];
  const mobileNumberRules = [
    (value: string) => {
      if (value) {
        if (/^09\d{9}$/.test(value)) return true;
      }

      return 'شماره همراه را صحیح وارد کنید'
    },
  ];
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height" fluid>
      <v-col class="d-flex justify-center align-center" cols="6">
        <v-card
          class="mx-auto my-8"
          elevation="2"
        >
          <v-card-title class="d-flex justify-center  pt-lg-3">
            <strong>ثبت نام در آرازکریپتو</strong>
          </v-card-title>

          <v-card-item class="d-flex pa-0 ma-4  ">
            <v-sheet max-height="400" width="350">

              <v-form
                ref="form"
                v-model="isformValid"
                class="ma-2"
                fast-fail
                @submit.prevent=" doRegister"
              >
                  <v-text-field
                    v-model="registermodel.username"
                    append-inner-icon="mdi-account"
                    label="نام کاربری"
                    required
                    :rules="nameRules"
                  />
                <v-text-field
                  v-model="registermodel.email"
                  append-inner-icon="mdi-email-outline"
                  label="ایمیل"
                  placeholder="johndoe@gmail.com"
                  required
                  :rules="emailRules"
                />
                <v-text-field
                  v-model="registermodel.mobileNumber"
                  append-inner-icon="mdi-phone"
                  class="justify-end text-deep-purple-darken-8"
                  dir="ltr"
                  label="موبایل"
                  placeholder="09121234561"
                  required
                  :rules="mobileNumberRules"
                />

                <v-text-field
                  v-model="registermodel.password"
                  append-inner-icon="mdi-eye"
                  class="pt-2"
                  label="پسورد"
                  required
                  :rules="passwordRules"
                  :type="showpassword ? 'text' : 'password'"
                  @click:append-inner="showpassword =!showpassword"
                />
                <v-btn block class="d-flex bg-purple text-center mt-1 " :disabled="!isformValid" type="submit">ثبت نام</v-btn>
                <p class="d-flex justify-center pt-3 ">قبلا حساب دارید
                  <router-link to="/login">وارد</router-link>
                  شوید
                </p>
              </v-form>
            </v-sheet>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col class="d-flex justify-center pa-0" cols="6">
        <div>
          <v-img
            :aspect-ratio="1"
            class="fullScreen"
            src="@/assets/login.png"
            width="500"
          />

        </div>
      </v-col>
      <v-snackbar
        v-model="snackbar"
        :color="snackbarcolor"
        :timeout="2000"
      >
        {{ snackbarmessage }}
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>
