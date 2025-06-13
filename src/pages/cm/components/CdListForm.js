import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Badge,
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
import styles from "./Cd0000Form.module.scss";
import {
  CM_LOGIN_NOT_CHECK,
  CmChangeJsonToSearch,
  CmChangeSearchToJson,
  CmChangeValue,
  CmGetListConfig,
  CmGetTranslated,
  CmGotoConnerListByPeopleId,
  CmSetTextareaValueDetail,
  CmSetTextareaValueDetailWithDbData,
  URL_CD_LIST,
  URL_PEOPLE_LIST,
} from "../../../components/js/Common";
import { CmUserContext } from "../../../context/CmUserContext";

export default function CdListForm(props) {
  const history = useHistory();
  const paramNowPage =
    props && props.match && props.match.params && props.match.params.nowPage
      ? props.match.params.nowPage
      : 1;

  const formFrom = props.formFrom ? props.formFrom : "peopleList";

  const [nowPage, setNowPage] = useState(paramNowPage);

  //====================================================================
  const { ctxtCmUser } = useContext(CmUserContext);

  let myCtxtCmUser = { ...ctxtCmUser };
  if (!myCtxtCmUser) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  const gotoNowUrl = formFrom === "cdList" ? URL_CD_LIST : URL_PEOPLE_LIST;

  const initSrchWordList = useMemo(() => {

    let srchWordList = CmChangeSearchToJson(
      props.location.search.replace("?", "")
    );

    if (formFrom === "peopleList") {
      srchWordList = { ...srchWordList, sCdGroupId: "people" };
    }
    //  console.log(srchWordList);
    return srchWordList;
  }, []);

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
    getList();
  }, [nowPage, sttSrchStartTime]);

  // 공통코드 가져오기
  useEffect(() => {
    getListByGroupId("CmCdList");
  }, []);

  //===================================================================
  const getListByGroupId = (pKind) => {
    pKind = "CmCdList";

    let insertJson = { useYn: "Y" };
    let cdGroupIdList = "";
    let cdGroupIdYn = "N";
    switch (pKind) {
      case "CmCdList":
        cdGroupIdList = "orderByColCmCd";
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
        .post("/api/cm/cdForm?type=cntListTotal", {
          ...sttSrchWordList,
          useYn: "",
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
      let insertJson = {
        ...sttSrchWordList,
        ...listConfig,
        useYn: "",
        formFrom: formFrom,
      };

      axios
        .post("/api/cm/cdForm?type=list", insertJson)
        .then((response) => {
          try {
            const result = response.data;
            let tempList = result.json;
            tempList.map((one, index) => {
              one.rowNum = listConfig.topStart + index;
            });
            setList(tempList);
            // setListConfig(newListConfig);
            if (tempList.length === 0) {
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
    history.push("/cm/cd/register");
  };

  const gotoModify = (pCdSeq, pCdId) => {
    history.push(
      `/cm/cd/modify/${pCdSeq}/${pCdId}?` +
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

  const hiddenForPeopleList = formFrom === "peopleList" ? { hidden: true } : {};
  const mdCntSearchCol = formFrom === "peopleList" ? 4 : 2;

  return (
    <>
      <div className={styles.cd0000FormBody}>
        <div className={styles.cd0000FormBody__contents}>
          <CmTitle title={`총 ${cntListTotal}개`} />
          <Form>
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col md={2} {...hiddenForPeopleList}>
                <Label className="visually-hidden" for="sCdGroupId">
                  그룹코드
                </Label>
                <Input
                  id="sCdGroupId"
                  name="sCdGroupId"
                  type="select"
                  value={sttSrchWordList.sCdGroupId}
                  onChange={(e) => changeValue(e)}
                >
                  <option value="">그룹코드</option>
                  {cmCdList
                    .filter((item) => {
                      return item.cdGroupId === "cdGroupId";
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
              <Col md={2} {...hiddenForPeopleList}>
                <Label className="visually-hidden" for="sCdId">
                  cdId
                </Label>
                <Input
                  id="sCdId"
                  name="sCdId"
                  placeholder="코드ID"
                  type="text"
                  value={sttSrchWordList.sCdId}
                  onChange={(e) => changeValue(e)}
                />
              </Col>
              <Col md={mdCntSearchCol}>
                <Label className="visually-hidden" for="sCdNm">
                  cdNm
                </Label>
                <Input
                  id="sCdNm"
                  name="sCdNm"
                  placeholder="이름/코드이름"
                  type="text"
                  value={sttSrchWordList.sCdNm}
                  onChange={(e) => changeValue(e)}
                />
              </Col>

              <Col md={2}>
                <Label className="visually-hidden" for="sCdAttr01">
                  cdNm
                </Label>
                <Input
                  id="sCdAttr01"
                  name="sCdAttr01"
                  placeholder="설명/attr1"
                  type="text"
                  value={sttSrchWordList.sCdAttr01}
                  onChange={(e) => changeValue(e)}
                />
              </Col>

              <Col md={mdCntSearchCol}>
                <Label className="visually-hidden" for="sOrderField">
                  order by
                </Label>
                <Input
                  id="sOrderField"
                  name="sOrderField"
                  type="select"
                  onChange={(e) => changeValue(e)}
                  value={sttSrchWordList.sOrderField}
                >
                  <option value="">정렬컬럼</option>
                  {cmCdList
                    .filter((item) => {
                      return item.cdGroupId === "orderByColCmCd";
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
                <Button color="success" onClick={gotoSearch}>
                  검색
                </Button>
                &nbsp;
                <Button onClick={() => (window.location.href = gotoNowUrl)}>
                  초기화
                </Button>
                {formFrom === "cdList" ? (
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

          <div>
            {formFrom === "cdList" ? (
              <Row
                className={styles.cd0000FormBody__contents__connerListHeader}
              >
                <Col md={1}>#</Col>
                <Col md={1}>공통코드</Col>
                <Col md={2}>코드ID</Col>
                <Col md={2}>코드이름</Col>
                <Col md={2}>attr01</Col>
                <Col md={2}>attr02</Col>
                <Col md={1}>attr03</Col>
                <Col md={1}>Seq</Col>
              </Row>
            ) : (
              ""
            )}

            {formFrom === "peopleList" ? (
              <Row
                className={styles.cd0000FormBody__contents__connerListHeader}
              >
                <Col md={1}>#</Col>
                <Col md={2}>이름</Col>
                <Col md={7}>설명</Col>
                <Col md={2}>참여갯수</Col>
              </Row>
            ) : (
              ""
            )}

            {list.length === 0 ? (
              <>
                <Row
                  hidden={noDataHidden}
                  className={styles.cd0000FormBody__contents__center}
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
              className={styles.cd0000FormBody__contents__center}
            >
              <Col md={12}>
                <Spinner color="primary">Loading...</Spinner>
              </Col>
            </Row>

            {/* 공통코드목록 */}
            {formFrom === "cdList" &&
              list.length > 0 &&
              spinnerHidden &&
              list.map((cd, index) => {
                return (
                  <div key={index}>
                    <Row>
                      <Col md={1}>{cntListTotal - cd.rowNum + 1}</Col>
                      <Col
                        md={1}
                        className="cursorPointer"
                        onClick={() => {
                          gotoModify(cd.cdSeq, cd.cdId);
                        }}
                      >
                        {cd.cdGroupId}
                      </Col>
                      <Col md={2}>{cd.cdId}</Col>
                      <Col md={2}>
                        {cd.cdNm}&nbsp;
                        {cd.cdGroupId === "people" ? (
                          <Badge
                            color="info"
                            className="cursorPointer"
                            onClick={() => {
                              CmGotoConnerListByPeopleId(cd.cdId);
                            }}
                          >
                            목록
                          </Badge>
                        ) : (
                          ""
                        )}
                      </Col>
                      <Col md={2}>
                        <div
                          dangerouslySetInnerHTML={CmGetTranslated(
                            CmSetTextareaValueDetailWithDbData(cd.cdAttr01)
                          )}
                        ></div>
                      </Col>
                      <Col md={2}>
                        <div
                          dangerouslySetInnerHTML={CmGetTranslated(
                            CmSetTextareaValueDetailWithDbData(cd.cdAttr02)
                          )}
                        ></div>
                      </Col>
                      <Col md={1}>{cd.cdAttr03}</Col>
                      <Col
                        md={1}
                        className="cursorPointer"
                        onClick={() => {
                          gotoModify(cd.cdSeq, cd.cdId);
                        }}
                      >
                        {cd.useYn} / {cd.cdSeq}
                      </Col>
                    </Row>
                    <hr />
                  </div>
                );
              })}

            {/* 참여자목록 */}
            {formFrom === "peopleList" &&
              list.length > 0 &&
              spinnerHidden &&
              list.map((cd, index) => {
                return (
                  <div key={index}>
                    <Row>
                      <Col md={1}>{cntListTotal - cd.rowNum + 1}</Col>
                      <Col md={2}>{cd.cdNm}</Col>
                      <Col md={7}>
                        <div
                          dangerouslySetInnerHTML={CmGetTranslated(
                            CmSetTextareaValueDetail(
                              cd.cdAttr01.replaceAll("\n", "<br/>")
                            )
                          )}
                        ></div>
                      </Col>
                      <Col md={2}>
                        {cd.cdGroupId === "people" ? (
                          <>
                            {cd.peopleCnt}개&nbsp;
                            <Badge
                              color="info"
                              className="cursorPointer"
                              onClick={() => {
                                CmGotoConnerListByPeopleId(cd.cdId);
                              }}
                            >
                              목록보기
                            </Badge>
                          </>
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

          <Table hover hidden>
            <thead>
              <tr align="center">
                <th>#</th>
                <th>코드ID</th>
                <th>코드이름</th>
                <th>attr01</th>
                <th>공통코드</th>
                <th>사용</th>
                <th>Seq</th>
              </tr>
            </thead>
            <tbody>
              <tr hidden={spinnerHidden}>
                <td colSpan="6" align="center">
                  <Spinner color="primary">Loading...</Spinner>
                </td>
              </tr>
              {list.length > 0 &&
                spinnerHidden &&
                list.map((cd) => {
                  return (
                    <tr
                      key={cd.cdSeq}
                      onClick={() => {
                        gotoModify(cd.cdSeq, cd.cdId);
                      }}
                    >
                      <th align="right" scope="row">
                        {cntListTotal - cd.rowNum + 1}
                      </th>
                      <td>{cd.cdId}</td>
                      <td>{cd.cdNm}</td>
                      <td>{cd.cdAttr01}</td>
                      <td>{cd.cdGroupId}</td>
                      <td align="center">{cd.useYn}</td>
                      <td align="right">{cd.cdSeq}</td>
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
