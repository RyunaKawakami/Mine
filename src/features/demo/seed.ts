import type { DemoState } from "./types";

export const demoSeed: DemoState = {
  userName: "ふたり",
  trips: [
    {
      id: "kanazawa-2026",
      title: "金沢、雨上がりの町歩き",
      startDate: "2026-08-08",
      endDate: "2026-08-10",
      comment:
        "茶屋街の石畳と、雨上がりの空気。予定を詰めずに歩いた時間がいちばんの思い出。",
      prefectureIds: [17],
      spots: [
        {
          id: "spot-higashichaya",
          name: "ひがし茶屋街",
          prefectureId: 17,
          comment: "朝の静かな時間に散歩。",
        },
        {
          id: "spot-kenrokuen",
          name: "兼六園",
          prefectureId: 17,
          comment: "雨粒の残る緑がきれいだった。",
        },
      ],
      photos: [
        {
          id: "photo-kanazawa-1",
          src: "/images/demo-kanazawa.svg",
          caption: "雨上がりのひがし茶屋街",
          takenAt: "2026-08-09",
        },
      ],
      createdAt: "2026-08-10T12:00:00.000Z",
    },
    {
      id: "kyoto-2025",
      title: "秋色の京都へ",
      startDate: "2025-11-22",
      endDate: "2025-11-24",
      comment: "少し早起きして、朝の光のなかをふたりで歩いた三日間。",
      prefectureIds: [26],
      spots: [
        {
          id: "spot-arashiyama",
          name: "嵐山",
          prefectureId: 26,
          comment: "渡月橋から見た山の色。",
        },
      ],
      photos: [
        {
          id: "photo-kyoto-1",
          src: "/images/demo-kyoto.svg",
          caption: "秋の嵐山",
          takenAt: "2025-11-23",
        },
      ],
      createdAt: "2025-11-24T12:00:00.000Z",
    },
    {
      id: "kamakura-2025",
      title: "海まで歩いた鎌倉",
      startDate: "2025-05-03",
      endDate: "2025-05-03",
      comment: "寄り道を重ねながら、夕方の海まで。",
      prefectureIds: [14],
      spots: [
        {
          id: "spot-yuigahama",
          name: "由比ヶ浜",
          prefectureId: 14,
          comment: "夕暮れまで砂浜でのんびり。",
        },
      ],
      photos: [
        {
          id: "photo-kamakura-1",
          src: "/images/demo-kamakura.svg",
          caption: "海へ続く午後",
          takenAt: "2025-05-03",
        },
      ],
      createdAt: "2025-05-03T12:00:00.000Z",
    },
  ],
};
