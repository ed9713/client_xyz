import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { CM_MIN_WIDTH_DEFAULT, CmGetListConfig } from "../js/Common";

// ==========================================================
// 타이틀
// ==========================================================
export default function CmTitle(props) {
  const title = props.title;
  return (
    <>
      <div className="cmDetailTitle">- {title}</div>
    </>
  );
}

export function CmDetailTitle(props) {
  const title = props.title;
  return (
    <>
      <div className="cmDetailTitle">-&nbsp;{title}</div>
    </>
  );
}

// ==========================================================
// select 의 선택하세요. option
// ==========================================================
export function CmSelectOptionNoValue() {
  // const title = props.title;
  return <option value="">선택하세요.</option>;
}

// select 의 숫자로 된 옵션
export function CmSelectOptionNumber(props) {
  const startIdx = props.startIdx;
  const endIdx = props.endIdx;
  let list = [];
  for (let i = startIdx; i <= endIdx; i++) {
    list.push(i);
  }

  return (
    <>
      {list.map((one) => {
        return (
          <option value={one} key={one}>
            {one}
          </option>
        );
      })}
    </>
  );
}

// ==========================================================
// 페이지네이션
// ==========================================================
export function CmPagination(props) {
  // console.log(props)

  const listConfig = CmGetListConfig(
    props.nowPage,
    props.totalCount,
    props.gotoUrl,
    props.searchWordList,
    props.fnGotoList
  );
  // console.log(listConfig);

  // ==============================================================
  const history = useHistory();

  // ==============================================================
  // 페이지 값들 세팅
  const settingPagination = (pListConfig) => {
    let listConfig = { ...pListConfig };
    let totalPage = Math.ceil(listConfig.totalCount / listConfig.numPerPage);

    // 페이지 관련
    // 맨앞 | 이전 | 1 |2 | 3 | 다음 | 맨뒤
    let gotoPaging = {
      page1: 0,
      pagePrev: 0,
      pageStart: 0,
      pageEnd: 0,
      pageNext: 0,
      pageTotal: 0,
      pageNow: parseInt(listConfig.nowPage),
    };

    if (totalPage < listConfig.nowPage) {
      listConfig.nowPage = totalPage;
    }

    if (totalPage > 0) {
      let nowBlock = Math.ceil(listConfig.nowPage / listConfig.numPerBlock);

      let prevBlock = nowBlock - 1;
      let totalBlock = Math.ceil(totalPage / listConfig.numPerBlock);

      if (nowBlock > 1) {
        gotoPaging.page1 = 1;
        gotoPaging.pagePrev = prevBlock * listConfig.numPerBlock;
      }

      gotoPaging.pageStart = prevBlock * listConfig.numPerBlock + 1;
      if (nowBlock * listConfig.numPerBlock <= totalPage) {
        gotoPaging.pageEnd = nowBlock * listConfig.numPerBlock;
      } else {
        gotoPaging.pageEnd = totalPage;
      }

      if (totalBlock > nowBlock) {
        gotoPaging.pageNext = nowBlock * listConfig.numPerBlock + 1;
        gotoPaging.pageTotal = totalPage;
      }
    }

    return gotoPaging;
  };

  const gotoPage = (pPage) => {
    // const navigate = useNavigate();

    history.push(`${listConfig.gotoUrl}/${pPage}?${listConfig.searchWordList}`);
    // window.location.href = `${listConfig.gotoUrl}/${pPage}${listConfig.searchWordList}`;
    props.fnGotoList(pPage);
  };

  // ==============================================================
  // 값세팅
  let initPageDefault = settingPagination(listConfig);
  const [initPage, setInitPage] = useState(initPageDefault);

  let pageList = [];
  for (let i = initPage.pageStart; i <= initPage.pageEnd; i++) {
    pageList.push(i);
  }

  useEffect(() => {
    setInitPage(initPageDefault);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  let size = window.innerWidth < CM_MIN_WIDTH_DEFAULT ? "sm" : "";

  return (
    <>
      <Pagination size={size} aria-label="Page navigation">
        <PaginationItem hidden={!initPage.page1 ? true : false}>
          <PaginationLink first onClick={() => gotoPage(`${initPage.page1}`)} />
        </PaginationItem>

        <PaginationItem hidden={!initPage.pagePrev ? true : false}>
          <PaginationLink
            previous
            onClick={() => gotoPage(`${initPage.pagePrev}`)}
          />
        </PaginationItem>

        {pageList.map((page) => {
          return (
            <PaginationItem
              key={page}
              active={page === initPage.pageNow ? true : false}
            >
              <PaginationLink onClick={() => gotoPage(`${page}`)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem hidden={!initPage.pageNext ? true : false}>
          <PaginationLink
            next
            onClick={() => gotoPage(`${initPage.pageNext}`)}
          />
        </PaginationItem>
        <PaginationItem hidden={!initPage.pageTotal ? true : false}>
          <PaginationLink
            last
            onClick={() => gotoPage(`${initPage.pageTotal}`)}
          />
        </PaginationItem>
      </Pagination>
    </>
  );
}
