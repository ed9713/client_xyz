import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Badge, Col, Row, Spinner } from "reactstrap";
import {
  CM_LOGIN_NOT_CHECK,
  CmChangeJsonToSearchWithList,
  CmChangeSearchToJson,
  CmGetDayOfTheWeek,
  CmGetTranslated,
  CmSetTextareaValueDetail,
  URL_BC_LIST,
} from "../../../components/js/Common";
import { CmUserContext } from "../../../context/CmUserContext";
import CmAlert from "../../../hook/CmAlert";
import styles from "./Bc0000Form.module.scss";

export default function BcDetailFormBasic(props) {
  let formFrom = props.formFrom ? props.formFrom : "signUp";
  formFrom = "modify";
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

  // 수정일 경우 처리
  let paramBroadcastSeq = props && props.broadcastSeq ? props.broadcastSeq : "";

  if (paramBroadcastSeq) {
  } else {
    formFrom = "signUp";
    paramBroadcastSeq = "";
  }

  const [sttDefaultOneJson, setSttDefaultOneJson] = useState([]);
  const [spinnerHidden, setSpinnerHidden] = useState(true);

  // 함수
  const gotoList = () => {
    history.push(CmChangeJsonToSearchWithList(URL_BC_LIST, initSrchWordList));
  };

  // 로딩시 데이터 가져오기
  useEffect(() => {
    if (formFrom === "modify") {
      setSpinnerHidden(false);

      axios
        .post("/api/ytb/bcForm?type=detailOne", {
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
  }, []);

  const showMore = () => {
    let b = document.querySelector(`#contents`);
    let c = document.querySelector(`#contentsButton`);
    if (b && b.className) {
      b.className = b.className.replaceAll("text", "");
    }
    if (c && c.className) {
      c.style = "display:none";
    }
  };

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      CmAlert("클립보드에 링크가 복사되었습니다.", "", "info", "닫기", 1000);
    } catch (e) {
      CmAlert("복사에 실패하였습니다.", "", "info", "닫기", 1000);
    }
  };

  const gotoConnerYtbUrl = () => {
    const broadcastUrl = sttDefaultOneJson.broadcastUrl;
    window.open(`${broadcastUrl}`, "_blank", "noopener", "noreferer");
  };

  const gotoChannelUrl = () => {
    const broadcastUrl = sttDefaultOneJson.channelUrl;
    if (broadcastUrl)
      window.open(`${broadcastUrl}`, "_blank", "noopener", "noreferer");
  };

  return (
    <>
      <Spinner color="primary" hidden={spinnerHidden}>
        Loading...
      </Spinner>
      <div className={styles.bc0000FormBody__contents} hidden={!spinnerHidden}>
        <div className="cursorPointer" onClick={gotoChannelUrl}>
          {sttDefaultOneJson.channelNm}&nbsp;⌂
        </div>
        <div>
          <h4>
            <div
              dangerouslySetInnerHTML={CmGetTranslated(
                CmSetTextareaValueDetail(sttDefaultOneJson.broadcastTitle)
              )}
            ></div>
          </h4>
        </div>

        <div>
          <Row>
            <Col md={6}>진행자 : {sttDefaultOneJson.mainPeopleNm}</Col>
            <Col md={3}>
              방송시간 : {sttDefaultOneJson.broadcastDate} (
              {CmGetDayOfTheWeek(sttDefaultOneJson.broadcastDateYoil)}){" "}
              {sttDefaultOneJson.broadcastStartTime}
              &nbsp;&nbsp;
            </Col>

            <Col md={3}>
              <Badge
                color="primary"
                className="cursorPointer"
                onClick={gotoConnerYtbUrl}
              >
                보러가기
              </Badge>
              &nbsp;
              <Badge
                color="primary"
                className="cursorPointer"
                onClick={() =>
                  handleCopyClipBoard(sttDefaultOneJson.broadcastUrl)
                }
              >
                링크복사
              </Badge>
            </Col>
          </Row>
        </div>

        {/* 내용 */}
        <hr />
        <div
          hidden
          dangerouslySetInnerHTML={CmGetTranslated(
            CmSetTextareaValueDetail(sttDefaultOneJson.broadcastContents)
          )}
        ></div>

        <div id="contents" className="text">
          {sttDefaultOneJson.broadcastContents &&
          sttDefaultOneJson.broadcastContents.length > 10 ? (
            <div id="contentsButton" className="more">
              <Badge
                onClick={showMore}
                color="primary"
                className="cursorPointer"
              >
                전체보기
              </Badge>
            </div>
          ) : (
            ""
          )}
          <div
            dangerouslySetInnerHTML={CmGetTranslated(
              CmSetTextareaValueDetail(sttDefaultOneJson.broadcastContents)
            )}
          ></div>
        </div>

        {/* 오프닝 멘트 */}

        {/* <hr />
        <div>
          <Label>오프닝 멘트</Label>
        </div>
        <div
          dangerouslySetInnerHTML={CmGetTranslated(
            sttDefaultOneJson.todayThinking
          )}
        ></div> */}
        <hr />
      </div>
    </>
  );
}
