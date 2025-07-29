export default interface ITile {
  id: number;
  target: string;
  title: string;
  icon: JSX.Element | null;
  home: string;
  category: string;
}
