import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory  } from "react-router-dom";
import { Badge, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";

import { useNavigate } from 'react-router-dom';
import { CmGetListConfig } from "../../components/js/Common";



export default function CmPagination(props) {
  // console.log(props)

  const listConfig = CmGetListConfig(
    props.nowPage,
    props.totalCount,
    props.gotoUrl,
    props.searchWordList,
    props.fnGotoList
  );
  console.log(listConfig);

  // ==============================================================
  const history = useHistory();

  // ==============================================================
  // 페이지 값들 세팅
  const settingPagination = (pListConfig) => {
    let listConfig = { ...pListConfig };
    let totalPage = Math.ceil(listConfig.totalCount / listConfig.numPerPage);
    let searchTotalCount = listConfig.searchTotalCount;

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

      let nextBlock = nowBlock + 1;
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

    // history.push(`${listConfig.gotoUrl}/${pPage}${listConfig.searchWordList}`);
    // navigate(`/cm/cd/list/${pPage}`)
    // window.location.href = `${listConfig.gotoUrl}/${pPage}${listConfig.searchWordList}`;
    props.fnGotoList(pPage);
    // console.log(props.fnGotoList);
  };

  // ==============================================================
  // 값세팅
  let initPageDefault = settingPagination(listConfig);
  // console.log("initPageDefaultinitPageDefault");
  // console.log(initPageDefault);


    // let initPageDefault = {
    //   page1: 1,
    //   pagePrev: 2,
    //   pageStart: 1,
    //   pageEnd: 10,
    //   pageNext: 4,
    //   pageTotal: 100,
    //   pageNow: props.nowPage,
    // };

  const [initPage, setInitPage] = useState(initPageDefault);
  console.log(initPage);

  let pageList = [];
  for (let i = initPage.pageStart; i <= initPage.pageEnd; i++) {
    pageList.push(i);
  }

  useEffect(() => {
    console.log("useEffect ");
  }, []);


      useEffect(()=>{
          console.log("useEffect " )
          setInitPage(initPageDefault)
      },[props.nowPage])
  


  // const Test = ()=>{
  //   setInitPage(useState( settingPagination(listConfig) ))
  // }

  const TestClick = () => {
    console.log("눌러앙ㅇ value");
    setInitPage(useState(settingPagination(listConfig)));
  };

  return (
    <>
      <Button onClick={TestClick}>눌러</Button>
      {initPage.pageNow}
      <br></br>
      {initPage.pageNow > 4 ? "5이상" : "4이하"}
      <Pagination aria-label="Page navigation">
        <PaginationItem hidden={!initPage.page1 ? true : false}>
          <PaginationLink
            first
            href="#"
            onClick={(e) => gotoPage(`${initPage.page1}`)}
          />
        </PaginationItem>

        <PaginationItem hidden={!initPage.pagePrev ? true : false}>
          <PaginationLink
            previous
            href="#"
            onClick={(e) => gotoPage(`${initPage.pagePrev}`)}
          />
        </PaginationItem>

        {pageList.map((page) => {
          return (
            <PaginationItem
              key={page}
              active={page === initPage.pageNow ? true : false}
            >
              <PaginationLink href="#" onClick={(e) => gotoPage(`${page}`)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem hidden={!initPage.pageNext ? true : false}>
          <PaginationLink
            href="#"
            next
            onClick={(e) => gotoPage(`${initPage.pageNext}`)}
          />
        </PaginationItem>
        <PaginationItem hidden={!initPage.pageTotal ? true : false}>
          <PaginationLink
            href="#"
            last
            onClick={(e) => gotoPage(`${initPage.pageTotal}`)}
          />
        </PaginationItem>
      </Pagination>
    </>
  );
}
