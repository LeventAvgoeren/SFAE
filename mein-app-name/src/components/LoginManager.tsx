import React, { useContext } from "react";

export interface LoginInfo {
  userId: string;
  admin : boolean;

 }
 export interface LoginContextType {
  loginInfo: LoginInfo | false | undefined;
  setLoginInfo: (loginInfo: LoginInfo | false) => void

 }

export const LoginContext = React.createContext<LoginContextType>({} as LoginContextType);


export const useLoginContext = () => useContext(LoginContext);
