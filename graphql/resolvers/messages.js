const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");

const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getMessages(_, { chatId }) {
      try {
        const messages = await Message.find({ chatId: chatId }).sort({
          createdAt: -1,
        });
        return messages;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    addMessage: async (
      _,
      {
        messageInput: { chatId, receiverUserId, content, images, itemMessageInput },
      },
      context
    ) => {
      if (!images) {
        images = [];
      }
      try {
        const { id: userId } = checkAuth(context);
        const newMessage = new Message({
          user: userId,
          content: content,
          images: images,
          sentAt: new Date().toISOString(),
        });
        if (itemMessageInput) {
          newMessage.item = {
            id: itemMessageInput.id,
            name: itemMessageInput.name,
            price: itemMessageInput.price,
            image: itemMessageInput.image,
          };
        }
        if (!chatId || chatId === "") {
          const newChat = new Chat({
            lastText: content,
            users: [receiverUserId, userId],
            sentAt: new Date().toISOString(),
          });
          newChat.save(function (err, chatDoc) {
            newMessage.chatId = chatDoc._id;
            if (err) {
              throw new Error(err);
            } else {
              newMessage.save();
            }
          });
          return newMessage;
        } else {
          newMessage.chatId = chatId;
          await newMessage.save();
        }
        context.pubsub.publish("NEW_MESSAGE", { newMessage: newMessage });
        return newMessage;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          console.log(user);
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, { chatId }, { user }) => {
          //   console.log("new message user id: ",typeof(newMessage.user.toString()))
          //   console.log("current user id: ",typeof(user.id))
          //   console.log("is id same: ", (newMessage.user.toString() === user.id))
          //   console.log("chatId: ", chatId)
          if (newMessage.chatId.toString() === chatId) {
            console.log("there's new chat");
            return true;
          }
          return false;
        }
      ),
    },
  },
};
