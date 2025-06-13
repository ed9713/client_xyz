import { useContext, useEffect, useState } from "react";
import BcModifyFormConnerItem from "./BcModifyFormConnerItem";
import CmTitle from "../../../components/design/CmTemplate";
import { Button, Col, Row } from "reactstrap";
import { CmUserContext } from "../../../context/CmUserContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";
import { CM_CM_USER_DEFAULT, CM_LOGIN_NOT_CHECK, CmGetNewTempSeq } from "../../../components/js/Common";
import { BcTimeTableListContext } from "../../../context/BcTimeTableListContext";
import { BcTimeTableCntContext } from "../../../context/BcTimeTableCntContext";

export default function BcModifyFormConner(props) {

  const history = useHistory();
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK
  }

  // 수정일 경우 처리
  let paramBroadcastSeq = props && props.broadcastSeq ? props.broadcastSeq : "";

  if (paramBroadcastSeq) {
  } else {
    // formFrom = "signUp";
    paramBroadcastSeq = "";
  }

  const paramChannelId =
    props && props.bcBasicData && props.bcBasicData.channelId
      ? props.bcBasicData.channelId
      : "";

  // 코너 갯수
  const { ctxtBcTimeTableCnt, setCtxtBcTimeTableCnt } = useContext(
    BcTimeTableCntContext
  );

  // 코너들 리스트 
  const [timeTableList, setTimeTableList] = useState([]);

  // 타임테이블 데이터
  useEffect(() => {
    getList("BcModify");
  }, []);

  // 페이지 내에서 코너 리스트
  const [ctxtBcTimeTableList, setCtxtBcTimeTableList] = useState([]); // dp 용

  //===================================================================
  // 타임테이블 데이터 가져오기
  const getList = (pKind) => {
    let insertJson = { useYn: "Y" };
    insertJson = {
      ...insertJson,
      broadcastSeq: paramBroadcastSeq,
    };
    axios
      .post("/api/ytb/bcForm?type=listAllTt", insertJson)
      .then((response) => {
        try {
          const result = response.data;
          if (result.json.length > 0) {
            let tempList = result.json;
            tempList.map(( one , index )=>{
              one.rowNum = index + 1 ; 
            })              
            setTimeTableList(tempList);
            setCtxtBcTimeTableList(tempList);
            setCtxtBcTimeTableCnt(tempList.length);
          } else {
            addTimeTable();
          }
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch((response) => {
        return false;
      });
  };

  // 신규 타임테이블 추가
  const addTimeTable = () => {
    let newTimeTableList = timeTableList.slice();
    const newTimeTableSeq = CmGetNewTempSeq(); 
    let maxTimeTableOrderSeq = 0;

    if (timeTableList && timeTableList.length > 0) {
      let max = 0;
      if (timeTableList.length === 1) {
        max = timeTableList[0].timeTableOrderSeq;
      } else {
        max = timeTableList.reduce(function (max, p) {
          return p.timeTableOrderSeq > max ? p.timeTableOrderSeq : max;
        }, timeTableList[0].timeTableOrderSeq);
      }
      maxTimeTableOrderSeq = max;
    }

    const addItem = {
      timeTableSeq: newTimeTableSeq,
      newTimeTableSeq: newTimeTableSeq,
      broadcastSeq: paramBroadcastSeq,
      channelId: paramChannelId,
      timeTableOrderSeq: maxTimeTableOrderSeq + 10,
      rowNum: newTimeTableList.length + 1,
    };
    newTimeTableList.push(addItem);

    setTimeTableList(newTimeTableList);
    setCtxtBcTimeTableCnt(newTimeTableList.length);

    // display 용
    let newCtxtBcTimeTableList = ctxtBcTimeTableList.slice();
    newCtxtBcTimeTableList.push(addItem);
    setCtxtBcTimeTableList(newCtxtBcTimeTableList);
  };

  return (
    <>
      <CmTitle title="타임테이블" />
      <Row>
        <Col md={9}>총 {ctxtBcTimeTableList.length}개 </Col>
        <Col md={3} className="cmBottom">
          <Button size="sm" color="info" onClick={addTimeTable} outline>
            코너정보 &nbsp; - 추가
          </Button>
        </Col>
      </Row>

      <BcTimeTableListContext.Provider
        value={{ ctxtBcTimeTableList, setCtxtBcTimeTableList }}
      >
        {props &&
          props.bcBasicData &&
          timeTableList &&
          timeTableList.map((item, index) => (
            <BcModifyFormConnerItem
              {...props}
              bcBasicData={props.bcBasicData}
              item={item}
              key={index + 1}
            />
          ))}
      </BcTimeTableListContext.Provider>
    </>
  );
}
