import { useEffect, useState } from "react";
import styles from "./Main0000Form.module.scss";
import CmTitle from "../../../components/design/CmTemplate";
import { Badge, Col, Row } from "reactstrap";
import {
  CmGetDayOfTheWeek,
  CmGetListConfig,
  CmGetTranslated,
  CmSetTextareaValueDetail,
  URL_BC_DETAIL,
} from "../../../components/js/Common";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";
import moment from "moment";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function MainBodyform(props) {
  const sMonth = props.sMonth ? props.sMonth : moment().format("YYYY-MM");
  const sKind = props.sKind === "conner" ? props.sKind : "channel";
  const sBroadcastDate = props.sBroadcastDate ? props.sBroadcastDate : "";

  const [list, setList] = useState([]);

  const srchWord = { sBroadcastMonth: sMonth, sBroadcastDate: sBroadcastDate };

  const history = useHistory();

  useEffect(() => {
    getListPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sMonth, sBroadcastDate, sKind]);

  
  // 내부함수 - 해당페이지의 리스트 가져오기
  const getListPage = () => {
    let listConfig = CmGetListConfig(1, 10);
    let url = "/api/ytb/bcForm?type=list";

    if (sKind === "conner") {
      url = "/api/ytb/bcForm?type=listTt";
      listConfig.numPerPage = 20;
    }

    let insertJson = { ...srchWord, ...listConfig, useYn: "" };
    axios
      .post(url, insertJson)
      .then((response) => {
        try {
          const result = response.data;
          let tempList = result.json;
          tempList.map((one, index) => one.rowNum = listConfig.topStart + index  );
          setList(tempList);         
          setList(result.json);
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.[]", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  const gotoDetail = (pSeq) => {
    history.push(URL_BC_DETAIL + `/${pSeq}`);
  };

  const gotoConnerYtbUrl = (pUrl) => {
    // const broadcastUrl = sttDefaultOneJson.broadcastUrl;
    window.open(`${pUrl}`, "_blank", "noopener", "noreferer");
  };

  const dpSearchDate = sBroadcastDate ? sBroadcastDate : sMonth;

  return (
    <>
      <div className={styles.main0000FormBody__contents}>
        {sKind === "channel" ? (
          <div>
            <CmTitle title={`최근 채널 10개 (${dpSearchDate})`} />
            <br />
          </div>
        ) : (
          ""
        )}
        {sKind === "conner" ? (
          <div>
            <CmTitle title={`최근 코너 20개 (${dpSearchDate})`} />
            <br />
          </div>
        ) : (
          ""
        )}
        <div>
          <Row className={styles.main0000FormBody__contents__connerListHeader}>
            <Col md={1}>#</Col>
            <Col md={2}>날짜</Col>
            <Col md={2}>
              <div id="ChannelToolTip">채널</div>
            </Col>
            <Col md={5}>
              <div id="ConnerTitleToolTip">
                {" "}
                {sKind === "channel" ? "방송" : "코너"} 제목
              </div>
            </Col>
            <Col md={2}>링크</Col>
          </Row>
        </div>

        {list.map((item, index) => {
          return (
            <div key={index}>
              <Row>
                <Col
                  className={styles.main0000FormBody__contents__bodyFormCol}
                  md={1}
                >
                  {index + 1}
                </Col>
                <Col md={2}>
                  {item.broadcastDate} (
                  {CmGetDayOfTheWeek(item.broadcastDateYoil)})
                </Col>
                <Col
                  className={styles.main0000FormBody__contents__bodyFormCol}
                  md={2}
                >
                  <div>{item.channelNm}</div>
                </Col>
                <Col
                  className={styles.main0000FormBody__contents__bodyFormCol}
                  md={5}
                >
                  <div
                    onClick={() => {
                      gotoDetail(item.broadcastSeq);
                    }}
                    className="cursorPointer"
                    dangerouslySetInnerHTML={CmGetTranslated(
                      CmSetTextareaValueDetail(
                        sKind === "channel"
                          ? item.broadcastTitle
                          : item.connerTitle
                      )
                    )}
                  ></div>
                </Col>
                <Col md={2}>
                  {item.broadcastUrl &&
                  (sKind === "channel" ||
                    (sKind === "conner" && item.timeStartSec)) ? (
                    <Badge
                      color="primary"
                      className="cursorPointer"
                      onClick={() => {
                        let url = item.broadcastUrl;
                        if (sKind === "conner")
                          url += "&t=" + item.timeStartSec + "s";
                        gotoConnerYtbUrl(url);
                      }}
                    >
                      {sKind === "conner" ? "바로보기" : "보러가기"}
                    </Badge>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              <hr />
            </div>
          );
        })}
      </div>
    </>
  );
}
