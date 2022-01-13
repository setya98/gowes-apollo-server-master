const { RESTDataSource } = require("apollo-datasource-rest");

class RajaOngkirApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.rajaongkir.com/starter/";
  }

  willSendRequest(request) {
    request.headers.set("key", "86dd1faeefba5bc5120efed036bd5aae");
  }

  async getCities() {
    const data = await this.get(`city`);
    return data.rajaongkir.results;
  }

  async getCosts(costInput) {
    const data = await this.post(`cost`, {
      origin: costInput.origin,
      destination: costInput.destination,
      weight: costInput.weight,
      courier: costInput.courier,
    });
    return data.rajaongkir.results;
  }
}

module.exports = {
  RajaOngkirApi,
};
