import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from "reactstrap";
import styles from "./Bc0000Form.module.scss";
import BcModifyFormGuest from "./BcModifyFormGuest";
import { CmPageCmCdListContext } from "../../../context/CmPageCmCdListContext";
import { CmSelectOptionNoValue } from "../../../components/design/CmTemplate";
import { CmUserContext } from "../../../context/CmUserContext";
import {
  BC_SAVE_TT_END,
  BC_SAVE_TT_FAIL,
  BC_SAVE_TT_ING,
  BC_SAVE_TT_PRE,
  BC_SAVE_TT_SUCCESS,
  BC_VALIDATION_TT_END,
  BC_VALIDATION_TT_FAIL,
  BC_VALIDATION_TT_ING,
  BC_VALIDATION_TT_PRE,
  BC_VALIDATION_TT_SUCCESS,
  CM_CD_NEW_TEMP_SEQ_MAX,
  CM_LOGIN_NOT_CHECK,
  CmChangeTextareaValue,
  CmChangeValue,
  CmClearInValidClassName,
  CmIsNull,
  CmSetTextareaValue,
  CmShowInValidMessage,
} from "../../../components/js/Common";
import CmAlert, { CmAlertConfirmMSg } from "../../../hook/CmAlert";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BcTimeTableListContext } from "../../../context/BcTimeTableListContext";
import Swal from "sweetalert2";

