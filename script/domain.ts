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
    export const isUndefined = (value: any): value is undefined => undefined === value;
    export const isNumber = (value: any): value is number => "number" === typeof value;
    export const isString = (value: any): value is number => "string" === typeof value;
    export const isOr = <TypeA, TypeB>(isA: ((value: unknown) => value is TypeA), isB: ((value: unknown) => value is TypeB)) =>
        (value: unknown): value is TypeA | TypeB => isA(value) || isB(value);
    export const isUndefinedOrNumber = isOr(isUndefined, isNumber);
    export const isUndefinedOrString = isOr(isUndefined, isString);
    export const isAuto = (value: any): value is "auto" | "-auto" =>
        0 <= [ "auto", "-auto", ].indexOf(value);
    export const isValidStyleEntry = (data: any): data is Type.StyleEntry =>
    {
        if
        (
            null !== data && "object" === typeof data &&
            isUndefinedOrNumber(data.offsetX) &&
            isUndefinedOrNumber(data.offsetY) &&
            isString(data.foregroundColor) &&
            isUndefinedOrString(data.backgroundColor) &&
            isUndefinedOrNumber(data.intervalSize) &&
            isNumber(data.depth) &&
            isUndefinedOrNumber(data.blur) &&
            isUndefinedOrNumber(data.Pixel) &&
            isOr(isUndefinedOrNumber, isAuto)(data.reverseRate) &&
            isOr(isUndefinedOrNumber, isAuto)(data.anglePerDepth) &&
            isUndefinedOrNumber(data.Count)
        )
        {
            if (0 <= [ "trispot", "tetraspot", ].indexOf(data.type))
            {
                if
                (
                    0 <= [ "regular", "alternative", 0, ].indexOf(data.LayoutAngle) &&
                    0 <= [ undefined, 0, ].indexOf(data.anglePerDepth)
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
                    (0 <= [ "regular", "alternative", ].indexOf(data.LayoutAngle) || isNumber(data.LayoutAngle)) &&
                    isOr(isUndefined, isNumber)(data.anglePerDepth)
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
