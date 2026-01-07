import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Некоректний email').required('Email обов’язковий'),
  password: yup.string().min(6, 'Мінімум 6 символів').required('Пароль обов’язковий'),
})

export const registerSchema = yup.object({
  email: yup.string().email('Некоректний email').required('Email обов’язковий'),
  password: yup.string().min(6, 'Мінімум 6 символів').required('Пароль обов’язковий'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Паролі не співпадають')
    .required('Підтвердження паролю обов’язкове'),
})
