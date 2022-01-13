const { AuthenticationError, UserInputError } = require("apollo-server");
const { argsToArgsConfig } = require("graphql/type/definition");

const Item = require("../../models/Item");
const checkAuth = require("../../util/check-auth");
const { validateAddItemInput } = require("../../util/validators");

module.exports = {
  Query: {
    async getItem(_, { itemId }) {
      try {
        const item = await Item.findById(itemId).populate("user");
        if (item) {
          return item;
        } else {
          throw new Error("Item not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getItems() {
      try {
        const items = await Item.find()
          .sort({ createdAt: -1 })
          .populate("user");
        return items;
      } catch (err) {
        throw new Error(err);
      }
    },
    async searchItems(_, {searchItemInput: { keyword, category, condition, city, minPrice, maxPrice }}) {
      try {
        const filterQuery = {
          category: category,
          condition: condition,
          "user_docs.address.cityName": city,
          $and: [
            {price: {$gte: minPrice}},
            {price: {$lte: maxPrice}},
            ]
        };
        console.log('before delete: ',filterQuery.$and)
        if (!category || category == "") {
          delete filterQuery.category;
        }
        if (!condition || condition == "") {
          delete filterQuery.condition;
        }
        if (!city || city == "") {
          delete filterQuery["user_docs.address.cityName"];
        }
        if ((!minPrice && !maxPrice) || (minPrice < 0 && maxPrice < 0) ) {
          delete filterQuery.$and;
        } else {
          if (!minPrice || minPrice < 0) {
            filterQuery.$and.shift();
          }
          if (!maxPrice || maxPrice < 0) {
            filterQuery.$and.pop();
          }
        }
        
        console.log('after delete: ',filterQuery.$and)
        const items = await Item.aggregate([
          {
            $search: {
              search: {
                query: keyword,
                path: "name",
              },
              highlight: {
                path: "name",
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user_docs",
            },
          },
          {
            $match: filterQuery,
          },
          {
            $project: {
              _id: 0,
              id: "$_id",
              name: 1,
              price: 1,
              createdAt: 1,
              description: 1,
              category: 1,
              condition: 1,
              images: 1,
              bookmarkedBy: 1,
              user: {
                $mergeObjects: [
                  { id: { $arrayElemAt: ["$user_docs._id", 0] } },
                  {
                    $arrayElemAt: ["$user_docs", 0],
                  },
                ],
              },
            },
          },
        ]);
        return items;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSellerItems(_, { userId }) {
      try {
        const items = await Item.find({ user: userId })
          .sort({ createdAt: -1 })
          .populate("user");
        return items;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getBookmarks(_, {}, context) {
      try {
        const user = checkAuth(context);
        const items = await Item.find({
          bookmarkedBy: {
            $elemMatch: {
              userId: user.id,
            },
          },
        })
          .sort({ createdAt: -1 })
          .populate("user");
        return items;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async addItem(
      _,
      {
        addItemInput: {
          name,
          price,
          stock,
          category,
          condition,
          weight,
          description,
          dimension,
          images,
        },
      },
      context
    ) {
      const user = checkAuth(context);

      const { valid, errors } = validateAddItemInput(
        name,
        price,
        stock,
        category,
        condition,
        weight,
        description,
        dimension,
        images,
        description
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const newItem = new Item({
        name: name,
        price: price,
        stock: stock,
        category: category,
        condition: condition,
        weight: weight,
        description: description,
        dimension: dimension,
        user: user.id,
        images: images,
        createdAt: new Date().toISOString(),
      });

      const item = await newItem.save();

      return item;
    },

    async updateItem(
      _,
      {
        itemId,
        addItemInput: {
          name,
          price,
          stock,
          category,
          condition,
          weight,
          description,
          dimension,
          images,
        },
      },
      context
    ) {
      const user = checkAuth(context);
      const { valid, errors } = validateAddItemInput(
        name,
        price,
        stock,
        category,
        condition,
        weight,
        description,
        dimension,
        images,
        description
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const updatedItem = await Item.findOneAndUpdate(
        { _id: itemId },
        {
          name: name,
          price: price,
          description: description,
          stock: stock,
          category: category,
          condition: condition,
          weight: weight,
          user: user.id,
          dimension: dimension,
          images: images,
        },
        { new: true }
      ).populate("user");

      return {
        ...updatedItem._doc,
        id: updatedItem._id,
      };
    },

    async deleteItem(_, { itemId }, context) {
      const user = checkAuth(context);
      try {
        const item = await Item.findById(itemId);
        if (user.username === item.username) {
          await item.delete();
          return "Item deleted";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async bookmarkItem(_, { itemId }, context) {
      const { id } = checkAuth(context);

      const item = await Item.findById(itemId);

      if (item) {
        if (
          item.bookmarkedBy.find(
            (bookmark) => bookmark.userId.toString() === id
          )
        ) {
          //Post already liked, unliked it
          item.bookmarkedBy = item.bookmarkedBy.filter(
            (bookmark) => bookmark.userId.toString() !== id
          );
        } else {
          //Post not liked
          item.bookmarkedBy.push({
            userId: id,
            createdAt: new Date().toDateString(),
          });
        }
        await item.save();
        return item;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },

  // Subscription: {
  //     newPost: {
  //         subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
  //     }
  // }
};
