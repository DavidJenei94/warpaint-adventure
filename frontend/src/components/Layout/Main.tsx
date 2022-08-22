import { ChildrenProps } from '../../models/basicProps';

import styles from './Main.module.scss';

const Main = ({ children }: ChildrenProps) => {
  return <main className={styles.main}>{children}</main>;
};

export default Main;
