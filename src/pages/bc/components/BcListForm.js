import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import CmAlert from "../../../hook/CmAlert";

import CmTitle, { CmPagination } from "../../../components/design/CmTemplate";
import {
  CM_LOGIN_NOT_CHECK,
  CM_LOGIN_NOT_EMAIL,
  CmChangeJsonToSearch,
  CmChangeSearchToJson,
  CmChangeValue,
  CmGetDayOfTheWeek,
  CmGetListConfig,
  CmGetTranslated,
  CmSetTextareaValueDetail,
  URL_BC_LIST,
} from "../../../components/js/Common";
import styles from "./Bc0000Form.module.scss";
import { CmUserContext } from "../../../context/CmUserContext";

export default function BcListForm(props) {
  const history = useHistory();
  const paramNowPage =
    props && props.match && props.match.params && props.match.params.nowPage
      ? props.match.params.nowPage
      : 1;

  const [nowPage, setNowPage] = useState(paramNowPage);

  const gotoNowUrl = URL_BC_LIST;
  const initSrchWordList = useMemo(() => {
    // console.log(`searchWordList`)
    return CmChangeSearchToJson(props.location.search.replace("?", ""));
  }, [props.location.search]);

  //====================================================================
  const { ctxtCmUser } = useContext(CmUserContext);

  let myCtxtCmUser = { ...ctxtCmUser };
  if (!myCtxtCmUser) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  //====================================================================
  // 설정값

  //====================================================================
  // state 변수
  const [spinnerHidden, setSpinnerHidden] = useState(true);
  const [noDataHidden, setNoDataHidden] = useState(true);

  const [list, setList] = useState([]); // 검색한 리스트
  const [cmCdList, setCmCdList] = useState([]); // 코드 리스트
  const [cntListTotal, setCntListTotal] = useState(0); // 총갯수

  const [sttSrchWordList, setSttSrchWordList] = useState(initSrchWordList);
  const [sttSrchStartTime, setSttSrchStartTime] = useState(new Date());
  //====================================================================
  // 리스트  가져오기
  useEffect(() => {
    // console.log(`useEffect useEffect nowPage ` + nowPage);
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPage, sttSrchStartTime]);

  // 공통코드 가져오기
  useEffect(() => {
    getListByGroupId("BcList");
  }, []);

  //===================================================================
  const getListByGroupId = (pKind) => {
    pKind = "BcList";

    let insertJson = { useYn: "Y" };
    let cdGroupIdList = "";
    let cdGroupIdYn = "N";
    switch (pKind) {
      case "BcList":
        cdGroupIdList = "orderByColBcCd,channel";
        cdGroupIdYn = "Y";
        break;
      case "CmCdModify":
        cdGroupIdYn = "Y";
        break;
      default:
        cdGroupIdList = "";
    }

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
          setCmCdList(result.json);
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  //====================================================================
  // 실제 리스트
  const getList = () => {
    let cntTotal = 0;
    setNoDataHidden(true);

    setCntListTotal(0); // 총 갯수 세팅
    setList([]);

    // 내부함수 - 해당페이지의 총갯수
    const getTotalCntList = () => {
      setSpinnerHidden(false);

      axios
        .post("/api/ytb/bcForm?type=cntListTotal", {
          ...sttSrchWordList,
        })
        .then((response) => {
          try {
            const result = response.data;
            cntTotal = result.json[0].cnt;

            if (cntTotal > 0) {
              setCntListTotal(cntTotal); // 총 갯수 세팅
              getListPage();
            } else {
              setNoDataHidden(false);
              setSpinnerHidden(true);

              setCntListTotal(0); // 총 갯수 세팅
              setList([]);
            }
          } catch (error) {
            CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
            setSpinnerHidden(true);
          }

          setTimeout(function () {
            setSpinnerHidden(true);
          }, 500);
        })
        .catch(() => {
          CmAlert("작업중 오류가 발생하였습니다.", "", "error", "닫기");
          setSpinnerHidden(true);
          return false;
        });
    };

    // 내부함수 - 해당페이지의 리스트 가져오기
    const getListPage = () => {
      let listConfig = CmGetListConfig(nowPage, cntTotal);
      let insertJson = { ...sttSrchWordList, ...listConfig, useYn: "" };

      axios
        .post("/api/ytb/bcForm?type=list", insertJson)
        .then((response) => {
          try {
            const result = response.data;
            let tempList = result.json;
            tempList.map((one, index) => {
              one.rowNum = listConfig.topStart + index;
            });
            setList(tempList);
            if (result.json.length === 0) {
              setNoDataHidden(false);
            }
          } catch (error) {
            CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
          }
        })
        .catch(() => {
          return false;
        });

      setSpinnerHidden(true);
    };

    // 실제 처리
    getTotalCntList();
  };

  // 값들 변경시
  const changeValue = (e) => {
    const chgValue = CmChangeValue(e, { ...sttSrchWordList });
    setSttSrchWordList(chgValue);
  };

  const gotoSignUp = () => {
    history.push("/bc/register");
  };

  const gotoModify = (pSeq) => {
    history.push(`/bc/modify/${pSeq}`);
  };

  const gotoDetail = (pSeq) => {
    history.push(
      `/bc/detail/${pSeq}?` +
        CmChangeJsonToSearch(sttSrchWordList) +
        `&sPage=${nowPage}`
    );
  };

  const gotoSearch = () => {
    history.push(`${gotoNowUrl}/1?` + CmChangeJsonToSearch(sttSrchWordList));
    setSttSrchStartTime(new Date());
    setNowPage(1);
  };

  const fnGotoList = (pPage) => {
    setNowPage(pPage);
  };

  return (
    <>
      <div className={styles.bc0000FormBody}>
        <div className={styles.bc0000FormBody__contents}>
          <CmTitle title={`총 ${cntListTotal}개`} />
          <Form>
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col md={2}>
                <Label className="visually-hidden" for="sChannelId">
                  channelId
                </Label>
                <Input
                  id="sChannelId"
                  name="sChannelId"
                  type="select"
                  value={sttSrchWordList.sChannelId}
                  onChange={(e) => changeValue(e)}
                >
                  <option value="">채널ID</option>
                  {cmCdList
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
              </Col>
              <Col md={2}>
                <Label className="visually-hidden" for="sBroadcastDate">
                  * 날짜
                </Label>
                <Input
                  id="sBroadcastDate"
                  name="sBroadcastDate"
                  placeholder="날짜"
                  type="date"
                  value={sttSrchWordList.sBroadcastDate}
                  onChange={(e) => changeValue(e)}
                />
              </Col>
              <Col md={2}>
                <Label className="visually-hidden" for="sBroadcastTitle">
                  broadcastTitle
                </Label>
                <Input
                  id="sBroadcastTitle"
                  name="sBroadcastTitle"
                  placeholder="제목"
                  type="text"
                  value={sttSrchWordList.sBroadcastTitle}
                  onChange={(e) => changeValue(e)}
                />
              </Col>
              <Col md={2}>
                <Label className="visually-hidden" for="sOrderField">
                  order by
                </Label>
                <Input
                  id="sOrderField"
                  name="sOrderField"
                  type="select"
                  value={sttSrchWordList.sOrderField}
                  onChange={(e) => changeValue(e)}
                >
                  <option value="">정렬컬럼</option>
                  {cmCdList
                    .filter((item) => {
                      return item.cdGroupId === "orderByColBcCd";
                    })
                    .map((one, index) => {
                      return (
                        <option key={index} value={one.cdId}>
                          {one.cdNm}
                        </option>
                      );
                    })}
                </Input>
              </Col>
              <Col md={4}>
                <Button onClick={gotoSearch} color="success">
                  검색
                </Button>
                &nbsp;
                <Button onClick={() => (window.location.href = gotoNowUrl)}>
                  초기화
                </Button>
                {myCtxtCmUser.userEmail &&
                myCtxtCmUser.userEmail !== CM_LOGIN_NOT_CHECK &&
                myCtxtCmUser.userEmail !== CM_LOGIN_NOT_EMAIL ? (
                  <>
                    &nbsp;
                    <Button color="primary" onClick={gotoSignUp}>
                      등록
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Form>
          <br />
          <Table hover>
            <thead>
              <tr align="center">
                <th>#</th>
                <th>채널ID</th>
                <th width="140">날짜</th>
                <th>제목</th>
              </tr>
            </thead>
            <tbody>
              <tr hidden={spinnerHidden}>
                <td colSpan="5" align="center">
                  <Spinner color="primary">Loading...</Spinner>
                </td>
              </tr>
              {list.length > 0 &&
                spinnerHidden &&
                list.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th
                        onClick={() => {
                          gotoModify(item.broadcastSeq);
                        }}
                        className="cursorPointer"
                        align="right"
                        scope="row"
                      >
                        {cntListTotal - item.rowNum + 1}
                      </th>
                      <td>{item.channelNm}</td>
                      <td>
                        {item.broadcastDate} (
                        {CmGetDayOfTheWeek(item.broadcastDateYoil)})
                      </td>
                      <td
                        onClick={() => {
                          gotoDetail(item.broadcastSeq);
                        }}
                        className="cursorPointer"
                      >
                        <div
                          dangerouslySetInnerHTML={CmGetTranslated(
                            CmSetTextareaValueDetail(item.broadcastTitle)
                          )}
                        ></div>
                      </td>
                    </tr>
                  );
                })}
              {list.length === 0 ? (
                <tr hidden={noDataHidden}>
                  <td colSpan="6" align="center" valign="middle">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                ""
              )}
            </tbody>
          </Table>
        </div>

        <div>
          {/* 페이지네이션  */}
          {cntListTotal > 0 ? (
            <CmPagination
              nowPage={nowPage}
              totalCount={cntListTotal}
              gotoUrl={gotoNowUrl}
              searchWordList={CmChangeJsonToSearch(sttSrchWordList)}
              fnGotoList={fnGotoList}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
