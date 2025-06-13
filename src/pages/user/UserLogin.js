import { useRef } from "react";
import {
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  FormText,
} from "reactstrap";
import styles from "./styles/index.module.scss";

import axios from "axios";
import cookie from "react-cookies";
import CmAlert from "../../hook/CmAlert";

import PasswordReset from "./components/PasswordReset";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function UserLogin() {

  const refEmail = useRef("");
  const refPassword = useRef("");

  // 로그인 버튼 클릭시 처리
  const submitClick = () => {
    const email_val = refEmail.current.value;
    const pwd_val = refPassword.current.value;

    if (email_val === "" || pwd_val === "") {
      CmAlert("이메일과 비밀번호를 확인해주세요.", "", "info", "닫기");
    } else {
      axios
        .post("/api/cm/loginForm?type=signin", {
          is_Email: email_val,
          is_Password: pwd_val,
        })
        .then((response) => {
          var userEmail = response.data.json[0].userEmail;
          var userNickName = response.data.json[0].userNickName;
          var userLevel = response.data.json[0].userLevel;

          var upw = response.data.json[0].userPassword;
          // console.log(response.data.json[0])
          if (userEmail !== null && userEmail !== "") {
            CmAlert("로그인 되었습니다.", "", "info", "닫기");
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 120);

            axios
              .post("/api/cm/loginForm?type=SessionState", {
                is_Email: userEmail,
                is_UserName: userNickName,
                is_UserLevel: userLevel,
              })
              .then((response) => {
                cookie.save("userEmail", response.data.token1, {
                  path: "/",
                  expires,
                });
                cookie.save("userNickName", response.data.token2, {
                  path: "/",
                  expires,
                });
                cookie.save("userLevel", response.data.token3, {
                  path: "/",
                  expires,
                });
                cookie.save("userIp", response.data.token4, {
                  path: "/",
                  expires,
                });
                cookie.save("userPassword", upw, { path: "/", expires });
              })
              .catch((error) => {
                CmAlert(
                  "작업중 오류가 발생하였습니다.",
                  error,
                  "error",
                  "닫기"
                );
              });

            setTimeout(function () {
              window.location.href = "/";
            }, 1000);
          } else {
            CmAlert("이메일과 비밀번호를 확인해주세요.", "", "info", "닫기");
          }
        })
        .catch(() => {
          CmAlert("이메일과 비밀번호를 확인해주세요.", "", "info", "닫기");
        });
    }
  };

  // 이메일일 입력 후 엔터키 눌렀을시 처리
  const emailKeyDown = (e) => {
    if (e.keyCode === 13 && refEmail.current.value !== "") {
      refPassword.current.focus();
    }
  };

  // 비밀번호 입력 후 엔터키 눌렀을시 처리
  const passwordKeyDown = (e) => {
    if (
      e.keyCode === 13 &&
      refEmail.current.value !== "" &&
      refPassword.current.value !== ""
    ) {
      submitClick();
    }
  };

  return (
    <main>
      <div className={styles.login}>
        <div className={styles.login__title}>로그인</div>
        <div className={styles.login__input}>
          {/* 로그인 폼 시작 */}
          <Form>
            <FormGroup floating>
              <Input
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                innerRef={refEmail}
                onKeyDown={(e) => {
                  emailKeyDown(e);
                }}
                maxLength={100}
              />
              <Label for="exampleEmail">이메일</Label>

              <FormFeedback>FormFeedback</FormFeedback>
              <FormText>예) abcd@XXXX.com</FormText>
            </FormGroup>{" "}
            <FormGroup floating>
              <Input
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                innerRef={refPassword}
                onKeyDown={(e) => {
                  passwordKeyDown(e);
                }}
                maxLength={16}
              />
              <Label for="examplePassword">비밀번호</Label>
              <FormFeedback>FormFeedback</FormFeedback>
              <FormText>8~16자 영문 대 소문자,숫자, 특수문자를 사용</FormText>
            </FormGroup>{" "}
          </Form>
        </div>
        <div className={styles.login__bottom}>
          <div>
            <Link to="/user/register" className="noUnderlineDefault">
              회원가입
            </Link>
          </div>
          <div>&nbsp;|&nbsp;</div>
          <div>
            <PasswordReset />
          </div>
        </div>
        <div></div>
        <div className={styles.login__buttons}>
          <Button block size="" onClick={submitClick}>
            로그인
          </Button>
        </div>
      </div>
    </main>
  );
}
