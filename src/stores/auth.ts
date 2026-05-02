import { defineStore } from 'pinia';
import type { RegisterModel } from '../models/auth/RegisterModel.ts';
import axios from 'axios';
import type { LoginModel } from '../models/auth/LoginModel.ts';
import { UserModel } from '../models/auth/UserModel.ts';
import { ChangePasswordModel } from '../models/ChangePasswordModel.ts';
import api from '../plugins/axios.ts'; // Importing the function
export const AuthStore=defineStore('auth',{
  state:()=>({
    me : new UserModel(),
    loading:false,
    error:'',
    accessToken:'',
    newUser: false,
  }),
  actions:{
    async registerUser (registermodel:RegisterModel){
      this.loading=true;
      this.error= '';
      try {
        const response=await api.post('/auth/register',registermodel,{
        });
        this.me=response.data;
      }
      catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'Registration failed';
        } else {
          this.error = 'خطا در ثبت نام';
        }
        console.error('Error during registration:', error);
      }
      finally {
        this.loading=false;
      }
    },
    async loginUser (loginmodel:LoginModel){
      this.loading=true;
      this.error= '';
      try {
        const response=await api.post('/auth/login',loginmodel,{
        });
        this.accessToken=response.data.accessToken;
        localStorage.setItem('accessToken',response.data.accessToken);
        this.newUser = response.data.newUser;
        console.log(this.newUser);
      }
      catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'Login failed';
        } else {
          this.error = 'خطا در ورود';
        }
        console.error('Error during Login:', error);
      }
      finally {
        this.loading=false;
      }
    },
    async getUser () {
      this.loading = true;
      this.error = '';

      try {
        const response = await api.get('/auth/me');
        this.me = response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر';
        } else {
          this.error = 'یک خطای غیرمنتظره رخ داد';
        }
        console.error('خطا در getUser:', error);
      } finally {
        this.loading = false;
      }
    },
    logout () {
      this.accessToken = '';
      this.me = new UserModel();
      localStorage.removeItem('accessToken');
    },

    async changePassWord (changepasswordmodel: ChangePasswordModel) {
      this.loading = true;
      this.error = '';
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.post('/auth/change-password', changepasswordmodel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.me = response.data;
      } catch (error: unknown) {
        this.error = 'خطایی در تغییر رمز عبور رخ داد';
        console.error('Error during fetching strategies:', error);
      } finally {
        this.loading = false;
      }
    },
    async editeProfile (usermodel: UserModel) {
      this.loading = true;
      this.error = '';
      const token = localStorage.getItem('accessToken');

      try {
        const response = await axios.put('/auth/edit-profile', usermodel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.me = response.data;
      } catch (error: unknown) {
        this.error = 'خطایی در دریافت استراتژی‌ها رخ داد';
        console.error('Error during fetching strategies:', error);
      } finally {
        this.loading = false;
      }
    },

  },
});
