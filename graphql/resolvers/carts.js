const { AuthenticationError, UserInputError } = require("apollo-server");
const { update } = require("../../models/Cart");

const Cart = require("../../models/Cart");
const checkAuth = require("../../util/check-auth");
const { validateAddCartItemInput } = require("../../util/validators");

module.exports = {
  Query: {
    async getUserCartItems(_, __, context) {
      try {
        const user = checkAuth(context);
        const cart = await Cart.find({ user: user.id })
          .populate("user")
          .populate({
            path: "item",
            populate: {
              path: "user",
              options: { sort: { "seller.username": -1 } },
            },
          });
        if (cart) {
          return cart;
        } else {
          throw new Error("User cart items not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserCartItemsCheckout(_, __, context) {
      try {
        const user = checkAuth(context);
        const cart = await Cart.find({ user: user.id, isChecked: true })
          .populate("user")
          .populate({
            path: "item",
            populate: {
              path: "user",
              options: { sort: { "seller.username": -1 } },
            },
          });
        if (cart) {
          return cart;
        } else {
          throw new Error("User cart items checkout not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserCartItem(_, { itemId }, context) {
      try {
        const user = checkAuth(context);
        const cart = await Cart.findOne({ item: itemId, user: user.id })
          .populate("user")
          .populate({
            path: "item",
            populate: {
              path: "user",
              options: { sort: { "seller.username": -1 } },
            },
          });
        if (cart) {
          return cart;
        } else {
          throw new Error("User cart item not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async addCartItem(_, { itemId, note, isChecked, amountItem }, context) {
      const user = checkAuth(context);
      const { valid, errors } = validateAddCartItemInput(amountItem);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const isCartItemExists = await Cart.findOne({
        item: itemId,
        user: user.id,
      });

      if (isCartItemExists) {
        isCartItemExists.amountItem += amountItem;
        isCartItemExists.note = note;
        isCartItemExists.isChecked = isChecked;
        const updatedCartItem = await isCartItemExists.save();
        return updatedCartItem;
      } else {
        const newCartItem = new Cart({
          item: itemId,
          user: user.id,
          note: note,
          isChecked: false,
          amountItem: amountItem,
          createdAt: new Date().toISOString(),
        });

        const cartItem = await newCartItem.save();
        return cartItem;
      }
    },
    async editCartItem(_, { itemId, note, isChecked, amountItem }, context) {
      const user = checkAuth(context);
      const { valid, errors } = validateAddCartItemInput(amountItem);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const isCartItemExists = await Cart.findOne({
        item: itemId,
        user: user.id,
      });

      if (isCartItemExists) {
        isCartItemExists.amountItem = amountItem;
        isCartItemExists.note = note;
        isCartItemExists.isChecked = isChecked;
        const updatedCartItem = await isCartItemExists.save();
        return updatedCartItem;
      } else {
        const newCartItem = new Cart({
          item: itemId,
          user: user.id,
          note: note,
          isChecked: false,
          amountItem: amountItem,
          createdAt: new Date().toISOString(),
        });

        const cartItem = await newCartItem.save();
        return cartItem;
      }
    },

    async deleteCartItem(_, { cartId }, context) {
      try {
        const user = checkAuth(context);
        console.log(`itemId: ${cartId}, user: ${user.id}`);
        const cartItem = await Cart.findById(cartId);
        if (cartItem) {
          await cartItem.delete();
          return "Cart item deleted";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async updateCheckCart(
      _,
      { checkedCart: { itemIds, isChecked, amountItem } }
    ) {
      const updatedCart = await Cart.updateMany(
        { item: { $in: itemIds } },
        {
          isChecked: isChecked,
        },
        { new: true }
      );
      return "Cart items updated";
    },
  },
};
