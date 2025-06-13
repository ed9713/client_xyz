import React from "react";
import { Badge, Button, Col, Form, FormGroup, Input, Label, List } from "reactstrap";

import '../../App.css';


export default function test() {
  const a1List = [1, 2, 3];

  return (
    <div className="">
                <Button     size="lg">저장</Button>
      <b>
        <h1>
        <Badge color="primary">강아지 종</Badge>A
        </h1>
      </b>
      <>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>
            종
          </Label>
          <Col sm={10}>
            <Input id="exampleEmail" name="종" placeholder="" type="email" value="말티즈" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>
            관련링크
          </Label>
          <Col sm={10}>
            <Input id="exampleEmail" name="email" placeholder="" type="email" value="http://ddd"/>
          </Col>
        </FormGroup>
        <List>
          {a1List.map((item) => {
            return <B1 item={item}  key={item} />;
          })}
        </List>
      </>
    </div>
  );
}

export function B1(props) {
  //   const c1List = [1, 2, 3, 4];

  const item = props.item;

  let list = [];
  for (let i = 1; i <= 4 - item + 1; i++) {
    list.push( i );
  }

  const c1List = list.slice();

  return (
    <div  className="bgRed">

      <hr />
      <b>
        <h2>
        <Badge color="danger">강아지정보</Badge>B {props.item} 강아지 정보
        </h2>
      </b>

      <>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>
            강아지 이름
          </Label>
          <Col sm={10}>
            <Input id="exampleEmail" name="종" placeholder="" type="email" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>
            색상
          </Label>
          <Col sm={10}>
            <Input id="exampleEmail" name="email" placeholder="" type="email" />
          </Col>
        </FormGroup>
      </>

      <List>
        {c1List && c1List.map((item) => {
          return <C1 cIndex={item} key={item}/>;
        })}
      </List>
      <br/>
    </div>
  );
}

export function C1(props) {
  const cIndex = props.cIndex;
  return (
    <div  className="bgGreen">
      <hr />
      <h3>
      <b>
        <Badge color="success">보호자 정보</Badge>C{props.cIndex}. 보호자 정보
      </b>
      </h3>
      <>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>
            보호자 이름
          </Label>
          <Col sm={10}>
            <Input id="exampleEmail" name="종" placeholder="" type="email" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>
            연락처
          </Label>
          <Col sm={10}>
            <Input id="exampleEmail" name="email" placeholder="" type="email" />
          </Col>
        </FormGroup>
      </>
    </div>
  );
}
