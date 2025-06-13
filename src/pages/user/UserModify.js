import { useContext, useEffect, useMemo, useState } from "react";
import { CmUserContext } from "../../context/CmUserContext";
import UserForm from "./components/UserForm";
import {
  CM_LOGIN_NOT_CHECK,
  CM_LOGIN_NOT_EMAIL,
  CM_USER_LEVEL_ADM,
  CmChangeJsonToSearchWithList,
  CmChangeSearchToJson,
  CmGotoLoginForm,
  CmNoPermissionAndGotoMain,
  URL_USER_LIST,
} from "../../components/js/Common";
import CmAlert from "../../hook/CmAlert";
import axios from "axios";
import cookie from "react-cookies";

export default function UserModify(props) {
  const pathname = props.location.pathname;
  const [userData, setUserData] = useState(null);

  // seq 조회
  let paramUserSeq =
    props && props.match && props.match.params && props.match.params.userSeq
      ? props.match.params.userSeq
      : "";

  const initSrchWordList = useMemo(() => {
    return CmChangeSearchToJson(props.location.search.replace("?", ""));
  }, [props.location.search]);

  // 로그인 정보
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  // 잠시
  const userEmail =
    ctxtCmUser && ctxtCmUser.userEmail ? ctxtCmUser.userEmail : "";
  const userNickName =
    ctxtCmUser && ctxtCmUser.userNickName ? ctxtCmUser.userNickName : "";
  const userLevel =
    ctxtCmUser && ctxtCmUser.userLevel ? ctxtCmUser.userLevel : "";

  let tempData = {
    userSeq: "", // user seq
    userEmail: userEmail, // 이메일
    userNickName: userNickName, // 별명
    bDataReady: false,
  };

  useEffect(() => {
    if (userEmail !== CM_LOGIN_NOT_CHECK && userEmail !== CM_LOGIN_NOT_EMAIL) {
      if (pathname.indexOf("myInfo") >= 0) {
        tempData.bDataReady = true;
        setUserData(tempData);
      } else if (pathname.indexOf("modify") >= 0) {
        if (userLevel < CM_USER_LEVEL_ADM) {
          CmNoPermissionAndGotoMain();
        }
      }
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // 회원정보 가져오기
  useEffect(() => {
    if (pathname.indexOf("modify") >= 0 && paramUserSeq) {
      axios
        .post("/api/cm/loginForm?type=detail", {
          userSeq: paramUserSeq,
          token1: cookie.load("userEmail"),
          token2: cookie.load("userLevel"),
          token3: cookie.load("userIp"),
        })
        .then((response) => {
          try {
            const result = response.data;
            if (result.json.length !== 1) {
              CmAlert(
                "해당건이 없습니다.\n리스트로 이동합니다.",
                "",
                "info",
                "닫기",
                3000
              );
              setTimeout(function () {
                // window.location.href = URL_BC_LIST;
                window.location.href = CmChangeJsonToSearchWithList(
                  URL_USER_LIST,
                  initSrchWordList
                );
              }, 1000);
            } else {
              let bcOne = result.json[0];

              tempData = {
                userSeq: bcOne.userSeq, // user seq
                userEmail: bcOne.userEmail, // 이메일
                userNickName: bcOne.userNickName, // 별명
                userLevel: bcOne.userLevel, //
                useYn: bcOne.useYn, //
                bDataReady: true,
              };

              setUserData(tempData);
            }

            // setList( result.json );
          } catch (error) {
            CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
          }
        })
        .catch(() => {
          return false;
        });
    }
  }, [paramUserSeq]);

  if (userEmail === CM_LOGIN_NOT_EMAIL) {
    CmGotoLoginForm();
    return;
  }

  return (
    <main>
      {userData && userData.bDataReady && userEmail !== CM_LOGIN_NOT_CHECK ? (
        <UserForm formFrom="modify" userData={userData} {...props} />
      ) : (
        ""
      )}
    </main>
  );
}
