export type DemoPhoto = {
  id: string;
  src: string;
  caption: string;
  takenAt: string;
};

export type DemoSpot = {
  id: string;
  name: string;
  prefectureId: number;
  comment: string;
};

export type DemoTrip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  comment: string;
  prefectureIds: number[];
  spots: DemoSpot[];
  photos: DemoPhoto[];
  createdAt: string;
};

export type DemoState = {
  trips: DemoTrip[];
  userName: string;
};
