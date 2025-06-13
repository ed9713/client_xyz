import { useEffect, useState } from "react";
import {
  CmGetDayOfTheWeek,
  CmGetTranslated,
  CmGotoConnerListByPeopleId,
  CmSetTextareaValueDetail,
} from "../../../components/js/Common";
import {
  Badge,
  Col,
  FormGroup,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";
import styles from "./Bc0000Form.module.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export default function ConnerListItemForm(props) {
  const item = props.item;
  const cntListTotal = props.cntListTotal;
  const guestList = props.guestList;
  // console.log(guestList);

  const history = useHistory();

  const bOpenAll = props.bOpenAll;
  const [bOpenBody, setBOpenBody] = useState(bOpenAll ? bOpenAll : false);
  const openCloseBody = () => {
    setBOpenBody(!bOpenBody);
  };

  useEffect(() => {
    setBOpenBody(bOpenAll);
  }, [bOpenAll]);

  const gotoConnerYtbUrl = () => {
    if (item.broadcastUrl && item.timeStartSec) {
      window.open(
        `${item.broadcastUrl}&t=${item.timeStartSec}s`,
        "_blank",
        "noopener",
        "noreferer"
      );
    }
  };

  // 방송정보 상세보기로 이동
  const gotoYtbBcUrl = () => {
    history.push(`/bc/detail/${item.broadcastSeq}`);
  };

  // 방송정보 수정하기 이동
  const gotoYtbBcModifyUrl = () => {
    history.push(`/bc/modify/${item.broadcastSeq}`);
  };

  const searchByDate = () => {
    window.location.href = `/conner/list/?sBroadcastDate=${item.broadcastDate}`;
  };

  return (
    <>
      <Row>
        <Col md={1} onClick={gotoYtbBcModifyUrl}>
          {cntListTotal - item.rowNum + 1}
        </Col>
        <Col
          md={2}
          onClick={() => {
            searchByDate();
          }}
          className="cursorPointer"
        >
          {item.broadcastDate} ({CmGetDayOfTheWeek(item.broadcastDateYoil)})
        </Col>
        <Col md={2} onClick={gotoYtbBcUrl} className="cursorPointer">
          {item.channelNm}
        </Col>
        <Col
          md={5}
          onClick={() => {
            openCloseBody();
          }}
          className="cursorPointer"
        >
          {" "}
          <div
            dangerouslySetInnerHTML={CmGetTranslated(
              CmSetTextareaValueDetail(item.connerTitle)
            )}
          ></div>
        </Col>
        <Col md={2} className={styles.bc0000FormBody__contents__itemCenter}>
          {item.broadcastUrl && item.timeStartSec ? (
            <Badge
              onClick={gotoConnerYtbUrl}
              color="primary"
              className="cursorPointer"
            >
              바로보기
            </Badge>
          ) : (
            ""
          )}
        </Col>
        {/* <Col md={1}>
        {item.timeTableContents.length ?
            <>
            <Button onClick={()=>{openCloseBody()}} color="primary"  size="sm" outline
              className="cursorPointer" >{bOpenBody?"닫기":"열기"}</Button>                   
            </>
        : ""}              
        </Col> */}
      </Row>
      {bOpenBody ? (
        <Row>
          <Col md={1}></Col>
          <Col md={11}>
            <br />
            <div className={styles.bc0000FormBody__contents__border}>
              <div
                dangerouslySetInnerHTML={CmGetTranslated(
                  CmSetTextareaValueDetail(
                    item.timeTableContents.replaceAll("\n", "<br/>")
                  )
                )}
              ></div>
              <br />
              <FormGroup>
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
          </Col>
        </Row>
      ) : (
        ""
      )}
      <hr />
    </>
  );
}

export function ConnerListItemFormXXXX(props) {
  const item = props.item;
  const cntListTotal = props.cntListTotal;

  return (
    <>
      <tr>
        <th align="right" scope="row">
          {cntListTotal - item.rowNum + 1}
        </th>
        <td>{item.broadcastDate}</td>
        <td>{item.channelNm}</td>
        <td className="cursorPointer">
          <div
            dangerouslySetInnerHTML={CmGetTranslated(
              CmSetTextareaValueDetail(item.connerTitle)
            )}
          ></div>
        </td>
        <td>{item.connerNm}</td>
      </tr>
      <tr>
        <td></td>
        <td colSpan="5">
          <div
            dangerouslySetInnerHTML={CmGetTranslated(
              CmSetTextareaValueDetail(
                item.timeTableContents.replaceAll("\n", "<br/>")
              )
            )}
          ></div>
        </td>
      </tr>
    </>
  );
}
