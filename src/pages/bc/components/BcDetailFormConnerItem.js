import { useContext, useEffect, useState } from "react";
import { Badge, Button } from "reactstrap";
import styles from "./Bc0000Form.module.scss";
import BcDetailFormGuest from "./BcDetailFormGuest";
import { CmUserContext } from "../../../context/CmUserContext";
// import { CmPageCmCdListContext } from "../../../context/CmPageCmCdListContext";
import {
  CM_LOGIN_NOT_CHECK,
  CmGetTranslated,
  CmIsNull,
  CmSetTextareaValueDetail,
} from "../../../components/js/Common";
import { BcTimeTableListContext } from "../../../context/BcTimeTableListContext";


export default function BcDetailFormConnerItem(props) {
  const item = props.item;
  const bOpenAll = props.bOpenAll;

  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  const { ctxtBcTimeTableList } = useContext(BcTimeTableListContext);

  // 공통코드 리스트
  // const { ctxtCmPageCmCdList } = useContext(CmPageCmCdListContext);

  // 데이터 타입
  const defaultOneJson = {
    timeTableSeq: item.timeTableSeq
      ? item.timeTableSeq
      : props.timeTableSeq
      ? props.timeTableSeq
      : 0, // 타임테이블seq
    newTimeTableSeq: item.newTimeTableSeq ? item.newTimeTableSeq : 0,
    broadcastSeq: item.broadcastSeq, // 방송정보seq
    timeTableOrderSeq: item.timeTableOrderSeq, // 순번
    // newTimeTableSeq: item.newTimeTableSeq, // 신규인 경우 임시값세팅

    timeStartSec: CmIsNull(item.timeStartSec), // 유튜브 시간정보
    connerId: CmIsNull(item.connerId), // 코너정보seq
    connerTitle: CmIsNull(CmSetTextareaValueDetail(item.connerTitle)), // 제목
    timeTableContents: CmIsNull(
      CmSetTextareaValueDetail(item.timeTableContents)
    ), // 내용
    linkInfoSeq: CmIsNull(item.linkInfoSeq), // 링크정보seq
    deleteYn: "N",
    createId: myCtxtCmUser.userEmail,
    updateId: myCtxtCmUser.userEmail,
  };

  const [sttDefaultOneJson] = useState(defaultOneJson);

  const showOrderSeq =
    ctxtBcTimeTableList.findIndex((item) => {
      return item.timeTableSeq === sttDefaultOneJson.timeTableSeq;
    }) + 1;


  const gotoConnerYtbUrl = () => {
    if (item.broadcastUrl && item.timeStartSec) {
      window.open(
        `${item.broadcastUrl}&t=${item.timeStartSec}s`,
        "_blank",
        "noopener",
        "noreferer"
      );
    }
  };

  const [bOpenBody, setBOpenBody] = useState(bOpenAll);
  const openCloseBody = () => {
    setBOpenBody(!bOpenBody);
  };

  useEffect(() => {
    setBOpenBody(bOpenAll);
  }, [bOpenAll]);

  return (
    <div>
      <div>
        <div className={styles.bc0000FormBody__contents__timeTable__header}>
          <div
            id="contentsButton"
            className={styles.bc0000FormBody__contents__timeTable__open}
          >
            <Button
              onClick={() => {
                openCloseBody();
              }}
              color="primary"
              size="sm"
              outline
              className="cursorPointer"
            >
              {bOpenBody ? "닫기" : "열기"}
            </Button>
          </div>

          <b>
            {showOrderSeq}. {sttDefaultOneJson.connerTitle}{" "}
            {item.broadcastUrl && item.timeStartSec ? (
              <>
                &nbsp;
                <Badge
                  onClick={gotoConnerYtbUrl}
                  color="primary"
                  className="cursorPointer"
                >
                  바로보기
                </Badge>
              </>
            ) : (
              ""
            )}
          </b>
        </div>

        {bOpenBody ? (
          <div className={styles.bc0000FormBody__contents__timeTable__body}>
            <div
              dangerouslySetInnerHTML={CmGetTranslated(
                CmSetTextareaValueDetail(
                  sttDefaultOneJson.timeTableContents.replaceAll("\n", "<br/>")
                )
              )}
            ></div>
            <BcDetailFormGuest timetableseq={sttDefaultOneJson.timeTableSeq} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
