import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";

export const APP_NAME = "Emilus";
export const API_BASE_URL = process.env.REACT_APP_BASE_URL;
export const APP_PREFIX_PATH = "/app";
export const AUTH_PREFIX_PATH = "/auth";

export const LANGUAGES = ["en", "uz", "ru"];

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: "en",
  navType: NAV_TYPE_SIDE,
  topNavColor: "#3e82f7",
  headerNavColor: "#ffffff",
  mobileNav: false,
};
