"use client";

import styles from "./root.module.scss";
import withTheme from "../theme";

const Root = function Root(props: any) {
  const { children } = props;
  return <div className={styles.root}>{children}</div>;
};

const RootPage = (props: any) => {
  return withTheme(<Root {...props} />);
};

export default RootPage;
