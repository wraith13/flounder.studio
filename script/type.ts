import { Tektite } from "tektite.js/script/tektite-index";
import { flounderStyle } from "flounder.style.js";
import resource from "@resource/images.json";
import tektiteResource from "tektite.js/images.json";
import { minamo } from "minamo.js";
import localeEn from "@resource/lang.en.json";
import localeJa from "@resource/lang.ja.json";
import { FlounderStudio } from "@script/index";
export module Type
{
    export const applicationList =
    {
        "Style": <Type.ApplicationEntry>
        {
            icon: "tektite-tick-icon",
            title: "Style",
        },
        "SVG": <Type.ApplicationEntry>
        {
            icon: "tektite-history-icon",
            title: "SVG",
        },
    };
    export type ApplicationType = keyof typeof applicationList;
    export const applicationIdList = Object.freeze(minamo.core.objectKeys(applicationList));
    export type PageItemType = flounderStyle.Arguments & minamo.core.JsonableObject;

    export interface ApplicationEntry//<ItemType>
    {
        icon: keyof typeof resource | keyof typeof tektiteResource;
        title: string;
        // show: (item: ItemType) => Promise<unknown>;
        // parseItem: (json: string) => ItemType;
    }
    export interface PageParams extends minamo.core.JsonableObject
    {
        application?: Type.ApplicationType;
        item?: Type.PageItemType;
        // hash?: string;
    }
    // export type TektiteParams = Tektite.ParamTypes<PageParams, Resource.KeyType, typeof localeEn | typeof localeJa, typeof FlounderStudio.localeMaster>;
    export type TektiteParams = Tektite.ParamTypes<PageParams, string, typeof localeEn | typeof localeJa, typeof FlounderStudio.localeMaster>;
}
