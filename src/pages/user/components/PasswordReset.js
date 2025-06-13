import { useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";
import styles from "./PasswordReset.module.scss";
import { CM_HOME_PAGE_NAME } from "../../../components/js/Common";

export default function PasswordReset(props) {
  // 모달창 사용
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const backdrop = false;

  // 화면에서 사용
  const [statebar, setStatebar] = useState(false);
  const refResetEmail = useRef("");
  const refResetName = useRef("");

  // 이메일 및 성명으로 회원 여부 체크
  const pwdResetConfim = () => {
    const reset_email = refResetEmail.current.value;
    const reset_name = refResetName.current.value;
    if (reset_email === "" || reset_name === "") {
      CmAlert("이메일과 성명을 확인해주세요.[1]", "", "info", "닫기");
    } else {
      axios
        .post("/api/cm/loginForm?type=pwreset", {
          is_Email: reset_email,
          is_Name: reset_name,
        })
        .then((response) => {
          var data = response.data.json;
          if (data.length === 1) {
            var userPassword = response.data.json[0].userPassword;
            userPassword = userPassword.replace(/\//gi, "가");
            if (userPassword !== null && userPassword !== "") {
              setStatebar(true);
              sendEmail(
                reset_email,
                CM_HOME_PAGE_NAME + " 비밀번호 재설정 메일",
                userPassword
              );
            } else {
              CmAlert("이메일과 성명을 확인해주세요.[3]", "", "info", "닫기");
            }
          } else {
            CmAlert(
              "해당 정보가 없습니다. <br/>이메일과 성명을 다시 확인해주세요.[4]",
              "",
              "info",
              "닫기"
            );
          }
        })
        .catch((error) => {
          console.log(error);
          CmAlert("이메일과 성명을 확인해주세요.[5]", "", "info", "닫기");
        });
    }
  };

  const sendEmail = (email, subject, password) => {
    axios
      .post("/api/mail", {
        is_Email: email,
        is_Subject: subject,
        is_Password: password,
      })
      .then((response) => {
        const resultJson = response.data;
        console.log(resultJson);
        if (resultJson.resultCd === "succ") {
          // if(response.data == "succ"){
          CmAlert(
            "입력하신 이메일로 비밀번호 \n" + "재설정 메일 보내드렸습니다.",
            "",
            "info",
            "닫기"
          );
          setStatebar(false);
          setModal(false);
        } else {
          CmAlert("작업중 오류가 발생하였습니다.", "", "error", "닫기");
          setStatebar(false);
        }
      })
      .catch((error) => {
        CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        setStatebar(false);
      });
  };

  // 이메일 입력 후 엔터키 눌렀을시 처리
  const resetEmailKeyDown = (e) => {
    if (e.keyCode === 13 && refResetEmail.current.value !== "") {
      refResetName.current.focus();
    }
  };

  // 성명 입력 후 엔터키 눌렀을시 처리
  const resetNameKeyDown = (e) => {
    if (
      e.keyCode === 13 &&
      refResetEmail.current.value !== "" &&
      refResetName.current.value !== ""
    ) {
      pwdResetConfim();
    }
  };

  return (
    <>
      <div onClick={toggle}>
        <a href="#" className="noUnderlineDefault">
          비밀번호 재설정
        </a>
      </div>

      <Modal
        isOpen={modal}
        toggle={toggle}
        backdrop={backdrop}
        centered
        {...props}
      >
        <ModalHeader toggle={toggle}>비밀번호 재설정</ModalHeader>
        <ModalBody>
          <div className={styles.passwordResetBody}>
            <div className={styles.passwordResetBody__input}>
              <FormGroup floating>
                <Input
                  id="reset_email"
                  name="reset_email"
                  placeholder="이메일"
                  type="email"
                  innerRef={refResetEmail}
                  onKeyDown={(e) => {
                    resetEmailKeyDown(e);
                  }}
                />
                <Label for="reset_email">이메일</Label>
              </FormGroup>{" "}
              <FormGroup floating>
                <Input
                  id="reset_name"
                  name="reset_name"
                  placeholder="성명"
                  innerRef={refResetName}
                  onKeyDown={(e) => {
                    resetNameKeyDown(e);
                  }}
                />
                <Label for="reset_name">성명</Label>
              </FormGroup>{" "}
              <div className={styles.passwordResetBody__statebar}>
                {statebar ? <Spinner>Loading...</Spinner> : ""}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={pwdResetConfim}>
            확인
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
