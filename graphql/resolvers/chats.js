const { UserInputError, AuthenticationError } = require("apollo-server");
const { ObjectId } = require("mongodb");
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getChats(_, {}, context) {
      const { id: userId } = checkAuth(context);
      try {
        const chats = await Chat.find({ users: userId })
          .sort({ createdAt: -1 })
          .populate("users");
        return chats;
      } catch (err) {
        throw new Error(err);
      }
    },
    async isChatExists(_, { itemUserId, currentUserId }, context) {
      // const { id: userId } = checkAuth(context);
      try {
        const chats = await Chat.aggregate([
          {
            $match: {
              users: {
                $all: [new ObjectId(currentUserId), new ObjectId(itemUserId)],
              },
            },
          },
        ]);
        return chats;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
