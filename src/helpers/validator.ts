export const validateEmail = (_: any, value: string) => {
  // Regular expression for email validation
  // const emailRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value || value.match(emailRegex)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('Please enter a valid email address'));
};
export const validatePhoneNumber = (_: any, value: string) => {
  // Regular expression for phone number validation
  // const phoneRegex = /^\+?[0-9]\d{1,14}$/; // Accepts digits with optional leading '+' symbol
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g; // Accepts digits with optional leading '+' symbol

  if (!value || value.match(phoneRegex)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('Please enter a valid phone number'));
};
