// const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    createPayment: async (_, { createPaymentInput }, { dataSources }) =>
      dataSources.midTransApi.createPayment(createPaymentInput),
  },
};
