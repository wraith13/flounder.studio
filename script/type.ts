import { Tektite } from "tektite.js/script/tektite-index";
import { minamo } from "minamo.js";
import localeEn from "@resource/lang.en.json";
import localeJa from "@resource/lang.ja.json";
import { FlounderStudio } from "@script/index";
export module Type
{
    export interface PageParams extends minamo.core.JsonableObject
    {
        // hash?: string;
    }
    // export type TektiteParams = Tektite.ParamTypes<PageParams, Resource.KeyType, typeof localeEn | typeof localeJa, typeof FlounderStudio.localeMaster>;
    export type TektiteParams = Tektite.ParamTypes<PageParams, string, typeof localeEn | typeof localeJa, typeof FlounderStudio.localeMaster>;
}
