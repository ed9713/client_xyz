import styles from "./Bc0000Form.module.scss";
import { CmDetailTitle } from "../../../components/design/CmTemplate";
import BcDetailFormConnerItem from "./BcDetailFormConnerItem";
import { useContext, useEffect, useState } from "react";
import { CmUserContext } from "../../../context/CmUserContext";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";
import { Button } from "reactstrap";
import { BcTimeTableListContext } from "../../../context/BcTimeTableListContext";
import { CM_LOGIN_NOT_CHECK } from "../../../components/js/Common";

export default function BcDetailFormConner(props) {
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  // 수정일 경우 처리
  let paramBroadcastSeq = props && props.broadcastSeq ? props.broadcastSeq : "";

  if (paramBroadcastSeq) {
  } else {
    // formFrom = "signUp";
    paramBroadcastSeq = "";
  }

  const [timeTableList, setTimeTableList] = useState([]);

  // 타임테이블 데이터
  useEffect(() => {
    getList("BcModify");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 페이지 내에서 코너 리스트
  const [ctxtBcTimeTableList, setCtxtBcTimeTableList] = useState([]);

  // const [accordingDefaultOpenList, setAccordingDefaultOpenList] = useState([]);
  //===================================================================
  // 타임테이블 데이터 가져오기
  const getList = () => {
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
          // console.log(result)
          if (result.json.length > 0) {
            let tempList = result.json;
            tempList.map((one, index) => one.rowNum = index + 1 );

            setTimeTableList(tempList);
            setCtxtBcTimeTableList(tempList);

            let optionList = [];
            for (let i = 1; i <= result.json.length; i++) {
              optionList.push("" + i + "");
            }
            // setAccordingDefaultOpenList(optionList);
          } else {
            // addTimeTable(); 
          }
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  const [bOpenAll, setBOpenAll] = useState(false);

  const openAllConnerItem = () => {
    setBOpenAll(!bOpenAll);
  };

  return (
    <>
      <CmDetailTitle title={`타임 테이블`} />
      <div>
        총 {ctxtBcTimeTableList.length}개
        <div
          id="contentsButton"
          className={styles.bc0000FormBody__contents__timeTable__open}
        >
          <Button
            onClick={() => {
              openAllConnerItem();
            }}
            color="primary"
            size="sm"
            outline
            className="cursorPointer"
          >
            모두 {bOpenAll ? "닫기" : "열기"}
          </Button>
        </div>
      </div>

      <hr />

      {timeTableList.lenth === 0 ? (
        ""
      ) : (
        <div className={styles.bc0000FormBody__contents}>
          {/* UncontrolledAccordion */}
          <div className="accordion accordion-flush">
            <BcTimeTableListContext.Provider
              value={{ ctxtBcTimeTableList, setCtxtBcTimeTableList }}
            >
              {timeTableList &&
                timeTableList.map((item, index) => (
                  <BcDetailFormConnerItem
                    {...props}
                    item={item}
                    key={index + 1}
                    bOpenAll={bOpenAll}
                  />
                ))}
            </BcTimeTableListContext.Provider>
          </div>
        </div>
      )}
    </>
  );
}
