export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^(09|03|05|07|08)\d{8}$/.test(phone);

export const isValidPassword = (pw) =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{9,}$/.test(pw);

export const isAtLeast18 = (dobStr) => {
  if (!dobStr) return false;
  const dob = new Date(dobStr);
  const now = new Date();
  if (isNaN(dob.getTime()) || dob > now || dob.getFullYear() < 1920) return false;
  
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
};

export const isValidDob = (dobStr) => isAtLeast18(dobStr);

export const extractError = (err) => {
  if (!err.response) return 'Network error. Please check your connection.';
  const data = err.response.data;
  if (typeof data === 'string') return data;
  return data?.message || data?.error || 'Something went wrong.';
};
