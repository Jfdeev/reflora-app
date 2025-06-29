import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Nome é obrigatório'),
  lastName: Yup.string()
    .required('Sobrenome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
});

export const sensorSettingsSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nome é obrigatório'),
  location: Yup.string()
    .required('Localização é obrigatória'),
});
