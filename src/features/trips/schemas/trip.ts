import { z } from "zod";

export const demoTripSchema = z
  .object({
    title: z.string().trim().min(1, "旅行名を入力してください。").max(120),
    startDate: z.string().date("開始日を入力してください。"),
    endDate: z.string().date("終了日を入力してください。"),
    comment: z.string().max(2000),
    prefectureIds: z
      .array(z.number().int().min(1).max(47))
      .min(1, "都道府県を1つ以上選んでください。"),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "終了日は開始日以降にしてください。",
    path: ["endDate"],
  });
