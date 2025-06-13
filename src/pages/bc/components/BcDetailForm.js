import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "reactstrap";
import styles from "./Bc0000Form.module.scss";

import { CmDetailTitle } from "../../../components/design/CmTemplate";
import BcDetailFormBasic from "./BcDetailFormBasic";
import BcDetailFormConner from "./BcDetailFormConner";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { CmUserContext } from "../../../context/CmUserContext";
import { CmPageCmCdListContext } from "../../../context/CmPageCmCdListContext";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";
import { BcTimeGuestListContext } from "../../../context/BcTimeGuestListContext";
// 3 Provider
import {
  CM_LOGIN_NOT_CHECK,
  CM_USER_LEVEL_ADM,
  CmChangeJsonToSearchWithList,
  CmChangeSearchToJson,
  URL_BC_LIST,
} from "../../../components/js/Common";

export default function BcDetailForm(props) {
  // let formFrom = props.formFrom ? props.formFrom : "signUp";
  const history = useHistory();
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
    // formFrom = "signUp";
    paramBroadcastSeq = "";
  }

  // 페이지 내에서 사용하는 공통 코드 리스트
  const [ctxtCmPageCmCdList, setCtxtCmPageCmCdList] = useState([]);

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

  // 페이지 내 게스트 리스트
  useEffect(() => {
    getListTimeGuestByParentId("BcModify");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //===================================================================
  // 게스트 리스트 가져오기
  const getListTimeGuestByParentId = (pKind) => {
    pKind = "BcModify";

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
          // setCtxtBcTimeGuestList(result.json);
          setCtxtBcTimeGuestList(tempList);
          // console.log(result) 
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
              gotoList();
            }, 1000);
          } else {
            let bcOne = result.json[0];
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 함수
  const gotoList = () => {
    history.push(CmChangeJsonToSearchWithList(URL_BC_LIST, initSrchWordList));
  };

  const gotoModify = (pSeq) => {
    history.push(`/bc/modify/${pSeq}`);
  };

  return (
    <div className={styles.bc0000FormBody}>
      {/* 공통코드 context */}
      <CmPageCmCdListContext.Provider
        value={{ ctxtCmPageCmCdList, setCtxtCmPageCmCdList }}
      >
        {/* 기본 */}
        <div className={styles.bc0000FormBody__contents}>
          <CmDetailTitle title="기본" />
          <BcDetailFormBasic {...props} broadcastSeq={paramBroadcastSeq} />
        </div>

        {/* 코너 목록 */}

        {/* 게스트 목록 context */}
        <div className={styles.bc0000FormBody__contents}>
          <BcTimeGuestListContext.Provider
            value={{ ctxtBcTimeGuestList, setCtxtBcTimeGuestList }}
          >
            <BcDetailFormConner {...props} broadcastSeq={paramBroadcastSeq} />
          </BcTimeGuestListContext.Provider>
        </div>
      </CmPageCmCdListContext.Provider>

      <div>
        {myCtxtCmUser &&
        sttDefaultOneJson &&
        (sttDefaultOneJson.createId === myCtxtCmUser.userEmail ||
          myCtxtCmUser.userLevel >= CM_USER_LEVEL_ADM) ? (
          <Button
            color="primary"
            onClick={() => {
              gotoModify(paramBroadcastSeq);
            }}
          >
            수정
          </Button>
        ) : (
          ""
        )}
        &nbsp;<Button onClick={gotoList}>리스트</Button>
      </div>
    </div>
  );
}
