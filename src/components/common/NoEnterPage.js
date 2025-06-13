import styles from "./EmptyPage.module.scss";
import { Button } from "reactstrap";

export default function NoEnterPage() {
  return (
    <main>
      <div className={styles.emptyPage}>
        <div className={styles.emptyPage__buttons}>
          <Button block size="">
            사이트 오류 입니다.{" "}
          </Button>
        </div>
      </div>
    </main>
  );
}
