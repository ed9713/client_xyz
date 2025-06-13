import { useEffect, useState } from "react";

export function CmUseDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // 입력값 체크 useEffect
  useEffect(() => {
    const timeId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    /*
이 useEffect 는 input 값이 변경될때마다 실행되는데
처음 호출되고
두번째 실행되기 전에
아래 callback 함수를 실행시키고
두번째 실행을 받는다.
*/
    // 타이머 unmount 될때 실행
    return () => {
      clearTimeout(timeId);
      //console.log('종료됨' + now );
    };
  }, [value, delay]);

  return debouncedValue;
}
