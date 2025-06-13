import { useState } from "react";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

import moment from "moment";

export default function MainTest() {
  const today = new Date();
  const [date, setDate] = useState(today);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    console.log(`handleDateChange` + newDate);
  };

  const [value, onChange] = useState(new Date());

  const [mark, setMark] = useState([
    "2025-05-15",
    "2025-05-20",
    "2025-05-21",
    "2025-05-22",
    "2025-06-21",
    "2025-06-22",
  ]);

  return (
    <main>
      <div className="testCss1">
        <Calendar
          value={date}
          onChange={handleDateChange}
          onClickDay={(value) => console.log("Clicked day: ", value)}
          onClickDecade={(value) => console.log("Clicked decade: ", value)}
          onClickMonth={(value) => console.log("Clicked month: ", value)}
          onClickWeekNumber={(value) => console.log("Clicked month: ", value)}
          onClickYear={(value) => console.log("Clicked year: ", value)}
          onViewChange={({ view }) => console.log("New view is: ", view)}
          onActiveStartDateChange={({ action, activeStartDate, value, view }) =>
            console.log(
              "Changed view to: ",
              action,
              activeStartDate,
              value,
              view
            )
          }
          formatDay={(locale, date) => moment(date).format("D")} // 일 제거 숫자만 보이게
          formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
          formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
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
            if (mark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
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

      <div hidden>
        <Calendar
          onChange={onChange} // useState로 포커스 변경 시 현재 날짜 받아오기
          formatDay={(locale, date) => moment(date).format("DD")} // 날'일' 제외하고 숫자만 보이도록 설정
          value={value}
          minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
          maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
          navigationLabel={null}
          showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
          className="mx-auto w-full text-sm border-b"
          tileContent={({ date }) => {
            // 날짜 타일에 컨텐츠 추가하기 (html 태그)
            // 추가할 html 태그를 변수 초기화
            let html = [];
            // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
            if (mark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
              html.push(<div key={date} className="dot"></div>);
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

        <div className="text-gray-500 mt-4">
          {moment(value).format("YYYY년 MM월 DD일")}
        </div>
      </div>
    </main>
  );
}
