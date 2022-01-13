const { AuthenticationError, UserInputError } = require("apollo-server");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getUserOrders(_, __, context) {
      try {
        const user = checkAuth(context);
        const orders = await Order.find({ user: user.id })
          .populate("user")
          .populate("items");
        if (orders) {
          return orders;
        } else {
          throw new Error("User orders not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserOrderById(_, { oderId }, context) {
      try {
        checkAuth(context);
        const order = await Order.findById(oderId)
          .populate("user")
          .populate("items");
        if (order) {
          return order;
        } else {
          throw new Error("User order not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSellerOrders(_, { username }, context) {
      try {
        // checkAuth(context);
        const order = await Order.find({
          seller: {
            username: username
          }
        })
          .populate("user")
          .populate("items");

        if (order) {
          return order;
        } else {
          throw new Error("User order not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async addOrder(
      _,
      { addOrderInput: { items, shipping, sellerUsername }, cartItemIds },
      context
    ) {
      const user = checkAuth(context);
      const deadlineTime = new Date();
      deadlineTime.setHours(deadlineTime.getHours() + 24);
      const newOrder = new Order({
        items: items,
        user: user.id,
        shipping: shipping,
        seller: {
          username: sellerUsername,
        },
        state: {
          stateType: "CONFIRMATION",
          createdAt: new Date().toISOString(),
          deadline: deadlineTime.toISOString(),
        },
      });

      await Cart.deleteMany({ _id: { $in: cartItemIds } });
      const order = await newOrder.save();
      return order;
    },

    async addAwbNumber(
      _,
      {
        orderId,
        awbNumber,
        courierName,
        buyerAddress,
        shippingCost
      },
    ) {
      if (awbNumber.trim() !== '') {
        const updatedOrders = await Order.findOneAndUpdate(
          { _id: orderId },
          {
            shipping: {
              awbNumber: awbNumber,
              courierName: courierName,
              buyerAddress: buyerAddress,
              shippingCost: shippingCost
            }
          },
          { new: true }
        )
        const awbNumberAdded = await updatedOrders.save();
        return awbNumberAdded
      } else {
        throw new UserInputError("AWB number must not be empty", {
          errors: {
            awbNumber: "AWB number must not be empty",
          },
        });
      }
    },

    async updateOrder(
      _,
      { oderId, updateOrderInput: { state } },
      context
    ) {
      checkAuth(context);
      try {
        const order = await Order.findOne({ _id: oderId }).sort({
          createdAt: -1,
        });
        console.log(order.state.stateType == state.stateType);
        const deadlineTime = new Date();

        switch (state.stateType) {
          case "PROCESSED":
            //check if currentState is equals previousState
            if (order.state.stateType == "CONFIRMATION") {
              deadlineTime.setHours(deadlineTime.getHours() + 24);
              order.logs = [
                ...order.logs,
                {
                  stateType: "CONFIRMATION",
                  succsededAt: new Date().toISOString(),
                  executedAt: order.state.createdAt,
                },
              ];
              order.state = {
                stateType: "PROCESSED",
                createdAt: new Date().toISOString(),
                deadline: deadlineTime.toISOString(),
              };
            }
            break;
          case "DELIVERY":
            deadlineTime.setHours(deadlineTime.getHours() + 96);
            //check if currentState is equals previousState
            if (order.state.stateType == "PROCESSED") {
              order.logs = [
                ...order.logs,
                {
                  stateType: "PROCESSED",
                  succsededAt: new Date().toISOString(),
                  executedAt: order.state.createdAt,
                },
              ];
              order.state = {
                stateType: "DELIVERY",
                createdAt: new Date().toISOString(),
                deadline: deadlineTime.toISOString(),
              };
            }
            break;
          case "ARRIVED":
            deadlineTime.setHours(deadlineTime.getHours() + 48);
            //check if currentState is equals previousState
            if (order.state.stateType == "DELIVERY") {
              order.logs = [
                ...order.logs,
                {
                  stateType: "DELIVERY",
                  succsededAt: new Date().toISOString(),
                  executedAt: order.state.createdAt,
                },
              ];
              order.state = {
                stateType: "ARRIVED",
                createdAt: new Date().toISOString(),
                deadline: deadlineTime.toISOString(),
              };
            }
            break;
          case "COMPLETED":
            //check if currentState is equals previousState
            if (order.state.stateType == "ARRIVED") {
              order.logs = [
                ...order.logs,
                {
                  stateType: "ARRIVED",
                  succsededAt: new Date().toISOString(),
                  executedAt: order.state.createdAt,
                },
              ];
              order.logs = [
                ...order.logs,
                {
                  stateType: "COMPLETED",
                  succsededAt: new Date().toISOString(),
                  executedAt: order.state.createdAt,
                },
              ];
              order.state = {
                stateType: "COMPLETED",
                createdAt: new Date().toISOString(),
                deadline: new Date().toISOString(),
              };
            }
            break;
          case "FAILED":
            order.logs = [
              ...order.logs,
              {
                stateType: order.state.stateType,
                succsededAt: new Date().toISOString(),
                executedAt: order.state.createdAt,
              },
            ];
            order.logs = [
              ...order.logs,
              {
                stateType: "FAILED",
                succsededAt: new Date().toISOString(),
                executedAt: new Date().toISOString(),
              },
            ];
            order.state = {
              stateType: "FAILED",
              createdAt: new Date().toISOString(),
              deadline: new Date().toISOString(),
            };
            break;
        }
        const updatedOrder = await order.save();
        return updatedOrder;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
