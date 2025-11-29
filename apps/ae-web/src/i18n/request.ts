import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  getMessages,
  localeCookieName,
  locales,
  pickLocale
} from "./index";

export default async function getRequestConfig() {
  const cookieStore = await cookies();
  const headerList = await headers();

  const locale = pickLocale({
    cookieLocale: cookieStore.get(localeCookieName)?.value,
    acceptLanguage: headerList.get("accept-language")
  });

  return {
    locales,
    defaultLocale,
    locale,
    messages: await getMessages(locale)
  };
}
