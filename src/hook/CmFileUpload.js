import { useContext, useEffect, useState } from "react";
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
  FormText,
} from "reactstrap";

import CmAlert, { CmAlertConfirmMSg } from "./CmAlert";
import axios from "axios";
import { CmUserContext } from "../context/CmUserContext";
import {
  CM_FILE_UPLOAD_FILE_EXTENSION,
  CM_FILE_UPLOAD_MAX_CNT,
  CM_FILE_UPLOAD_MAX_SIZE,
  CM_LOGIN_NOT_CHECK,
} from "../components/js/Common";
import moment from "moment";
import Swal from "sweetalert2";

export default function CmFileUpload(props) {
  // 모달창 사용
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (guestList.length >= maxUploadCnt || readOnlyMode) {
    } else {
      setModal(!modal);
      setSelectedFile([]);
    }
  };
  const backdrop = false;

  // ================================================
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }

  // ================================================
  const [fileInfoMstSeq, setFileInfoMstSeq] = useState(
    props && props.fileinfomstseq ? props.fileinfomstseq : 0
  );
  // 부모에 fileMstSeq 보낼 함수
  const setParentFileInfoMstSeq =
    props && props.setfileinfomstseq ? props.setfileinfomstseq : () => {};

  const readOnlyMode = props.readonlymode ? true : false;

  // console.log(readOnlyMode);

  const maxUploadCnt =
    props && props.maxuploadcnt
      ? props.maxuploadcnt > CM_FILE_UPLOAD_MAX_CNT
        ? CM_FILE_UPLOAD_MAX_CNT
        : props.maxuploadcnt
      : 1;

  const [guestList, setGuestList] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [menualName, setMenualName] = useState(null);

  const ckFileUpload = (pFileInfo) => {
    if (!pFileInfo || pFileInfo.length === 0) {
      CmAlert("업로드 가능한 파일 정보가 없습니다.", "", "info", "닫기", 3000);
      return false;
    }

    const size = pFileInfo.size;
    const name = pFileInfo.name;
    const namelist = name.split(".");
    const extension = namelist[namelist.length - 1];

    if (!size || size > CM_FILE_UPLOAD_MAX_SIZE) {
      CmAlert(
        CM_FILE_UPLOAD_MAX_SIZE / 1000 + "KB 이상은 불가입니다.",
        "",
        "info",
        "닫기",
        3000
      );
      return false;
    }

    if (!guestList || guestList.length >= maxUploadCnt) {
      CmAlert(
        `최대 ${maxUploadCnt}개까지 업로드가 가능합니다.`,
        "",
        "info",
        "닫기",
        3000
      );
      return false;
    }

    if (CM_FILE_UPLOAD_FILE_EXTENSION.indexOf(extension) < 0) {
      CmAlert(`업로드 불가능한 파일 확장자 입니다.`, "", "info", "닫기", 3000);
      return false;
    }

    return true;
  };

  const handleFileInput = (e) => {
    // console.log(e.target.files[0]);
    setSelectedFile([]);
    const fileInfo = e.target.files[0];

    if (!ckFileUpload(fileInfo)) {
      return;
    }

    setSelectedFile(e.target.files[0]);

  };

  // 파일 업로드

  // 모달창의 추가 버튼 클릭시
  const clickAdd = () => {
    // 파일 업로드
    const fileUpload = (pSelectedFile) => {
      const formData = new FormData();
      formData.append("file", pSelectedFile);

      let uploadFileInfo = {
        fileInfoSeq: 0,
        fileInfoMstSeq: fileInfoMstSeq,
        fileOrderSeq: 0,
        fileOrginNm: pSelectedFile.name,
        fileSavePath: "",
        fileSaveNm: "",
        fileSize: pSelectedFile.size,
      };

      const uploadType = "uploads/image/" + moment().format("YYYYMM") + "/";
      // const uploadType = "uploads/swmanual/";

      return axios
        .post("/api/upload?type=" + uploadType, formData)
        .then((res) => {
          // console.log("성공");
          // this.setState({menualName : res.data.filename})
          setMenualName(res.data.filename);

          uploadFileInfo.fileSaveNm = res.data.filename;
          uploadFileInfo.fileSavePath = uploadType;
          setUploadFile(uploadFileInfo);
          // console.log(uploadFileInfo);

          fnSignInsert(uploadFileInfo);
        })
        .catch((error) => {
          // console.log("실패");
          alert("작업중 오류가 발생하였습니다.555", error, "error", "닫기");
        });
    };

    // 등록  처리
    const fnSignInsert = async (pUploadFile) => {
      let insertJson = {
        ...pUploadFile,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };

      let Json_form = JSON.stringify(insertJson);
      const type = "signUpFile";

      try {
        const response = await fetch("/api/cm/fileForm?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          // console.log(resultJson);
          const mstSeq = pUploadFile.fileInfoMstSeq;
          const insertId = resultJson.insertId;
          const newUploadFile = { ...pUploadFile };
          newUploadFile.fileInfoSeq = insertId;

          if (mstSeq > 0) {
          } else {
            newUploadFile.fileInfoMstSeq =
              newUploadFile.fileInfoMstSeq > 0
                ? newUploadFile.fileInfoMstSeq
                : insertId;

            setFileInfoMstSeq(insertId);
            setParentFileInfoMstSeq(insertId);
          }

          setUploadFile(newUploadFile);

          if (mstSeq > 0) {
            addFileListAndClose(newUploadFile);
          } else {
            fnUpdateMst(newUploadFile);
          }
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // 마스터 seq 업데이트
    const fnUpdateMst = async (newUploadFile) => {
      let insertJson = {
        fileInfoSeq: newUploadFile.fileInfoSeq,
        fileInfoMstSeq: newUploadFile.fileInfoSeq,
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };

      let Json_form = JSON.stringify(insertJson);
      const type = "modifyMstSeq";

      try {
        const response = await fetch("/api/cm/fileForm?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          // console.log(resultJson);
          addFileListAndClose(newUploadFile);
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    if (!ckFileUpload(selectedFile)) {
      return;
    }

    // 파일정보 등록
    fileUpload(selectedFile);
  };

  const addFileListAndClose = (newUploadFile) => {
    let newGuestList = guestList.slice();
    newGuestList.push(newUploadFile);
    setGuestList(newGuestList);
    // console.log(newGuestList);
    toggle();
  };

  useEffect(() => {
    if (fileInfoMstSeq > 0) {
      getList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //====================================================================
  // 실제 리스트
  const getList = () => {
    setGuestList([]);
    let insertJson = { fileInfoMstSeq: fileInfoMstSeq };

    axios
      .post("/api/cm/fileForm?type=listFile", insertJson)
      .then((response) => {
        try {
          const result = response.data;
          let tempList = result.json;
          tempList.map((one, index) => one.rowNum = index + 1 );
          setGuestList(tempList);
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  const deleteGuestOne = (pFileInfoSeq, e) => {
    //  삭제 처리
    const fnDelete = async () => {
      let insertJson = {
        fileInfoSeq: pFileInfoSeq,
        deleteYn: "Y",
        updateId: myCtxtCmUser.userEmail,
        createId: myCtxtCmUser.userEmail,
      };
      let Json_form = JSON.stringify(insertJson);
      try {
        const response = await fetch("/api/cm/fileForm?type=modifyMstSeq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });

        const body = await response.text();
        const resultJson = JSON.parse(body);
        if (resultJson.resultCd === "succ") {
          // CmAlert("삭제가 완료되었습니다.", "", "info", "닫기", 3000);
          const newGuestList = guestList.filter((item) => {
            return item.fileInfoSeq !== pFileInfoSeq; // 더블클릭한 아이템 빼고 나머지
          });

          setGuestList(newGuestList);
        } else {
          CmAlert("작업중 오류가 발생하였습니다.[1]", body, "error", "닫기");
        }
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.[2]", error, "error", "닫기");
      }
    };

    // 실제 처리
    Swal.fire(CmAlertConfirmMSg("삭제 하시겠습니까?")).then((result) => {
      if (result.isConfirmed) {
        fnDelete("modify", e);
      }
    });
  };

  return (
    <>
      <FormGroup>
        <Label for="exampleSelectMulti">
          파일 (총 {guestList.length}개
          {readOnlyMode ? "" : ` / 최대 ${maxUploadCnt}개 첨부 가능`})
          &nbsp;&nbsp;
          {/* timeTableRowNum {timeTableRowNum} */}
          {guestList.length >= maxUploadCnt || readOnlyMode ? (
            ""
          ) : (
            <Button outline size="sm" color="info" onClick={toggle}>
              +
            </Button>
          )}
        </Label>

        <ListGroup>
          <>
            {guestList.map((one, index) => {
              return (
                <ListGroupItem key={index}>
                  {index + 1}. {one.fileOrginNm}
                  &nbsp;
                  <img
                    src={`/${one.fileSavePath}${one.fileSaveNm}`}
                    width="100px"
                    alt={`${one.fileSaveNm}`}
                  />
                  {readOnlyMode ? (
                    "" 
                  ) : (
                    <Button
                      outline
                      size="sm"
                      color="danger"
                      onClick={() => {
                        deleteGuestOne(one.fileInfoSeq);
                      }}
                    >
                      x
                    </Button>
                  )}
                </ListGroupItem>
              );
            })}
            {guestList.length > 0 || readOnlyMode ? (
              ""
            ) : (
              <ListGroupItem>
                <Button outline size="sm" color="info" onClick={toggle}>
                  +
                </Button>
                &nbsp;버튼을 눌러 파일을 추가하세요.
              </ListGroupItem>
            )}
          </>
        </ListGroup>
      </FormGroup>

      <Modal
        isOpen={modal}
        toggle={toggle}
        backdrop={backdrop}
        centered
        {...props}
      >
        <ModalHeader toggle={toggle}>파일 추가</ModalHeader>
        <ModalBody>
          <div>
            <div>
              <FormGroup>
                <Input
                  id="exampleFile"
                  name="file"
                  type="file"
                  onChange={(e) => handleFileInput(e)}
                />
                <FormText>
                  최대 {maxUploadCnt}개 가능, 파일 최대{" "}
                  {CM_FILE_UPLOAD_MAX_SIZE / 1000}KB 크기 가능
                  <br />
                  파일 확장자 {CM_FILE_UPLOAD_FILE_EXTENSION} 만 가능
                </FormText>
              </FormGroup>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={clickAdd}>
            확인
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
