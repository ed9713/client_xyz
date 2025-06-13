import BcModifyForm from "./components/BcModifyForm";
export default function BcModify(props) {
  return (
    <main>
      <BcModifyForm {...props} formFrom="modify" />
    </main>
  );
}
