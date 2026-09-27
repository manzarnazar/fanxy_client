/**
 * Central image manifest — every static asset used in the UI must be declared
 * here first, then imported from this file. Never hardcode `/images/...`
 * paths inside components. All paths are prefixed with NEXT_PUBLIC_BASE_PATH
 * so the app keeps working when deployed under a sub-path.
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const images = {
    logoMark: `${BASE_PATH}/images/logo-mark.png`,
    appIcon: `${BASE_PATH}/images/appIcon.png`,
    appIconP: `${BASE_PATH}/images/appIconP.png`,
    nodata: `${BASE_PATH}/images/nodata.png`,
};
