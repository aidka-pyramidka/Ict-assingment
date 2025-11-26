// Validation utility functions

// Validate email format
function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format 
function isValidPhone(phone) {
  if (!phone) return true;
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length <= 50;
}

// Validate ID parameter
function isValidId(id) {
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0;
}

// Validate customer data
function validateCustomer(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string');
    } else if (data.name.trim().length === 0) {
      errors.push('Name cannot be empty');
    } else if (data.name.length > 100) {
      errors.push('Name must be 100 characters or less');
    }
  }

  if (!isUpdate || data.email !== undefined) {
    if (!data.email || typeof data.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    } else if (data.email.length > 100) {
      errors.push('Email must be 100 characters or less');
    }
  }

  if (data.phone !== undefined && data.phone !== null) {
    if (typeof data.phone !== 'string') {
      errors.push('Phone must be a string');
    } else if (!isValidPhone(data.phone)) {
      errors.push('Invalid phone format');
    }
  }

  if (data.address !== undefined && data.address !== null) {
    if (typeof data.address !== 'string') {
      errors.push('Address must be a string');
    }
  }

  return errors;
}

// Validate employee data
function validateEmployee(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string');
    } else if (data.name.trim().length === 0) {
      errors.push('Name cannot be empty');
    } else if (data.name.length > 100) {
      errors.push('Name must be 100 characters or less');
    }
  }

  if (!isUpdate || data.role !== undefined) {
    if (!data.role || typeof data.role !== 'string') {
      errors.push('Role is required and must be a string');
    } else if (data.role.trim().length === 0) {
      errors.push('Role cannot be empty');
    } else if (data.role.length > 50) {
      errors.push('Role must be 50 characters or less');
    }
  }

  if (data.email !== undefined && data.email !== null) {
    if (typeof data.email !== 'string') {
      errors.push('Email must be a string');
    } else if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    } else if (data.email.length > 100) {
      errors.push('Email must be 100 characters or less');
    }
  }

  return errors;
}

// Validate product data
function validateProduct(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string');
    } else if (data.name.trim().length === 0) {
      errors.push('Name cannot be empty');
    } else if (data.name.length > 150) {
      errors.push('Name must be 150 characters or less');
    }
  }

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    }
  }

  if (!isUpdate || data.price !== undefined) {
    if (data.price === null || data.price === undefined) {
      errors.push('Price is required');
    } else {
      const price = parseFloat(data.price);
      if (isNaN(price)) {
        errors.push('Price must be a valid number');
      } else if (price < 0) {
        errors.push('Price must be greater than or equal to 0');
      } else if (price > 99999999.99) {
        errors.push('Price is too large (max 99999999.99)');
      }
    }
  }

  if (data.stock !== undefined && data.stock !== null) {
    const stock = parseInt(data.stock, 10);
    if (isNaN(stock)) {
      errors.push('Stock must be a valid integer');
    } else if (stock < 0) {
      errors.push('Stock must be greater than or equal to 0');
    } else if (stock > 2147483647) {
      errors.push('Stock value is too large');
    }
  }

  return errors;
}

// Validate order data
function validateOrder(data) {
  const errors = [];

  if (!data.customer_id) {
    errors.push('customer_id is required');
  } else {
    const customerId = parseInt(data.customer_id, 10);
    if (isNaN(customerId) || customerId <= 0) {
      errors.push('customer_id must be a positive integer');
    }
  }

  if (!Array.isArray(data.items)) {
    errors.push('items must be an array');
  } else if (data.items.length === 0) {
    errors.push('items array cannot be empty');
  } else {
    data.items.forEach((item, index) => {
      if (!item.product_id) {
        errors.push(`items[${index}].product_id is required`);
      } else {
        const productId = parseInt(item.product_id, 10);
        if (isNaN(productId) || productId <= 0) {
          errors.push(`items[${index}].product_id must be a positive integer`);
        }
      }

      if (item.quantity === undefined || item.quantity === null) {
        errors.push(`items[${index}].quantity is required`);
      } else {
        const quantity = parseInt(item.quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
          errors.push(`items[${index}].quantity must be a positive integer`);
        }
      }
    });
  }

  return errors;
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidId,
  validateCustomer,
  validateEmployee,
  validateProduct,
  validateOrder
};

