import MainForm from "./components/MainForm";
import moment from "moment";
import { CmChangeSearchToJson } from "../../components/js/Common";

export default function main(props) {
  const sSrchWords = CmChangeSearchToJson(
    props.location.search.replace("?", "")
  );
  const sMonth =
    sSrchWords && sSrchWords.sMonth && sSrchWords.sMonth.length === 7
      ? sSrchWords.sMonth
      : moment().format("YYYY-MM");

  return (
    <main>
      <MainForm {...props} sMonth={sMonth} />
    </main>
  );
}
