import cookie from "react-cookies";
import CmAlert from "../../hook/CmAlert";
import axios from "axios";
import sanitizeHtml from "sanitize-html";
import Swal from "sweetalert2";

// =======================================================
// 전역상수
export const CM_HOME_PAGE_NAME = "ed9719.cafe24app.com";
export const CM_CD_GROUP_ID_ETC = "__XXXX__";
export const CM_CD_NEW_TEMP_SEQ_MAX = 10000;
export const CM_CD_IS_INVALID = "is-invalid";
export const CM_CM_USER_DEFAULT = "default";
export const CM_MIN_WIDTH_DEFAULT = 500;
export const CM_LOGIN_NOT_EMAIL = "noLogin"; // 로그인 정보가 없다.
export const CM_LOGIN_NOT_CHECK = "noCheck"; // 로그인 정보 체크 전이다.
export const CM_USER_LEVEL_ADM = 10;
export const CM_USER_EMAIL_ADM = "XXXX@naver.com";

export const CM_FILE_UPLOAD_MAX_SIZE = 100000;
export const CM_FILE_UPLOAD_MAX_CNT = 10;
export const CM_FILE_UPLOAD_FILE_EXTENSION = "png,jpg,jpeg,gif";

export const URL_BC_LIST = "/bc/list";
export const URL_BC_DETAIL = "/bc/detail";
export const URL_BC_Modify = "/bc/modify";
export const URL_BC_REGISTER = "/bc/register";

export const URL_USER_LIST = "/user/list";
// export const URL_USER_DETAIL = "/user/detail"
export const URL_USER_Modify = "/user/modify";

export const URL_CD_LIST = "/cm/cd/list";
export const URL_PEOPLE_LIST = "/cm/people/list";
export const URL_CONNER_LIST = "/conner/list";

export const URL_USER_LOGIN = "/user/login";

export const BC_BLANK = "";
export const BC_RESET = "reset";

export const BC_VALIDATION_TT_PRE = "validationTT";
export const BC_VALIDATION_TT_START = "validationTTStart";
export const BC_VALIDATION_TT_ING = "validationTTIng";
export const BC_VALIDATION_TT_SUCCESS = "validationTTSuccess";
export const BC_VALIDATION_TT_FAIL = "validationTTFail";
export const BC_VALIDATION_TT_END = "validationTTEnd";

export const BC_SAVE_TT_PRE = "saveTT";
export const BC_SAVE_TT_START = "saveTTStart";
export const BC_SAVE_TT_ING = "saveTTIng";
export const BC_SAVE_TT_SUCCESS = "saveTTSuccess";
export const BC_SAVE_TT_FAIL = "saveTTFail";
export const BC_SAVE_TT_END = "saveTTEnd";

export const BC_SAVE_TG_PRE = "saveTG";
export const BC_SAVE_TG_START = "saveTGStart";
export const BC_SAVE_TG_ING = "saveTGIng";
export const BC_SAVE_TG_SUCCESS = "saveTGSuccess";
export const BC_SAVE_TG_FAIL = "saveTGFail";
export const BC_SAVE_TG_END = "saveTGEnd";

export const BC_VALIDATION_BC_PRE = "validationBC";
export const BC_VALIDATION_BC_START = "validationBCStart";
export const BC_VALIDATION_BC_ING = "validationBCIng";
export const BC_VALIDATION_BC_SUCCESS = "validationBCSuccess";
export const BC_VALIDATION_BC_FAIL = "validationBCFail";
export const BC_VALIDATION_BC_END = "validationBCEnd";

export const BC_SAVE_BC_PRE = "saveBC";
export const BC_SAVE_BC_START = "saveBCStart";
export const BC_SAVE_BC_ING = "saveBCIng";
export const BC_SAVE_BC_SUCCESS = "saveBCSuccess";
export const BC_SAVE_BC_FAIL = "saveBCFail";
export const BC_SAVE_BC_END = "saveBCEnd";

// =======================================================
// 로그아웃 처리
export default function CmLogOut() {
  const fnExcute = async (e) => {
    CmRemoveCookie(e);
    window.location.href = "/";
  };

  fnExcute();
}

// =======================================================
// 로그인 페이지로 가기
export function CmGotoLoginForm() {
  const fnExcute = async (e) => {
    CmRemoveCookie(e);
    CmAlert("로그인 후 가능합니다. ", "", "info", "닫기");
    setTimeout(function () {
      window.location.href = URL_USER_LOGIN + "/#nocookie";
    }, 1000);
  };

  fnExcute();
}

// =======================================================
// 로그인 쿠키 삭제
export function CmRemoveCookie(_e) {
  cookie.remove("userEmail", { path: "/" });
  cookie.remove("userNickName", { path: "/" });
  cookie.remove("userPassword", { path: "/" });
  cookie.remove("userLevel", { path: "/" });
  cookie.remove("userIp", { path: "/" });
}

