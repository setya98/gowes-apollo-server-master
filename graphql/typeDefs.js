const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Order {
    id: ID!
    items: [OrderItem]!
    seller: OrderSeller!
    user: User!
    state: OrderState
    shipping: OrderShipping!
    logs: [OrderLog]!
  }

  type OrderLog {
    stateType: String!
    succsededAt: String!
    executedAt: String!
  }

  type OrderSeller {
    username: String!
  }

  type OrderItem {
    id: String!
    name: String!
    price: Int!
    weight: Int!
    images: [Image]
    amountItem: Int!
    note: String!
  }

  type OrderState {
    stateType: String!
    createdAt: String!
    deadline: String!
  }

  type OrderShipping {
    awbNumber: String!
    courierName: String!
    buyerAddress: String!
    shippingCost: Int!
  }

  type Item {
    id: ID!
    name: String!
    price: Int!
    stock: Int!
    category: String!
    condition: String!
    weight: Int!
    description: String!
    dimension: Dimension!
    user: User!
    images: [Image]!
    bookmarkedBy: [BookmarkedBy]
    createdAt: String!
  }

  type Cart {
    id: ID!
    item: Item!
    user: User!
    note: String!
    isChecked: Boolean!
    amountItem: Int!
    createdAt: String!
  }

  type Dimension {
    length: Int!
    width: Int!
    height: Int!
  }

  type Review {
    id: ID!
    score: Int!
    body: String!
    user: User!
    item: Item!
    images: [Image]!
    createdAt: String!
  }

  type Image {
    id: ID!
    downloadUrl: String!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type BookmarkedBy {
    id: ID!
    userId: ID!
    createdAt: String!
  }

  type Address {
    cityName: String
    cityId: String
    district: String
    postalCode: String
    detail: String
  }

  type User {
    id: ID!
    email: String!
    phone: String!
    address: Address!
    balance: Int!
    token: String!
    buyer: Buyer!
    seller: Seller!
  }

  type Buyer {
    id: ID!
    name: String
    birthDate: String
    avatar: String
    createdAt: String
  }

  type Seller {
    id: ID!
    username: String!
    avatar: String!
    description: String!
    createdAt: String!
  }

  type Chat {
    id: ID!
    lastText: String!
    users: [User]!
    sentAt: String!
  }

  type Message {
    id: ID!
    user: ID!
    item: ItemMessage
    content: String!
    images: [Image]
    sentAt: String!
  }

  type ItemMessage {
    id: ID
    name: String
    price: Int
    image: String
  }

  type City {
    city_id: String
    province_id: String
    province: String
    type: String
    city_name: String
    postal_code: String
  }

  type Cost {
    value: Int
    etd: String
    note: String
  }

  type Costs {
    service: String
    description: String
    cost: [Cost]
  }

  type Results {
    code: String
    name: String
    costs: [Costs]
  }

  type MidTransResult {
    token: String
    redirect_url: String
  }

  input CostInput {
    origin: String!
    destination: String!
    weight: Int!
    courier: String!
  }

  input RegisterInput {
    name: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input UserProfileInput {
    avatar: String!
    name: String!
    email: String!
    phone: String!
    birthDate: String!
    address: AddressInput!
  }

  input AddressInput {
    cityName: String
    cityId: String
    district: String
    postalCode: String
    detail: String
  }

  input SellerProfileInput {
    username: String!
    avatar: String!
    description: String!
  }

  input AddItemInput {
    name: String!
    price: Int!
    stock: Int!
    category: String!
    condition: String!
    weight: Int!
    description: String!
    dimension: DimensionInput!
    images: [ImageInput]!
  }

  input ImageInput {
    downloadUrl: String
  }

  input DimensionInput {
    length: Int!
    width: Int!
    height: Int!
  }

  input AddOrderInput {
    items: [OrderItemInput]!
    state: OrderStateInput!
    sellerUsername: String!
    shipping: OrderShippingInput!
  }

  input UpdateOrderInput {
    state: OrderStateInput!
  }

  input OrderItemInput {
    id: String!
    name: String!
    price: Int!
    weight: Int!
    images: [ImageInput]
    amountItem: Int!
    note: String!
  }

  input OrderStateInput {
    stateType: String
  }

  input OrderShippingInput {
    awbNumber: String
    courierName: String!
    buyerAddress: String!
    shippingCost: Int!
  }

  input MessageInput {
    chatId: ID
    itemMessageInput: ItemMessageInput
    receiverUserId: ID!
    content: String
    images: [ImageInput]
  }

  input ItemMessageInput {
    id: ID!
    name: String!
    price: Int!
    image: String!
  }
  type chatExists {
    _id: ID
    lastText: String
  }

  input SearchItemInput {
    keyword: String!
    category: String
    condition: String
    city: String
    minPrice: Int
    maxPrice: Int
  }

  input CheckedCart {
    itemIds: [ID]!
    isChecked: Boolean!
  }

  input CreatePaymentInput {
    grossAmount: Int!
    customerDetails: CustomerDetailsInput!
    itemDetails: [ItemDetail]!
  }
  
  input ItemDetail {
    id: String!
    price: Int!
    quantity: Int!
    name: String!
  }

  input CustomerDetailsInput {
    firstName: String!
    email: String!
    phone: String!
    billingAddress: PaymentAddressInput!
  }

  input PaymentAddressInput {
    firstName: String!
    email: String!
    phone: String!
    address: String!
    city: String!
    postalCode: String!
    countryCode: String!
  }

  input AddReviewInput {
    score: Int!
    body: String!
    images: ImageInput
    itemId: ID!
  }

  type Query {
    getUser(userId: ID!): User!
    getSeller(sellerId: ID!): User
    getSellers: [User]
    getPosts: [Post]
    getPost(postId: ID!): Post!
    getItem(itemId: ID!): Item!
    getItems: [Item]
    searchItems(searchItemInput: SearchItemInput): [Item]
    getSellerItems(userId: ID!): [Item]
    getItemReviews(itemId: ID!): [Review]
    getUserReviews(userId: ID!): [Review]
    getBookmarks: [Item]
    getChats: [Chat]
    isChatExists(itemUserId: ID!, currentUserId: ID!): [chatExists]
    getMessages(chatId: ID!): [Message]
    getUserCartItems: [Cart]
    getUserCartItemsCheckout: [Cart]
    getUserCartItem(itemId: ID!): Cart
    getUserOrders: [Order]
    getSellerOrders(username: String!): [Order]
    getUserOrderById(oderId: ID!): [Order]
    getCities: [City] @cacheControl(maxAge: 1000)
    getCosts(costInput: CostInput): [Results]
    createPayment(createPaymentInput: CreatePaymentInput): MidTransResult
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    updateUserProfile(userProfileInput: UserProfileInput): User!
    updateSellerProfile(sellerProfileInput: SellerProfileInput): User!
    login(email: String!, password: String!): User!
    createPost(body: String!): Post!
    addItem(addItemInput: AddItemInput): Item!
    addReview(addReviewInput: AddReviewInput): Review!
    updateItem(itemId: ID!, addItemInput: AddItemInput): Item!
    deletePost(postId: ID!): String!
    deleteItem(itemId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    bookmarkItem(itemId: ID!): Item!
    addMessage(messageInput: MessageInput!): Message
    addCartItem(
      itemId: ID!
      note: String!
      isChecked: Boolean!
      amountItem: Int!
    ): Cart!
    editCartItem(
      itemId: ID!
      note: String!
      isChecked: Boolean!
      amountItem: Int!
    ): Cart!
    deleteCartItem(cartId: ID!): String!
    addOrder(addOrderInput: AddOrderInput!, cartItemIds: [ID]!): Order!
    addAwbNumber(orderId: ID!, awbNumber: String!, courierName: String!, buyerAddress: String!, shippingCost:Int!): Order!
    updateOrder(oderId: ID!, updateOrderInput: UpdateOrderInput!): Order!
    updateCheckCart(checkedCart: CheckedCart!): String!
  }
  type Subscription {
    newPost: Post!
    newMessage(chatId: ID!): Message
  }
`;
