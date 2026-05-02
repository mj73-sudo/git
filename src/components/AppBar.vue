<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { AuthStore } from '../stores/auth'
  import router from '../router';
  import { ChangePasswordModel } from '../models/ChangePasswordModel.ts';
  import { TelegramLinkModel } from '../models/TelegramLinkModel.ts';
  import { useTheme } from 'vuetify'
  import { TelegramLink } from '../stores/TelegramLink.ts';
  import { NotificationStore } from '../stores/NotificationStore.ts';
  import dayjs from 'dayjs';
  import { UserModel } from '../models/auth/UserModel.ts';
  import { NotificationModel } from '../models/NotificationModel.ts';
  import type { FieldDefinition } from '../models/FieldDefinition.Model.ts';
  import jalaliday from 'jalaliday'
  dayjs.extend(jalaliday)


  const profileDrawer = ref(false) // جایگزین profileDialog
  const notificationStore = NotificationStore();
  const telegramLinkModel = ref<TelegramLinkModel>(new TelegramLinkModel());
  const changnePassword = ref<ChangePasswordModel>(new ChangePasswordModel())
  const drawer = ref(false)
  const authStore = AuthStore();


  const profileMenuOpen = ref(false)
  const showChangePassword =ref(false)

  const cancelPass=async ()=>{
    showChangePassword.value=false;
    snackbar.value=false;
  }
  const ChangePass = async () => {
    await authStore.changePassWord(changnePassword.value);
    if (authStore.error==='') {
      snackbarcolor.value = 'success';
      snackbarmassege.value = 'موفقیت';
      snackbar.value = true;
      router.push('/login');
      changnePassword.value = new ChangePasswordModel();
    }
    else {
      snackbarcolor.value = 'error';
      snackbarmassege.value = 'پسورد اشتباه است';
      snackbar.value = true;
      showChangePassword.value=true
    }
  }
  const passwordRules =[
    (value: string) => {
      if (value?.length > 8) return true;
      return 'طول رمز عبور حداقل باید هشت کاراکتر باشد ';
    },
  ];


  const closeChangePassword = () => {
    showChangePassword.value = true;
    changnePassword.value = new ChangePasswordModel();
  }

  const snackbar = ref<boolean>(false);
  const snackbarcolor = ref('');
  const snackbarmassege = ref('');


  if (!authStore.me.username) {
    authStore.getUser()
  }

  //edite profile
  const showEditProfile= ref(false);
  const usermodel = ref<UserModel>(new UserModel())


  const EditProfile = async () => {
    await authStore.editeProfile(usermodel.value);
    if (authStore.error==='') {
      snackbarcolor.value = 'success';
      snackbarmassege.value = 'موفقیت';
      snackbar.value = true;
    }
    else {
      snackbarcolor.value = 'error';
      snackbarmassege.value = 'خطا';
      snackbar.value = true;
    }
    showEditProfile.value = false;
  }


  // کنترل باز و بسته شدن مودال
  const showNotifDialog = ref(false)


  //change Theme--------------------------------------------------------


  const theme = useTheme()

  function toggleTheme () {
    theme.global.name.value = theme.global.name.value === 'darkTheme' ? 'myCustomTheme' : 'darkTheme'
  }


  // use Main Form------------------------------------------------------------
  const isPasswordMismatch = computed(() => {
    return !!changnePassword.value.repeatPassword && changnePassword.value.repeatPassword !== changnePassword.value.newPassword;
  });


  const fields: FieldDefinition<ChangePasswordModel>[] = [
    { type: 'password', name: 'oldPassword', title: 'پسورد قبلی' ,md:12 },
    { type: 'password', name: 'newPassword', title: ' پسورد جدید' ,md:12 ,
      rules: [
        (value: unknown) => {
          const val = value as string; // تبدیل ایمن به رشته
          if (val?.length >= 8) return true;
          return 'طول رمز عبور حداقل باید هشت کاراکتر باشد';
        },
      ] },
    { type: 'password', name: 'repeatPassword', title: 'تکرار پسورد جدید' ,md:12,
      error:() => isPasswordMismatch.value,
      errorMessage: 'پسورد مطابقت ندارد',
    },
  ];

  const telegramLink = TelegramLink();
  // OTP--------------------------------------------------------------------
  const openOtp = ref(false);
  const showOtp = async ()=>{
    openOtp.value=true;
    await telegramLink.getLink();
    telegramLinkModel.value.linkCode=telegramLink.Link.linkCode;
  }
  const closeopt=()=>{
    openOtp.value=false;
  }
  const copyToClipboard = async () => {
    if (telegramLinkModel.value) {
      await navigator.clipboard.writeText(String(telegramLinkModel.value));
      alert(telegramLinkModel.value);
    }
  }
  const openTelegramBot = () => {
    telegramLinkModel.value=telegramLink.Link;
    const url = `https://t.me/ArazBot?start=${encodeURIComponent(telegramLinkModel.value.linkCode || '')}`;
    window.open(url, '_blank');
  }
  const receiveAgain=async ()=>{
    await telegramLink.getLink();
    telegramLinkModel.value=telegramLink.Link;
  }

  const exite = ()=>{
    authStore.logout();
    profileDrawer.value=false
    router.push('/Login');
  }

  //format jalali------------------------------------------------------------------


  function formatNotificationMessage (msg: string) {
    return msg.replace(/Time: (.+)/, (_, time) => {
      // حذف [Asia/Tehran] اگر موجود باشد
      const cleanTime = time.replace(/\[.*\]$/, '')
      // فرمت شمسی و فارسی
      const formattedTime = dayjs(cleanTime)
        .calendar('jalali')
        .locale('fa')
        .format('YYYY/MM/DD HH:mm:ss')
      return `Time: ${formattedTime}`
    })
  }
  //notif--------------------------------
  const token = localStorage.getItem('accessToken') || '';
  onMounted(() => {
    notificationStore.getNotifications();
    if (token) notificationStore.connectWebSocket();
  });
  const showNotif = () => {
    showNotifDialog.value = true;

    // وقتی دیالوگ باز شد، همه اعلان‌های موجود را خوانده شده کن
    notificationStore.notifications.forEach(n => {
      n.read = true;
    });
  };

  const closeShowNotif = ()=>{
    notificationStore.notifications=[];
    showNotifDialog.value=false;
  }

  // محاسبه تعداد اعلان‌های خوانده نشده
  const unreadCount = computed(() => {
    return notificationStore.notifications.filter(n => !n.read).length;
  });

  onBeforeUnmount(() => {
    notificationStore.disconnectWebSocket();
  });

