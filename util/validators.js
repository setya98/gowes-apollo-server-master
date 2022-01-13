module.exports.validateRegisterInput = (
  name,
  password,
  confirmPassword,
  email
) => {
  const errors = {};
  if (name.trim() === '') {
    errors.name = 'Name must not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password === '') {
    errors.password = 'Password must not empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateUserProfileInput = (name, email, phone) => {
  const errors = {};
  if (name.trim() === '') {
    errors.name = 'Name must not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  
  if (phone.trim().length < 11) {
    errors.phone = 'Phone number is not valid';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateActivateSellerInput = (username) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateAddItemInput = (name, price, stock, category, condition, weight, description, dimension, images) => {
  const errors = {};
  if (name.trim() === '') {
    errors.name = 'Name must not be empty';
  }
  if (price === 0) {
    errors.price = 'Price must not be 0';
  }
  if (stock === 0) {
    errors.stock = 'Stock must not be 0';
  }
  if (category.trim() === '') {
    errors.category = 'Category must not be empty';
  }
  if (condition.trim() === '') {
    errors.condition = 'Condition must not be empty';
  }
  if (weight === 0) {
    errors.weight = 'Weight must not be 0';
  }
  if (dimension.length === 0) {
    errors.lengthDimension = 'Length must not be 0';
  }
  if (dimension.width === 0) {
    errors.widthDimension = 'Width must not be 0';
  }
  if (dimension.height === 0) {
    errors.heightDimension = 'Height must not be 0';
  }
  if (images.length === 0) {
    errors.images = 'There must be at least one image';
  }
  if (description.trim() === '') {
    errors.description = 'Description must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};


module.exports.validateAddCartItemInput = (amountItem) => {
  const errors = {};
  if (amountItem === 0) {
    errors.amountItem = 'Price must not be 0';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};