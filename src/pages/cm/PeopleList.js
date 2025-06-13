import { useContext } from "react";
import CdListForm from "./components/CdListForm";
import { CmUserContext } from "../../context/CmUserContext";
import { CM_LOGIN_NOT_CHECK } from "../../components/js/Common";

export default function PeopleList(props) {
  //====================================================================
  const { ctxtCmUser } = useContext(CmUserContext);

  let myCtxtCmUser = { ...ctxtCmUser };
  if (!myCtxtCmUser) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  return (
    <main>
      <CdListForm {...props} formFrom="peopleList" />
    </main>
  );
}