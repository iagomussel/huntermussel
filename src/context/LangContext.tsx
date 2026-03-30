import { createContext, useContext } from "react";

export type Lang = "en" | "pt";

const LangContext = createContext<Lang>("en");

export const LangProvider = ({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) => <LangContext.Provider value={lang}>{children}</LangContext.Provider>;

export const useLang = () => useContext(LangContext);
