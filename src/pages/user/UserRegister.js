import { useContext } from "react";
import UserForm from "./components/UserForm";
import { CmUserContext } from "../../context/CmUserContext";
import {
  CM_LOGIN_NOT_CHECK,
  CM_LOGIN_NOT_EMAIL,
} from "../../components/js/Common";

export default function UserRegister(props) {
  //========================================================================
  // 로그인 정보
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  if (myCtxtCmUser.userEmail === CM_LOGIN_NOT_EMAIL) {
  } else {
  }

  return (
    <main>
      <UserForm formFrom="signup" {...props} />
    </main>
  );
}
