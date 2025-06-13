import styles from "./EmptyPage.module.scss";
import { Button } from "reactstrap";

export default function EmptyPage(props) {
  return (
    <main>
      <div className={styles.emptyPage}>
        <div className={styles.emptyPage__title}>잘못된 링크 입니다.</div>
        <div className={styles.emptyPage__buttons}>
          <Button
            block
            size=""
            onClick={() => {
              window.location.href = "/";
            }}
          >
            처음으로 이동
          </Button>
        </div>
      </div>
    </main>
  );
}
