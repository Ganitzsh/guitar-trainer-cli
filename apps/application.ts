export interface Application<TState> {
  state: TState;
  start: () => void;
  stop: () => void;
}
