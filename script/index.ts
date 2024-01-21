import { minamo } from "@nephila/minamo.js";
import { flounderStyle } from "flounder.style.js";
import { Tektite } from "@nephila/tektite.js/script/tektite-index";
import { TektiteDate } from "@nephila/tektite.js/script/tektite-date";
import { ViewModel } from "@nephila/tektite.js/script/tektite-view-model.js";
import { ViewRenderer } from "@nephila/tektite.js/script/tektite-view-renderer";

export module flounderStudio
{
    export const $make = minamo.dom.make;
    export const $tag = minamo.dom.tag;
    export const $div = $tag("div");
    export const $span = $tag("span");
    export const valueToString = (value: unknown) =>
        undefined === value ? "undefined": JSON.stringify(value);
    export const makeTitle = (data: flounderStyle.Arguments) =>
    {
        const result = $make(HTMLDivElement)($div("sample title")(`type:${valueToString(data.type)}, layoutAngle:${valueToString(data.layoutAngle)}, maxSpotSize:${valueToString(data.maxPatternSize)}, reverseRate:${valueToString(data.reverseRate)}`));
        // setInterval
        // (
        //     () => flounderStyle.setStyleList(result, flounderStyle.makePatternStyleList(makeArguments(data, Math.abs((((new Date().getTime() /(10000 /200)) %200) /100) -1.0)))),
        //     100
        // );
        return result;
    }
    export const makeArguments = (data: flounderStyle.Arguments, depth: number): flounderStyle.Arguments =>
    {
        const result = structuredClone(data);
        result.depth = depth;
        return result;
    };
    export const makeSample = (data: flounderStyle.Arguments) => flounderStyle.setStyle
    (
        $make(HTMLDivElement)
        (
            $div("sample")(`depth:${(data.depth).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2, })}`)
        ),
        flounderStyle.makeStyle(data)
    );
    export const start = () =>
    {
        var list: flounderStyle.Arguments[] =
        [
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "regular", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "regular", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "regular", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "regular", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "regular", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "regular", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: undefined, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "regular", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "trispot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "regular", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },
            <flounderStyle.Arguments>{ type: "tetraspot", layoutAngle: "alternative", foregroundColor: "#AAFFDD", backgroundColor: "white", reverseRate:"auto", depth: 0, maxSpotSize: 4, spotIntervalSize: 24, },

        ];
        const resolution = 20;
        minamo.dom.replaceChildren
        (
            document.getElementById("screen-body") as HTMLDivElement,
            list.map
            (
                data =>
                [
                    makeTitle(data),
                    Array.from({ length: resolution +1, })
                        .map((_, ix) => makeSample(makeArguments(data, ix *(1.0 /resolution)))),
                ]
            )
            
        );
    }
}
