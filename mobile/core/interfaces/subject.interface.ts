export interface Subject {
  id: string;
  name: string;
}

export interface SubjectsPage {
  data: Subject[];
  count: number;
}
