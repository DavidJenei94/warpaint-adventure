import { ChildrenProps } from '../../models/basic.props';

import styles from './Main.module.scss';

const Main = ({ children }: ChildrenProps) => {
  return <main className={styles.main}>{children}</main>;
};

export default Main;
