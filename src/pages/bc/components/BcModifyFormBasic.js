import axios from "axios";
import moment from "moment";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import {
  BC_BLANK,
  BC_SAVE_BC_END,
  BC_SAVE_BC_FAIL,
  BC_SAVE_BC_ING,
  BC_SAVE_BC_PRE,
  BC_SAVE_BC_START,
  BC_SAVE_BC_SUCCESS,
  BC_SAVE_TG_END,
  BC_SAVE_TG_PRE,
  BC_SAVE_TG_START,
  BC_SAVE_TT_END,
  BC_SAVE_TT_PRE,
  BC_SAVE_TT_START,
  BC_VALIDATION_BC_END,
  BC_VALIDATION_BC_FAIL,
  BC_VALIDATION_BC_ING,
  BC_VALIDATION_BC_PRE,
  BC_VALIDATION_BC_START,
  BC_VALIDATION_BC_SUCCESS,
  BC_VALIDATION_TT_END,
  BC_VALIDATION_TT_START,
  CM_LOGIN_NOT_CHECK,
  CM_LOGIN_NOT_EMAIL,
  CM_USER_LEVEL_ADM,
  CmChangeJsonToSearch,
  CmChangeJsonToSearchWithList,
  CmChangeSearchToJson,
  CmChangeTextareaValue,
  CmChangeValue,
  CmClearInValidClassName,
  CmSetTextareaValue,
  CmShowInValidMessage,
  URL_BC_LIST,
} from "../../../components/js/Common";
import { CmPageCmCdListContext } from "../../../context/CmPageCmCdListContext";
import { CmUserContext } from "../../../context/CmUserContext";
import CmAlert, {
  CmAlertConfirmMSg,
  CmAlertNeedLogin,
} from "../../../hook/CmAlert";
import styles from "./Bc0000Form.module.scss";
import CmFileUpload from "../../../hook/CmFileUpload";

