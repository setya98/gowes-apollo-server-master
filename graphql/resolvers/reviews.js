const { UserInputError, AuthenticationError } = require("apollo-server");

const Review = require("../../models/Review");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    async addReview(_, { addReviewInput: { score, body, images, itemId } }, context) {
      const user = checkAuth(context);
      const newReview = new Review({
        score: score,
        body: body,
        user: user.id,
        images: images,
        item: itemId,
        createdAt: new Date().toISOString(),
      });
      const review = await newReview.save();
      return review;
    },
  },
  Query: {
    async getItemReviews(_, { itemId }) {
      try {
        const reviews = await Review.find({ item: itemId })
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("item");
        return reviews;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getUserReviews(_, { userId }) {
      try {
        const reviews = await Review.find({ user: userId })
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("item");
        return reviews;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
