import { useContext, useEffect, useState } from "react";
import { Badge, FormGroup, Label, ListGroup, ListGroupItem } from "reactstrap";
// import { CmPageCmCdListContext } from "../../../context/CmPageCmCdListContext";
import { CmUserContext } from "../../../context/CmUserContext";
import { BcTimeGuestListContext } from "../../../context/BcTimeGuestListContext";
import {
  CM_LOGIN_NOT_CHECK,
  CmGotoConnerListByPeopleId,
} from "../../../components/js/Common";

export default function BcDetailFormGuest(props) {
  // ====================================
  const timeTableSeq = props.timetableseq ? props.timetableseq : 0;

  // ====================================
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  // ====================================
  // 공통코드 리스트

  // 게스트 목록
  const { ctxtBcTimeGuestList } = useContext(BcTimeGuestListContext);

  const [guestList, setGuestList] = useState([]); // 실제 게스트 목록
  const [divAttr, setDivAttr] = useState({});

  useEffect(() => {
    const list = ctxtBcTimeGuestList.filter((item) => {
      return item.timeTableSeq === timeTableSeq;
    });
    setGuestList(list);

    list.length ? setDivAttr() : setDivAttr({ hidden: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [ctxtBcTimeGuestList]);

  return (
    <>
      <div {...divAttr}>
        <br />
        <FormGroup hidden={timeTableSeq ? false : true}>
          <Label for="exampleSelectMulti">
            참여자 (총 {guestList.length}명)
          </Label>
          <ListGroup flush>
            {guestList.map((one, index) => {
              return (
                <ListGroupItem key={one.cdId}>
                  {index + 1}. {one.cdNm} -{" "}
                  {one.guestAttr01 ? one.guestAttr01 : one.cdAttr01}{" "}
                  <Badge
                    color="info"
                    className="cursorPointer"
                    onClick={() => {
                      CmGotoConnerListByPeopleId(one.cdId);
                    }}
                  >
                    목록
                  </Badge>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </FormGroup>
      </div>
    </>
  );
}
