import { minamo } from "minamo.js";
import { FlounderStyle } from "flounder.style.js";
import { Tektite } from "tektite.js/script/tektite-index";
import { TektiteDate } from "tektite.js/script/tektite-date";
import { ViewModel } from "tektite.js/script/tektite-view-model.js";
import { ViewRenderer } from "tektite.js/script/tektite-view-renderer";
import { Type } from "./type";
// import { Render } from "./render";
// import { Storage } from "./storage";
import { Domain } from "./domain";
import localeEn from "@resource/lang.en.json";
import localeJa from "@resource/lang.ja.json";
import config from "@resource/config.json";

export module FlounderStudio
{
    export const localeMaster =
    {
        en: localeEn,
        ja: localeJa,
    };
    export type LocaleKeyType =
        keyof typeof localeEn &
        keyof typeof localeJa;
    export type LocaleType = keyof typeof localeMaster;
    export const localeMap = (key: LocaleKeyType) => tektite.locale.map(key);
    export const showPage = async (url: string = location.href) =>
    {
        tektite.screen.getScreenCover()?.click();
        window.scrollTo(0,0);
        document.getElementById("tektite-screen-body")?.scrollTo(0,0);
        // const urlParams = getUrlParams(url);
        const hash = Base.getUrlHash(url).split("/");
        const applicationType = hash[0] as Type.ApplicationType;
        const itemJson = hash[1];
        const application =
        {
            "Style":
            {
                _show: async (item: Type.StyleEntry) => await RainbowClockRender.showRainbowClockScreen(item),
                show: async (params: Type.PageParams) => await showRainbowClockScreen(params),
                parseItem: (json: string) => Domain.parseTimezone(json),
            },
            "SVG":
            {
                _show: async (item: Type.SvgEntry) => await CountdownTimerRender.showCountdownTimerScreen(item),
                show: async (params: Type.PageParams) => await showWelcomeScreen(params),
                parseItem: (json: string) => Domain.parseAlarm(json),
            },
        }[applicationType] ??
        {
            show: async (params: Type.PageParams) => await showWelcomeScreen(params),
            parseItem: () => null,
        };
        const item = application.parseItem(itemJson);
        if (Render.regulateLocation(applicationType, itemJson, item))
        {
            await application.show({application: applicationType, item: item as any, });
        }
        else
        {
            return false;
        }
        return true;
    };
    export const start = async (params:{ buildTimestampTick:number, }) =>
    {
        console.log(`start timestamp: ${tektite.date.format("YYYY-MM-DD HH:MM:SS.mmm", new Date())}`);
        console.log(`buildTimestamp: ${tektite.date.format("YYYY-MM-DD HH:MM:SS.mmm", params.buildTimestampTick)} ( ${tektite.date.format("formal-time", params.buildTimestampTick, "elapsed")} 前 )`);
        console.log(`${JSON.stringify(params)}`);
        tektite.locale.setLocale(Storage.Settings.get().locale ?? null);
        // tektite.onLoad();
        window.onpopstate = () => showPage(location.href);
        window.matchMedia("(prefers-color-scheme: dark)").addListener(Render.updateStyle);
        TektiteWIP.initialize();
        TektiteWIP.setRootData
        ({
            title: config.applicationTitle,
            theme: Storage.Settings.get().theme ?? "auto",
            progressBarStyle: Storage.Settings.get().progressBarStyle ?? "auto",
            windowColor: Color.getSolidRainbowColor(0),
        });
        const urlParams = Base.getUrlParams(location.href);
        const reload = urlParams["reload"];
        if (reload)
        {
            const json = JSON.parse(reload);
            const url = json["url"];
            if (url)
            {
                history.replaceState(null, config.applicationTitle, url);
            }
            const fullscreen = json["fullscreen"];
            if (fullscreen && tektite.fullscreen.enabled())
            {
                const toast = tektite.screen.toast.make
                ({
                    forwardOperator:
                    {
                        tag: "button",
                        className: "tektite-text-button",
                        children: Tektite.$span("")(tektite.locale.map("Full screen")),
                        onclick: async () =>
                        {
                            toast.hide();
                            await tektite.fullscreen.request();
                        },
                    },
                    content: Tektite.$span("")(tektite.locale.map("Full screen has been canceled due to reloading.")),
                });
            }
        }
        const renders: { [type: string ]: ViewRenderer.Entry<any>} =
        {
            "welcome-board":
            {
                make: Tektite.$div("logo")
                ([
                    Tektite.$div("application-icon icon")(await Resource.loadIconOrCache("application-icon")),
                    Tektite.$span("logo-text")(config.applicationTitle)
                ]),
            },
            "welcome-operators":
            {
                make: Tektite.$div("tektite-vertical-button-list")
                (
                    Type.applicationIdList.map
                    (
                        (i: Type.ApplicationType) =>
                        tektite.internalLink
                        ({
                            className: "tektite-link-button",
                            href: { application: i },
                            children:
                            {
                                tag: "button",
                                className: "tektite-default-button tektite-main-button tektite-long-button",
                                children: Tektite.$labelSpan(Type.applicationList[i].title),
                                // onclick: async () => await showNeverStopwatchScreen(),
                            }
                        }),
                    )
                ),
            },
            "welcome-footer":
            {
                make: Tektite.$div("description")
                (
                    Tektite.$tag("ul")("tektite-locale-parallel-off")
                    ([
                        Tektite.$tag("li")("")(Render.label("You can use this web app like an app by registering it on the home screen of your smartphone.")),
                    ])
                ),
            },
        };
        minamo.core.objectKeys(renders).forEach
        (
            key => (tektite.viewRenderer.renderer as any)[key] = renders[key]
        );
        const commands: { [type: string ]: ViewCommand.Command<any, any> } =
        {
            "get-screen-menu": <ViewCommand.Command<any, GetScreenMenuCommand>>
            (
                async (_tektite, _entry) =>
                ({
                    fullscreen: tektite.fullscreen.enabled() ?
                        <ViewModel.MenuItemButtonEntry>
                        {
                            type: "tektite-menu-item-button",
                            data: { onclick: "tektite-toggle-fullscreen", },
                            child: tektite.viewModel.makeLabelSpan
                            ({
                                text: null === tektite.fullscreen.getElement() ? "Full screen": "Cancel full screen",
                            }),
                        }:
                        "tektite-null",
                    theme: <ViewModel.MenuItemButtonEntry>
                    {
                        type: "tektite-menu-item-button",
                        child: tektite.viewModel.makeLabelSpan
                        ({
                            text: "Theme setting",
                        }),
                    },
                    progressBarStyle: <ViewModel.MenuItemButtonEntry>
                    {
                        type: "tektite-menu-item-button",
                        child: tektite.viewModel.makeLabelSpan
                        ({
                            text: "Progress Bar Style setting",
                        }),
                    },
                    language: <ViewModel.MenuItemButtonEntry>
                    {
                        type: "tektite-menu-item-button",
                        child: tektite.viewModel.makeLabelSpan
                        ({
                            text: "Language setting",
                        }),
                    },
                    github: <ViewModel.MenuItemLinkButtonEntry<Type.TektiteParams>>
                    {
                        type: "tektite-menu-item-link-button",
                        data:
                        {
                            href: config.repositoryUrl,
                        },
                        child: <ViewModel.SpanEntry>
                        {
                            type: "tektite-span",
                            data:
                            {
                                className: "tektite-label",
                                text: "GitHub",
                            }
                        },
                    },
                })
            ),
        };
        minamo.core.objectKeys(commands).forEach
        (
            key => (tektite.viewCommand.commands as any)[key] = commands[key]
        );
        await showPage();
        if (reload || "reload" === (<any>performance.getEntriesByType("navigation"))?.[0]?.type)
        {
            tektite.makeToast
            ({
                content: `ビルドタイムスタンプ: ${tektite.date.format("YYYY-MM-DD HH:MM", params.buildTimestampTick)} ( ${tektite.date.format("formal-time", params.buildTimestampTick, "elapsed")} 前 )`,
                isWideContent: true,
            });
            await tektite.viewRenderer.renderRoot();
        }
        document.getElementById("tektite-screen-body")?.addEventListener
        (
            "scroll",
            () => tektite.viewRenderer.update("scroll"),
        );
    };
}
export const tektite = Tektite.make<Type.TektiteParams>
({
    makeUrl: Domain.makeUrl,
    showUrl: Domain.showUrl,
    showPage: FlounderStudio.showPage,
    loadIconOrCache: Resource.loadIconOrCache,
    localeMaster: FlounderStudio.localeMaster,
    timer:
    {
        resolution: 360,
        highResolution: 36,
    },
});
