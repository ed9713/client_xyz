import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
} from "reactstrap";

import styles from "./Main0000Form.module.scss";

export default function MainTop() {

  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <>
      <div className={styles.main0000FormBody}>
        <div className={styles.main0000FormBody__contents}></div>
        <div className={styles.page__contents__imageBox}>
          {list.map(() => {
            return (
              <div>
                <Card
                  style={{
                    width: "18rem",
                  }}
                >
                  <img alt="Sample" src="https://picsum.photos/300/200" />
                  <CardBody>
                    <CardTitle tag="h5">Card title</CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                      Card subtitle
                    </CardSubtitle>
                    <CardText>
                      Some quick example text to build on the card title and
                      make up the bulk of the card‘s content.
                    </CardText>
                    <Button>Button</Button>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