// وقتی کاربر دیالوگ رو باز کرد


</script>

<template>
  <v-app-bar
    app
    color="#0E0E0E"
    dark
    fixed
    height="79"
    :style="{ color: '#ffffff' }"
  >
    <!-- دکمه منو فقط در موبایل -->
    <v-app-bar-nav-icon
      class="d-md-none"
      @click="drawer = !drawer"
    />

    <!-- لوگو -->
    <v-img
      class="mx-1"
      max-height="150"
      max-width="150"
      src="../assets/k.jpg"
    />

    <!-- عنوان -->
    <v-app-bar-title class="d-flex justify-start" :style="{ color: '#FF4F29' }" />

    <!-- دکمه‌ها در دسکتاپ -->

    <div class="nav-container d-md-flex d-none">
      <v-btn class="nav-text" prepend-icon="mdi-chart-line" router :to="{ path: '/dashboard' }">
        داشبورد
      </v-btn>


      <v-btn class="nav-text" prepend-icon="mdi-currency-usd" router :to="{ path: '/listsymbol' }">
        نمادها
      </v-btn>
      <v-btn class="nav-text" prepend-icon="mdi-bullseye" router :to="{ path: '/showmarket' }">
        بازار
      </v-btn>

      <v-btn class="nav-text" prepend-icon="mdi-lightbulb-on-outline" router :to="{ path: '/creat-strategy' }">
        ایجاد استراتژی
      </v-btn>

      <v-btn class="nav-text" prepend-icon="mdi-finance" router :to="{ path: '/strategies' }">
        استراتژی من
      </v-btn>

      <v-btn class="nav-text" prepend-icon="mdi-history" router :to="{ path: '/responseback' }">
        محیط بک تست
      </v-btn>

      <v-btn class="nav-text" prepend-icon="mdi-chart-line" router :to="{ path: '/listsignal' }">
        سیگنال ها
      </v-btn>
    </div>

    <v-spacer />


    <v-btn class="text-none" stacked @click="showNotif">
      <v-badge
        class="nav-icon"
        color="error"
        :content="notificationStore.notifications.filter((i:NotificationModel)=>!i.read).length"
        offset-x="28"
        offset-y="1"
      >
        <v-icon>mdi-bell-outline</v-icon>
      </v-badge>
    </v-btn>

    <!-- مودال نوتیفیکیشن‌ها --><v-dialog v-model="showNotifDialog" max-width="500" persistent>
      <v-card class="notif-dialog-card">
        <v-card-title class="notif-dialog-title">
          نوتیفیکیشن‌ها
        </v-card-title>

        <v-card-text>
          <v-divider class="mb-3" />

          <div
            v-for="(notif, index) in notificationStore.notifications"
            :key="index"
            class="notif-item"
          >
            <div
              class="notif-message"
              v-html="formatNotificationMessage(notif.message || '').replace(/\n/g, '<br>')"
            />
            <v-divider />
          </div>

          <div v-if="notificationStore.notifications.length === 0" class="text-center text-grey">
            نوتیفیکیشنی وجود ندارد.
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="closeShowNotif">بستن</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-btn
      v-if="authStore.me.username"
      class="nav-icon"
      prepend-icon="mdi-account"
      stacked
      style="font-family: 'Shabnam', sans-serif"
      @click="profileDrawer = true"
    />

    <v-btn
      v-else
      class="mx-2"
      prepend-icon="mdi-login"
      style="font-family: 'Shabnam', sans-serif"
      text
      to="/login"
    >
      ورود
    </v-btn>


  </v-app-bar>
  <!-- Drawer پروفایل (از چپ) -->
  <v-navigation-drawer
    v-if="authStore.me"
    v-model="profileDrawer"

    class="d-none d-md-flex"
    location="left"
    temporary
  >
    <v-card v-if="authStore.me.username" flat>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h6 font-weight-medium" style="font-family: 'Shabnam', sans-serif">
          {{ authStore.me.username || 'کاربر' }}
        </div>
        <v-btn icon @click="profileDrawer = false">
          <v-icon size="24">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Email and Plan -->
      <v-divider />
      <v-card-subtitle class="px-4 pb-7 mt-2">
        <div class="d-flex flex-column gap-1">
          <!-- Email -->
          <span class="text-body-5text-gray-800" style="font-family: 'Shabnam', sans-serif;">
            {{ authStore.me.email }}
          </span>

          <!-- Plan -->
          <v-chip
            class="mt-1"
            color="purple lighten-4"
            small
            style="font-family: 'Shabnam', sans-serif;"
            text-color="purple darken-2"
          >
            {{ authStore.me.planTitle || 'پلن ندارد' }}
          </v-chip>

        </div>
      </v-card-subtitle>
      <v-divider />
      <v-list>
        <v-list-item>
          <v-list-item-title class="d-flex align-center text-body-2">
            <v-icon class="me-1" color="grey-darken-2" size="18">mdi-credit-card-outline</v-icon>
            <span
              style="font-family: 'Shabnam', sans-serif"
            >
              خرید اشتراک
            </span>

          </v-list-item-title>


        </v-list-item>


        <v-list-item>
          <v-list-item-title class="d-flex align-center text-body-2" @click="showOtp">
            <v-icon class="me-1" color="grey-darken-2" size="18">mdi-credit-card-outline</v-icon>
            <span
              style="font-family: 'Shabnam', sans-serif"
            >
              OTP
            </span>
          </v-list-item-title>
        </v-list-item>
        <v-dialog v-model="openOtp" max-width="500" persistent>
          <v-card class="py-8 px-6 text-center mx-auto ma-4" elevation="12">
            <!-- عنوان -->
            <v-card-title class="d-flex justify-space-between align-start text-h6 font-weight-bold pa-0">
              <div class="text-h6 font-weight-bold ps-2" style="font-family: 'Shabnam', sans-serif">
                دریافت کد اختصاصی بات تلگرام
              </div>

              <v-btn
                class="bg-surface-variant hover:bg-surface brightness-hover"
                color="error"
                icon="mdi-close"
                size="27"
                variant="flat"
                @click="closeopt"
              />
            </v-card-title>

            <!-- محتوای اصلی -->
            <v-card-text class="pt-8 px-5 pb-4">
              <div class="text-body-2 pa-0" style="line-height: 1.6; color: #374151;">
                <span>
                  این کد تنها برای شما ایجاد شده و شخصی است.
                  لطفاً آن را با دیگران به اشتراک نگذارید.
                  برای استفاده، کد را کپی کرده و در بات وارد کنید.
                </span>
              </div>

              <v-sheet color="surface" style="direction: ltr">
                <v-otp-input
                  v-model="telegramLinkModel.linkCode"
                  disabled
                  length="8"
                  variant="solo"
                >

                  <v-btn
                    color="primary"
                    icon="mdi-content-copy"
                    variant="text"
                    @click="copyToClipboard"
                  />
                </v-otp-input>
              </v-sheet>

              <v-btn
                class="my-4"
                color="purple"
                height="40"
                variant="flat"
                width="70%"
                @click="openTelegramBot"
              >
                ورود به بات
              </v-btn>

              <div class="text-caption">
                <p class="mb-2" style="color: #6B7280;">
                  اگر کد شما منقضی شد یا نیاز به کد جدید داشتید،
                  <a href="#" @click.prevent="receiveAgain">دریافت مجدد</a> را انتخاب کنید.
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>


        <v-list-item>
          <v-list-item-title class="d-flex align-center text-body-2">
            <v-icon class="me-1" color="grey-darken-2" size="18">mdi-cog-outline</v-icon>
            <span
              style="font-family: 'Shabnam', sans-serif"
            >
              تنظیمات
            </span>
          </v-list-item-title>
        </v-list-item>


        <v-list-item @click="toggleTheme">
          <v-list-item-title class="d-flex align-center text-body-2">
            <v-icon
              v-if="theme.global.name.value === 'darkTheme'"
              class="me-1"
              color="grey-darken-2"
              size="18"
            >mdi-white-balance-sunny</v-icon>
            <v-icon v-else>mdi-moon-waxing-crescent</v-icon>
            <span
              v-if="theme.global.name.value === 'darkTheme'"
              style="font-family: 'Shabnam', sans-serif"
            >
              حالت روز
            </span>
            <span v-else style="font-family: 'Shabnam', sans-serif">حالت شب</span>
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="closeChangePassword">
          <v-list-item-title>
            <v-icon class="me-1" color="grey-darken-2" size="18">mdi-lock-reset</v-icon>
            تغییر رمز عبور
          </v-list-item-title>
        </v-list-item>

        <BaseDialog

          v-model="showChangePassword"
          cancel-color="#9CA3AF"
          cancel-text="بستن"
          action-size="xl"
          confirm-color="#FF8C00"
          confirm-text="ثبت"
          icontext="mdi-update"
          title="تغییر رمز عبور"
          width="30%"
          @cancel="cancelPass"
          @confirm="ChangePass"
        >
          <v-form>
            <MainsForm v-model="changnePassword" :fields="fields" />
          </v-form>
          <v-snackbar
            v-model="snackbar"
            :color="snackbarcolor"
          >
            {{ snackbarmassege }}

          </v-snackbar>
        </BaseDialog>
        <!--
        <v-dialog v-model="showChangePassword" max-width="420" persistent>
          <v-card
            class="py-8 px-6 text-center mx-auto ma-4"
            elevation="12"
          >
            &lt;!&ndash; عنوان &ndash;&gt;
            <v-card-title class="text-h6 font-weight-bold py-4 px-5" style="font-family: 'Shabnam', sans-serif">
              تغییر رمز عبور
            </v-card-title>

            &lt;!&ndash; محتوای اصلی &ndash;&gt;
            <v-card-text class="pt-0 px-5 pb-4">
              <MainsForm v-model="changnePassword" :fields="fields" />
              &lt;!&ndash;
               فیلد: رمز قبلی
                            <v-text-field
                v-model="changnePassword.oldPassword"
                :append-inner-icon="showOld ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-4"
                density="comfortable"
                label="رمز قبلی"
                prepend-inner-icon="mdi-lock"
                :type="showOld ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showOld = !showOld"
              />

              &lt;!&ndash; فیلد: رمز جدید &ndash;&gt;
              <v-text-field
                v-model="changnePassword.newPassword"
                :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-4"
                density="comfortable"
                label="رمز جدید"
                prepend-inner-icon="mdi-lock-check"
                :rules="passwordRules"
                :type="showNew ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showNew = !showNew"
              />

              &lt;!&ndash; فیلد: تکرار رمز جدید &ndash;&gt;
              <v-text-field
                v-model="changnePassword.repeatPassword"
                :append-inner-icon="showRepeat ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-4"
                density="comfortable"
                :error="isPasswordMismatch"
                :error-messages="isPasswordMismatch ? 'پسورد مطابقت ندارد' : ''"
                label="تکرار رمز جدید"
                prepend-inner-icon="mdi-lock-reset"
                :type="showRepeat ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showRepeat = !showRepeat"
              />
