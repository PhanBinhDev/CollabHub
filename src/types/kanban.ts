import { Point } from '.';

export type ListListState =
  | {
      mode: ListListMode.MovingList;
      origin: Point;
      current: Point;
    }
  | {
      mode: ListListMode.MovingCard;
      origin: Point;
      current: Point;
    };

export enum ListListMode {
  MovingList,
  MovingCard,
}
