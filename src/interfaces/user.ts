interface IRegister {
  username : string,
  email : string,
  password : string,
  confirmPassword : string|undefined,
}
export default IRegister;
interface Ilogin {
 
  email : string,
  password : string,
 
}
export default Ilogin;