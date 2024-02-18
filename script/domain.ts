// import { minamo } from "minamo.js";
import { Type } from "@script/type";
import { Base } from "@script/base";
import { FlounderStudio } from "@script/index";
import config from "@resource/config.json";
export module Domain
{
    export const makePageParams = (application: Type.ApplicationType, item: Type.PageItemType): Type.PageParams =>
    ({
        application,
        item
    });
    export const makeUrl =
    (
        args: Type.PageParams,
        href: string = location.href
    ) => Base.makeUrlRaw
    (
        {
            hash: args.application ?
                (
                    args.item ?
                        `${args.application}/${encodeURIComponent(JSON.stringify(args.item))}`:
                        args.application
                ):
                "",
        },
        href
    );
    export const getTitle = (data: Type.PageParams) =>
    (
        data.application ? Type.applicationList[data.application]?.title:
        null
    ) ?? config.applicationTitle;
    export const showUrl = async (data: Type.PageParams) =>
    {
        const url = Domain.makeUrl(data);
        if (await FlounderStudio.showPage(url))
        {
            history.pushState(null, getTitle(data), url);
        }
    };
    export const parseOrNull = (json: string) =>
    {
        if (null !== json && undefined !== json)
        {
            try
            {
                return JSON.parse(json);
            }
            catch(error)
            {
                console.error(error);
            }
        }
        return null;
    };
    export const validDataOrNull = <T>(validator: (data: any) => data is T, data: any) =>
        validator(data) ? data: null;
    export const isValidStyleEntry = (data: any): data is Type.StyleEntry =>
    {
        if (null !== data && undefined !== data && "object" === typeof data)
        {
            if (0 <= [ "trispot", "tetraspot", ].indexOf(data.type))
            {
                if
                (
                    0 <= [ "regular", "alternative", 0].indexOf(data.LayoutAngle) &&
                    0 === (data.anglePerDepth ?? 0)
                )
                {
                    return true;
                }
            }
            else
            if (0 <= [ "stripe", "diline", "triline", ].indexOf(data.type))
            {
                if
                (
                    (0 <= [ "regular", "alternative", ].indexOf(data.LayoutAngle) || "number" === typeof data.LayoutAngle) &&
                    "number" === (typeof data.anglePerDepth ?? 0)
                )
                {
                    return true;
                }
            }
        }
        return false;
    };
    export const parseStyleEntry = (json: string): Type.StyleEntry | null =>
        validDataOrNull(isValidStyleEntry, parseOrNull(json));
}
