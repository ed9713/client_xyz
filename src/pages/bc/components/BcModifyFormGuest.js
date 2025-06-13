import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import { CmPageCmCdListContext } from "../../../context/CmPageCmCdListContext";
import { CmUseDebounce } from "../../../hook/CmUseDebounce";
import { CmUserContext } from "../../../context/CmUserContext";
import CmAlert from "../../../hook/CmAlert";
import { BcTimeGuestListContext } from "../../../context/BcTimeGuestListContext";
import { useDispatch, useSelector } from "react-redux";
import {
  BC_SAVE_TG_END,
  BC_SAVE_TG_ING,
  BC_SAVE_TG_PRE,
  BC_SAVE_TG_SUCCESS,
  CM_LOGIN_NOT_CHECK,
} from "../../../components/js/Common";

export default function BcModifyFormGuest(props) {
  // 모달창 사용
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    resetSearch();
  };
  const backdrop = false;

  // ====================================
  const timeTableSeq = props.timetableseq ? props.timetableseq : 0;
  const timeTableItem = props.timeTableItem ? props.timeTableItem : {};
  const channelId = props.channelId ? props.channelId : "";
  // const formFrom = "";
  // ====================================
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  // ====================================
  // 공통코드 리스트
  const { ctxtCmPageCmCdList } = useContext(CmPageCmCdListContext);
  const peopleList = ctxtCmPageCmCdList.filter((item) => {
    return item.cdGroupId === "people";
  });

  const peopleListByConner = ctxtCmPageCmCdList.filter((item) => {
    return item.cdGroupId === "conner" && item.cdAttr02 === "Y";
  });

  // 게스트 목록
  const { ctxtBcTimeGuestList } = useContext(BcTimeGuestListContext);
  const dbGuestList = ctxtBcTimeGuestList.filter((item) => {
    return item.timeTableSeq === timeTableSeq;
  });
  let cntDbGuestList = dbGuestList.length;

  // ============================================================================
  // useDebounce
  const [srchWord, setSrchWord] = useState("");
  const [srchList, setSrchList] = useState(peopleList); // 검색가능한 목록
  const [srchedList, setSrchedList] = useState([]); // 검색 리스트에서 선택한 목록
  // const [guestList, setGuestList] = useState( cntTemp > 0 ? dbGuestList : []); // 실제 게스트 목록
  const [guestList, setGuestList] = useState([]); // 실제 게스트 목록

  let saveList = []; // 저장시 사용

  const debounceInput = CmUseDebounce(srchWord, 1000);
  // 실제 검색하는 useEffect
  useEffect(() => {
    const list = fetchDataFromServer(peopleList, debounceInput);
    setSrchList(list);
  }, [debounceInput]);

  // 데이터 filter 부분
  const fetchDataFromServer = (list, value) => {
    if (!value) {
      return list;
    }
    return list.filter((user) => user.cdNm.startsWith(value));
  };

  // ================================================================
  // useCallback 사용시 cntDbGuestList 가 변경시에만 재생성 된다.
  const someFunction = useCallback(() => {
    // console.log(`==> someFunc : number ${cntDbGuestList}`);
    return;
  }, [cntDbGuestList]);

  useEffect(() => {
    // console.log(`======> someFunction 이 변경되었습니ㅏ. ${timeTableSeq} ${cntDbGuestList}` );
    setGuestList(dbGuestList);
  }, [someFunction]);
  // ================================================================

  // 검색 목록 더블클릭시
  const srchListDbClick = (e) => {
    const value = e.target.value;
    addSrchedList([{ cdId: value }]);
  };

  // 검색 목록 더블클릭시
  const addSrchedList = (pCdIdList) => {
    const newSelectedList = srchedList.slice(); // 기존 목록 복사
    let bChange = false;

    if (pCdIdList && pCdIdList.length > 0) {
      for (let i = 0; i < pCdIdList.length; i++) {
        const value = pCdIdList[i].cdId;
        // 기존에 추가 됐는지 여부
        let selectedOne = srchedList.find((item) => {
          return item.cdId === value;
        });

        if (!selectedOne) {
          // console.log(peopleList)
          let oneItem = peopleList.find((item) => {
            return item.cdId === value;
          });

          if (oneItem) {
            oneItem.guestAttr01 = oneItem.cdAttr01;
            newSelectedList.push(oneItem);
            bChange = true;
          }
        }
      }
    }

    if (bChange) {
      setSrchedList(newSelectedList);
    }
  };

  // 검색 후 선택된 목록 더블클릭시
  const srchedListDbClick = (e) => {
    const value = e.target.value;
    const newList = srchedList.filter((item) => {
      return item.cdId !== value; // 더블클릭한 아이템 빼고 나머지
    });
    setSrchedList(newList);
  };

  // 검색창 클리어
  const resetSearch = () => {
    setSrchWord("");
    setSrchList(peopleList);
    setSrchedList([]);
    // refSrchWord.current.focus();
  };

  // 모달창의 추가 버튼 클릭시
  const addGuestListAndClose = () => {
    let newGuestList = guestList.slice();
    srchedList.forEach((item) => {
      var value = item.cdId;
      let alreadyItem = guestList.find((item) => {
        return item.cdId === value;
      });

      if (!alreadyItem) {
        newGuestList.push(item);
      }
    });

    setGuestList(newGuestList);

    toggle();
  };


  // 게스트 목록에서 선택된 사람 빼기
  const deleteGuestOne = (pCdId) => {
    // console.log(pCdId);

    // return;

    let newGuestList = guestList.slice();
    const newList = newGuestList.filter((item) => {
      return item.cdId !== pCdId; // 더블클릭한 아이템 빼고 나머지
    });

    setGuestList(newList);
  };

  // 저장 클릭시
  const submitClick = () => {
    // 입력값 체크
    const fnValidate = () => {    
      return true;
    };

    //  삭제 처리
    const fnDelete = async () => {
      let insertJson = {
        timeTableSeq: timeTableSeq,
      };

      let Json_form = JSON.stringify(insertJson);
      try {
        const response = await fetch("/api/ytb/bcForm?type=deleteTg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          // const insertId = resultJson.insertId;
          // CmAlert("삭제가 완료되었습니다.", "", "info", "닫기", 3000);
          console.log("삭제가 완료되었습니다.");
          fnInsert();
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    //  입력 처리
    const fnInsert = async () => {
      let insertJson = {
        timeTableSeq: timeTableSeq,
        guestList: saveList,
      };

      let Json_form = JSON.stringify(insertJson);

      try {
        const response = await fetch("/api/ytb/bcForm?type=signUpTgList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          // const insertId = resultJson.insertId;
          if (rdxActionBcModify.indexOf(BC_SAVE_TG_PRE) >= 0) {
            console.log("등록이 완료되었습니다 ");
            dispatchBcModifyFormGuest({ type: BC_SAVE_TG_SUCCESS });
          } else {
            CmAlert("등록이 완료되었습니다.", "", "info", "닫기", 3000);
          }
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // ===============================================================
    // 실제 처리
    saveList = [];
    for (let i = 0; i < guestList.length; i++) {
      const guestItem = guestList[i];

      let newTimeGuestItem = {
        timeTableSeq: timeTableSeq, // 타임테이블seq
        peopleId: guestItem.cdId, // 사람Id
        guestAttr01: guestItem.guestAttr01
          ? guestItem.guestAttr01
          : guestItem.cdAttr01, // 사람Id
        joinYn: "N", // 전화여부
        createId: myCtxtCmUser.userEmail,
        updateId: myCtxtCmUser.userEmail,
      };
      saveList.push(newTimeGuestItem);
    }

    // console.log(saveList);
    if (fnValidate()) {
      fnDelete();
    }
  };

  const getPeopleListByConner = (e) => {
    const value = e.target.value;
    if (value) {
      const tempList2 = ctxtCmPageCmCdList.filter((item) => {
        return item.cdGroupId === "people" && item.cdAttr03 === value;
      });
      // console.log(tempList2);
      addSrchedList(tempList2);
    }
  };

  // =============================================================
  // redux 사용

  // 11. dispatch
  const dispatchBcModifyFormGuest = useDispatch();

  // 5. root 에 있는 number 값을 사용하고 싶다.
  function fnShowActionModify(state) {
    return state.actionBcModify;
  }
  // 6 selector 를 사용한다.
  // selector 는 함수를 받는다.
  const rdxActionBcModify = useSelector(fnShowActionModify); // 이것도 가능
  const rdxTotalCnt = useSelector((state) => state.totalCnt); // 이것도 가능
  const rdxSuccessCnt = useSelector((state) => state.successCnt); // 이것도 가능
  const rdxFailCnt = useSelector((state) => state.failCnt); // 이것도 가능

  // ===========================================================================
  // redux 상태값 체크
  if (rdxActionBcModify.indexOf(BC_SAVE_TG_ING) >= 0) {
    // console.log(" ============================ ")
    // console.log( sttDefaultOneJson.rowNum )
    // console.log( rdxTotalCnt )
    // console.log( rdxSuccessCnt )
    // console.log( rdxFailCnt )
    // console.log(" ============================ ")
    let doneCnt = rdxSuccessCnt + rdxFailCnt; // 총 처리 값
    if (rdxTotalCnt === 0 || doneCnt === rdxTotalCnt) {
      dispatchBcModifyFormGuest({ type: BC_SAVE_TG_END });
    } else if (doneCnt + 1 === timeTableItem.rowNum) {
      submitClick();
    }
  }

  const refSrchWord = useRef("");

  //=====================================================
  // 입력값 체크 후 결과값에 따라 redux 값 변경 처리
  return (
    <>
      <FormGroup hidden={timeTableSeq ? false : true}>
        <Label for="exampleSelectMulti">
          게스트 (총 {guestList.length}개) &nbsp;&nbsp;
          {/* timeTableRowNum {timeTableRowNum} */}
          <Button outline size="sm" color="info" onClick={toggle}>
            +
          </Button>
          {/* &nbsp;
          <Button size="sm" color="warning" onClick={deleteGuestList}>
            -
          </Button> */}
          &nbsp;
          <Button outline size="sm" color="primary" onClick={submitClick}>
            저장
          </Button>
        </Label>
        {/* <Input
          hidden
          id="exampleSelectMulti"
          multiple
          name="selectMulti"
          type="select"
          innerRef={refGuestList}
          style={{ height: "100px" }}
        >
          {guestList.map((one, index) => {
            return (
              <option key={index} value={one.cdId}>
                {index + 1}. {one.cdNm} - {one.cdAttr01}
              </option>
            );
          })}
        </Input> */}
        <ListGroup>
          {guestList.map((one, index) => {
            return (
              <ListGroupItem key={one.cdId}>
                {index + 1}. {one.cdNm} - {one.guestAttr01} &nbsp;
                <Button
                  outline
                  size="sm"
                  color="danger"
                  onClick={() => {
                    deleteGuestOne(one.cdId);
                  }}
                >
                  x
                </Button>
              </ListGroupItem>
            );
          })}
          {!guestList.length ? (
            <ListGroupItem>
              <Button outline size="sm" color="info" onClick={toggle}>
                +
              </Button>
              &nbsp;버튼을 눌러 게스트를 선택하세요.
            </ListGroupItem>
          ) : (
            ""
          )}
        </ListGroup>
      </FormGroup>

      <Modal
        isOpen={modal}
        toggle={toggle}
        backdrop={backdrop}
        centered
        {...props}
      >
        <ModalHeader toggle={toggle}>게스트 추가</ModalHeader>
        <ModalBody>
          <div>
            <div>
              <FormGroup>
                <Label hidden for="srchWord">
                  검색
                </Label>
                <Input
                  id="srchWord"
                  name="srchWord"
                  value={srchWord}
                  onChange={(e) => {
                    setSrchWord(e.target.value);
                  }}
                  placeholder="게스트 검색"
                  innerRef={refSrchWord}
                />
              </FormGroup>

              <FormGroup>
                <Label for="exampleSelectMulti">
                  검색 리스트 (총 {srchList.length}개)
                </Label>
                <Input
                  id="exampleSelectMulti"
                  multiple
                  name="selectMulti"
                  type="select"
                  height={100}
                  style={{ height: "150px" }}
                  onClick={srchListDbClick}
                >
                  {srchList.map((one, index) => {
                    return (
                      <option key={index} value={one.cdId}>
                        {one.cdNm} - {one.cdAttr01}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="exampleSelectMulti" hidden>
                  코너별 게스트
                </Label>
                <Input
                  id="peopleListByConner"
                  name="peopleListByConner"
                  type="select"
                  onChange={getPeopleListByConner}
                >
                  <option value="">코너별 게스트 리스트</option>
                  {peopleListByConner
                    .filter((item) => {
                      return item.cdAttr01 === channelId;
                    })
                    .map((one, index) => {
                      return (
                        <option key={index} value={one.cdId}>
                          {one.cdNm}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelectMulti">
                  선택 리스트 (총 {srchedList.length}개)
                </Label>
                <Input
                  id="exampleSelectMulti"
                  multiple
                  name="selectMulti"
                  type="select"
                  style={{ height: "100px" }}
                  onDoubleClick={srchedListDbClick}
                >
                  {srchedList.map((one, index) => {
                    return (
                      <option key={index} value={one.cdId}>
                        {one.cdNm} - {one.cdAttr01}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={addGuestListAndClose}>
            추가
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