&ndash;&gt;


              <v-row class="mt-2" dense>
                <v-col class="pr-1" cols="6">
                  <v-btn
                    block
                    class="my-4"
                    color="primary"
                    height="44"
                    rounded="0"
                    variant="flat"
                    @click="ChangePass"
                  >
                    ثبت
                  </v-btn>
                </v-col>

                <v-col class="pl-1" cols="6">
                  <v-btn
                    block
                    class="my-4"
                    color="grey"
                    height="44"
                    variant="flat"
                    @click="showChangePassword = false"
                  >
                    بستن
                  </v-btn>
                </v-col>
              </v-row>
              <v-snackbar
                v-model="snackbar"
                :color="snackbarcolor"
              >
                {{ snackbarmassege }}

              </v-snackbar>
            </v-card-text>
          </v-card>
        </v-dialog>
-->


        <v-list-item @click="showEditProfile=true">
          <v-list-item-title>
            <v-icon class="me-1" color="grey-darken-2" size="18">mdi-logout	</v-icon>
            ویرایش پروفایل
          </v-list-item-title>
        </v-list-item>
        <v-dialog v-model="showEditProfile" max-width="420" persistent>
          <v-card
            class="py-8 px-6 text-center ma-4"
            elevation="12"
          >

            <v-card-title class="text-h6 font-weight-bold py-4 px-5" style="font-family: 'Shabnam', sans-serif">
              ویرایش پروفایل
            </v-card-title>

            <v-card-text class="pt-0 px-5 pb-4">
              <v-text-field
                v-model="usermodel.username"
                class="mb-4"
                density="comfortable"
                label="نام کاربری"
                prepend-inner-icon="mdi-account"
                variant="outlined"
              />

              <v-text-field
                v-model="usermodel.email"
                class="mb-4"
                density="comfortable"
                label="ایمیل"
                prepend-inner-icon="mdi-email"
                variant="outlined"
              />

              <v-text-field
                v-model="usermodel.mobileNumber"
                class="mb-4"
                density="comfortable"
                label="شماره موبایل"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
              />


              <!-- دکمه‌ها -->
              <v-row class="mt-2" dense>
                <v-col class="pr-1" cols="6">
                  <v-btn
                    block
                    class="rounded-lg text-white"
                    color="primary"
                    height="44"
                    variant="flat"
                    @click="EditProfile"
                  >
                    ثبت
                  </v-btn>
                </v-col>

                <v-col class="pl-1" cols="6">
                  <v-btn
                    block
                    color="grey"
                    height="44"
                    variant="flat"
                    @click="showEditProfile = false"
                  >
                    بستن
                  </v-btn>
                </v-col>
              </v-row>
              <v-snackbar
                v-model="snackbar"
                :color="snackbarcolor"
              >
                {{ snackbarmassege }}

              </v-snackbar>
            </v-card-text>
          </v-card>
        </v-dialog>


        <v-list-item @click="exite">
          <v-list-item-title class="text-red">
            <v-icon class="me-1" color="grey-darken-2" size="18">mdi-logout	</v-icon>
            خروج
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-navigation-drawer>


  <!-- Drawer موبایل -->
  <v-navigation-drawer
    v-model="drawer"
    class="d-md-none"
    right
    temporary
  >
    <v-list dense nav>

      <!-- لینک‌های اصلی -->
      <v-list-item prepend-icon="mdi-chart-line" title="نمادها" to="/listsymbol" />
      <v-list-item prepend-icon="mdi-bookmark-multiple" title="ایجاد استراتژی" to="/creat-strategy" />
      <v-list-item prepend-icon="mdi-lightbulb-on-outline" title="استراتژی من" to="/strategies" />
      <v-list-item prepend-icon="mdi-lightbulb-on-outline" title="محیط بک تست" to="/responseback" />
      <v-list-item prepend-icon="mdi-lightbulb-on-outline" title="مارکت" to="/showmarket" />
      <v-list-item prepend-icon="mdi-lightbulb-on-outline" title="سیگنال ها" to="/listsignal" />
      <v-list-item prepend-icon="mdi-lightbulb-on-outline" title="سیگنال ها" to="/listsignal" />


      <!-- زیرمنوی پروفایل -->
      <v-list-group v-if="authStore.me.username" v-model="profileMenuOpen" no-action prepend-icon="mdi-account">
        <template #activator="{ props }">
          <v-list-item v-bind="props">
            <v-list-item-title>پروفایل {{ authStore.me.username }}</v-list-item-title>
          </v-list-item>
        </template>

        <!-- ایمیل کاربر -->
        <v-list-item>
          <v-list-item-subtitle>{{ authStore.me.email }}</v-list-item-subtitle>
        </v-list-item>

        <!-- خرید اشتراک -->
        <v-list-item>
          <v-list-item-title>
            <v-icon class="me-2" size="18">mdi-credit-card-outline</v-icon>
            خرید اشتراک
          </v-list-item-title>
        </v-list-item>

        <!-- OTP -->
        <v-list-item @click="showOtp">
          <v-list-item-title>
            <v-icon class="me-2" size="18">mdi-credit-card-outline</v-icon>
            OTP
          </v-list-item-title>
        </v-list-item>

        <!-- تغییر رمز عبور -->
        <v-list-item @click="closeChangePassword">
          <v-list-item-title>
            <v-icon class="me-2" size="18">mdi-lock-reset</v-icon>
            تغییر رمز عبور
          </v-list-item-title>
        </v-list-item>

        <!-- ویرایش پروفایل -->
        <v-list-item @click="showEditProfile = true">
          <v-list-item-title>
            <v-icon class="me-2" size="18">mdi-account-edit</v-icon>
            ویرایش پروفایل
          </v-list-item-title>
        </v-list-item>

        <!-- تغییر تم -->
        <v-list-item @click="toggleTheme">
          <v-list-item-title>
            <v-icon class="me-2" size="18">
              {{ theme.global.name.value === 'darkTheme' ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent' }}
            </v-icon>
            {{ theme.global.name.value === 'darkTheme' ? 'حالت روز' : 'حالت شب' }}
          </v-list-item-title>
        </v-list-item>

        <!-- خروج -->
        <v-list-item @click="exite">
          <v-list-item-title class="text-red d-flex align-center">
            <v-icon class="me-2" size="18">mdi-logout</v-icon>
            خروج
          </v-list-item-title>
        </v-list-item>
      </v-list-group>

      <!-- اگر کاربر لاگین نیست -->
      <v-list-item v-else prepend-icon="mdi-login" title="ورود" to="/login" />

    </v-list>
  </v-navigation-drawer>

</template>

<style scoped lang="scss">
.nav-icon-hover:hover {
  background-color: #FF8C00;
}

/* Selected state */
.nav-container {
  display: flex;
  gap: 25px;
  justify-content: center/* space between icons */
}
.nav-icon {
  background-color: transparent;  /* default */
  color: #ffffff;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}


/* Hover state */
.nav-icon:hover {

  background-color: transparent;

  outline: none;
}

/* Active / selected state */
.nav-icon:active,
.nav-icon:focus {
  color: #FF8C00;
}
.nav-text {
  background-color: transparent;  /* default */
  color: #ffffff;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.nav-text-hover:hover {
  background-color: #FF8C00;
}
.nav-text:hover {

  background-color: transparent;
  color: #FF8C00;
  outline: none;
}
.v-btn.v-btn--active {
  color: #ff6700 !important;
  background-color: transparent !important;
}

/* Active icon inside the button */
.v-btn.v-btn--active .v-icon {
  color: #FF8C00 !important;
}
.notif-dialog-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  padding: 16px;
}

.notif-dialog-title {
  font-size: 25px;
  font-weight: 600;
  color: #FF8C00;
  text-align: center;
  margin-bottom: 8px;
}

.notif-item {
  padding: 12px 8px;
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 8px;
}

.notif-message {
  font-size: 14px;
  line-height: 1.5;
  color: #333333;
}

.v-divider {
  margin: 8px 0;
}
</style>
