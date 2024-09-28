import { atom } from 'recoil';

export const inputValueState = atom({
  key: 'inputValueState',
  default: '',
});

export const errorState = atom({
  key: 'errorState',
  default: '',
});

export const userLoginState = atom({
  key: 'userLoginState',
  default: {
    email: '',
    password: ''
  }
});

export const UserSignUpState = atom({
  key: 'userSignUpState',
  default: {
    fullName: '',
    email: '',
    password: ''
  }
})

export const signUpState = atom({
  key: 'signUpState',
  default:false
})

export const tokenState = atom({
  key: 'tokenState',
  default:''
})

export const loginState = atom({
  key:'loginState',
  default: false
})