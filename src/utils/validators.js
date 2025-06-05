export const validateEmail = (value) => {
  if (!value) return 'required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'invalidEmail';

  const [local, domain] = value.split('@');
  if (local.startsWith('.') || local.endsWith('.')) return 'invalidEmail';
  if (domain.startsWith('.') || domain.endsWith('.')) return 'invalidEmail';
  if (local.includes('..') || domain.includes('..')) return 'invalidEmail';

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return 'invalidEmail';

  return undefined;
};

export const validatePassword = (value) => {
  if (!value) return 'required';
  if (value.length < 6) return 'passwordTooShort';
  return undefined;
};

export const validateRequired = (value) => {
  if (value === '' || value === null || value === undefined) {
    return 'required';
  }
  return undefined;
};

export const validateDescription = (value) => {
  if (value?.length >= 200) return 'maxLength200';
  return undefined;
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const validateFile = (file) => {
  if (!file) return 'requiredFile';
  if (!ALLOWED_TYPES.includes(file.type)) return 'invalidFileType';
  if (file.size > MAX_FILE_SIZE) return 'fileTooLarge';
  return undefined;
};
