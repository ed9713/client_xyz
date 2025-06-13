import { Badge } from "reactstrap";
import CmAlert from "../../hook/CmAlert";

export default function Footer() {
  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      CmAlert("클립보드에 링크가 복사되었습니다.", "", "info", "닫기", 1000);
    } catch (e) {
      console.log(e);
      CmAlert("복사에 실패하였습니다.", "", "info", "닫기", 1000);
    }
  };

  return (
    <footer align="center" valign="middle">
      컨텐츠의 저작권은 각 채널의 방송사에 있습니다. <br />
      <Badge color="danger">
        회원정보 포함 데이터는 예고없이 초기화됩니다.
      </Badge>
      <br />
      <Badge
        color="primary"
        padding="10px"
        className="cursorPointer"
        onClick={() => handleCopyClipBoard("XXXX@naver.com")}
      >
        이메일 연락처 : XXXX@네이버.com 복사
      </Badge>
    </footer>
  );
}
