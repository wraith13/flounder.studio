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
    export const isBoolean = (value: any): value is boolean => "boolean" === typeof value;
    export const isNumber = (value: any): value is number => "number" === typeof value;
    export const isString = (value: any): value is number => "string" === typeof value;
    export const isValueType = <V>(cv: V) => (value: any): value is V => cv === value;
    export const isOr = <TypeA, TypeB>(isA: ((value: unknown) => value is TypeA), isB: ((value: unknown) => value is TypeB)) =>
        (value: unknown): value is TypeA | TypeB => isA(value) || isB(value);
    export const isOptionalOr = <TypeA>(isA: ((value: unknown) => value is TypeA)) =>
        (data: any, key: string) => ( ! (key in data) || isA(data[key]));
    export interface ValidateResultEntry
    {
        key: string;
        requiredType: string;
        actualData: unknown;
    }
    export interface ValidateResult
    {
        isValid: boolean; // === (this.result.length <= 0)
        result: ValidateResultEntry[];
    }
    export const validateType =
        (requiredType: ValidateResultEntry["requiredType"], isA: ((data: any, key: string) => boolean)) =>
        (data: any, key: string): ValidateResultEntry | null =>
        {
            var result: ValidateResultEntry | null = null;
            if ( ! isA(data, key))
            {
                result =
                {
                    key,
                    requiredType,
                    actualData: data[key],
                };
            }
            return result;
        };
    export interface ValueTypeValidator
    {
        requiredType: ValidateResultEntry["requiredType"];
        isRequiredType: (data: any, key: string) => boolean;
    }
    export const isValueTypeValidator = (value: unknown): value is ValueTypeValidator =>
        null !== value && "object" === typeof value &&
        "requiredType" in value && "string" === typeof value.requiredType &&
        "isRequiredType" in value && "function" === typeof value.isRequiredType;
    export interface ArrayTypeValidator
    {
        requiredType: ValidateResultEntry["requiredType"];
        isRequiredItemType: (data: any, key: string) => boolean;
    }
    export const isArrayTypeValidator = (value: unknown): value is ArrayTypeValidator =>
        null !== value && "object" === typeof value &&
        "requiredType" in value && "string" === typeof value.requiredType &&
        "isRequiredItemType" in value && "function" === typeof value.isRequiredItemType;
    export interface ObjectTypeValidator
    {
        requiredType: ValidateResultEntry["requiredType"];
        isRequiredMemberType:
        {
            [member: string]: TypeValidator
        };
    };
    export const isObjectTypeValidator = (value: unknown): value is ObjectTypeValidator =>
        null !== value && "object" === typeof value &&
        "requiredType" in value && "string" === typeof value.requiredType &&
        "isRequiredMemberType" in value &&
            null !== value.isRequiredMemberType && "object" === typeof value.isRequiredMemberType &&
            Object.keys(value.isRequiredMemberType).filter(member => ! isTypeValidator((value.isRequiredMemberType as any)[member])).length <= 0;
    export interface OrTypeValidator
    {
        requiredType?: ValidateResultEntry["requiredType"];
        isRequiredOrTypes: TypeValidator[];
    };
    export interface AndTypeValidator
    {
        requiredType?: ValidateResultEntry["requiredType"];
        isRequiredAndTypes: TypeValidator[];
    };
    export type TypeValidator = ValueTypeValidator | ArrayTypeValidator | ObjectTypeValidator | OrTypeValidator | AndTypeValidator;
    export const isTypeValidator = (value: unknown): value is TypeValidator =>
        isValueTypeValidator(value) || isArrayTypeValidator(value) || isObjectTypeValidator(value);
    export const isRequiredMemberType = (isType: (value: unknown) => boolean) =>
        (data: any, key: string) => isType("" === (key ?? "") ? data: data[key]);
    export const isRequiredMemberContantValueType = <T>(cv: T) => isRequiredMemberType(value => value === cv);
    export const ContantValueTypeValidator = <T>(cv: T): ValueTypeValidator =>
    ({
        requiredType: JSON.stringify(cv),
        isRequiredType: isRequiredMemberContantValueType(cv),
    });
    export const OptionalValidator: ValueTypeValidator =
    {
        requiredType: "optional",
        isRequiredType: (data, key) => !(key in data),
    };
    export const BooleanValidator: ValueTypeValidator =
    {
        requiredType: "boolean",
        isRequiredType: (data, key) => isBoolean(data[key]),
    };
    export const NumberValidator: ValueTypeValidator =
    {
        requiredType: "number",
        isRequiredType: (data, key) => isNumber(data[key]),
    };
    export const StringValidator: ValueTypeValidator =
    {
        requiredType: "string",
        isRequiredType: (data, key) => isString(data[key]),
    };
    export const isRegularOrAlternative = (value: any): value is "regular" | "alternative" =>
        0 <= [ "regular", "alternative", ].indexOf(value);
    export const isAuto = (value: any): value is "auto" | "-auto" =>
        0 <= [ "auto", "-auto", ].indexOf(value);
    export const StyleEntryValidator: AndTypeValidator =
    {
        requiredType: "Type.StyleEntry",
        isRequiredAndTypes:
        [
            {
                requiredType: "FlounderStyle.ArgumentsBase",
                isRequiredMemberType:
                {
                    type:
                    {
                        requiredType: "FlounderStyle.FlounderType",
                        isRequiredOrTypes:
                        [
                            ContantValueTypeValidator("trispot"),
                            ContantValueTypeValidator("tetraspot"),
                            ContantValueTypeValidator("stripe"),
                            ContantValueTypeValidator("diline"),
                            ContantValueTypeValidator("triline"),
                        ],
                    },
                    layoutAngle:
                    {
                        requiredType: "FlounderStyle.layoutAngle?",
                        isRequiredOrTypes:
                        [
                            OptionalValidator,
                            ContantValueTypeValidator("regular"),
                            ContantValueTypeValidator("alternative"),
                            NumberValidator,
                        ],
                    },
                    offsetX:
                    {
                        requiredType: "FlounderStyle.offsetX?",
                        isRequiredOrTypes:
                        [
                            OptionalValidator,
                            NumberValidator,
                        ],
                    },
                    offsetY:
                    {
                        requiredType: "FlounderStyle.offsetY?",
                        isRequiredOrTypes:
                        [
                            OptionalValidator,
                            NumberValidator,
                        ],
                    },
                }
            },
            {
                isRequiredOrTypes:
                [
                    {
                        requiredType: "FlounderStyle.SpotArguments",
                        isRequiredMemberType:
                        {
                            type:
                            {
                                requiredType: "FlounderStyle.SpotArguments.type",
                                isRequiredOrTypes:
                                [
                                    ContantValueTypeValidator("trispot"),
                                    ContantValueTypeValidator("tetraspot"),
                                ],
                            },
                            layoutAngle:
                            {
                                requiredType: "FlounderStyle.SpotArguments.layoutAngle?",
                                isRequiredOrTypes:
                                [
                                    OptionalValidator,
                                    ContantValueTypeValidator("regular"),
                                    ContantValueTypeValidator("alternative"),
                                    ContantValueTypeValidator(0),
                                ],
                            },
                            anglePerDepth:
                            {
                                requiredType: "FlounderStyle.SpotArguments.anglePerDepth?",
                                isRequiredOrTypes:
                                [
                                    OptionalValidator,
                                    ContantValueTypeValidator(0),
                                ],
                            },
                        }
                    },
                    {
                        requiredType: "FlounderStyle.LineArguments",
                        isRequiredMemberType:
                        {
                            type:
                            {
                                requiredType: "FlounderStyle.LineArguments.type",
                                isRequiredOrTypes:
                                [
                                    ContantValueTypeValidator("stripe"),
                                    ContantValueTypeValidator("diline"),
                                    ContantValueTypeValidator("triline"),
                                ],
                            },
                        }
                    }
                ],
            },
        ],
    };
    export const numberValidator: ValueTypeValidator =
    {
        requiredType: "number",
        isRequiredType: (data: any, key: string) => isNumber(data[key]),
    };
    export const optionalValidator: ValueTypeValidator =
    {
        requiredType: "optional",
        isRequiredType: (data: any, key: string) => ! (key in data),
    };
    validateType("optional", (data: any, key: string) => ! (key in data));
    export const isValidStyleEntry = (data: any): data is Type.StyleEntry =>
    {
        if
        (
            null !== data && "object" === typeof data &&
            isOptionalOr(isNumber)(data, "offsetX") &&
            isOptionalOr(isNumber)(data, "offsetY") &&
            isString(data.foregroundColor) &&
            isOptionalOr(isString)(data, "backgroundColor") &&
            isOptionalOr(isNumber)(data, "intervalSize") &&
            isNumber(data.depth) &&
            isOptionalOr(isNumber)(data, "blur") &&
            isOptionalOr(isNumber)(data, "Pixel") &&
            isOptionalOr(isOr(isNumber, isAuto))(data, "reverseRate") &&
            isOptionalOr(isOr(isNumber, isAuto))(data, "anglePerDepth") &&
            isOptionalOr(isNumber)(data, "Count")
        )
        {
            if (0 <= [ "trispot", "tetraspot", ].indexOf(data.type))
            {
                if
                (
                    isOptionalOr(isOr(isRegularOrAlternative, isValueType(0 as const)))(data, "LayoutAngle") &&
                    isOptionalOr(isValueType(0 as const))(data, "anglePerDepth")
                )
                {
                    data.layoutAngle
                    return true;
                }
            }
            else
            if (0 <= [ "stripe", "diline", "triline", ].indexOf(data.type))
            {
                if (isOptionalOr(isOr(isRegularOrAlternative, isNumber))(data, "LayoutAngle"))
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
