import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import CmAlert from "../../../hook/CmAlert";
import styles from "./UserForm.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import {
  CM_CD_GROUP_ID_ETC,
  CM_LOGIN_NOT_CHECK,
  CM_USER_EMAIL_ADM,
  CmChangeJsonToSearchWithList,
  CmChangeSearchToJson,
  URL_USER_LIST,
  URL_USER_LOGIN,
} from "../../../components/js/Common";
import cookie from "react-cookies";
import { CmUserContext } from "../../../context/CmUserContext";
/*
1. 이메일 주소가 기타인 경우 직접입력하게 
*/
export default function UserForm(props) {
  const formFrom = props.formFrom ? props.formFrom : "signup";
  const userData = props.userData;
  const pathname = props.location.pathname;

  // 로그인 정보
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  // 잠시
  const userEmail = userData && userData.userEmail ? userData.userEmail : "";
  const userNickName = userData && userData.userNickName ? userData.userNickName : "";

  const userLevel = userData && userData.userLevel ? userData.userLevel : "";
  const useYn = userData && userData.useYn ? userData.useYn : "";

  const history = useHistory();

  const refEmail1 = useRef("");
  const refEmail2 = useRef("");
  const refUserPassword = useRef();
  const refUserPasswordCnf = useRef();
  const refUserNickName = useRef();
  const refUserEmail = useRef();

  const refUserLevel = useRef();

  // 유저정보 데이터
  const [userInfoJson, setUserInfoJson] = useState({});
  const [cmCdList, setCmCdList] = useState([]); // 코드 리스트

  // 공통코드 가져오기
  useEffect(() => {
    getListByGroupId("userForm");
  }, []);

  //===================================================================
  const getListByGroupId = (pKind) => {
    pKind = "userForm";

    let insertJson = { useYn: "Y" };
    let cdGroupIdList = "";
    let cdGroupIdYn = "N";
    switch (pKind) {
      case "userForm":
        cdGroupIdList = "emailList";
        cdGroupIdYn = "N";
        break;
      default:
        cdGroupIdList = "";
    }

    insertJson = {
      ...insertJson,
      cdGroupIdList: cdGroupIdList,
      cdGroupIdYn: cdGroupIdYn,
    };
    axios
      .post("/api/cm/cdForm?type=listByGroupId", insertJson)
      .then((response) => {
        try {
          const result = response.data;
          setCmCdList(result.json);
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  useEffect(() => {
    // console.log(`useEffect`)

    let tempDate = {
      userSeq: "", // user seq
      userEmail: userEmail, // 이메일
      userPassword: "", // 비밀번호
      userPasswordCnf: "",
      userNickName: userNickName, // 별명
      userLevel: userLevel, // 레벨
      userPhone: "", // 휴대폰번호
      userEtc: "", // 기타
      useYn: useYn, // 사용여부
      userAttr1: "", // user_attr1
      userAttr2: "", // user_attr2
      userAttr3: "", // user_attr3
      userAttr4: "", // user_attr4
      userAttr5: "", // user_attr5
      creaetDt: "", // 등록일자
      createId: "", // 등록자
      updateDt: "", // 수정일자
      updateId: "", // 수정자
      useremail1: "",
      useremail2: "",
    };

    if (formFrom === "modify") {
      setUserInfoJson(tempDate);
    } else {
      tempDate.userEmail = "";
      tempDate.userNickName = "";
      setUserInfoJson(tempDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const initSrchWordList = useMemo(() => {
    return CmChangeSearchToJson(props.location.search.replace("?", ""));
  }, [props.location.search]);

  // 등록 클릭시 처리
  const submitClick = async (type, e) => {
    // console.log(userInfoJson)
    const email_val_checker = userInfoJson.useremail1;
    const email2_val_checker = userInfoJson.useremail2;
    const email_full_val_checker = userInfoJson.userEmail;
    const pwd_val_checker = userInfoJson.userPassword;
    const pwd_cnf_val_checker = userInfoJson.userPasswordCnf;
    const name_val_checker = userInfoJson.userNickName;
    // const emailId_val_checker = userInfoJson.userEmail;

    // 입력값 체크
    const fnValidate = () => {
      let bSignup = formFrom === "modify" ? false : true;
      let bPswCheck =
        formFrom === "signup"
          ? true
          : pwd_val_checker !== "" || pwd_cnf_val_checker !== ""
          ? true
          : false;

      var pattern1 = /[0-9]/;
      var pattern2 = /[a-zA-Z]/;
      var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

      if (bSignup) {
        if (email2_val_checker === CM_CD_GROUP_ID_ETC) {
          if (!email_full_val_checker) {
            refUserEmail.current.focus();
            CmAlert("이메일 주소를 다시 확인해주세요.", "", "info", "닫기");
            return false;
          }

          if (email_full_val_checker.search(/\s/) !== -1) {
            refUserEmail.current.focus();
            CmAlert("이메일 공백을 제거해 주세요.", "", "info", "닫기");
            return false;
          }

          if (
            !(
              email_full_val_checker.search(
                /^\s*[\w\~\-\.]+\@[\w\~\-]+(\.[\w\~\-]+)+\s*$/g
              ) >= 0
            )
          ) {
            refUserEmail.current.focus();
            CmAlert("이메일 주소를 다시 확인해주세요.", "", "info", "닫기");
            return false;
          }
        } else {
          if (bSignup && email_val_checker === "") {
            refEmail1.current.focus();
            CmAlert("이메일 주소를 다시 확인해주세요.", "", "info", "닫기");
            return false;
          }
          if (bSignup && email_val_checker.search(/\s/) !== -1) {
            refEmail1.current.focus();
            CmAlert("이메일 공백을 제거해 주세요.", "", "info", "닫기");
            return false;
          }
          if (bSignup && email2_val_checker === "") {
            refEmail2.current.focus();
            CmAlert("이메일 주소를 다시 확인해주세요.", "", "info", "닫기");
            return false;
          }
        }
      }

      if (bPswCheck && pwd_val_checker === "") {
        refUserPassword.current.focus();
        CmAlert("비밀번호를 입력해주세요.", "", "info", "닫기");
        return false;
      }
      if (bPswCheck && pwd_val_checker !== "") {
        var str = pwd_val_checker;
        if (str.search(/\s/) !== -1) {
          refUserPassword.current.focus();
          CmAlert("비밀번호 공백을 제거해 주세요.", "", "info", "닫기");
          return false;
        }
        if (
          !pattern1.test(str) ||
          !pattern2.test(str) ||
          !pattern3.test(str) ||
          str.length < 8 ||
          str.length > 16
        ) {
          refUserPassword.current.focus();
          CmAlert(
            "8~16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.",
            "",
            "info",
            "닫기"
          );
          return false;
        }
      }

      if (bPswCheck && pwd_cnf_val_checker === "") {
        refUserPasswordCnf.current.focus();
        CmAlert("비밀번호 확인을 입력해주세요.", "", "info", "닫기");
        return false;
      }
      if (bPswCheck && pwd_val_checker !== pwd_cnf_val_checker) {
        refUserPasswordCnf.current.focus();
        CmAlert("비밀번호가 일치하지 않습니다.", "", "info", "닫기");
        return false;
      }

      if (name_val_checker === "") {
        refUserNickName.current.focus();
        CmAlert("성명을 입력해주세요.", "", "info", "닫기");
        return false;
      }
      if (name_val_checker.search(/\s/) !== -1) {
        refUserNickName.current.focus();
        CmAlert("성명에 공백을 제거해 주세요.", "", "info", "닫기");
        return false;
      }

      if (
        pattern3.test(name_val_checker) ||
        name_val_checker.length < 1 ||
        name_val_checker.length > 16
      ) {
        refUserNickName.current.focus();
        CmAlert("성명에 특수문자를 제거해 주세요.", "", "info", "닫기");
        return false;
      }

      return true;
    };

    // 회원 정보 수정 처리
    const fnUserModify = async (type) => {
      const emailId_val_checker = userInfoJson.userEmail;
      const pwd_val_checker = userInfoJson.userPassword;
      const name_val_checker = userInfoJson.userNickName;

      const level = userInfoJson.userLevel;
      const useYn = userInfoJson.useYn;

      var jsonstr = {
        userNickName: name_val_checker,
        userEmail: emailId_val_checker,
        userPassword: pwd_val_checker,
        updateId: emailId_val_checker,
        token1: cookie.load("userEmail"),
        token2: cookie.load("userLevel"),
        token3: cookie.load("userIp"),
      };

      if (props.location.pathname.indexOf("modify") >= 0) {
        jsonstr.userLevel = level;
        jsonstr.useYn = useYn;
      }

      var Json_form = JSON.stringify(jsonstr);
      try {
        const response = await fetch("/api/cm/register?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          CmAlert("회원정보 수정이 완료되었습니다.", "", "info", "닫기", 3000);
          // history.push(pathname);
          setTimeout(function () {
            window.location.href = pathname + props.location.search;
          }, 1000);
        } else {
          CmAlert(
            "작업중 오류가 발생하였습니다.[1]",
            body.msg,
            "error",
            "닫기"
          );
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // 실제 처리
    if (fnValidate()) {
      if (formFrom === "modify") {
        // fnUserModify("userModify", e);

        if (
          userInfoJson.userEmail === CM_USER_EMAIL_ADM &&
          myCtxtCmUser.userEmail !== CM_USER_EMAIL_ADM
        ) {
          CmAlert(
            "관리자 계정정보 수정은 본인만 가능합니다.",
            "",
            "error",
            "닫기"
          );
          return;
        }

        Swal.fire({
          title: "수정 하시겠습니까?",
          text: "비밀번호 변경시 해당 계정은 로그아웃 됩니다.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "예",
          cancelButtonText: "아니요",
        }).then((result) => {
          if (result.isConfirmed) {
            fnUserModify("userModify", e);
          }
        });
      } else {
        const full_email =
          email2_val_checker !== CM_CD_GROUP_ID_ETC
            ? email_val_checker + "@" + email2_val_checker
            : email_full_val_checker;

        axios
          .post("/api/cm/register?type=dplicheck", {
            is_Email: full_email,
          })
          .then((response) => {
            try {
              const dupli_count = response.data.json[0].num;
              if (dupli_count !== 0) {
                refEmail1.current.focus();
                CmAlert("이미 존재하는 이메일입니다.", "", "info", "닫기");
              } else {
                //
                Swal.fire({
                  title: "가입 하시겠습니까?",
                  text: "",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "예",
                  cancelButtonText: "아니요",
                }).then((result) => {
                  if (result.isConfirmed) {
                    fnSignInsert("signup", e);
                  }
                });
              }
            } catch (error) {
              CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
            }
          })
          .catch(() => {
            return false;
          });
      }
    }

    // 회원가입  처리
    const fnSignInsert = async (type) => {
      const full_email =
        email2_val_checker !== CM_CD_GROUP_ID_ETC
          ? userInfoJson.useremail1 + "@" + userInfoJson.useremail2
          : userInfoJson.userEmail;

      let insertJson = {
        ...userInfoJson,
        userEmail: full_email,
      };

      var Json_form = JSON.stringify(insertJson);
      // console.log(Json_form)
      //  return;

      try {
        const response = await fetch("/api/cm/register?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          CmAlert("회원가입이 완료되었습니다.", "", "info", "닫기", 3000);
          history.push(URL_USER_LOGIN);
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };
  };

  const changeValue = (e) => {

    const { name, value, type, checked } = e.target;
    console.log(type);
    if (type === "checkbox") {
      setUserInfoJson({ ...userInfoJson, useYn: checked ? "N" : "Y" });
    } else {
      setUserInfoJson({ ...userInfoJson, [name]: value });
    }
  };

  const checkedValue = userInfoJson.useYn === "N" ? { checked: true } : {};

  const modifyModeHidden =
    pathname.indexOf("modify") >= 0 ? {} : { hidden: true };

  return (
    <div className={styles.userFormBody}>
      <div className={styles.userFormBody__contents}>
        <Form method="post" name="frm">
          {formFrom === "modify" ? (
            // 수정일 경우
            <FormGroup>
              <Label for="userEmail">이메일</Label>
              <Input
                id="userEmail"
                name="userEmail"
                placeholder="이메일ID"
                type="userEmail"
                innerRef={refUserEmail}
                disabled
                value={userInfoJson.userEmail}
              />
            </FormGroup>
          ) : (
            // 등록일 경우
            <>
              <Row>
                <Col>
                  <Label>이메일</Label>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="useremail1" hidden>
                      이메일
                    </Label>
                    <Input
                      id="useremail1"
                      name="useremail1"
                      placeholder="이메일ID만 입력"
                      type="useremail1"
                      innerRef={refEmail1}
                      onChange={changeValue}
                      hidden={
                        refEmail2.current.value === CM_CD_GROUP_ID_ETC
                          ? true
                          : false
                      }
                    />
                    <FormText
                      hidden={
                        refEmail2.current.value === CM_CD_GROUP_ID_ETC
                          ? true
                          : false
                      }
                    >
                      이메일 ID만 입력
                    </FormText>

                    <Input
                      id="userEmail"
                      name="userEmail"
                      placeholder="XXXX@YYYY.ZZZZ"
                      type="userEmail"
                      innerRef={refUserEmail}
                      onChange={changeValue}
                      value={userInfoJson.userEmail}
                      hidden={
                        refEmail2.current.value === CM_CD_GROUP_ID_ETC
                          ? false
                          : true
                      }
                    />
                    <FormText
                      hidden={
                        refEmail2.current.value === CM_CD_GROUP_ID_ETC
                          ? false
                          : true
                      }
                    >
                      XXXX@도메인 형태로 이메일 주소 전체를 입력
                    </FormText>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="useremail2" hidden>
                      이메일 도메인
                    </Label>
                    <Input
                      id="useremail2"
                      name="useremail2"
                      type="select"
                      innerRef={refEmail2}
                      onChange={changeValue}
                    >
                      <option value="">@주소를 선택하세요.</option>
                      {cmCdList
                        .filter((item) => {
                          return item.cdGroupId === "emailList";
                        })
                        .map((one, index) => {
                          return (
                            <option key={index} value={one.cdId}>
                              @{one.cdNm}
                            </option>
                          );
                        })}
                      <option value={CM_CD_GROUP_ID_ETC}>직접입력</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}
          <FormGroup>
            <Label for="userPassword">
              비밀번호
              {formFrom === "modify" ? " (수정을 원할시 입력하세요)" : ""}
            </Label>
            <Input
              id="userPassword"
              name="userPassword"
              placeholder="비밀번호"
              type="password"
              innerRef={refUserPassword}
              onChange={changeValue}
              maxLength={16}
            />
            <FormText>8~16자 영문 대 소문자,숫자, 특수문자를 사용</FormText>
          </FormGroup>

          <FormGroup>
            <Label for="userPasswordCnf">비밀번호 확인</Label>
            <Input
              id="userPasswordCnf"
              name="userPasswordCnf"
              placeholder="비밀번호"
              type="password"
              innerRef={refUserPasswordCnf}
              onChange={changeValue}
              maxLength={16}
            />
          </FormGroup>

          <FormGroup>
            <Label for="userNickNameLabel">성명(별명)</Label>
            <Input
              id="userNickName"
              name="userNickName"
              placeholder="성명(별명)"
              type="text"
              innerRef={refUserNickName}
              value={userInfoJson.userNickName}
              onChange={changeValue}
              maxLength={10}
            />
          </FormGroup>

          <FormGroup {...modifyModeHidden}>
            <Label for="userLevel">레벨</Label>
            <Input
              id="userLevel"
              name="userLevel"
              placeholder="레벨"
              type="number"
              innerRef={refUserLevel}
              value={userInfoJson.userLevel}
              onChange={changeValue}
              maxLength={10}
            />
          </FormGroup>

          <FormGroup {...modifyModeHidden}>
            <Label for="useYn">사용여부</Label>
            <FormGroup check>
              <Input
                type="checkbox"
                name="useYn"
                id="useYn"
                value="N"
                onChange={changeValue}
                {...checkedValue}
              />
              <Label check>사용안함</Label>
            </FormGroup>
          </FormGroup>
        </Form>
      </div>
      <div>
        <Button onClick={submitClick} color="primary">
          {formFrom === "modify" ? "정보수정" : "회원가입"}
        </Button>
        {pathname.indexOf("modify") >= 0 ? (
          <>
            &nbsp;
            <Button
              color="secondary"
              onClick={() => {
                window.location.href = CmChangeJsonToSearchWithList(
                  URL_USER_LIST,
                  initSrchWordList
                );
              }}
            >
              리스트
            </Button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
