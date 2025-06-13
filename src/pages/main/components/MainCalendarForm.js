import moment from "moment";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { CmGetListConfig } from "../../../components/js/Common";
import axios from "axios";
import CmAlert from "../../../hook/CmAlert";

export default function MainCalendarForm(props) {
  const sMonth = props.sMonth ? props.sMonth : moment().format("YYYY-MM");
  const sKind = props.sKind === "conner" ? props.sKind : "channel";
  const setParentSMonth = props.setParentSMonth
    ? props.setParentSMonth
    : () => {};
  const setParentSBroadcastDate = props.setParentSBroadcastDate
    ? props.setParentSBroadcastDate
    : () => {};

  const [selectDate, setSelectDate] = useState(
    sMonth ? sMonth + "-01" : moment().format("YYYY-MM-DD")
  );

  const handleDateChange = (newDate) => {
    setSelectDate(newDate);
    setParentSBroadcastDate(moment(newDate).format("YYYY-MM-DD"));    
  };

  // const [value, onChange] = useState(new Date());

  const [mark, setMark] = useState([]);

  //
  useEffect(() => {
    const today =
      sMonth === moment().format("YYYY-MM")
        ? moment().format("YYYY-MM-DD")
        : sMonth + "-01";
    setSelectDate(today);
  }, [sMonth]);

  // 리스트 가져오기
  useEffect(() => {
    getListPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sMonth, sKind]);

  // 내부함수 - 해당페이지의 리스트 가져오기
  const getListPage = () => {
    const listConfig = CmGetListConfig(1, 10);
    const srchWord = { sBroadcastMonth: sMonth };
    let insertJson = { ...srchWord, ...listConfig, useYn: "" };

    let url = "/api/ytb/bcForm?type=listCntByMonth";
    if (sKind === "conner") {
      url = "/api/ytb/bcForm?type=listTtCntByMonth";
    }

    axios
      .post(url, insertJson)
      .then((response) => {
        try {
          const result = response.data;
          setMark(result.json);
        } catch (error) {
          CmAlert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
        }
      })
      .catch(() => {
        return false;
      });
  };

  // 지난달, 다음달 클릭시
  const onActiveStartDateChange = ({ action, activeStartDate, view }) => {
    // console.log("Changed view to: ", action, activeStartDate, value, view)
    // console.log(activeStartDate); 
    if (
      (view === "month") &
      (action === "prev" || action === "next" || action === "drillDown")
    ) {
      const month = moment(activeStartDate).format("YYYY-MM");
      // console.log(month);
      setParentSMonth(month);
      setParentSBroadcastDate("");
    }
  };

  const onViewChange = ({ action, activeStartDate, view }) => {
    // console.log("===== New view is: ", view , action , activeStartDate , value)

    if ((view === "month") & (action === "drillDown")) {
      const month = moment(activeStartDate).format("YYYY-MM");
      // console.log(month);
      const firstMonth = moment(activeStartDate).format("MM");
      // console.log(firstMonth)
      if (firstMonth === "01") {
        setParentSMonth(month);
        setParentSBroadcastDate("");
      }
    }
  };

  return (
    <div>
      <Calendar
        value={selectDate}
        onChange={handleDateChange}
        onClickDay={() => {
          /* console.log("Clicked day: ", value) */
        }}
        onClickDecade={() => {
          /* console.log("Clicked decade: ", value) */
        }}
        onClickMonth={() => {
          /* console.log("Clicked month: ", value) */
        }}
        onClickWeekNumber={() => {
          // console.log("Clicked month: ", value)
        }}
        onClickYear={(value) => console.log("Clicked year: ", value)}
        onViewChange={onViewChange}
        // onViewChange={({ action, activeStartDate, value, view }) => {
        //    console.log("===== New view is: ", view , action , activeStartDate , value)
        //   }}
        onActiveStartDateChange={onActiveStartDateChange}
        // onActiveStartDateChange={({ action, activeStartDate, value, view }) =>
        //   console.log("Changed view to: ", action, activeStartDate, value, view)
        // }
        formatDay={(locale, selectDate) => moment(selectDate).format("D")} // 일 제거 숫자만 보이게
        formatYear={(locale, selectDate) => moment(selectDate).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
        formatMonthYear={(locale, selectDate) =>
          moment(selectDate).format("YYYY. MM")
        } // 네비게이션에서 2023. 12 이렇게 보이도록 설정
        calendarType="gregory" // 일요일 부터 시작
        showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
        next2Label={null} // +1년 & +10년 이동 버튼 숨기기
        prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
        minDetail="year" // 10년단위 년도 숨기기
        tileContent={({ date }) => {
          // 날짜 타일에 컨텐츠 추가하기 (html 태그)
          // 추가할 html 태그를 변수 초기화
          let html = [];
          // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
          if (
            mark.find(
              (x) => x.broadcastDate === moment(date).format("YYYY-MM-DD")
            )
          ) {
            html.push(<div key={date} className="dot"></div>);
          } else {
            html.push("");
          }
          // 다른 조건을 주어서 html.push 에 추가적인 html 태그를 적용할 수 있음.
          return (
            <>
              <div className="flex justify-center items-center absoluteDiv">
                {html}
              </div>
            </>
          );
        }}
      />
    </div>
  );
}