// =======================================================
// 로그인 쿠키 삭제
export function CmRemoveCookieAndGotoMain(e) {
  CmRemoveCookie(e);
  window.location.href = "/";
}

export function CmNeedLoginAndGotoMain(_e) {
  CmAlert(
    `로그인 후 이용 가능합니다. <br/>메인으로 이동합니다.`,
    "",
    "info",
    "닫기",
    3000
  );
  setTimeout(function () {
    CmRemoveCookieAndGotoMain();
  }, 1000);
}

export function CmNoPermissionAndGotoMain(_e) {
  CmAlert(
    `권한이 없습니다. <br/>메인으로 이동합니다.`,
    "",
    "info",
    "닫기",
    3000
  );
  setTimeout(function () {
    window.location.href = "/";
  }, 1000);
}

// =======================================================
// 공통코드 가져오기
export const CmSelectListByGroupId = async (pKind) => {
  pKind = "CmCdList";

  let insertJson = { useYn: "Y" };
  let cdGroupIdList = "";
  let cdGroupIdYn = "N";
  switch (pKind) {
    case "CmCdList":
      cdGroupIdList = "orderByColCmCd";
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

  await axios
    .get("/api/cm/cdForm?type=listByGroupId", insertJson)
    .then((response) => {
      try {
        console.log(`CmSelectListByGroupId`);
        const result = response.data;
        return result.json;
      } catch (error) {
        CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        return null;
      }
    })
    .catch((_response) => {
      console.log(" CmSelectListByGroupId error ");
      return null;
    });
};

// =======================================================
// 값 변경시
export function CmChangeValue(e, pOriginalState, _pWhere) {
  const { name, value, type, checked } = e.target;

  let newState = { ...pOriginalState };
  if (name === "cdGroupId") {
    if (value !== CM_CD_GROUP_ID_ETC) {
      newState = { ...newState, cdGroupIdText: "" };
    }
  }

  if (type === "checkbox") {
    newState = { ...newState, [name]: checked ? "N" : "Y" };
  } else {
    newState = { ...newState, [name]: value };
  }

  return newState;
}

// =======================================================
// textarea 의 값들 변경 - db저장전
export function CmChangeTextareaValue(pValue) {
  if (!pValue) pValue = "";
  pValue = pValue.replaceAll("'", "¿");
  return pValue;
}

// textarea 의 값들 변경 - db에서 가져오기
export function CmSetTextareaValue(pValue) {
  if (!pValue) pValue = "";
  pValue = pValue.replaceAll("<br/>", "\n");
  pValue = pValue.replaceAll('"', '"');
  pValue = pValue.replaceAll("\\%", "%");
  pValue = pValue.replaceAll('\\"', '"');
  pValue = pValue.replaceAll("¿", "'");
  return pValue;
}

// textarea 의 값들 변경 - db에서 가져오기 - 상세보기
export function CmSetTextareaValueDetail(pValue) {
  if (!pValue) pValue = "";
  pValue = pValue.replaceAll("\\\\", "\\");
  pValue = pValue.replaceAll('\\"', '"');
  pValue = pValue.replaceAll("\\", "");
  pValue = pValue.replaceAll("\n", "<br/>");
  pValue = pValue.replaceAll("¿", "'");
  return pValue;
}

// textarea 의 값들 변경 - db에서 가져오기 - 상세보기
export function CmSetTextareaValueDetailWithDbData(pValue) {
  if (pValue) {
    pValue = pValue.replaceAll("\n", "<br/>");
  }

  return CmSetTextareaValueDetail(pValue);
}

// =======================================================
// 리스트에서 페이지에 필요한 변수 세팅
export function CmGetListConfig(
  pNowPage,
  pTotalCount,
  pGotoUrl,
  pSearchWordList,
  pFnGotoList
) {
  let listConfig = {
    numPerPage: 10, // 한페이지의 게시물 갯수
    numPerBlock: window.innerWidth < CM_MIN_WIDTH_DEFAULT ? 5 : 10, // 아래 페이지 블록의 페이지 갯수
    nowPage: 1, // 현재페이지

    topStart: 0,
    topEnd: 0,
    topIndex: 0, // 해당페이지의 top index  (0부터 시작)

    totalCount: 0, // 총 갯수
    totalPage: 0,
    searchTotalCount: 0, // 해당 페이지에 검색된 row 갯수

    gotoUrl: pGotoUrl,
    searchWordList: pSearchWordList,
  };

  if (pNowPage) listConfig.nowPage = pNowPage;
  if (pTotalCount) listConfig.totalCount = pTotalCount;

  listConfig.totalPage = Math.ceil(
    listConfig.totalCount / listConfig.numPerPage
  );

  // if (listConfig.totalPage < listConfig.nowPage) {
  //   listConfig.nowPage = listConfig.totalPage;
  // }

  listConfig.topStart = (listConfig.nowPage - 1) * listConfig.numPerPage + 1;
  listConfig.topEnd = listConfig.topStart + listConfig.numPerPage - 1;

  listConfig.topIndex = listConfig.topStart - 1;
  // listConfig.totalPage = listConfig.totalPage;
  listConfig.fnGotoList = pFnGotoList;

  return listConfig;
}

// =======================================================
// search 값 json 객체로
export function CmChangeSearchToJson(pSearchValue) {
  let returnValue = {};
  let searchList = pSearchValue.split("&");
  for (let i = 0; i < searchList.length; i++) {
    let searchOne = searchList[i].split("=");
    if (searchOne[0] && searchOne[1]) {
      returnValue = {
        ...returnValue,
        [searchOne[0]]: decodeURIComponent(searchOne[1]),
      };
    }
  }

  return returnValue;
}

// json 객체를 search 값 으로
export function CmChangeJsonToSearch(pJsonData) {
  let returnValue = "";
  // console.log(pJsonData)
  for (var key in pJsonData) {
    if (pJsonData.hasOwnProperty(key)) {
      var value = pJsonData[key];
      if (value) {
        if (returnValue) {
          returnValue += `&`;
        }
        returnValue += `${key}=${pJsonData[key]}`;
      }
    }
  }

  return returnValue;
}

// json 객체를 search 값 으로 - page 처리 추가
export function CmChangeJsonToSearchWithList(pListUrl, pJsonData) {
  let returnValue = "";
  let page = 1;

  // console.log(pJsonData);

  for (var key in pJsonData) {
    if (pJsonData.hasOwnProperty(key)) {
      var value = pJsonData[key];

      if (value) {
        if (key === "sPage") {
          page = value;
        } else {
          if (returnValue) {
            returnValue += `&`;
          }
          returnValue += `${key}=${pJsonData[key]}`;
        }
      }
    }
  }

  returnValue = pListUrl + `/${page}?${returnValue}`;

  return returnValue;
}

// json 객체를 search 값 으로
export function CmIsNull(pString, pDefault) {
  pDefault = pDefault ? pDefault : "";
  return pString ? pString : pDefault;
}

// json 객체를 search 값 으로
export function CmGetNewTempSeq() {
  return Math.ceil(Math.random() * CM_CD_NEW_TEMP_SEQ_MAX);
}

// in-valid 스타일 넣기
export function CmAddInValidClassName(pFrmId, pInValidColumn) {
  if (pInValidColumn && pFrmId) {
    let b = document.querySelector(`#${pFrmId} #${pInValidColumn}`);
    if (b && b.className) {
      b.className += ` ${CM_CD_IS_INVALID}`;
    }
  }
}

// in-valid 스타일 제거
export function CmClearInValidClassName(pFrmId, pInValidList) {
  if (pInValidList && pFrmId && pInValidList.length) {
    pInValidList.forEach((item) => {
      let b = document.querySelector(`#${pFrmId} #${item}`);
      if (b && b.className) {
        b.className = b.className.replaceAll(CM_CD_IS_INVALID, "");
      }
    });
  }
}

// 경고문 표시 여부
export function CmShowInValidMessage(
  pKind,
  pFrmId,
  ppInValidColumn,
  pMsg,
  pRefId
) {
  if (pKind === "alert") {
    if (pRefId) {
      pRefId.current.focus();
    }

    CmAlert(pMsg, "", "info", "닫기");
  } else {
    // CmAddInValidClassName( pFrmId , ppInValidColumn )
  }

  CmAddInValidClassName(pFrmId, ppInValidColumn);
}

// 상세보기에서 태그 노출 안되게
export function CmGetTranslated(text) {
  const sanitizedText = sanitizeHtml(text, {
    allowedTags: ["br", "em", "span"], //허용할 태그 지정
  });
  return { __html: sanitizedText };
}

// 요일 표시
export function CmGetDayOfTheWeek(pYoil) {
  const yoilList = {
    0: "월",
    1: "화",
    2: "수",
    3: "목",
    4: "금",
    5: "토",
    6: "일",
  };
  let returnValue = yoilList[pYoil] ? yoilList[pYoil] : "";
  return returnValue;
}

// peopleId 로 검색
export function CmGotoConnerListByPeopleId(pPeopleId) {
  Swal.fire({
    title: "참여 코너 목록을 조회하시겠습니까?",
    text: "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "예",
    cancelButtonText: "아니요",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = `/conner/list/1?sGuestNm=${pPeopleId}`;
    }
  });
}
