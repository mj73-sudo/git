<script setup lang="ts">
  import { LoginModel } from '../../models/auth/LoginModel.ts';
  import { ref } from 'vue';
  import { AuthStore } from '../../stores/auth.ts';
  import router from '../../router';

  const loginmodel = ref<LoginModel>(new LoginModel());
  const showpassword = ref<boolean>(false);
  const authStore = AuthStore()
  const isformValid=ref<boolean>(false);
  const form = ref()
  const snackbar=ref<boolean>(false)
  const snackbarcolor = ref<string>('')
  const snackbarmessage=ref<string>('');

  const nameRules =[
    (value: string) => {
      if (value) return true;
      return 'نام نمیتواند خالی باشد';
    },
  ];
  const passwordRules =[
    (value: string) => {
      if (value?.length > 8) return true;
      return 'طول رمز عبور حداقل باید هشت کاراکتر باشد ';
    },
  ];

  const doLogin= async ()=>{
    console.log(loginmodel.value);
    await authStore.loginUser(loginmodel.value);
    if(authStore.error ===''){
      await authStore.getUser();
      snackbarcolor.value ='success';
      snackbarmessage.value=' موفقیت انجام شد';
      snackbar.value=true;
      setTimeout(() => {
        router.push('/Dashboard');
      }, 2000);
    }
    else {
      snackbarcolor.value ='error';
      snackbarmessage.value='خطایی در ورد رخ داده است مجددا وارد شوید';
      snackbar.value=true;
    }
  }

</script>






<template class="fill-height bg-white">
  <v-container class="fill-height bg-white" fluid>
    <v-row align="center" class="fill-height " justify="center">
      <v-col class="d-flex justify-center align-center" cols="12" md="6">
        <v-card
          elevation="2"
          max-width="600"
        >
          <v-card-title class="d-flex justify-center  pt-5 pb-1">
            <strong>ورود به آرازکریپتو</strong>
          </v-card-title>

          <v-card-item class="d-flex ma-6  ">
            <v-sheet width="350">

              <v-form ref="form" v-model="isformValid" class="ma-2" @submit.prevent="doLogin">
                <v-text-field
                  v-model="loginmodel.username"
                  label="نام کاربری"
                  required
                  :rules="nameRules"
                />

                <v-text-field
                  v-model="loginmodel.password"
                  append-inner-icon="mdi-eye"
                  class="pt-2"
                  label="پسورد"
                  required
                  :rules="passwordRules"
                  :type="showpassword ? 'text' : 'password'"
                  @click:append-inner="showpassword =!showpassword"
                />
                <v-btn
                  block
                  class="d-flex bg-purple text-center mt-2 "
                  :disabled="!isformValid"
                  type="submit"
                >ورود</v-btn>
                <p class="d-flex justify-center pt-3 ">حساب کاربری ندارید
                  <router-link to="/register">ثبت‌نام</router-link>
                  کنید</p>
              </v-form>
            </v-sheet>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col class="d-none d-md-flex justify-center pa-0" cols="12" md="6">
        <div>
          <v-img
            :aspect-ratio="1"
            class="fullScreen"
            src="@/assets/login.png"
            width="500"
          />
        </div>
      </v-col>

    </v-row>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarcolor"
      :timeout="2000"
    >
      {{ snackbarmessage }}
    </v-snackbar>

  </v-container>

</template>

<style scoped lang="scss">
.fullScreen{
  height: 90vh;
}
@media (max-width: 960px) {
  .v-card {
    margin: 0 !important;
    border-radius: 0;
    box-shadow: none !important;
  }
}

</style>
