import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "reactstrap";
import styles from "./Bc0000Form.module.scss";

import CmTitle from "../../../components/design/CmTemplate";
import BcModifyFormBasic from "./BcModifyFormBasic";
import BcModifyFormConner from "./BcModifyFormConner";

// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { CmUserContext } from "../../../context/CmUserContext";
import { CmPageCmCdListContext } from "../../../context/CmPageCmCdListContext";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";
import { BcTimeGuestListContext } from "../../../context/BcTimeGuestListContext";
import { legacy_createStore as createStore } from "redux";
// 3 Provider
import { Provider } from "react-redux";
import {
  BC_BLANK,
  BC_SAVE_BC_END,
  BC_SAVE_BC_FAIL,
  BC_SAVE_BC_ING,
  BC_SAVE_BC_START,
  BC_SAVE_BC_SUCCESS,
  BC_SAVE_TG_END,
  BC_SAVE_TG_FAIL,
  BC_SAVE_TG_ING,
  BC_SAVE_TG_START,
  BC_SAVE_TG_SUCCESS,
  BC_SAVE_TT_END,
  BC_SAVE_TT_FAIL,
  BC_SAVE_TT_ING,
  BC_SAVE_TT_START,
  BC_SAVE_TT_SUCCESS,
  BC_VALIDATION_BC_END,
  BC_VALIDATION_BC_FAIL,
  BC_VALIDATION_BC_ING,
  BC_VALIDATION_BC_START,
  BC_VALIDATION_BC_SUCCESS,
  BC_VALIDATION_TT_END,
  BC_VALIDATION_TT_FAIL,
  BC_VALIDATION_TT_ING,
  BC_VALIDATION_TT_START,
  BC_VALIDATION_TT_SUCCESS,
  CM_LOGIN_NOT_CHECK,
  CM_LOGIN_NOT_EMAIL,
  CM_USER_LEVEL_ADM,
  CmChangeJsonToSearch,
  CmChangeJsonToSearchWithList,
  CmChangeSearchToJson,
  CmSetTextareaValue,
  URL_BC_LIST,
} from "../../../components/js/Common";
import { BcTimeTableCntContext } from "../../../context/BcTimeTableCntContext";

