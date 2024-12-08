export default () => ({
  base_url: process.env.BASE_URL,

  payment_provider: {
    api_key: process.env.PAYMENT_PROVIDER_API_KEY,
    api_url: process.env.PAYMENT_PROVIDER_API_URL,
    brand_id: process.env.PAYMENT_PROVIDER_BRAND_ID,
    success_callback: `${process.env.BASE_URL}${process.env.PAYMENT_PROVIDER_SUCCESS_CALLBACK}`,
    token: process.env.PAYMENT_PROVIDER_TOKEN,
  },

  redirect: {
    cancel_redirect: `${process.env.BASE_URL}${process.env.SUCCESS_REDIRECT}`,
    failure_redirect: `${process.env.BASE_URL}${process.env.FAILURE_REDIRECT}`,
    success_redirect: `${process.env.BASE_URL}${process.env.CANCEL_REDIRECT}`,
  },
});
