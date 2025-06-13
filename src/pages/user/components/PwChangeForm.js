import { useEffect, useRef } from "react";
import { Button, Form, Input, Label, FormGroup } from "reactstrap";
import styles from "./PwChangeForm.module.scss";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";

export default function PwChangeForm(props) {
  const refPassword = useRef("");
  const refPasswordCnf = useRef("");

  // const [emailState, setEmailState] = useState(props.match.params.email);
  // const [tokenState, setTokenState] = useState(props.match.params.token);

  const emailState = props.match.params.email;
  const tokenState = props.match.params.token;

  // 주소 유효 여부 체크
  useEffect(() => {
    let token = tokenState.replace(/가/gi, "/");
    axios
      .post("/api/cm/loginForm?type=emailtoken", {
        is_Email: emailState,
        is_Token: token,
      })
      .then((response) => {
        if (response.data.json[0].userEmail === undefined) {
          window.location.replace("about:blank");
        }
      })
      .catch((error) => {
        CmAlert("유효한 접속이 아닙니다.", error, "error", "닫기");
        setTimeout(function () {
          window.location.replace("about:blank");
        }, 1000);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 버튼 클릭시 처리
  const submitClick = async () => {
    const pwd_val_checker = refPassword.current.value;
    const pwd_cnf_val_checker = refPasswordCnf.current.value;

    const fnValidate = () => {
      var pattern1 = /[0-9]/;
      var pattern2 = /[a-zA-Z]/;
      var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

      if (pwd_val_checker === "") {
        refPassword.current.focus();
        CmAlert("비밀번호를 입력해주세요.", "", "info", "닫기");
        return false;
      }
      if (pwd_val_checker !== "") {
        var str = pwd_val_checker;
        if (str.search(/\s/) !== -1) {
          refPassword.current.focus();
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
          refPassword.current.focus();
          CmAlert(
            "8~16자 영문 대 소문자, 숫자\n 특수문자를 사용하세요.",
            "",
            "info",
            "닫기"
          );
          return false;
        }
      }

      if (pwd_cnf_val_checker === "") {
        refPasswordCnf.current.focus();
        CmAlert("비밀번호 확인을 입력해주세요.", "", "info", "닫기");
        return false;
      }
      if (pwd_val_checker !== pwd_cnf_val_checker) {
        refPasswordCnf.current.focus();
        CmAlert("비밀번호가 일치하지 않습니다.", "", "info", "닫기");
        return false;
      }

      return true;
    };

    if (fnValidate()) {
      const updatePwdUser = refPassword.current.value;
      var jsonstr = {
        is_Useremail: emailState,
        is_Password: updatePwdUser,
      };

      var Json_form = JSON.stringify(jsonstr);

      try {
        const response = await fetch("/api/cm/register?type=pwdmodify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });
        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          CmAlert(
            "비밀번호 수정이 완료되었습니다.",
            "",
            "success",
            "닫기",
            3000
          );
          setTimeout(() => {
            props.history.push("/");
          }, 1500);
        } else {
          CmAlert("작업 중 오류가 발생하였습니다.", "", "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업 중 오류가 발생하였습니다.", error, "error", "닫기");
      }
    }
  };

  // 이메일일 입력 후 엔터키 눌렀을시 처리
  const pwdKeyDown = (e) => {
    if (e.keyCode === 13 && refPassword.current.value !== "") {
      refPasswordCnf.current.focus();
    }
  };

  return (
    <>
      <div className={styles.pwChangeForm}>
        <div className={styles.pwChangeForm__title}>비밀번호재설정</div>
        <div className={styles.pwChangeForm__input}>
          {/* 로그인 폼 시작 */}
          <Form>
            <FormGroup floating>
              <Input
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                innerRef={refPassword}
                onKeyDown={(e) => {
                  pwdKeyDown(e);
                }}
              />
              <Label for="examplePassword">비밀번호</Label>
            </FormGroup>{" "}
            <FormGroup floating>
              <Input
                id="passwordCnf"
                name="passwordCnf"
                placeholder="Password"
                type="password"
                innerRef={refPasswordCnf}
              />
              <Label for="examplePassword">비밀번호 확인</Label>
            </FormGroup>{" "}
          </Form>
        </div>

        <div></div>
        <div className={styles.pwChangeForm__buttons}>
          <Button block size="" onClick={submitClick}>
            변경
          </Button>
        </div>
      </div>
    </>
  );
}
