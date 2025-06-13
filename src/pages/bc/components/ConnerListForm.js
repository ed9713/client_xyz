import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Row,
  Spinner,
  Tooltip,
} from "reactstrap";
import CmAlert from "../../../hook/CmAlert";
import CmTitle, { CmPagination } from "../../../components/design/CmTemplate";
import {
  CmChangeJsonToSearch,
  CmChangeSearchToJson,
  CmChangeValue,
  CmGetListConfig,
} from "../../../components/js/Common";
import styles from "./Bc0000Form.module.scss";
import ConnerListItemForm from "./ConnerListItemForm";

export default function ConnerListForm(props) {
  const history = useHistory();
  const paramNowPage =
    props && props.match && props.match.params && props.match.params.nowPage
      ? props.match.params.nowPage
      : 1;

  const [nowPage, setNowPage] = useState(paramNowPage);

  const gotoNowUrl = "/conner/list";
  const initSrchWordList = useMemo(() => {
    // console.log(`searchWordList`)
    return CmChangeSearchToJson(props.location.search.replace("?", ""));
  }, []);

  //====================================================================
  // 설정값

  //====================================================================
  // state 변수
  const [spinnerHidden, setSpinnerHidden] = useState(true);
  const [noDataHidden, setNoDataHidden] = useState(true);

  const [list, setList] = useState([]); // 검색한 리스트
  const [guestList, setGuestList] = useState([]); // 검색한 리스트
  const [cmCdList, setCmCdList] = useState([]); // 코드 리스트
  const [cntListTotal, setCntListTotal] = useState(0); // 총갯수

  const [sttSrchWordList, setSttSrchWordList] = useState(initSrchWordList);
  const [sttSrchStartTime, setSttSrchStartTime] = useState("");

  const [bOpenAll, setBOpenAll] = useState(false);
  const openAllConnerItem = () => {
    setBOpenAll(!bOpenAll);
  };

  //====================================================================
  // 리스트  가져오기

  useEffect(() => {
    // console.log(`useEffect useEffect nowPage ` + nowPage + `  ` + sttSrchStartTime);
    getList();
  }, [nowPage, sttSrchStartTime]);

  // 공통코드 가져오기
  useEffect(() => {
    getListByGroupId("BcList");
  }, []);

  //===================================================================
  const getListByGroupId = (pKind) => {
    pKind = "connerList";

    let insertJson = { useYn: "Y" };
    let cdGroupIdList = "";
    let cdGroupIdYn = "N";
    switch (pKind) {
      case "BcList":
        cdGroupIdList = "orderByColBcCd,channel";
        cdGroupIdYn = "Y";
        break;
      case "connerList":
        cdGroupIdList = "orderByColConnerCd,channel,conner";
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
    setGuestList([]);

    // 내부함수 - 해당페이지의 총갯수
    const getTotalCntList = () => {
      setSpinnerHidden(false);

      axios
        .post("/api/ytb/bcForm?type=cntListTotalTt", {
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
        .post("/api/ytb/bcForm?type=listTt", insertJson)
        .then((response) => {
          try {
            const result = response.data;
            let tempList = result.json;
            tempList.map((one, index) => {
              one.rowNum = listConfig.topStart + index;
            });
            setList(tempList);
            // setList(result.json);
            if (result.json.length === 0) {
              setNoDataHidden(false);
            } else {
              let ttSeqList = [];
              result.json.map((bcOne) => {
                ttSeqList.push(bcOne.timeTableSeq);
              });
              getListGuest(ttSeqList);
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

    // 내부함수 - 해당 목록의 게스트 목록 가져오기
    const getListGuest = (pTtSeqList) => {
      let timeTableSeqList = pTtSeqList;
      let insertJson = { timeTableSeqList: timeTableSeqList };

      axios
        .post("/api/ytb/bcForm?type=listAllTgByParentSeq", insertJson)
        .then((response) => {
          try {
            const result = response.data;
            let tempList = result.json;
            tempList.map((one, index) => {
              one.rowNum = index + 1;
            });
            setGuestList(tempList);
          } catch (error) {
            CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
          }
        })
        .catch(() => {
          return false;
        });
    };

    // 실제 처리
    getTotalCntList();
  };

  // 값들 변경시
  const changeValue = (e) => {
    const chgValue = CmChangeValue(e, { ...sttSrchWordList });

    const { name } = e.target;
    if (name === "sChannelId") {
      chgValue.sConnerId = "";
    }

    setSttSrchWordList(chgValue);
  };

  const gotoSearch = () => {
    // let gotoUrl = gotoNowUrl + "?" + CmChangeJsonToSearch(sttSrchWordList);
    // console.log(sttSrchWordList)
    // window.location.href = gotoUrl;
    history.push(`${gotoNowUrl}/1?` + CmChangeJsonToSearch(sttSrchWordList));
    setSttSrchStartTime(new Date());
    console.log(`gotoSearch ` + nowPage);
    setNowPage(1);
  };

  const fnGotoList = (pPage) => {
    setNowPage(pPage);
  };

  const [connerIdTooltipOpen, setConnerIdTooltipOpen] = useState(false);
  const toggleConnerIdTooltip = () =>
    setConnerIdTooltipOpen(!connerIdTooltipOpen);

  const [channelTooltipOpen, setChannelTooltipOpen] = useState(false);
  const toggleChannelTooltip = () => setChannelTooltipOpen(!channelTooltipOpen);

  return (
    <>
      <div className={styles.bc0000FormBody}>
        <div className={styles.bc0000FormBody__contents}>
          <CmTitle title={`총 ${cntListTotal}개`} />
          <Form>
            <Row>
              <Col md={3}>
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
                  <option value="">채널</option>
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

              <Col md={3}>
                <Label className="visually-hidden" for="sConnerId">
                  channelId
                </Label>
                <Input
                  id="sConnerId"
                  name="sConnerId"
                  type="select"
                  value={sttSrchWordList.sConnerId}
                  onChange={(e) => changeValue(e)}
                >
                  <option value="">코너</option>
                  {cmCdList
                    .filter((item) => {
                      return (
                        item.cdGroupId === "conner" &&
                        item.cdAttr01 === sttSrchWordList.sChannelId
                      );
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

              <Col md={3}>
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

              <Col md={3}>
                <Label className="visually-hidden" for="sOrderField">
                  order by
                </Label>
                <Input
                  id="sOrderField"
                  name="sOrderField"
                  type="select"
                  value={sttSrchWordList.sCdGroupId}
                  onChange={(e) => changeValue(e)}
                >
                  <option value="">정렬컬럼</option>
                  {cmCdList
                    .filter((item) => {
                      return item.cdGroupId === "orderByColConnerCd";
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
            </Row>

            <Row className={styles.bc0000FormBody__contents__connerSearchBar}>
              <Col md={3}>
                <Label className="visually-hidden" for="sConnerTitle">
                  sConnerTitle
                </Label>
                <Input
                  id="sConnerTitle"
                  name="sConnerTitle"
                  placeholder="코너제목"
                  type="text"
                  value={sttSrchWordList.sConnerTitle}
                  onChange={(e) => changeValue(e)}
                />
              </Col>

              <Col md={3}>
                <Label className="visually-hidden" for="sTimeTableContents">
                  sTimeTableContents
                </Label>
                <Input
                  id="sTimeTableContents"
                  name="sTimeTableContents"
                  placeholder="코너내용"
                  type="text"
                  value={sttSrchWordList.sTimeTableContents}
                  onChange={(e) => changeValue(e)}
                />
              </Col>
              <Col md={3}>
                <Label className="visually-hidden" for="sGuestNm">
                  sGuestNm
                </Label>
                <Input
                  id="sGuestNm"
                  name="sGuestNm"
                  placeholder="참여자"
                  type="text"
                  value={sttSrchWordList.sGuestNm}
                  onChange={(e) => changeValue(e)}
                />
              </Col>
              <Col md={3}>
                <Button onClick={gotoSearch} color="success">
                  검색
                </Button>
                &nbsp;
                <Button onClick={() => (window.location.href = gotoNowUrl)}>
                  초기화
                </Button>
                &nbsp;
                <Button
                  onClick={() => {
                    openAllConnerItem();
                  }}
                  color="primary"
                  outline
                  className="cursorPointer"
                >
                  모두 {bOpenAll ? "닫기" : "열기"}
                </Button>
              </Col>
            </Row>
          </Form>
          <br />

          <div>
            <Row className={styles.bc0000FormBody__contents__connerListHeader}>
              <Col md={1}>#</Col>
              <Col md={2}>날짜</Col>
              <Col md={2}>
                <div id="ChannelToolTip">채널</div>
                <Tooltip
                  placement="top"
                  isOpen={channelTooltipOpen}
                  autohide={false}
                  target="ChannelToolTip"
                  toggle={toggleChannelTooltip}
                >
                  채널 클릭시
                  <br />
                  해당 방송 정보로 이동
                </Tooltip>
              </Col>
              <Col md={5}>
                <div id="ConnerTitleToolTip">코너제목</div>
                <Tooltip
                  placement="top"
                  isOpen={connerIdTooltipOpen}
                  autohide={false}
                  target="ConnerTitleToolTip"
                  toggle={toggleConnerIdTooltip}
                >
                  코너 제목 클릭시
                  <br />
                  코너 내용 보기
                </Tooltip>
              </Col>
              <Col md={2}>링크</Col>
            </Row>
          </div>
          {list.length > 0 &&
            spinnerHidden &&
            list.map((item, index) => {
              return (
                <ConnerListItemForm
                  {...props}
                  item={item}
                  guestList={guestList.filter((tt) => {
                    return tt.timeTableSeq === item.timeTableSeq;
                  })}
                  cntListTotal={cntListTotal}
                  key={index}
                  bOpenAll={bOpenAll}
                />
              );
            })}

          {list.length === 0 ? (
            <>
              <Row
                hidden={noDataHidden}
                className={styles.bc0000FormBody__contents__center}
              >
                <Col md={12}>데이터가 없습니다.</Col>
              </Row>
              <hr />
            </>
          ) : (
            ""
          )}
          {/* 로딩중  */}
          <Row
            hidden={spinnerHidden}
            className={styles.bc0000FormBody__contents__center}
          >
            <Col md={12}>
              <Spinner color="primary">Loading...</Spinner>
            </Col>
          </Row>  
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