export default function BcModifyFormConnerItem(props) {
  const item = props.item;
  // console.log(item)

  const paramChannelId =
    props && props.bcBasicData && props.bcBasicData.channelId
      ? props.bcBasicData.channelId
      : null;

  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  const { ctxtBcTimeTableList, setCtxtBcTimeTableList } = useContext(
    BcTimeTableListContext
  );

  // 공통코드 리스트
  const { ctxtCmPageCmCdList } = useContext(CmPageCmCdListContext);

  // useRef
  const refConnerTitle = useRef();
  const refSaveResult = useRef();

  // 데이터 타입
  const defaultOneJson = {
    rowNum: item.rowNum,
    timeTableSeq: item.timeTableSeq
      ? item.timeTableSeq
      : props.timeTableSeq
      ? props.timeTableSeq
      : 0, // 타임테이블seq
    newTimeTableSeq: item.newTimeTableSeq
      ? item.newTimeTableSeq
      : item.timeTableSeq,
    broadcastSeq: item.broadcastSeq, // 방송정보seq
    channelId: item.channelId, //
    timeTableOrderSeq: item.timeTableOrderSeq, // 순번
    timeStartSec: CmIsNull(item.timeStartSec), // 유튜브 시간정보
    connerId: CmIsNull(item.connerId), // 코너정보seq
    connerTitle: CmIsNull(CmSetTextareaValue(item.connerTitle)), // 제목
    timeTableContents: CmIsNull(CmSetTextareaValue(item.timeTableContents)), // 내용
    // linkInfoSeq: CmIsNull(item.linkInfoSeq, 0), // 링크정보seq
    linkInfoSeq: 0, // 링크정보seq
    deleteYn: "N",
    createId: myCtxtCmUser.userEmail,
    updateId: myCtxtCmUser.userEmail,
  };

  // 코너 정보 jsonData
  const [sttDefaultOneJson, setSttDefaultOneJson] = useState(defaultOneJson);

  // =============================
  // redux 사용
  // 11. dispatch
  const dispatchBcModifyFormConnerItem = useDispatch();

  // 5. root 에 있는 number 값을 사용하고 싶다.
  function fnShowActionModify(state) {
    return state.actionBcModify;
  }
  // 6 selector 를 사용한다.
  // selector 는 함수를 받는다.
  const rdxActionBcModify = useSelector(fnShowActionModify); // 이것도 가능
  const rdxTotalCnt = useSelector((state) => state.totalCnt); // 이것도 가능
  const rdxSuccessCnt = useSelector((state) => state.successCnt); // 이것도 가능
  const rdxFailCnt = useSelector((state) => state.failCnt); // 이것도 가능

  //=====================================================
  const defaultFrmId = `frmConnerItem${sttDefaultOneJson.timeTableSeq}`;
  const inValidCkList = ["connerTitle", "connerId", "timeTableOrderSeq"];

  //=====================================================
  // validation
  const fnValidate = () => {
    let alertKind =
      rdxActionBcModify.indexOf(BC_VALIDATION_TT_ING) >= 0
        ? "alertXX"
        : "alert";
    let cntInValidColumn = 0;

    // 입력값 오류 스타일 시트 제거
    CmClearInValidClassName(defaultFrmId, inValidCkList);

    // 삭제건이면 입력값 체크를 하지 않는다.
    if (sttDefaultOneJson.deleteYn === "Y") {
      return true;
    }

    // 코너정보
    if (sttDefaultOneJson.connerId === "") {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "connerId",
        "코너정보를 확인해주세요.",
        null
      );
      cntInValidColumn++;
      if (alertKind === "alert") {
        return false;
      }
    }

    // 제목
    if (sttDefaultOneJson.connerTitle === "") {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "connerTitle",
        "제목을 확인해주세요.",
        refConnerTitle
      );
      cntInValidColumn++;
      if (alertKind === "alert") {
        return false;
      }
    }

    // 순번
    if (sttDefaultOneJson.timeTableOrderSeq === "") {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "timeTableOrderSeq",
        "순번을 확인해주세요.",
        null
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

  //=====================================================
  // fnValidateRdx
  const fnValidateRdx = () => {
    // 실제 처리
    refSaveResult.current.value = "";
    if (fnValidate()) {
      refSaveResult.current.value = "succ";
    } else {
      refSaveResult.current.value = "fail";
    }
  };

  //=====================================================
  // 입력값 체크 후 결과값에 따라 redux 값 변경 처리
  useEffect(() => {
    const validationValue = refSaveResult.current.value;
    refSaveResult.current.value = "";

    if (rdxActionBcModify.indexOf(BC_VALIDATION_TT_PRE) >= 0) {
      if (validationValue === "succ") {
        dispatchBcModifyFormConnerItem({ type: BC_VALIDATION_TT_SUCCESS });
      } else if (validationValue === "fail") {
        dispatchBcModifyFormConnerItem({ type: BC_VALIDATION_TT_FAIL });
      }
    } else if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
      if (validationValue === "succ") {
        dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_SUCCESS });
      } else if (validationValue === "fail") {
        dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_FAIL });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rdxActionBcModify]);

  //=====================================================
  // 등록하기 버튼 클릭시 back

  //=====================================================
  // 등록하기 버튼 클릭시 back
  const submitClick = async (type, e) => {
    // 실제 처리
    if (fnValidate(e)) {
      console.log("저장 전 submitClick");

      Swal.fire(CmAlertConfirmMSg("저장 하시겠습니까?")).then((result) => {
        if (result.isConfirmed) {
          saveDb(type, e);
        }
      });
    } else {
      console.log(" 입력값 오류 submitClick ");
    }
  };

  //=====================================================
  // 등록하기 버튼 클릭시 back
  const saveDb = async (type, e) => {
    // --------------------------------------------------------------
    // 삭제 처리
    const fnDelete = async () => {
      let insertJson = {
        broadcastSeq: sttDefaultOneJson.broadcastSeq,
        timeTableSeq: sttDefaultOneJson.timeTableSeq,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };

      let Json_form = JSON.stringify(insertJson);

      try {
        const response = await fetch("/api/ytb/bcForm?type=deleteTt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
            console.log("삭제가 완료되었습니다.");
            dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_SUCCESS });
          } else {
            CmAlert("삭제가 완료되었습니다.", "", "info", "닫기", 3000);
          }
        } else {
          if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
            console.log("작업중 오류가 발생하였습니다.[1]");
            dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_FAIL });
          } else {
            CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
          }
        }
      } catch (error) {
        if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
          console.log("작업중 오류가 발생하였습니다.[1]");
          dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_FAIL });
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
        }
      }
    };

    // --------------------------------------------------------------
    // 수정 처리
    const fnModify = async () => {
      let insertJson = {
        ...sttDefaultOneJson,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };

      insertJson.timeTableContents = CmChangeTextareaValue(
        insertJson.timeTableContents
      );
      insertJson.connerTitle = CmChangeTextareaValue(insertJson.connerTitle);

      let Json_form = JSON.stringify(insertJson);

      // console.log(insertJson);

      try {
        const response = await fetch("/api/ytb/bcForm?type=modifyTt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
            console.log("수정이 완료되었습니다.");
            dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_SUCCESS });
          } else {
            CmAlert("수정이 완료되었습니다.", "", "info", "닫기", 3000);
          }
        } else {
          if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
            console.log("작업중 오류가 발생하였습니다.[1]");
            dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_FAIL });
          } else {
            CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
          }
        }
      } catch (error) {
        if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
          console.log("작업중 오류가 발생하였습니다.[2]");
          dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_FAIL });
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
        }
      }
    };

    // --------------------------------------------------------------
    // timeTableSeq 이전값 교정 수정 처리
    const fnModifyTimeTableSeq = async (dbTimeTableSeq) => {
      let insertJson = {
        oldTimeTableSeq: sttDefaultOneJson.newTimeTableSeq,
        timeTableSeq: dbTimeTableSeq,
        updateId: myCtxtCmUser.userEmail,
      };

      let Json_form = JSON.stringify(insertJson);

      try {
        const response = await fetch(
          "/api/ytb/bcForm?type=modifyTgTimeTableSeq",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: Json_form,
          }
        );

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          console.log("modifyTgTimeTableSeq 수정이 완료되었습니다.");
       } else {
          // CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
          console.log("modifyTgTimeTableSeq 작업중 오류가 발생하였습니다.[1]");
        }
      } catch (error) {
        // CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
        console.log("modifyTgTimeTableSeq 작업중 오류가 발생하였습니다.[1]");
      }
    };

    // --------------------------------------------------------------
    // 등록  처리
    const fnSignInsert = async (type, e) => {
      let insertJson = {
        ...sttDefaultOneJson,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };

      insertJson.connerTitle = CmChangeTextareaValue(insertJson.connerTitle);

      insertJson.timeTableContents = CmChangeTextareaValue(
        insertJson.timeTableContents
      );
      // console.log(insertJson);

      let Json_form = JSON.stringify(insertJson);

      try {
        const response = await fetch("/api/ytb/bcForm?type=signUpTt", {
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
          let newSttDefaultOneJson = { ...sttDefaultOneJson };
          newSttDefaultOneJson.timeTableSeq = insertId;
          setSttDefaultOneJson(newSttDefaultOneJson);
          // console.log(newSttDefaultOneJson);
          // console.log(insertId);
          //
          if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
            console.log("등록이 완료되었습니다.");
            dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_SUCCESS });
          } else {
            CmAlert("등록이 완료되었습니다.", "", "info", "닫기", 3000);
          }

          // 기존 tb_ytb_time_guest 에 임시로 들어간 time_table_seq 값 update 해주기
          fnModifyTimeTableSeq(insertId, e);

          setTimeout(function () {
            // history.push(`/bc/modify/${insertId}`);
          }, 1000);
        } else {
          //
          if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
            console.log("작업중 오류가 발생하였습니다.[1]");
            dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_FAIL });
          } else {
            CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
          }
        }
      } catch (error) {
        //
        if (rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0) {
          console.log("작업중 오류가 발생하였습니다.[2]");
          dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_FAIL });
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
        }
      }
    };

    // 실제 처리
    if (true) {
      if (
        sttDefaultOneJson.timeTableSeq >= CM_CD_NEW_TEMP_SEQ_MAX ||
        sttDefaultOneJson.deleteYn === "Y"
      ) {
        if (sttDefaultOneJson.deleteYn === "Y") {
          fnDelete("delete", e);
        } else {
          fnModify("modify", e);
        }
      } else {
        fnSignInsert("signUp", e);
      }
    }
  };

  // ===========================================================================
  // 값들 변경시
  const changeValue = (e) => {
    const chgValue = CmChangeValue(e, { ...sttDefaultOneJson });

    const { name, value } = e.target;

    if (name === "connerId") {
      // 코너 정보 선택시 제목이 비어있으면 자동으로 채워주기
      let connerInfo = ctxtCmPageCmCdList.find((item) => {
        return item.cdGroupId === "conner" && item.cdId === value;
      });
      if (connerInfo && !chgValue.connerTitle) {
        let title = connerInfo.cdNm;
        const sList = title.split(".");
        if (sList.length > 1) {
          title = sList[1].trim();
        }
        chgValue.connerTitle = title;
      }
    } else if (name === "timeStartTime") {
      // 유튜브 시작 시간을 입력하면 초로 변경해서 timeStartSec 에 넣어준다.
      if (value.length === 6) {
        let hour = value.substr(0, 2);
        let min = value.substr(2, 2);
        let sec = value.substr(4, 2);
        try {
          let totalTime =
            parseInt(hour) * 60 * 60 + parseInt(min) * 60 + parseInt(sec);
          chgValue.timeStartSec = totalTime;
        } catch (e) {
          chgValue.timeStartSec = 0;
        }
      } else {
        chgValue.timeStartSec = 0;
      }
    }

    setSttDefaultOneJson(chgValue);
  };

  // ===========================================================================
  // 코너 삭제
  const deleteConnerCnfm = () => {
    if (sttDefaultOneJson.timeTableSeq >= CM_CD_NEW_TEMP_SEQ_MAX) {
      Swal.fire(
        CmAlertConfirmMSg(
          "해당 코너를 삭제 하시겠습니까?\n",
          "실제 삭제 처리는 하단 [수정]버튼 클릭시 처리 됩니다. "
        )
      ).then((result) => {
        if (result.isConfirmed) {
          deleteConner();
        }
      });
    } else {
      deleteConner();
    }
  };

  const deleteConner = () => {
    let newSttDefaultOneJson = { ...sttDefaultOneJson };
    newSttDefaultOneJson.deleteYn = "Y";
    setSttDefaultOneJson(newSttDefaultOneJson);

    let newCtxtBcTimeTableList = ctxtBcTimeTableList.slice().filter((one) => {
      return one.timeTableSeq !== newSttDefaultOneJson.timeTableSeq;
    });
    setCtxtBcTimeTableList(newCtxtBcTimeTableList);
  };

  // ===========================================================================
  // 처음 로딩시 입력값 오류  css 제거
  useEffect(() => {
    CmClearInValidClassName(defaultFrmId, inValidCkList);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  // 자동으로 첫번째 코너 등록 폼 생성시 channelId 값 없어서 세팅해 주는 useEffect
  useEffect(() => {
    let newOneJson = { ...sttDefaultOneJson };
    if (paramChannelId && !newOneJson.channelId) {
      newOneJson.channelId = paramChannelId;
      setSttDefaultOneJson(newOneJson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramChannelId]);

  // ===========================================================================
  // redux 상태값 체크
  if (rdxActionBcModify.indexOf(BC_VALIDATION_TT_ING) >= 0) {
    // console.log(" ============================")
    // console.log( sttDefaultOneJson.rowNum )
    // console.log( rdxTotalCnt )
    // console.log( rdxSuccessCnt )
    // console.log( rdxFailCnt )
    // console.log(" ============================ ")
    let doneCnt = rdxSuccessCnt + rdxFailCnt; // 총 처리 값
    if (rdxTotalCnt === 0 || doneCnt === rdxTotalCnt) {
      dispatchBcModifyFormConnerItem({ type: BC_VALIDATION_TT_END });
    } else if (doneCnt + 1 === sttDefaultOneJson.rowNum) {
      fnValidateRdx();
    }
  } else if (rdxActionBcModify.indexOf(BC_SAVE_TT_ING) >= 0) {
    // console.log(" ============================ ");
    // console.log(sttDefaultOneJson.rowNum);
    // console.log(rdxTotalCnt);
    // console.log(rdxSuccessCnt);
    // console.log(rdxFailCnt);
    // console.log(" ============================ ");
    let doneCnt = rdxSuccessCnt + rdxFailCnt; // 총 처리 값
    if (rdxTotalCnt === 0 || doneCnt === rdxTotalCnt) {
      dispatchBcModifyFormConnerItem({ type: BC_SAVE_TT_END });
    } else if (doneCnt + 1 === sttDefaultOneJson.rowNum) {
      saveDb();
    }
  }

  //<div hidden={sttDefaultOneJson.deleteYn === "Y" ? true : false}>

  return (
    <div hidden={sttDefaultOneJson.deleteYn === "Y" ? true : false}>
      <div>
        <hr />
        <div className={styles.bc000FormBody__contents__ttTitle}></div>
        <div className={styles.bc000FormBody__contents__ttButton}></div>

        <form name={defaultFrmId} id={defaultFrmId}>
          {/* {defaultFrmId} */}
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="connerId">
                  <b>
                    *{" "}
                    {ctxtBcTimeTableList.findIndex((item) => {
                      return (
                        item.timeTableSeq === sttDefaultOneJson.timeTableSeq ||
                        item.newTimeTableSeq ===
                          sttDefaultOneJson.newTimeTableSeq
                      );
                    }) + 1}
                    . 코너정보 - {sttDefaultOneJson.timeTableSeq}
                    {/* //{" "}{sttDefaultOneJson.rowNum} // {sttDefaultOneJson.newTimeTableSeq} */}
                  </b>
                </Label>
                <Input
                  id="connerId"
                  name="connerId"
                  type="select"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.connerId}
                  invalid
                >
                  <CmSelectOptionNoValue />
                  {ctxtCmPageCmCdList
                    .filter((cdItem) => {
                      return (
                        cdItem.cdGroupId === "conner" &&
                        cdItem.cdAttr01 ===
                          (sttDefaultOneJson.channelId
                            ? sttDefaultOneJson.channelId
                            : cdItem.cdAttr01)
                      );
                    })
                    .map((one, index) => {
                      return (
                        <option key={index} value={one.cdId}>
                          {one.cdNm}
                        </option>
                      );
                    })}
                </Input>
                <FormFeedback>코너정보를 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="connerTitle">* 제목</Label>
                <Input
                  id="connerTitle"
                  name="connerTitle"
                  placeholder="제목"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.connerTitle}
                  invalid
                  maxLength="100"
                  innerRef={refConnerTitle}
                />
                <FormFeedback>제목을 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Label for="timeTableOrderSeq">* 순번</Label>
                <Input
                  id="timeTableOrderSeq"
                  name="timeTableOrderSeq"
                  placeholder="순번"
                  type="number"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.timeTableOrderSeq}
                />
                <FormFeedback>순번을 숫자로 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup hidden>
            <Label for="refSaveResult">값 체크 후 결과값 저장용 </Label>
            <Input innerRef={refSaveResult} />
          </FormGroup>

          <FormGroup>
            <Label for="timeTableContents">내용</Label>
            <Input
              id="timeTableContents"
              name="timeTableContents"
              placeholder="내용"
              type="textarea"
              rows="4"
              maxLength="1000"
              onChange={(e) => changeValue(e)}
              value={sttDefaultOneJson.timeTableContents}
            />
          </FormGroup>

          {/* 게스트 정보  */}
          <BcModifyFormGuest
            timetableseq={sttDefaultOneJson.timeTableSeq}
            timeTableItem={item}
            channelId={paramChannelId}
          />

          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="timeStartTime">유튜브시작위치</Label>
                <Input
                  id="timeStartTime"
                  name="timeStartTime"
                  placeholder="12:34:56를 123456으로 입력"
                  type="text"
                  maxLength="10"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.timeStartTime}
                />
                <FormFeedback>순번을 숫자로 입력하세요.</FormFeedback>
                <FormText>00:34:56 을 003456으로 입력하세요.</FormText>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="timeStartSec">&nbsp;</Label>
                <Input
                  id="timeStartSec"
                  name="timeStartSec"
                  placeholder="유튜브시작위치 초 입력"
                  type="number"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.timeStartSec}
                />
                <FormFeedback>순번을 숫자로 입력하세요.</FormFeedback>
                <FormText>초(숫자)로 입력하세요.</FormText>
              </FormGroup>
            </Col>
            <Col md={3} className="cmBottom">
              <Label for="">&nbsp;</Label>
              <Button
                hidden={sttDefaultOneJson.deleteYn === "Y" ? true : false}
                size="sm"
                color="danger"
                onClick={deleteConnerCnfm}
                outline
              >
                {/* 코너정보 {item.key} {item.timeTableSeq}
              <br /> */}
                삭제
              </Button>
            </Col>
            <Col md={3} className="cmBottom">
              <Label for="">&nbsp;</Label>
              <Button
                hidden={sttDefaultOneJson.deleteYn === "Y" ? true : false}
                size="sm"
                onClick={submitClick}
                color="primary"
                outline
              >
                {ctxtBcTimeTableList.findIndex((item) => {
                  return (
                    item.timeTableSeq === sttDefaultOneJson.timeTableSeq ||
                    item.newTimeTableSeq === sttDefaultOneJson.newTimeTableSeq
                  );
                }) + 1}
                . 코너정보만(게스트X)&nbsp;
                {sttDefaultOneJson.timeTableSeq >= CM_CD_NEW_TEMP_SEQ_MAX
                  ? `수정`
                  : `등록`}
              </Button>
              {/*               
              &nbsp;
              <Button
                onClick={() => {
                  dispatchBcModifyFormConnerItem({ type: BC_SAVE_TG_START });
                }}
              >
                guest 저장 버튼
              </Button> */}
            </Col>
          </Row>
          {/* <div className={styles.bc000FormBody__contents__ttButton}>
          <Button onClick={submitClick}>
            {sttDefaultOneJson.timeTableSeq >= CM_CD_NEW_TEMP_SEQ_MAX
              ? `수정 ${sttDefaultOneJson.timeTableSeq}`
              : `등록 ${sttDefaultOneJson.timeTableSeq}`}
          </Button>
        </div> */}
        </form>
        <br />
      </div>
    </div>
  );
}
