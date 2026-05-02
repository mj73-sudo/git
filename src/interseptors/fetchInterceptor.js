import { useAlertStore } from '@/stores/alert';

const originalFetch = window.fetch;

async function secureFetch (resource, config = {}) {
  console.log('🚀 Fetch request intercepted:', resource, config);

  const token = localStorage.getItem('accessToken');

  if (!config.method) {
    config.method = 'GET'; // ✅ Ensure method is set if not provided
  }

  if (token) {
    config = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  } else if (!token) {
    console.log('❌ No token, redirecting...');
    window.location.href = '/login';
    return;
  }

  console.log('✅ Fetch modified config:', config);

  const response = await originalFetch(resource, config);
  const alertStore = useAlertStore();
  if (!response.ok) {
    alertStore.showAlert('❌ مشکلی رخ داده است', 'error');
  }
  if (response.status === 401) {
    alertStore.showAlert('مجددا وارد شوید.', 'error');
    window.location.href = '/login';
  }

  return response;
}

export default secureFetch;