// export default function BcModifyFormBasic(props) {
const BcModifyFormBasic = forwardRef((props, ref) => {
  let formFrom = props.formFrom ? props.formFrom : "signUp";

  const history = useHistory();

  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  const initSrchWordList = useMemo(() => {
    // console.log(`searchWordList`)
    return CmChangeSearchToJson(props.location.search.replace("?", ""));
  }, [props.location.search]);

  // 공통코드 리스트
  const { ctxtCmPageCmCdList } = useContext(CmPageCmCdListContext);

  // 수정일 경우 처리
  let paramBroadcastSeq = props && props.broadcastSeq ? props.broadcastSeq : "";

  if (paramBroadcastSeq) {
  } else {
    formFrom = "signUp";
    paramBroadcastSeq = "";
  }

  // 방송정보 JsonData - props 으로 넘어온 값
  const bcBasicData = props && props.bcBasicData ? props.bcBasicData : null;

  // 방송정보 기본 세팅값
  const defaultOneJson = {
    broadcastSeq: "", // 날짜seq
    channelId: "", // 채널seq
    broadcastDate: moment().format("YYYY-MM-DD"), // 날짜
    broadcastStartTime: moment().format("HH:mm"), // 시간
    broadcastOrderSeq: "1", // 날짜순번seq
    mainPeopleId: "", // 메인캐스트(사람seq)
    broadcastTitle: "", // 제목
    broadcastUrl: "", // 내용
    fileInfoSeq: 0, // 파일정보seq
    createDt: "", // 등록일자
    updateDt: "", // 수정일자
    createId: myCtxtCmUser.userEmail,
    updateId: myCtxtCmUser.userEmail,
  };

  // ref
  const refBroadcastDate = useRef("");
  const refBroadcastStartTime = useRef("");
  const refChannelId = useRef("");
  const refMainPeopleId = useRef("");
  const refBroadcastTitle = useRef("");

  const [sttDefaultOneJson, setSttDefaultOneJson] = useState(
    bcBasicData ? bcBasicData : defaultOneJson
  );
  // const [cmCdList, setCmCdList] = useState([]);
  const [spinnerHidden, setSpinnerHidden] = useState(true);

  const [fileInfoSeq, setFileInfoSeq] = useState(0);

  // 모달창 - 처리중
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const backdrop = false;

  // frm 이름 및 입력값 오류 체크할 컬럼
  const defaultFrmId = `frmConnerItem${sttDefaultOneJson.broadcastSeq}`;
  const inValidCkList = [
    "broadcastTitle",
    "broadcastDate",
    "channelId",
    "mainPeopleId",
    "broadcastUrl",
  ];

  // 로딩시 데이터 가져오기
  useEffect(() => {
    if (formFrom === "modify" && !bcBasicData) {
      setSpinnerHidden(false);

      axios
        .post("/api/ytb/bcForm?type=detail", {
          broadcastSeq: paramBroadcastSeq,
        })
        .then((response) => {
          try {
            setSpinnerHidden(true);
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
                gotoList();
              }, 1000);
            } else {
              let bcOne = result.json[0];
              // console.log(bcOne)
              bcOne.broadcastTitle = bcOne.broadcastTitle
                ? CmSetTextareaValue(bcOne.broadcastTitle)
                : "";
              bcOne.todayThinking = bcOne.todayThinking
                ? CmSetTextareaValue(bcOne.todayThinking)
                : "";
              bcOne.broadcastContents = bcOne.broadcastContents
                ? CmSetTextareaValue(bcOne.broadcastContents)
                : "";

              bcOne.rowNum = 1;
              // console.log(bcOne)
              setSttDefaultOneJson(bcOne);
              setFileInfoSeq(bcOne.fileInfoSeq);
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
  }, [paramBroadcastSeq]);

  // ref 들
  const refSaveResult = useRef();

  // 함수
  const gotoList = () => {
    window.location.href = CmChangeJsonToSearchWithList(
      URL_BC_LIST,
      initSrchWordList
    );
  };

  // ==========================================================
  // 입력값 체크
  const fnValidate = () => {
    if (
      myCtxtCmUser.userEmail &&
      myCtxtCmUser.userEmail !== CM_LOGIN_NOT_CHECK &&
      myCtxtCmUser.userEmail !== CM_LOGIN_NOT_EMAIL
    ) {
    } else {
      CmAlertNeedLogin();
      return false;
    }

    // redex 로 입력값 체크인 경우 alert을 안띄운다.
    let alertKind =
      rdxActionBcModify.indexOf(BC_VALIDATION_BC_ING) >= 0
        ? "alertXX"
        : "alert";
    let cntInValidColumn = 0;

    // 입력값 오류 스타일 시트 제거
    CmClearInValidClassName(defaultFrmId, inValidCkList);

    // 날짜
    if (sttDefaultOneJson.broadcastDate === "") {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "broadcastDate",
        "날짜를 확인해주세요.",
        null
      );
      cntInValidColumn++;
      if (alertKind === "alert") {
        return false;
      }
    }
    // 채널정보
    if (sttDefaultOneJson.channelId === "") {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "channelId",
        "채널정보를 확인해주세요.",
        null
      );
      cntInValidColumn++;
      if (alertKind === "alert") {
        return false;
      }
    }

    // 진행자
    if (sttDefaultOneJson.mainPeopleId === "") {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "mainPeopleId",
        "진행자를 확인해주세요.",
        null
      );
      cntInValidColumn++;
      if (alertKind === "alert") {
        return false;
      }
    }

    // 제목
    if (sttDefaultOneJson.broadcastTitle === "") {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "broadcastTitle",
        "제목을 확인해주세요.",
        null
      );
      cntInValidColumn++;
      if (alertKind === "alert") {
        return false;
      }
    }

    // url 체크
    if (sttDefaultOneJson.broadcastUrl.search(/\s/) !== -1) {
      CmShowInValidMessage(
        alertKind,
        defaultFrmId,
        "broadcastUrl",
        "url 에 공백을 제거해주세요.",
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

  // 실제 DB 처리
  const saveDb = async (type, e) => {
    if (
      myCtxtCmUser.userEmail &&
      myCtxtCmUser.userEmail !== CM_LOGIN_NOT_CHECK &&
      myCtxtCmUser.userEmail !== CM_LOGIN_NOT_EMAIL
    ) {
    } else {
      CmAlertNeedLogin();
      return;
    }

    // 수정 처리
    const fnModify = async (type) => {
      let insertJson = {
        ...sttDefaultOneJson,
        fileInfoSeq: fileInfoSeq,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };

      // DB저장 전 처리
      insertJson.broadcastUrl = CmChangeTextareaValue(insertJson.broadcastUrl);
      insertJson.broadcastTitle = CmChangeTextareaValue(
        insertJson.broadcastTitle
      );
      insertJson.todayThinking = CmChangeTextareaValue(
        insertJson.todayThinking
      );
      insertJson.broadcastContents = CmChangeTextareaValue(
        insertJson.broadcastContents
      );

      let Json_form = JSON.stringify(insertJson);

      try {
        const response = await fetch("/api/ytb/bcForm?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          if (rdxActionBcModify.indexOf(BC_SAVE_BC_PRE) >= 0) {
            console.log("기본 정보 수정이 완료되었습니다.");
            dispatchBcModifyForm({ type: BC_SAVE_BC_SUCCESS });
          } else {
            CmAlert("수정이 완료되었습니다.", "", "info", "닫기", 3000);
          }
        } else {
          if (rdxActionBcModify.indexOf(BC_SAVE_BC_PRE) >= 0) {
            console.log("작업중 오류가 발생하였습니다.[1]");
            dispatchBcModifyForm({ type: BC_SAVE_BC_FAIL });
          } else {
            CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
          }
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // 등록  처리
    const fnSignInsert = async (type) => {
      let insertJson = {
        ...sttDefaultOneJson,
        fileInfoSeq: fileInfoSeq,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };

      insertJson.broadcastUrl = CmChangeTextareaValue(insertJson.broadcastUrl);
      insertJson.broadcastTitle = CmChangeTextareaValue(
        insertJson.broadcastTitle
      );
      insertJson.todayThinking = CmChangeTextareaValue(
        insertJson.todayThinking
      );
      insertJson.broadcastContents = CmChangeTextareaValue(
        insertJson.broadcastContents
      );

      let Json_form = JSON.stringify(insertJson);

      try {
        const response = await fetch("/api/ytb/bcForm?type=" + type, {
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
            "등록이 완료되었습니다. <br/>수정페이지로 이동합니다.",
            "",
            "info",
            "닫기",
            3000
          );
          setTimeout(function () {
            const tempNum = Math.ceil(Math.random() * 100);
            history.push(`/bc/modify/${insertId}?${tempNum}`);
          }, 1000);
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };


    // 실제 처리
    if (true) {
      if (formFrom === "modify") {
        //
        Swal.fire(CmAlertConfirmMSg("수정 하시겠습니까?")).then((result) => {
          if (result.isConfirmed) {
            fnModify("modify", e);
          }
        });
      } else {
        // 신규 등록시 중복여부
        axios
          .post("/api/ytb/bcForm?type=dpliCheck", {
            channelId: sttDefaultOneJson.channelId,
            broadcastDate: sttDefaultOneJson.broadcastDate,
            broadcastOrderSeq: sttDefaultOneJson.broadcastOrderSeq,
          })
          .then((response) => {
            try {
              const dupli_count = response.data.json[0].num;
              if (dupli_count !== 0) {
                refBroadcastDate.current.focus();
                CmAlert("이미 존재하는 방송입니다.", "", "info", "닫기");
              } else {
                Swal.fire(CmAlertConfirmMSg("등록 하시겠습니까?")).then(
                  (result) => {
                    if (result.isConfirmed) {
                      fnSignInsert("signUp", e);
                    }
                  }
                );
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

  // 등록하기 버튼 클릭시
  const submitClick = async (type, e) => {
    // 실제 처리
    if (fnValidate()) {
      saveDb(type, e);
    }
  };

  // 삭제 버튼 클릭시
  const deleteClick = async (type, e) => {
    //  삭제 처리
    const fnDelete = async () => {
      let insertJson = {
        broadcastSeq: paramBroadcastSeq,
        updateId: myCtxtCmUser.userEmail,
      };
      let Json_form = JSON.stringify(insertJson);
      try {
        const response = await fetch("/api/ytb/bcForm?type=delete", {
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
              URL_BC_LIST,
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
    const chgValue = CmChangeValue(e, { ...sttDefaultOneJson });
    const { name, value } = e.target;

    if (name === "channelId" && value && !chgValue.mainPeopleId) {
      let index = ctxtCmPageCmCdList.findIndex((item) => {
        return item.cdGroupId === "people" && item.cdAttr02 === value;
      });

      if (index >= 0) {
        chgValue.mainPeopleId = ctxtCmPageCmCdList[index].cdId;
      }
    }

    setSttDefaultOneJson(chgValue);
  };

  const fileReadOnlyMode =
    myCtxtCmUser.userLevel >= CM_USER_LEVEL_ADM ? {} : { readonlymode: true };
  // console.log(fileReadOnlyMode)
  //readonlymode

  // ======================================================================================
  // 11. dispatch
  const dispatchBcModifyForm = useDispatch();

  // 5. root 에 있는 actionBcModify 값을 사용하고 싶다.
  function fnShowActionModify(state) {
    return state.actionBcModify;
  }

  // 6 selector 를 사용한다.
  // selector 는 함수를 받는다.
  const rdxActionBcModify = useSelector(fnShowActionModify); // 이것도 가능
  const rdxTotalCnt = useSelector((state) => state.totalCnt); // 이것도 가능
  const rdxSuccessCnt = useSelector((state) => state.successCnt); // 이것도 가능
  const rdxFailCnt = useSelector((state) => state.failCnt); // 이것도 가능

  // 체크 - 방송
  function fnCheckBc() {
    if (rdxFailCnt > 0) {
      CmAlert("입력값 에러 메시지를 확인하세요.", null, "error", "닫기");
    } else {
      console.log(
        "  BC 값 체크 끝 다음은 저장 합니다. =============================== "
      );
    }
  }

  // 저장 - 방송
  const fnSaveBc = () => {
    if (rdxFailCnt > 0) {
      CmAlert("BC 저장 중 에러가 발생했습니다. ", null, "error", "닫기");
    } else {
      console.log(" 방송 저장 모두 저장");
      console.log(" 코너 저장은 useEffect에서 저장");
    }
  };

  // 체크 - 코너
  function fnCheckConner() {
    if (rdxFailCnt > 0) {
      CmAlert("입력값 에러 메시지를 확인하세요.", null, "error", "닫기");
    } else {
      console.log(
        "코너 정보 값 체크 끝 다음은 저장 합니다. =============================== "
      );
    }
  }

  // 저장 - 코너
  const fnSaveConner = () => {
    if (rdxFailCnt > 0) {
      CmAlert("코너 정보 저장 중 에러가 발생했습니다. ", null, "error", "닫기");
    } else {
      console.log("fnSaveConner  모두 저장");
    }
  };

  // 저장 - 게스트
  const fnSaveGuest = () => {
    if (rdxFailCnt > 0) {
      CmAlert("게스트 저장 중 에러가 발생했습니다. ", null, "error", "닫기");
    } else {
      console.log("게스트 모두 저장");
      CmAlert("저장이 완료되었습니다.", "", "info", "닫기", 1000);
      setTimeout(function () {
        const tempNum = Math.ceil(Math.random() * 100);
        window.location.href = window.location.pathname + `?${tempNum}`;
      }, 1000);
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

  useEffect(() => {
    const validationValue = refSaveResult.current.value;
    refSaveResult.current.value = "";
    /* 
      기본정보 값체크 -> 코너들 정보 값체크 -> (게스트정보는 값체크가 없다. )
      기본정보 저장 -> 코너들 정보 저장 -> 게스트정보 저장 
    */

    // redux 전체에서 쓰는 조건문
    if (rdxActionBcModify === BC_VALIDATION_BC_END) {
      // 실패건이 없이 모두 통과라면 다음 스텝 진행
      if (rdxTotalCnt === rdxSuccessCnt + rdxFailCnt && !rdxFailCnt) {
        // 기본 정보 체크 후 코너들값 체크
        dispatchBcModifyForm({ type: BC_VALIDATION_TT_START });
      }
      fnCheckBc();
    } else if (rdxActionBcModify === BC_VALIDATION_TT_END) {
      // 실패건이 없이 모두 통과라면 다음 스텝 진행
      if (rdxTotalCnt === rdxSuccessCnt + rdxFailCnt && !rdxFailCnt) {
        // 코너들 정보 체크 후 기본정보 저장
        dispatchBcModifyForm({ type: BC_SAVE_BC_START });
      }
      fnCheckConner();
    } else if (rdxActionBcModify === BC_SAVE_BC_END) {
      // 저장이 모두 끝났다면 결과 표시 및 다음 스텝 진행
      // 기본 정보 저장이 끝났다면 코너들 정보 저장시작
      dispatchBcModifyForm({ type: BC_SAVE_TT_START });
      fnSaveBc();
    } else if (rdxActionBcModify === BC_SAVE_TT_END) {
      // 저장이 모두 끝났다면 결과 표시 및 다음 스텝 진행
      // 코너들 정보 저장이 끝났다면 게스트 정보 저장 시작
      dispatchBcModifyForm({ type: BC_SAVE_TG_START });
      fnSaveConner();
    } else if (rdxActionBcModify === BC_SAVE_TG_END) {
      // 저장이 모두 끝났다면 결과 표시 및 다음 스텝 진행
      dispatchBcModifyForm({ type: BC_BLANK });
      fnSaveGuest();

      // 화면에서 쓰는 조건문
    } else if (rdxActionBcModify.indexOf(BC_VALIDATION_BC_PRE) >= 0) {
      // 기본 정보 입력값 체크 중이라면
      if (validationValue === "succ") {
        dispatchBcModifyForm({ type: BC_VALIDATION_BC_SUCCESS });
      } else if (validationValue === "fail") {
        dispatchBcModifyForm({ type: BC_VALIDATION_BC_FAIL });
      }
    } else if (rdxActionBcModify.indexOf(BC_SAVE_BC_PRE) >= 0) {
      // 기본 정보 저장 중이라면
      if (validationValue === "succ") {
        dispatchBcModifyForm({ type: BC_SAVE_BC_SUCCESS });
      } else if (validationValue === "fail") {
        dispatchBcModifyForm({ type: BC_SAVE_BC_FAIL });
      }
    }

    // 코너 저장이나 게스트 저장중이라면 모달창 띄우기
    if (
      rdxActionBcModify.indexOf(BC_SAVE_TT_PRE) >= 0 ||
      rdxActionBcModify.indexOf(BC_SAVE_TG_PRE) >= 0
    ) {
      setModal(true);
    } else {
      setModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rdxActionBcModify]);

  // ===========================================================================
  // redux 상태값 체크
  // console.log(" ============================ ");
  // console.log(sttDefaultOneJson.rowNum);
  // console.log(rdxTotalCnt);
  // console.log(rdxSuccessCnt);
  // console.log(rdxFailCnt);
  // console.log(" ============================ ");
  if (rdxActionBcModify.indexOf(BC_VALIDATION_BC_ING) >= 0) {
    // 값 체크 중이라면

    let doneCnt = rdxSuccessCnt + rdxFailCnt; // 총 처리 값
    if (rdxTotalCnt === 0 || doneCnt === rdxTotalCnt) {
      dispatchBcModifyForm({ type: BC_VALIDATION_BC_END }); // 모두 체크함
    } else if (doneCnt + 1 === sttDefaultOneJson.rowNum) {
      fnValidateRdx();
    }
  } else if (rdxActionBcModify.indexOf(BC_SAVE_BC_ING) >= 0) {
    // 값 저장 중이라면
    let doneCnt = rdxSuccessCnt + rdxFailCnt; // 총 처리 값
    if (rdxTotalCnt === 0 || doneCnt === rdxTotalCnt) {
      dispatchBcModifyForm({ type: BC_SAVE_BC_END }); // 모두 저장함
    } else if (doneCnt + 1 === sttDefaultOneJson.rowNum) {
      saveDb();
    }
  }

  // ===========================================================================
  // 부모창에서 사용할 함수 - 저장
  const fnStartSaveFromParent = () => {
    console.log(" fnStartSave ");
    dispatchBcModifyForm({ type: BC_VALIDATION_BC_START });
  };

  // 부모창에서 사용할 함수 - 삭제
  const fnStartDeleteFromParent = () => {
    console.log(" fnStartDeleteFromParent ");
    // dispatchBcModifyForm({ type: BC_VALIDATION_BC_START });
    // alert("삭제");
    deleteClick();
  };

  useImperativeHandle(ref, () => ({
    // 부모에서 사용하고 싶은 함수 정의
    fnStartSaveFromParent,
    fnStartDeleteFromParent,
  }));
  // ===========================================================================

  return (
    <>
      <Spinner color="primary" hidden={spinnerHidden}>
        Loading...
      </Spinner>

      <div className={styles.bc0000FormBody__contents} hidden={!spinnerHidden}>
        <form name={defaultFrmId} id={defaultFrmId}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="broadcastDate">* 날짜</Label>
                <Input
                  id="broadcastDate"
                  name="broadcastDate"
                  placeholder="날짜"
                  type="date"
                  disabled={formFrom === "modify" ? true : false}
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.broadcastDate}
                  innerRef={refBroadcastDate}
                />
                <FormFeedback>날짜를 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="broadcastStartTime">시간</Label>
                <Input
                  id="broadcastStartTime"
                  name="broadcastStartTime"
                  placeholder="시간"
                  type="time"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.broadcastStartTime}
                  innerRef={refBroadcastStartTime}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="channelId">* 채널정보</Label>
                <Input
                  id="channelId"
                  name="channelId"
                  type="select"
                  onChange={(e) => changeValue(e)}
                  disabled={formFrom === "modify" ? true : false}
                  value={sttDefaultOneJson.channelId}
                  innerRef={refChannelId}
                >
                  <option value="">선택하세요.</option>
                  {ctxtCmPageCmCdList
                    .filter((item) => {
                      return item.cdGroupId === "channel";
                    })
                    .map((one, index) => {
                      return (
                        <option key={index} value={one.cdId}>
                          {one.cdNm}
                        </option>
                      );
                    })}
                </Input>
                <FormFeedback>채널정보를 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="broadcastUrl">Url</Label>
                <Input
                  id="broadcastUrl"
                  name="broadcastUrl"
                  placeholder="Url"
                  type="url"
                  maxLength="200"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.broadcastUrl}
                />
                <FormFeedback>url를 바르게 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="mainPeopleId">* 진행1</Label>
                <Input
                  id="mainPeopleId"
                  name="mainPeopleId"
                  type="select"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.mainPeopleId}
                  innerRef={refMainPeopleId}
                >
                  <option value="">선택하세요.</option>
                  {ctxtCmPageCmCdList
                    .filter((item) => {
                      return item.cdGroupId === "people";
                    })
                    .map((one, index) => {
                      return (
                        <option key={index} value={one.cdId}>
                          {one.cdNm} {one.cdAttr01}
                        </option>
                      );
                    })}
                </Input>
                <FormFeedback>진행자를 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup hidden>
                <Label for="mainPeopleId">* 진행2</Label>
                <Input
                  id="mainPeopleId"
                  name="mainPeopleId"
                  type="select"
                  onChange={(e) => changeValue(e)}
                  value={sttDefaultOneJson.mainPeopleId}
                  innerRef={refMainPeopleId}
                >
                  <option value="">선택하세요.</option>
                  {ctxtCmPageCmCdList
                    .filter((item) => {
                      return item.cdGroupId === "people";
                    })
                    .map((one, index) => {
                      return (
                        <option key={index} value={one.cdId}>
                          {one.cdNm} {one.cdAttr01}
                        </option>
                      );
                    })}
                </Input>
                <FormFeedback>메인캐스트를 입력하세요.</FormFeedback>
                <FormText hidden>데이터에 대한 설명</FormText>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup hidden>
            <Label for="refSaveResult">값 체크 후 결과값 저장용 </Label>
            <Input innerRef={refSaveResult} />
          </FormGroup>

          <FormGroup>
            <Label for="broadcastTitle">* 제목</Label>
            <Input
              id="broadcastTitle"
              name="broadcastTitle"
              placeholder="제목"
              maxLength="500"
              onChange={(e) => changeValue(e)}
              value={sttDefaultOneJson.broadcastTitle}
              innerRef={refBroadcastTitle}
            />
            <FormFeedback>제목을 입력하세요.</FormFeedback>
            <FormText hidden>데이터에 대한 설명</FormText>
          </FormGroup>

          <FormGroup>
            <Label for="broadcastContents">내용</Label>
            <Input
              id="broadcastContents"
              name="broadcastContents"
              type="textarea"
              placeholder="내용"
              rows="7"
              maxLength="4000"
              onChange={(e) => changeValue(e)}
              value={sttDefaultOneJson.broadcastContents}
            />
            <FormFeedback hidden></FormFeedback>
            <FormText hidden>데이터에 대한 설명</FormText>
          </FormGroup>

          <FormGroup hidden>
            <Label for="todayThinking">시작멘트</Label>
            <Input
              id="todayThinking"
              name="todayThinking"
              type="textarea"
              placeholder="시작멘트"
              rows="5"
              onChange={(e) => changeValue(e)}
              value={sttDefaultOneJson.todayThinking}
            />
            <FormFeedback hidden></FormFeedback>
            <FormText hidden>데이터에 대한 설명</FormText>
          </FormGroup>

          <CmFileUpload
            fileinfomstseq={sttDefaultOneJson.fileInfoSeq}
            setfileinfomstseq={setFileInfoSeq}
            // readonlymode
            maxuploadcnt={6}
            {...fileReadOnlyMode}
          />
        </form>

        {formFrom === "modify" ? (
          <Row>
            <Col md={9} className="cmBottom"></Col>
            <Col md={3} className="cmBottom">
              {sttDefaultOneJson.createId === myCtxtCmUser.userEmail ||
              myCtxtCmUser.userLevel >= CM_USER_LEVEL_ADM ? (
                <Button
                  onClick={() => {
                    submitClick();
                  }}
                  size="sm"
                  color="primary"
                  outline
                >
                  기본 정보만 수정
                </Button>
              ) : (
                ""
              )}
              <>
                {/* &nbsp;
              <Button
                onClick={() => {
                  dispatchBcModifyForm({ type: BC_VALIDATION_BC_START });
                }}
              >
                redex로 처리
              </Button>
              &nbsp;
              <Button
                onClick={() => {
                  dispatchBcModifyForm({ type: BC_VALIDATION_TT_START });
                }}
              >
                코너들저장
              </Button> */}
              </>
            </Col>
          </Row>
        ) : (
          ""
        )}

        {formFrom !== "modify" &&
        myCtxtCmUser &&
        myCtxtCmUser.userEmail &&
        myCtxtCmUser.userEmail !== "default" ? (
          <div className={styles.bc0000FormBody__contents__ttButtonCenter}>
            <Button
              color="primary"
              onClick={() => {
                submitClick();
              }}
            >
              등록
            </Button>
            &nbsp;
            <Button
              color="secondary"
              onClick={() => {
                window.location.href =
                  URL_BC_LIST + "?" + CmChangeJsonToSearch(initSrchWordList);
              }}
            >
              리스트
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* 처리 중  모달 창*/}
      <Modal isOpen={modal} toggle={toggle} backdrop={backdrop} centered>
        <ModalHeader hidden toggle={toggle}>
          Modal title
        </ModalHeader>
        <ModalBody>
          <div width="100%">
            <br></br>
            <Progress animated bar color="primary" value="100">
              처리중..
            </Progress>
            <br></br>
          </div>
        </ModalBody>
        <ModalFooter hidden>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
});

export default BcModifyFormBasic;
