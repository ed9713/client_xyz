import styles from "./Main0000Form.module.scss";
import MainCalendarForm from "./MainCalendarForm";
import MainBodyform from "./MainBodyForm";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import { useContext, useEffect, useState } from "react";
import { CM_LOGIN_NOT_CHECK } from "../../../components/js/Common";
import CmAlert from "../../../hook/CmAlert";
import axios from "axios";
import { CmUserContext } from "../../../context/CmUserContext";
import moment from "moment";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function MainForm(props) {
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };
  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  const history = useHistory();
  const [sMonth, setSMonth] = useState(
    props.sMonth ? props.sMonth : moment().format("YYYY-MM")
  );

  const [sBroadcastDate, setSBroadcastDate] = useState("");

  //
  // const [date, setDate] = useState(sMonth);
  const [sKind, setSKind] = useState("channel");
  const [cntListTotal, setCntListTotal] = useState(0);
  // const [list, setList] = useState([]); // 검색한 리스트

  // 채널이냐 코너냐 선택
  const changeValue = (e) => {
    const { value } = e.target;
    setSKind(value);
  };

  useEffect(() => {
    // 채널, 코너 여부 체크
    getTotalCntList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sMonth]);

  // 내부함수 - 해당페이지의 총갯수
  const getTotalCntList = () => {
    const srchWord = { sBroadcastMonth: sMonth };

    axios
      .post("/api/ytb/bcForm?type=cntListTotal", {
        ...srchWord,
      })
      .then((response) => {
        try {
          const result = response.data;
          const cntTotal = result.json[0].cnt;
          if (cntTotal > 0) {
            setCntListTotal(cntTotal); // 총 갯수 세팅
          } else {
            setCntListTotal(0); // 총 갯수 세팅
          }
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        CmAlert("작업중 오류가 발생하였습니다.", "", "error", "닫기");
        return false;
      });
  };

  // 검색 달을 세팅한다.
  const setMainSMonth = (pMonth) => {
    history.push(`/?sMonth=${pMonth}`);
    setSMonth(pMonth);
  };

  // 검색 일을 세팅한다.
  const setMainSBroadcastDate = (pDate) => {
    setSBroadcastDate(pDate);
    // history.push(`/?sMonth=${pMonth}`);
  };

  // 오늘 클릭시

  return (
    <div className={styles.main0000FormBody}>
      <div className={styles.main0000FormBody__contents__calendar}>
        <MainCalendarForm
          {...props}
          sKind={sKind}
          sMonth={sMonth}
          sBroadcastDate={sBroadcastDate}
          setParentSMonth={setMainSMonth}
          setParentSBroadcastDate={setMainSBroadcastDate}
        />
      </div>
      <br />
      <div className={styles.main0000FormBody__contents__dpOption}>
        <Row>
          <Col>
            <FormGroup tag="fieldset">
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="sKind"
                  value="channel"
                  checked={sKind === "channel" ? true : false}
                  onChange={changeValue}
                />
                <Label check>채널</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="sKind"
                  value="conner"
                  checked={sKind === "conner" ? true : false}
                  onChange={changeValue}
                />
                <Label check>코너</Label>
              </FormGroup>
            </FormGroup>
          </Col>
          {/* <Col>
          <div onClick={clickToday}>오늘은 {today}</div>
          </Col> */}
        </Row>
      </div>

      {cntListTotal > 0 ? (
        <MainBodyform
          {...props}
          sKind={sKind}
          sMonth={sMonth}
          sBroadcastDate={sBroadcastDate}
        />
      ) : (
        ""
      )}


    </div>
  );
}