export default function BcModifyForm(props) {
  let formFrom = props.formFrom ? props.formFrom : "signUp";
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };
  if (!myCtxtCmUser) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  const initSrchWordList = useMemo(() => {
    // console.log(`searchWordList`)
    return CmChangeSearchToJson(props.location.search.replace("?", ""));
  }, [props.location.search]);

  // seq 조회
  let paramBroadcastSeq =
    props &&
    props.match &&
    props.match.params &&
    props.match.params.broadcastSeq
      ? props.match.params.broadcastSeq
      : "";

  if (paramBroadcastSeq) {
  } else {
    formFrom = "signUp";
    paramBroadcastSeq = "";
  }

  // 페이지 내에서 사용하는 공통 코드 리스트
  const [ctxtCmPageCmCdList, setCtxtCmPageCmCdList] = useState([]);

  // 코너 갯수 정보
  const [ctxtBcTimeTableCnt, setCtxtBcTimeTableCnt] = useState(0);

  // 기본 정보
  const [sttDefaultOneJson, setSttDefaultOneJson] = useState(null);

  // 공통코드
  useEffect(() => {
    getListByGroupId("BcModify");
  }, []);

  //===================================================================
  // 공통코드 가져오기
  const getListByGroupId = (pKind) => {
    pKind = "BcModify";

    let insertJson = { useYn: "Y" };
    let cdGroupIdList = "people,channel,conner";
    let cdGroupIdYn = "N";
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
          setCtxtCmPageCmCdList(result.json);
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  // 페이지 내에서 게스트 리스트
  const [ctxtBcTimeGuestList, setCtxtBcTimeGuestList] = useState([]);

  // 게스트 리스트
  useEffect(() => {
    getListTimeGuestByParentId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //===================================================================
  // 게스트 리스트 가져오기
  const getListTimeGuestByParentId = () => {
    if (!paramBroadcastSeq) {
      return;
    }

    let insertJson = { useYn: "Y" };
    insertJson = {
      broadcastSeq: paramBroadcastSeq,
    };

    axios
      .post("/api/ytb/bcForm?type=listAllTgByParentSeq", insertJson)
      .then((response) => {
        try {
          const result = response.data;
          let tempList = result.json;
          tempList.map((one, index) => one.rowNum = index + 1 );
          setCtxtBcTimeGuestList(tempList);
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  // 로딩시 데이터 가져오기 - channelId 정보가 필요하여 추가함
  useEffect(() => {
    if (formFrom === "modify") {
      axios
        .post("/api/ytb/bcForm?type=detailOne", {
          broadcastSeq: paramBroadcastSeq,
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
                  URL_BC_LIST,
                  initSrchWordList
                );
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

  // 수정 권한 체크
  useEffect(() => {
    if (myCtxtCmUser.userEmail === CM_LOGIN_NOT_CHECK) {
    } else {
      if (
        sttDefaultOneJson &&
        sttDefaultOneJson.createId &&
        (myCtxtCmUser.userEmail === CM_LOGIN_NOT_EMAIL ||
          (myCtxtCmUser.userEmail !== sttDefaultOneJson.createId &&
            myCtxtCmUser.userLevel < CM_USER_LEVEL_ADM))
      ) {
        CmAlert(
          "권한이 없습니다.\n리스트로 이동합니다.",
          "",
          "info",
          "닫기",
          3000
        );
        setTimeout(function () {
          window.location.href = CmChangeJsonToSearchWithList(
            URL_BC_LIST,
            initSrchWordList
          );
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [myCtxtCmUser]);

  // ===================================================
  // 2. action 에 따라 state 값 세팅함
  function reducerBcModify(currentState, action) {
    if (currentState === undefined) {
      return {
        actionBcModify: "",
        totalCnt: 0,
        successCnt: 0,
        failCnt: 0,
      };
    }

    const newState = { ...currentState };
    if (action.type === "plus") {
      // BC_VALIDATION_TT_
    } else if (action.type === BC_VALIDATION_TT_START) {
      newState.actionBcModify = BC_VALIDATION_TT_ING;
      newState.totalCnt = ctxtBcTimeTableCnt;
      newState.successCnt = 0;
      newState.failCnt = 0;
    } else if (
      action.type === BC_VALIDATION_TT_SUCCESS ||
      action.type === BC_VALIDATION_TT_FAIL
    ) {
      newState.successCnt =
        action.type === BC_VALIDATION_TT_SUCCESS
          ? newState.successCnt + 1
          : newState.successCnt;
      newState.failCnt =
        action.type === BC_VALIDATION_TT_FAIL
          ? newState.failCnt + 1
          : newState.failCnt;
      const totalDone = newState.successCnt + newState.failCnt;
      newState.actionBcModify = BC_VALIDATION_TT_ING + totalDone;

      // 처리가 다 끝났으면
      if (newState.totalCnt <= newState.successCnt + newState.failCnt) {
        newState.actionBcModify = BC_VALIDATION_TT_END;
      }

      // BC_SAVE_TT_
    } else if (action.type === BC_SAVE_TT_START) {
      newState.actionBcModify = BC_SAVE_TT_ING;
      newState.totalCnt = ctxtBcTimeTableCnt;
      newState.successCnt = 0;
      newState.failCnt = 0;
    } else if (
      action.type === BC_SAVE_TT_SUCCESS ||
      action.type === BC_SAVE_TT_FAIL
    ) {
      newState.successCnt =
        action.type === BC_SAVE_TT_SUCCESS
          ? newState.successCnt + 1
          : newState.successCnt;
      newState.failCnt =
        action.type === BC_SAVE_TT_FAIL
          ? newState.failCnt + 1
          : newState.failCnt;
      const totalDone = newState.successCnt + newState.failCnt;
      newState.actionBcModify = BC_SAVE_TT_ING + totalDone;

      if (newState.totalCnt <= newState.successCnt + newState.failCnt) {
        newState.actionBcModify = BC_SAVE_TT_END;
      }

      // BC_SAVE_TG_
    } else if (action.type === BC_SAVE_TG_START) {
      newState.actionBcModify = BC_SAVE_TG_ING;
      newState.totalCnt = ctxtBcTimeTableCnt;
      newState.successCnt = 0;
      newState.failCnt = 0;
    } else if (
      action.type === BC_SAVE_TG_SUCCESS ||
      action.type === BC_SAVE_TG_FAIL
    ) {
      newState.successCnt =
        action.type === BC_SAVE_TG_SUCCESS
          ? newState.successCnt + 1
          : newState.successCnt;
      newState.failCnt =
        action.type === BC_SAVE_TG_FAIL
          ? newState.failCnt + 1
          : newState.failCnt;
      const totalDone = newState.successCnt + newState.failCnt;
      newState.actionBcModify = BC_SAVE_TG_ING + totalDone;

      if (newState.totalCnt <= newState.successCnt + newState.failCnt) {
        newState.actionBcModify = BC_SAVE_TG_END;
      }

      // BC_VALIDATION_BC_
    } else if (action.type === BC_VALIDATION_BC_START) {
      newState.actionBcModify = BC_VALIDATION_BC_ING;
      // newState.totalCnt = ctxtBcTimeTableCnt
      newState.totalCnt = 1;
      newState.successCnt = 0;
      newState.failCnt = 0;
    } else if (
      action.type === BC_VALIDATION_BC_SUCCESS ||
      action.type === BC_VALIDATION_BC_FAIL
    ) {
      newState.successCnt =
        action.type === BC_VALIDATION_BC_SUCCESS
          ? newState.successCnt + 1
          : newState.successCnt;
      newState.failCnt =
        action.type === BC_VALIDATION_BC_FAIL
          ? newState.failCnt + 1
          : newState.failCnt;
      const totalDone = newState.successCnt + newState.failCnt;
      newState.actionBcModify = BC_VALIDATION_BC_ING + totalDone;

      if (newState.totalCnt <= newState.successCnt + newState.failCnt) {
        newState.actionBcModify = BC_VALIDATION_BC_END;
      }

      // BC_SAVE_BC_
    } else if (action.type === BC_SAVE_BC_START) {
      newState.actionBcModify = BC_SAVE_BC_ING;
      // newState.totalCnt = ctxtBcTimeTableCnt
      newState.totalCnt = 1;
      newState.successCnt = 0;
      newState.failCnt = 0;
    } else if (
      action.type === BC_SAVE_BC_SUCCESS ||
      action.type === BC_SAVE_BC_FAIL
    ) {
      newState.successCnt =
        action.type === BC_SAVE_BC_SUCCESS
          ? newState.successCnt + 1
          : newState.successCnt;
      newState.failCnt =
        action.type === BC_SAVE_BC_FAIL
          ? newState.failCnt + 1
          : newState.failCnt;
      const totalDone = newState.successCnt + newState.failCnt;
      newState.actionBcModify = BC_SAVE_BC_ING + totalDone;

      if (newState.totalCnt <= newState.successCnt + newState.failCnt) {
        newState.actionBcModify = BC_SAVE_BC_END;
      }
    } else if (action.type === BC_BLANK) {
      newState.actionBcModify = BC_BLANK;
    }

    return newState;
  }

  // 1. store 생성
  // 2-1.
  const storeBcModify = createStore(reducerBcModify);

  const refChildrenFn = useRef({}); // 자식 컴포넌트의 함수를 호출할 경우 사용

  // 수정 버튼 클릭시
  const fnStartSave = () => {
    refChildrenFn.current.fnStartSaveFromParent();
  };

  // 삭제 버튼 클릭시
  const fnStartDelete = () => {
    refChildrenFn.current.fnStartDeleteFromParent();
  };

  return (
    <div className={styles.bc0000FormBody}>
      {/*  4  필요한 곳에만 감싼다. store  꼭 정의 - storeBcModify  */}
      <Provider store={storeBcModify}>
        {/* 공통코드 context */}
        <CmPageCmCdListContext.Provider
          value={{ ctxtCmPageCmCdList, setCtxtCmPageCmCdList }}
        >
          {/* 코너 갯수 context */}
          <BcTimeTableCntContext.Provider
            value={{ ctxtBcTimeTableCnt, setCtxtBcTimeTableCnt }}
          >
            <div className={styles.bc0000FormBody__contents}>
              <CmTitle title="기본" />
              {!paramBroadcastSeq || sttDefaultOneJson ? (
                <BcModifyFormBasic
                  {...props}
                  bcBasicData={sttDefaultOneJson}
                  broadcastSeq={paramBroadcastSeq}
                  ref={refChildrenFn}
                />
              ) : (
                ""
              )}
            </div>

            {formFrom !== "signUp" &&
            sttDefaultOneJson &&
            sttDefaultOneJson.broadcastSeq &&
            (sttDefaultOneJson.createId === myCtxtCmUser.userEmail ||
              myCtxtCmUser.userLevel >= CM_USER_LEVEL_ADM) ? (
              <>
                {/* ctxtBcTimeTableCnt {ctxtBcTimeTableCnt} */}
                <div className={styles.bc0000FormBody__contents}>
                  {/* 게스트 목록 context */}
                  <BcTimeGuestListContext.Provider
                    value={{ ctxtBcTimeGuestList, setCtxtBcTimeGuestList }}
                  >
                    <BcModifyFormConner
                      {...props}
                      bcBasicData={sttDefaultOneJson}
                      broadcastSeq={paramBroadcastSeq}
                    />
                  </BcTimeGuestListContext.Provider>
                </div>
                <div>
                  {formFrom !== "modify" &&
                  myCtxtCmUser.userEmail &&
                  myCtxtCmUser.userEmail !== CM_LOGIN_NOT_CHECK &&
                  myCtxtCmUser.userEmail !== CM_LOGIN_NOT_EMAIL ? (
                    <>
                      <Button
                        color="primary"
                        onClick={() => {
                          fnStartSave();
                        }}
                      >
                        등록
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                  {formFrom === "modify" &&
                  myCtxtCmUser.userEmail &&
                  sttDefaultOneJson &&
                  (sttDefaultOneJson.createId === myCtxtCmUser.userEmail ||
                    myCtxtCmUser.userLevel >= CM_USER_LEVEL_ADM) ? (
                    <Button
                      color="primary"
                      onClick={() => {
                        fnStartSave();
                      }}
                    >
                      수정
                    </Button>
                  ) : (
                    ""
                  )}
                  {myCtxtCmUser.userEmail &&
                  sttDefaultOneJson &&
                  (sttDefaultOneJson.createId === myCtxtCmUser.userEmail ||
                    myCtxtCmUser.userLevel >= CM_USER_LEVEL_ADM) ? (
                    <>
                      &nbsp;
                      <Button
                        color="danger"
                        onClick={() => {
                          fnStartDelete();
                        }}
                      >
                        삭제
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                  &nbsp;
                  <Button
                    color="success"
                    onClick={() => {
                      window.location.href = window.location.pathname.replace(
                        "modify",
                        "detail"
                      );
                    }}
                  >
                    상세
                  </Button>
                  &nbsp;
                  <Button
                    color="secondary"
                    onClick={() => {
                      window.location.href =
                        URL_BC_LIST +
                        "?" +
                        CmChangeJsonToSearch(initSrchWordList);
                    }}
                  >
                    리스트
                  </Button>
                </div>
              </>
            ) : (
              ""
            )}
          </BcTimeTableCntContext.Provider>
        </CmPageCmCdListContext.Provider>
      </Provider>
    </div>
  );
}
