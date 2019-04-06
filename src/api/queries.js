export default {
  MUTATION_LOGIN: `
  mutation Login($login: String!, $password: String!){
    login(login: $login, password: $password){
      token
    }
  }`,
  MUTATION_SIGNUP: `
  mutation Signup($email: String!){
    singup(email: $email){
      ok
    }
  }`
};
