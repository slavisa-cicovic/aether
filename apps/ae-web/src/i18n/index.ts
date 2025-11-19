import en from "@/messages/en.json";

export type Messages = typeof en;

export async function getMessages(locale: string = "en"): Promise<Messages> {
  switch (locale) {
    case "en":
    default:
      return en;
  }
}
