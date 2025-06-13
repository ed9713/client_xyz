import Swal from "sweetalert2";
export function CmAlert(contents, title, icon, confirmButtonText, timer) {
  let tm = 0;
  if (timer) {
    tm = timer;
  }

  Swal.fire({
    title: title,
    // html: contents,
    html: contents,
    icon: icon,
    confirmButtonText: confirmButtonText,
    timer: tm,
  });
}

export function CmAlertConfirmMSg(pTitle, pText) {
  if (!pTitle) pTitle = "실행하시겠습니까?";
  if (!pText) pText = "";

  const returnData = {
    title: pTitle,
    text: pText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "예",
    cancelButtonText: "아니요",
  };

  return returnData;
}

export function CmAlertNeedLogin() {
  CmAlert("로그인이 필요합니다.", "", "info", "닫기", 3000);
}

export default CmAlert;
