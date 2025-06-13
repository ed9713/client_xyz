import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  PopoverBody,
  PopoverHeader,
  Row,
  Spinner,
  UncontrolledPopover,
} from "reactstrap";
import CmAlert, { CmAlertConfirmMSg } from "../../../hook/CmAlert";
import axios from "axios";
import styles from "./Cd0000Form.module.scss";
import CmTitle from "../../../components/design/CmTemplate";
import Swal from "sweetalert2";
import { CmUserContext } from "../../../context/CmUserContext";
import {
  CM_CD_GROUP_ID_ETC,
  CM_LOGIN_NOT_CHECK,
  CmChangeJsonToSearchWithList,
  CmChangeSearchToJson,
  CmClearInValidClassName,
  CmShowInValidMessage,
  URL_CD_LIST,
} from "../../../components/js/Common";

export default function CdModifyForm(props) {
  let formFrom = props.formFrom ? props.formFrom : "signUp";
  const history = useHistory();
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  let cdSeq =
    props && props.match && props.match.params && props.match.params.cdSeq
      ? props.match.params.cdSeq
      : "";
  let cdId =
    props && props.match && props.match.params && props.match.params.cdId
      ? props.match.params.cdId
      : "";
  if (cdSeq && cdId) {
  } else {
    formFrom = "signUp";
    cdSeq = "";
    cdId = "";
  }

  // frm 이름 및 입력값 오류 체크할 컬럼
  const defaultFrmId = `frmCmCd`;
  const inValidCkList = ["cdGroupId", "cdGroupIdText", "cdId", "cdNm"];

  // useState
  // 코드 정보 데이터
  const defaultCmCdJson = {
    cdSeq: "0", // 코드seq
    cdGroupId: "", // 코드그룹
    cdId: "", // 코드id
    cdNm: "", // 코드이름
    cdDesc: "", // 기타
    useYn: "Y", // 사용여부
    cdAttr01: "", // attr01-100자
    cdAttr02: "", // attr02
    cdAttr03: "", // attr03
    cdAttr04: "", // attr04
    cdAttr05: "", // attr05
    cdAttr11: "", // attr11-1000자
    cdAttr12: "", // attr12
    cdAttr13: "", // attr13
    cdAttr14: "", // attr14
    cdAttr15: "", // attr15
    cdAttr21: 0, // attr21-숫자
    cdAttr22: 0, // attr22
    cdAttr23: 0, // attr23
    cdAttr24: 0, // attr24
    cdAttr25: 0, // attr25
    createId: myCtxtCmUser.userEmail,
    updateId: myCtxtCmUser.userEmail,
    cdGroupIdText: "", // 코드그룹_텍스트
  };

  const [sttCmCdJson, setSttCmCdJson] = useState(defaultCmCdJson);
  const [spinnerHidden, setSpinnerHidden] = useState(true);
  const [cmCdList, setCmCdList] = useState([]);
  

  const initSrchWordList = useMemo(() => {
    return CmChangeSearchToJson(props.location.search.replace("?", ""));
  }, [props.location.search]);

  // 로딩시 데이터 가져오기
  useEffect(() => {
    if (formFrom === "modify") {
      setSpinnerHidden(false);

      axios
        .post("/api/cm/cdForm?type=detail", {
          cdSeq: cdSeq,
          cdId: cdId,
        })
        .then((response) => {
          try {
            setSpinnerHidden(true);
            const result = response.data;
            // console.log(result.json);
            // console.log(`총 ${result.json.length}`)
            if (result.json.length !== 1) {
              CmAlert(
                "해당건이 없습니다.\n리스트로 이동합니다.",
                "",
                "info",
                "닫기",
                3000
              );
              setTimeout(function () {
                gotoList();
              }, 1000);
            } else {
              setSttCmCdJson(result.json[0]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 공통코드
  useEffect(() => {
    getListByGroupId("CmCdModify");
  }, []);


  //===================================================================
  const getListByGroupId = (pKind) => {
    pKind = "CmCdModify";

    let insertJson = { useYn: "Y" };
    let cdGroupIdList = "";
    let cdGroupIdYn = "N";
    switch (pKind) {
      case "CmCdList":
        cdGroupIdList = "orderByColCmCd";
        cdGroupIdYn = "Y";
        break;
      case "CmCdModify":
        cdGroupIdYn = "Y";
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

  // ref 들
  const refCdGroupId = useRef(); //	코드그룹
  const refCdId = useRef(); //	코드id
  const refCdNm = useRef(); //	코드이름
  const refCdDesc = useRef(); //	기타
  const refCdAttr01 = useRef(); //	attr01-100자
  const refCdAttr02 = useRef(); //	attr02
  const refCdAttr03 = useRef(); //	attr03
  const refCdAttr04 = useRef(); //	attr04
  const refCdAttr11 = useRef(); //	attr11-1000자
  const refCdAttr12 = useRef(); //	attr12
  const refCdAttr21 = useRef(); //	attr21-숫자
  const refCdAttr22 = useRef(); //	attr22
  const refCdGroupIdText = useRef();

  // 함수
  const gotoList = () => {
    // history.push("/cm/cd/list");
    history.push(CmChangeJsonToSearchWithList(URL_CD_LIST, initSrchWordList));
  };

  // 등록하기 버튼 클릭시
  const submitClick = async (type, e) => {
    // 입력값 체크
    const fnValidate = () => {
      let bSignup = formFrom === "modify" ? false : true;
      var pattern3_1 = /[~!@#$%^&*()+|<>?:{}]/;
      var pattern4 = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글

      let alertKind = "alert";
      let cntInValidColumn = 0;

      // 입력값 오류 스타일 시트 제거
      CmClearInValidClassName(defaultFrmId, inValidCkList);

      if (bSignup) {
        if (sttCmCdJson.cdGroupId === CM_CD_GROUP_ID_ETC) {
          if (sttCmCdJson.cdGroupIdText === "") {
            CmShowInValidMessage(
              alertKind,
              defaultFrmId,
              "cdGroupIdText",
              "코드그룹 직접등록을 다시 확인해주세요.",
              refCdGroupIdText
            );
            cntInValidColumn++;
            if (alertKind === "alert") {
              return false;
            }
          }

          if (sttCmCdJson.cdGroupIdText.search(/\s/) !== -1) {
            CmShowInValidMessage(
              alertKind,
              defaultFrmId,
              "cdGroupIdText",
              "코드그룹에 공백을 제거해 주세요.",
              refCdGroupIdText
            );
            cntInValidColumn++;
            if (alertKind === "alert") {
              return false;
            }
          }

          if (
            pattern3_1.test(sttCmCdJson.cdGroupIdText) ||
            pattern4.test(sttCmCdJson.cdGroupIdText)
          ) {
            CmShowInValidMessage(
              alertKind,
              defaultFrmId,
              "cdGroupIdText",
              "코드그룹은 영문 대 소문자\n숫자를 사용하세요",
              refCdGroupIdText
            );
            cntInValidColumn++;
            if (alertKind === "alert") {
              return false;
            }
          }
        } else {
          if (sttCmCdJson.cdGroupId === "") {
            CmShowInValidMessage(
              alertKind,
              defaultFrmId,
              "cdGroupIdText",
              "코드그룹을 다시 확인해주세요.",
              refCdGroupId
            );
            cntInValidColumn++;
            if (alertKind === "alert") {
              return false;
            }
          }
        }
      }

      // 코드
      if (sttCmCdJson.cdId === "") {
        CmShowInValidMessage(
          alertKind,
          defaultFrmId,
          "cdId",
          "코드를 확인해주세요.",
          refCdId
        );
        cntInValidColumn++;
        if (alertKind === "alert") {
          return false;
        }
      }

      if (sttCmCdJson.cdId.search(/\s/) !== -1) {
        CmShowInValidMessage(
          alertKind,
          defaultFrmId,
          "cdId",
          "코드ID에 공백을 제거해 주세요.",
          refCdId
        );
        cntInValidColumn++;
        if (alertKind === "alert") {
          return false;
        }
      }

      if (
        pattern3_1.test(sttCmCdJson.cdId) ||
        pattern4.test(sttCmCdJson.cdId)
      ) {
        CmShowInValidMessage(
          alertKind,
          defaultFrmId,
          "cdId",
          "코드ID는 영문 대 소문자\n숫자를 사용하세요",
          refCdId
        );
        cntInValidColumn++;
        if (alertKind === "alert") {
          return false;
        }
      }

      // 코드이름
      if (sttCmCdJson.cdNm === "") {
        CmShowInValidMessage(
          alertKind,
          defaultFrmId,
          "cdNm",
          "코드이름을 확인해주세요.",
          refCdNm
        );
        cntInValidColumn++;
        if (alertKind === "alert") {
          return false;
        }
      }

      if (cntInValidColumn > 0) {
        return false;
      } else {
        return true;
      }
    };

    // 수정 처리
    const fnModify = async (type) => {
      let insertJson = {
        ...sttCmCdJson,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };
      let Json_form = JSON.stringify(insertJson);
      // console.log(insertJson);
      try {
        const response = await fetch("/api/cm/cdForm?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          CmAlert("코드정보 수정이 완료되었습니다.", "", "info", "닫기");
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // 등록  처리
    const fnSignInsert = async (type) => {
      let insertJson = {
        ...sttCmCdJson,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };
      if (sttCmCdJson.cdGroupId === CM_CD_GROUP_ID_ETC) {
        insertJson = { ...sttCmCdJson, cdGroupId: sttCmCdJson.cdGroupIdText };
      }

      let Json_form = JSON.stringify(insertJson);

      try {
        const response = await fetch("/api/cm/cdForm?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);

        if (resultJson.resultCd === "succ") {
          const insertId = resultJson.insertId;
          CmAlert(
            "코드정보 등록이 완료되었습니다. 수정페이지로 이동합니다.",
            "",
            "info",
            "닫기",
            3000
          );
          setTimeout(function () {
            history.push(`/cm/cd/modify/${insertId}/${sttCmCdJson.cdId}`);
          }, 1000);
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // 실제 처리
    if (fnValidate()) {
      if (formFrom === "modify") {
        //
        Swal.fire({
          title: "수정 하시겠습니까?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "예",
          cancelButtonText: "아니요",
        }).then((result) => {
          if (result.isConfirmed) {
            fnModify("modify", e);
          }
        });
      } else {
        // const full_email = email_val_checker+'@'+email2_val_checker
        axios
          .post("/api/cm/cdForm?type=dpliCheck", {
            cdGroupId: sttCmCdJson.cdGroupId,
            cdId: sttCmCdJson.cdId,
          })
          .then((response) => {
            try {
              const dupli_count = response.data.json[0].num;
              if (dupli_count !== 0) {
                refCdId.current.focus();
                CmAlert("이미 존재하는 코드입니다.", "", "info", "닫기");
              } else {
                //
                Swal.fire({
                  title: "등록 하시겠습니까?",
                  text: "",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "예",
                  cancelButtonText: "아니요",
                }).then((result) => {
                  if (result.isConfirmed) {
                    fnSignInsert("signUp", e);
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
  };

  // 삭제 버튼 클릭시
  const deleteClick = async (type, e) => {
    //  삭제 처리
    const fnDelete = async () => {
      let insertJson = {
        cdSeq: cdSeq,
        updateId: myCtxtCmUser.userEmail,
      };
      let Json_form = JSON.stringify(insertJson);
      try {
        const response = await fetch("/api/cm/cdForm?type=delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          CmAlert("삭제가 완료되었습니다.", "", "info", "닫기", 3000);
          setTimeout(function () {
            // window.location.href = URL_BC_LIST;
            window.location.href = CmChangeJsonToSearchWithList(
              URL_CD_LIST,
              initSrchWordList
            );
          }, 1000);
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // 실제 처리
    Swal.fire(CmAlertConfirmMSg("삭제 하시겠습니까?")).then((result) => {
      if (result.isConfirmed) {
        fnDelete("modify", e);
      }
    });
  };

  // 값들 변경시
  const changeValue = (e) => {
    const { name, value, type, checked } = e.target;
    let newState = { ...sttCmCdJson };
    if (name === "cdGroupId") {
      if (value !== CM_CD_GROUP_ID_ETC) {
        newState = { ...newState, cdGroupIdText: "" };
      }
    }

    if (type === "checkbox") {
      newState = { ...newState, useYn: checked ? "N" : "Y" };
    } else {
      newState = { ...newState, [name]: value };
    }

    setSttCmCdJson(newState);
  };

  const checkedValue = sttCmCdJson.useYn === "N" ? { checked: true } : {};

  return (
    <>
      <div className={styles.cd0000FormBody}>
        <Spinner color="primary" hidden={spinnerHidden}>
          Loading...
        </Spinner>
        <div
          className={styles.cd0000FormBody__contents}
          hidden={!spinnerHidden}
        >
          <form name={defaultFrmId} id={defaultFrmId}>
            <CmTitle title="기본" />
            <>
              <FormGroup>
                <Label for="cdGroupId">* 코드그룹</Label>
                <Input
                  id="cdGroupId"
                  name="cdGroupId"
                  type="select"
                  onChange={(e) => changeValue(e)}
                  innerRef={refCdGroupId}
                  disabled={formFrom === "modify" ? true : false}
                  value={sttCmCdJson.cdGroupId}
                >
                  <option value="">선택하세요.</option>
                  {cmCdList
                    .filter((item) => {
                      return item.cdGroupId === "cdGroupId";
                    })
                    .map((one, index) => {
                      return (
                        <option key={index} value={one.cdId}>
                          {one.cdNm}
                        </option>
                      );
                    })}
                  <option value={CM_CD_GROUP_ID_ETC}>직접입력</option>
                </Input>

                <Input
                  innerRef={refCdGroupIdText}
                  id="cdGroupIdText"
                  name="cdGroupIdText"
                  placeholder="코드그룹 직접등록 - 공백없이 영문 및 숫자만 입력하세요"
                  type="text"
                  onChange={(e) => changeValue(e)}
                  value={sttCmCdJson.cdGroupIdText}
                  maxLength="20"
                  hidden={
                    sttCmCdJson.cdGroupId === CM_CD_GROUP_ID_ETC ? false : true
                  }
                />
                <FormFeedback>코드그룹을 바르게 입력하세요.</FormFeedback>
                <FormText>
                  코드그룹에서 직접입력시 그룹을 입력할 수 있습니다.{" "}
                </FormText>
              </FormGroup>

              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="cdId">* 코드ID</Label>
                    <Input
                      id="cdId"
                      name="cdId"
                      placeholder="코드ID"
                      type="text"
                      maxLength="20"
                      value={sttCmCdJson.cdId}
                      innerRef={refCdId}
                      onChange={(e) => changeValue(e)}
                      disabled={formFrom === "modify" ? true : false}
                    />
                    <FormFeedback>코드ID를 바르게 입력하세요.</FormFeedback>
                    <FormText>공백없이 영문 및 숫자만 입력</FormText>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <Label for="useYn">사용여부</Label>
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      name="useYn"
                      id="useYn"
                      value="N"
                      onChange={(e) => changeValue(e)}
                      {...checkedValue}
                    />
                    <Label check>사용안함</Label>
                  </FormGroup>
                  <Label>&nbsp;</Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdNm">* 코드이름</Label>
                    <Input
                      id="cdNm"
                      name="cdNm"
                      placeholder="코드이름"
                      type="text"
                      maxLength="40"
                      value={sttCmCdJson.cdNm}
                      innerRef={refCdNm}
                      onChange={(e) => changeValue(e)}
                    />
                    <FormFeedback>코드이름을 바르게 입력하세요.</FormFeedback>
                    <FormText hidden>공백없이 영문,숫자로 입력</FormText>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="cdDesc">기타</Label>
                <Input
                  id="cdDesc"
                  name="cdDesc"
                  placeholder="기타"
                  type="text"
                  maxLength="200"
                  value={sttCmCdJson.cdDesc}
                  innerRef={refCdDesc}
                  onChange={(e) => changeValue(e)}
                />
              </FormGroup>

              {/* attr1 */}
              <Label>
                attr01~attr03 - 100자 &nbsp;
                <Button id="PopoverAttr0" type="button" color="info" size="sm">
                  i
                </Button>
                <UncontrolledPopover placement="bottom" target="PopoverAttr0">
                  <PopoverHeader>attr1X 사용처</PopoverHeader>
                  <PopoverBody>
                    그룹코드 channel
                    <br />
                    attr01 : 홈페이지
                    <br />
                    attr02 : 메인캐스트
                    <br />
                    <br />
                    그룹코드 people
                    <br />
                    attr01 : 상세 추가
                    <br />
                    attr02 : 메인캐스트 채널정보
                    <br />
                    attr03 : 게스트그룹 연결된 conner 정보
                    <br />
                    <br />
                    그룹코드 conner
                    <br />
                    attr01 : 연결 채널 정보
                    <br />
                    attr02 : 게스트그룹 사용 여부
                  </PopoverBody>
                </UncontrolledPopover>
              </Label>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr01" hidden>
                      cdAttr01
                    </Label>
                    <Input
                      id="cdAttr01"
                      name="cdAttr01"
                      placeholder="cdAttr01"
                      type="text"
                      maxLength="100"
                      value={sttCmCdJson.cdAttr01}
                      innerRef={refCdAttr01}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr02" hidden>
                      cdAttr02
                    </Label>
                    <Input
                      id="cdAttr02"
                      name="cdAttr02"
                      placeholder="cdAttr02"
                      type="text"
                      maxLength="100"
                      value={sttCmCdJson.cdAttr02}
                      innerRef={refCdAttr02}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr03" hidden>
                      cdAttr03
                    </Label>
                    <Input
                      id="cdAttr03"
                      name="cdAttr03"
                      placeholder="cdAttr03"
                      type="text"
                      maxLength="100"
                      value={sttCmCdJson.cdAttr03}
                      innerRef={refCdAttr03}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr04" hidden>
                      cdAttr04
                    </Label>
                    <Input
                      id="cdAttr04"
                      name="cdAttr04"
                      placeholder="cdAttr04"
                      type="text"
                      maxLength="100"
                      value={sttCmCdJson.cdAttr04}
                      innerRef={refCdAttr04}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* attr11 */}
              <Label for="exampleEmail">
                attr11~attr12 - 1000자 &nbsp;
                <Button id="PopoverAttr1" type="button" color="info" size="sm">
                  i
                </Button>
                <UncontrolledPopover placement="bottom" target="PopoverAttr1">
                  <PopoverHeader>attr1X 사용처</PopoverHeader>
                  <PopoverBody>
                    attr11 : XXX테이블에서 사용 attr12 : XXX테이블에서 사용ㅇㅇ
                  </PopoverBody>
                </UncontrolledPopover>
              </Label>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr11" hidden>
                      cdAttr11
                    </Label>
                    <Input
                      id="cdAttr11"
                      name="cdAttr11"
                      placeholder="cdAttr11"
                      type="text"
                      maxLength="100"
                      value={sttCmCdJson.cdAttr11}
                      innerRef={refCdAttr11}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr12" hidden>
                      cdAttr12
                    </Label>
                    <Input
                      id="cdAttr12"
                      name="cdAttr12"
                      placeholder="cdAttr12"
                      type="text"
                      maxLength="100"
                      value={sttCmCdJson.cdAttr12}
                      innerRef={refCdAttr12}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* attr21 */}
              <Label for="exampleEmail">
                attr21~attr22 - int &nbsp;
                <Button id="PopoverAttr2" type="button" color="info" size="sm">
                  i
                </Button>
                <UncontrolledPopover placement="bottom" target="PopoverAttr2">
                  <PopoverHeader>attr1X 사용처</PopoverHeader>
                  <PopoverBody>
                    attr11 : XXX테이블에서 사용
                    <br />
                    attr11 : XXX테이블에서 사용
                    <br />
                    attr11 : XXX테이블에서 사용
                    <br />
                    attr11 : XXX테이블에서 사용
                    <br />
                    attr12 : XXX테이블에서 사용ㅇㅇ
                  </PopoverBody>
                </UncontrolledPopover>
              </Label>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr21" hidden>
                      cdAttr21
                    </Label>
                    <Input
                      id="cdAttr21"
                      name="cdAttr21"
                      placeholder="cdAttr21"
                      type="number"
                      value={sttCmCdJson.cdAttr21}
                      innerRef={refCdAttr21}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cdAttr22" hidden>
                      cdAttr22
                    </Label>
                    <Input
                      id="cdAttr22"
                      name="cdAttr22"
                      placeholder="cdAttr22"
                      type="number"
                      value={sttCmCdJson.cdAttr22}
                      innerRef={refCdAttr22}
                      onChange={(e) => changeValue(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </>
          </form>
        </div>
        <div>
          <Button color="primary" onClick={submitClick}>
            {formFrom === "modify" ? "수정" : "등록"}
          </Button>
          {formFrom === "modify" ? (
            <>
              &nbsp;&nbsp;
              <Button
                color="danger"
                onClick={() => {
                  deleteClick();
                }}
              >
                삭제
              </Button>
              &nbsp;&nbsp;
              <Button
                onClick={() => {
                  history.push("/cm/cd/register");
                }}
              >
                등록페이지로
              </Button>
            </>
          ) : (
            ""
          )}
          &nbsp;&nbsp;
          <Button onClick={gotoList}>리스트로</Button>
        </div>
      </div>
    </>
  );
}
