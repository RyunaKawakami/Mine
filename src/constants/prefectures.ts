export const prefectureRegions = [
  "HOKKAIDO",
  "TOHOKU",
  "KANTO",
  "CHUBU",
  "KANSAI",
  "CHUGOKU",
  "SHIKOKU",
  "KYUSHU",
] as const;

export type PrefectureRegion = (typeof prefectureRegions)[number];

export type PrefectureSeed = {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  region: PrefectureRegion;
};

export const prefectures = [
  { id: 1, code: "01", name: "北海道", nameEn: "Hokkaido", region: "HOKKAIDO" },
  { id: 2, code: "02", name: "青森県", nameEn: "Aomori", region: "TOHOKU" },
  { id: 3, code: "03", name: "岩手県", nameEn: "Iwate", region: "TOHOKU" },
  { id: 4, code: "04", name: "宮城県", nameEn: "Miyagi", region: "TOHOKU" },
  { id: 5, code: "05", name: "秋田県", nameEn: "Akita", region: "TOHOKU" },
  { id: 6, code: "06", name: "山形県", nameEn: "Yamagata", region: "TOHOKU" },
  { id: 7, code: "07", name: "福島県", nameEn: "Fukushima", region: "TOHOKU" },
  { id: 8, code: "08", name: "茨城県", nameEn: "Ibaraki", region: "KANTO" },
  { id: 9, code: "09", name: "栃木県", nameEn: "Tochigi", region: "KANTO" },
  { id: 10, code: "10", name: "群馬県", nameEn: "Gunma", region: "KANTO" },
  { id: 11, code: "11", name: "埼玉県", nameEn: "Saitama", region: "KANTO" },
  { id: 12, code: "12", name: "千葉県", nameEn: "Chiba", region: "KANTO" },
  { id: 13, code: "13", name: "東京都", nameEn: "Tokyo", region: "KANTO" },
  { id: 14, code: "14", name: "神奈川県", nameEn: "Kanagawa", region: "KANTO" },
  { id: 15, code: "15", name: "新潟県", nameEn: "Niigata", region: "CHUBU" },
  { id: 16, code: "16", name: "富山県", nameEn: "Toyama", region: "CHUBU" },
  { id: 17, code: "17", name: "石川県", nameEn: "Ishikawa", region: "CHUBU" },
  { id: 18, code: "18", name: "福井県", nameEn: "Fukui", region: "CHUBU" },
  { id: 19, code: "19", name: "山梨県", nameEn: "Yamanashi", region: "CHUBU" },
  { id: 20, code: "20", name: "長野県", nameEn: "Nagano", region: "CHUBU" },
  { id: 21, code: "21", name: "岐阜県", nameEn: "Gifu", region: "CHUBU" },
  { id: 22, code: "22", name: "静岡県", nameEn: "Shizuoka", region: "CHUBU" },
  { id: 23, code: "23", name: "愛知県", nameEn: "Aichi", region: "CHUBU" },
  { id: 24, code: "24", name: "三重県", nameEn: "Mie", region: "KANSAI" },
  { id: 25, code: "25", name: "滋賀県", nameEn: "Shiga", region: "KANSAI" },
  { id: 26, code: "26", name: "京都府", nameEn: "Kyoto", region: "KANSAI" },
  { id: 27, code: "27", name: "大阪府", nameEn: "Osaka", region: "KANSAI" },
  { id: 28, code: "28", name: "兵庫県", nameEn: "Hyogo", region: "KANSAI" },
  { id: 29, code: "29", name: "奈良県", nameEn: "Nara", region: "KANSAI" },
  {
    id: 30,
    code: "30",
    name: "和歌山県",
    nameEn: "Wakayama",
    region: "KANSAI",
  },
  { id: 31, code: "31", name: "鳥取県", nameEn: "Tottori", region: "CHUGOKU" },
  { id: 32, code: "32", name: "島根県", nameEn: "Shimane", region: "CHUGOKU" },
  { id: 33, code: "33", name: "岡山県", nameEn: "Okayama", region: "CHUGOKU" },
  {
    id: 34,
    code: "34",
    name: "広島県",
    nameEn: "Hiroshima",
    region: "CHUGOKU",
  },
  {
    id: 35,
    code: "35",
    name: "山口県",
    nameEn: "Yamaguchi",
    region: "CHUGOKU",
  },
  {
    id: 36,
    code: "36",
    name: "徳島県",
    nameEn: "Tokushima",
    region: "SHIKOKU",
  },
  { id: 37, code: "37", name: "香川県", nameEn: "Kagawa", region: "SHIKOKU" },
  { id: 38, code: "38", name: "愛媛県", nameEn: "Ehime", region: "SHIKOKU" },
  { id: 39, code: "39", name: "高知県", nameEn: "Kochi", region: "SHIKOKU" },
  { id: 40, code: "40", name: "福岡県", nameEn: "Fukuoka", region: "KYUSHU" },
  { id: 41, code: "41", name: "佐賀県", nameEn: "Saga", region: "KYUSHU" },
  { id: 42, code: "42", name: "長崎県", nameEn: "Nagasaki", region: "KYUSHU" },
  { id: 43, code: "43", name: "熊本県", nameEn: "Kumamoto", region: "KYUSHU" },
  { id: 44, code: "44", name: "大分県", nameEn: "Oita", region: "KYUSHU" },
  { id: 45, code: "45", name: "宮崎県", nameEn: "Miyazaki", region: "KYUSHU" },
  {
    id: 46,
    code: "46",
    name: "鹿児島県",
    nameEn: "Kagoshima",
    region: "KYUSHU",
  },
  { id: 47, code: "47", name: "沖縄県", nameEn: "Okinawa", region: "KYUSHU" },
] as const satisfies readonly PrefectureSeed[];
