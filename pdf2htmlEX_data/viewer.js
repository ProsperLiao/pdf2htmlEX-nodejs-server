/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2020 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */

 /**
 * Credit to FireFox's viewer.js
 *
 */

 function getPDFFileNameFromURL(url, defaultFilename = "document.pdf") {
     if (typeof url !== "string") {
         return defaultFilename;
     }

     if (isDataSchema(url)) {
         console.warn("getPDFFileNameFromURL: " + 'ignoring "data:" URL for performance reasons.');
         return defaultFilename;
     }

     const reURI = /^(?:(?:[^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
     const reFilename = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
     const splitURI = reURI.exec(url);
     let suggestedFilename = reFilename.exec(splitURI[1]) || reFilename.exec(splitURI[2]) || reFilename.exec(splitURI[3]);

     if (suggestedFilename) {
         suggestedFilename = suggestedFilename[0];

         if (suggestedFilename.includes("%")) {
             try {
                 suggestedFilename = reFilename.exec(decodeURIComponent(suggestedFilename))[0];
             } catch (ex) {}
         }
     }

     return suggestedFilename || defaultFilename;
 }

/******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId]) {
            /******/ 			return installedModules[moduleId].exports;
            /******/ 		}
        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			i: moduleId,
            /******/ 			l: false,
            /******/ 			exports: {}
            /******/ 		};
        /******/
        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/ 		module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
        /******/ 		if(!__webpack_require__.o(exports, name)) {
            /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
            /******/ 		}
        /******/ 	};
    /******/
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require__.r = function(exports) {
        /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            /******/ 		}
        /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
        /******/ 	};
    /******/
    /******/ 	// create a fake namespace object
    /******/ 	// mode & 1: value is a module id, require it
    /******/ 	// mode & 2: merge all properties of value into the ns
    /******/ 	// mode & 4: return value when already ns object
    /******/ 	// mode & 8|1: behave like require
    /******/ 	__webpack_require__.t = function(value, mode) {
        /******/ 		if(mode & 1) value = __webpack_require__(value);
        /******/ 		if(mode & 8) return value;
        /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        /******/ 		var ns = Object.create(null);
        /******/ 		__webpack_require__.r(ns);
        /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
        /******/ 		return ns;
        /******/ 	};
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
        /******/ 		var getter = module && module.__esModule ?
            /******/ 			function getDefault() { return module['default']; } :
            /******/ 			function getModuleExports() { return module; };
        /******/ 		__webpack_require__.d(getter, 'a', getter);
        /******/ 		return getter;
        /******/ 	};
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = 0);
    /******/ })
    /************************************************************************/
    /******/ ([
        /* 0 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            ;
            let pdfjsWebApp, pdfjsWebAppOptions;
            {
                pdfjsWebApp = __webpack_require__(1);
                pdfjsWebAppOptions = __webpack_require__(3);
            }
            {
                __webpack_require__(33);

                __webpack_require__(36);
            }
            ;
            ;
            ;

            function getViewerConfiguration() {
                return {
                    appContainer: document.body,
                    mainContainer: document.getElementById("viewerContainer"),
                    viewerContainer: document.getElementById("viewer"),
                    eventBus: null,
                    toolbar: {
                        container: document.getElementById("toolbarViewer"),
                        numPages: document.getElementById("numPages"),
                        pageNumber: document.getElementById("pageNumber"),
                        scaleSelectContainer: document.getElementById("scaleSelectContainer"),
                        scaleSelect: document.getElementById("scaleSelect"),
                        customScaleOption: document.getElementById("customScaleOption"),
                        previous: document.getElementById("previous"),
                        next: document.getElementById("next"),
                        zoomIn: document.getElementById("zoomIn"),
                        zoomOut: document.getElementById("zoomOut"),
                        viewFind: document.getElementById("viewFind"),
                        openFile: document.getElementById("openFile"),
                        print: document.getElementById("print"),
                        presentationModeButton: document.getElementById("presentationMode"),
                        download: document.getElementById("download"),
                        viewBookmark: document.getElementById("viewBookmark")
                    },
                    secondaryToolbar: {
                        toolbar: document.getElementById("secondaryToolbar"),
                        toggleButton: document.getElementById("secondaryToolbarToggle"),
                        toolbarButtonContainer: document.getElementById("secondaryToolbarButtonContainer"),
                        presentationModeButton: document.getElementById("secondaryPresentationMode"),
                        openFileButton: document.getElementById("secondaryOpenFile"),
                        printButton: document.getElementById("secondaryPrint"),
                        downloadButton: document.getElementById("secondaryDownload"),
                        viewBookmarkButton: document.getElementById("secondaryViewBookmark"),
                        firstPageButton: document.getElementById("firstPage"),
                        lastPageButton: document.getElementById("lastPage"),
                        pageRotateCwButton: document.getElementById("pageRotateCw"),
                        pageRotateCcwButton: document.getElementById("pageRotateCcw"),
                        cursorSelectToolButton: document.getElementById("cursorSelectTool"),
                        cursorHandToolButton: document.getElementById("cursorHandTool"),
                        scrollVerticalButton: document.getElementById("scrollVertical"),
                        scrollHorizontalButton: document.getElementById("scrollHorizontal"),
                        scrollWrappedButton: document.getElementById("scrollWrapped"),
                        spreadNoneButton: document.getElementById("spreadNone"),
                        spreadOddButton: document.getElementById("spreadOdd"),
                        spreadEvenButton: document.getElementById("spreadEven"),
                        documentPropertiesButton: document.getElementById("documentProperties")
                    },
                    fullscreen: {
                        contextFirstPage: document.getElementById("contextFirstPage"),
                        contextLastPage: document.getElementById("contextLastPage"),
                        contextPageRotateCw: document.getElementById("contextPageRotateCw"),
                        contextPageRotateCcw: document.getElementById("contextPageRotateCcw")
                    },
                    sidebar: {
                        outerContainer: document.getElementById("outerContainer"),
                        viewerContainer: document.getElementById("viewerContainer"),
                        toggleButton: document.getElementById("sidebarToggle"),
                        thumbnailButton: document.getElementById("viewThumbnail"),
                        outlineButton: document.getElementById("viewOutline"),
                        attachmentsButton: document.getElementById("viewAttachments"),
                        thumbnailView: document.getElementById("thumbnailView"),
                        outlineView: document.getElementById("outlineView"),
                        attachmentsView: document.getElementById("attachmentsView")
                    },
                    sidebarResizer: {
                        outerContainer: document.getElementById("outerContainer"),
                        resizer: document.getElementById("sidebarResizer")
                    },
                    findBar: {
                        bar: document.getElementById("findbar"),
                        toggleButton: document.getElementById("viewFind"),
                        findField: document.getElementById("findInput"),
                        highlightAllCheckbox: document.getElementById("findHighlightAll"),
                        caseSensitiveCheckbox: document.getElementById("findMatchCase"),
                        entireWordCheckbox: document.getElementById("findEntireWord"),
                        findMsg: document.getElementById("findMsg"),
                        findResultsCount: document.getElementById("findResultsCount"),
                        findPreviousButton: document.getElementById("findPrevious"),
                        findNextButton: document.getElementById("findNext")
                    },
                    passwordOverlay: {
                        overlayName: "passwordOverlay",
                        container: document.getElementById("passwordOverlay"),
                        label: document.getElementById("passwordText"),
                        input: document.getElementById("password"),
                        submitButton: document.getElementById("passwordSubmit"),
                        cancelButton: document.getElementById("passwordCancel")
                    },
                    documentProperties: {
                        overlayName: "documentPropertiesOverlay",
                        container: document.getElementById("documentPropertiesOverlay"),
                        closeButton: document.getElementById("documentPropertiesClose"),
                        fields: {
                            fileName: document.getElementById("fileNameField"),
                            fileSize: document.getElementById("fileSizeField"),
                            title: document.getElementById("titleField"),
                            author: document.getElementById("authorField"),
                            subject: document.getElementById("subjectField"),
                            keywords: document.getElementById("keywordsField"),
                            creationDate: document.getElementById("creationDateField"),
                            modificationDate: document.getElementById("modificationDateField"),
                            creator: document.getElementById("creatorField"),
                            producer: document.getElementById("producerField"),
                            version: document.getElementById("versionField"),
                            pageCount: document.getElementById("pageCountField"),
                            pageSize: document.getElementById("pageSizeField"),
                            linearized: document.getElementById("linearizedField")
                        }
                    },
                    errorWrapper: {
                        container: document.getElementById("errorWrapper"),
                        errorMessage: document.getElementById("errorMessage"),
                        closeButton: document.getElementById("errorClose"),
                        errorMoreInfo: document.getElementById("errorMoreInfo"),
                        moreInfoButton: document.getElementById("errorShowMore"),
                        lessInfoButton: document.getElementById("errorShowLess")
                    },
                    printContainer: document.getElementById("printContainer"),
                    openFileInputName: "fileInput",
                    debuggerScriptPath: "./debugger.js"
                };
            }

            function webViewerLoad() {
                const config = getViewerConfiguration();
                window.PDFViewerApplication = pdfjsWebApp.PDFViewerApplication;
                window.PDFViewerApplicationOptions = pdfjsWebAppOptions.AppOptions;
                pdfjsWebApp.PDFViewerApplication.run(config);
            }

            if (document.readyState === "interactive" || document.readyState === "complete") {
                webViewerLoad();
            } else {
                document.addEventListener("DOMContentLoaded", webViewerLoad, true);
            }

            /***/ }),
        /* 1 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.PDFPrintServiceFactory = exports.DefaultExternalServices = exports.PDFViewerApplication = void 0;

            var _ui_utils = __webpack_require__(2);

            var _app_options = __webpack_require__(3);

            var _pdfjsLib = __webpack_require__(4);

            var _pdf_cursor_tools = __webpack_require__(6);

            var _pdf_rendering_queue = __webpack_require__(8);

            var _pdf_sidebar = __webpack_require__(9);

            var _overlay_manager = __webpack_require__(10);

            var _password_prompt = __webpack_require__(11);

            var _pdf_attachment_viewer = __webpack_require__(12);

            var _pdf_document_properties = __webpack_require__(13);

            var _pdf_find_bar = __webpack_require__(14);

            var _pdf_find_controller = __webpack_require__(15);

            var _pdf_history = __webpack_require__(17);

            var _pdf_link_service = __webpack_require__(18);

            var _pdf_outline_viewer = __webpack_require__(19);

            var _pdf_presentation_mode = __webpack_require__(20);

            var _pdf_sidebar_resizer = __webpack_require__(21);

            var _pdf_thumbnail_viewer = __webpack_require__(22);

            var _pdf_viewer = __webpack_require__(24);

            var _secondary_toolbar = __webpack_require__(29);

            var _toolbar = __webpack_require__(31);

            var _view_history = __webpack_require__(32);

            const DEFAULT_SCALE_DELTA = 1.1;
            const DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT = 5000;
            const FORCE_PAGES_LOADED_TIMEOUT = 10000;
            const WHEEL_ZOOM_DISABLED_TIMEOUT = 1000;
            const ENABLE_PERMISSIONS_CLASS = "enablePermissions";
            const ViewOnLoad = {
                UNKNOWN: -1,
                PREVIOUS: 0,
                INITIAL: 1
            };

            class DefaultExternalServices {
                constructor() {
                    throw new Error("Cannot initialize DefaultExternalServices.");
                }

                static updateFindControlState(data) {}

                static updateFindMatchesCount(data) {}

                static initPassiveLoading(callbacks) {}

                static fallback(data, callback) {}

                static reportTelemetry(data) {}

                static createDownloadManager(options) {
                    throw new Error("Not implemented: createDownloadManager");
                }

                static createPreferences() {
                    throw new Error("Not implemented: createPreferences");
                }

                static createL10n(options) {
                    throw new Error("Not implemented: createL10n");
                }

                static get supportsIntegratedFind() {
                    return (0, _pdfjsLib.shadow)(this, "supportsIntegratedFind", false);
                }

                static get supportsDocumentFonts() {
                    return (0, _pdfjsLib.shadow)(this, "supportsDocumentFonts", true);
                }

                static get supportedMouseWheelZoomModifierKeys() {
                    return (0, _pdfjsLib.shadow)(this, "supportedMouseWheelZoomModifierKeys", {
                        ctrlKey: true,
                        metaKey: true
                    });
                }

                static get isInAutomation() {
                    return (0, _pdfjsLib.shadow)(this, "isInAutomation", false);
                }

            }

            exports.DefaultExternalServices = DefaultExternalServices;
            const PDFViewerApplication = {
                initialBookmark: document.location.hash.substring(1),
                _initializedCapability: (0, _pdfjsLib.createPromiseCapability)(),
                fellback: false,
                appConfig: null,
                pdfDocument: null,
                pdfLoadingTask: null,
                printService: null,
                pdfViewer: null,
                pdfThumbnailViewer: null,
                pdfRenderingQueue: null,
                pdfPresentationMode: null,
                pdfDocumentProperties: null,
                pdfLinkService: null,
                pdfHistory: null,
                pdfSidebar: null,
                pdfSidebarResizer: null,
                pdfOutlineViewer: null,
                pdfAttachmentViewer: null,
                pdfCursorTools: null,
                store: null,
                downloadManager: null,
                overlayManager: null,
                preferences: null,
                toolbar: null,
                secondaryToolbar: null,
                eventBus: null,
                l10n: null,
                isInitialViewSet: false,
                downloadComplete: false,
                isViewerEmbedded: window.parent !== window,
                url: "",
                baseUrl: "",
                externalServices: DefaultExternalServices,
                _boundEvents: {},
                contentDispositionFilename: null,
                _hasInteracted: false,
                _delayedFallbackFeatureIds: [],

                async initialize(appConfig) {
                    this.preferences = this.externalServices.createPreferences();
                    this.appConfig = appConfig;
                    await this._readPreferences();
                    await this._parseHashParameters();
                    await this._initializeL10n();

                    if (this.isViewerEmbedded && _app_options.AppOptions.get("externalLinkTarget") === _pdfjsLib.LinkTarget.NONE) {
                        _app_options.AppOptions.set("externalLinkTarget", _pdfjsLib.LinkTarget.TOP);
                    }

                    await this._initializeViewerComponents();
                    this.bindEvents();
                    this.bindWindowEvents();
                    const appContainer = appConfig.appContainer || document.documentElement;
                    this.l10n.translate(appContainer).then(() => {
                        this.eventBus.dispatch("localized", {
                            source: this
                        });
                    });

                    this._initializedCapability.resolve();
                },

                async _readPreferences() {
                    try {
                        const prefs = await this.preferences.getAll();

                        for (const name in prefs) {
                            _app_options.AppOptions.set(name, prefs[name]);
                        }
                    } catch (reason) {
                        console.error(`_readPreferences: "${reason.message}".`);
                    }
                },

                async _parseHashParameters() {
                    if (!_app_options.AppOptions.get("pdfBugEnabled")) {
                        return undefined;
                    }

                    const hash = document.location.hash.substring(1);

                    if (!hash) {
                        return undefined;
                    }

                    const hashParams = (0, _ui_utils.parseQueryString)(hash),
                        waitOn = [];

                    if ("disableworker" in hashParams && hashParams.disableworker === "true") {
                        waitOn.push(loadFakeWorker());
                    }

                    if ("disablerange" in hashParams) {
                        _app_options.AppOptions.set("disableRange", hashParams.disablerange === "true");
                    }

                    if ("disablestream" in hashParams) {
                        _app_options.AppOptions.set("disableStream", hashParams.disablestream === "true");
                    }

                    if ("disableautofetch" in hashParams) {
                        _app_options.AppOptions.set("disableAutoFetch", hashParams.disableautofetch === "true");
                    }

                    if ("disablefontface" in hashParams) {
                        _app_options.AppOptions.set("disableFontFace", hashParams.disablefontface === "true");
                    }

                    if ("disablehistory" in hashParams) {
                        _app_options.AppOptions.set("disableHistory", hashParams.disablehistory === "true");
                    }

                    if ("webgl" in hashParams) {
                        _app_options.AppOptions.set("enableWebGL", hashParams.webgl === "true");
                    }

                    if ("verbosity" in hashParams) {
                        _app_options.AppOptions.set("verbosity", hashParams.verbosity | 0);
                    }

                    if ("textlayer" in hashParams) {
                        switch (hashParams.textlayer) {
                            case "off":
                                _app_options.AppOptions.set("textLayerMode", _ui_utils.TextLayerMode.DISABLE);

                                break;

                            case "visible":
                            case "shadow":
                            case "hover":
                                const viewer = this.appConfig.viewerContainer;
                                viewer.classList.add("textLayer-" + hashParams.textlayer);
                                break;
                        }
                    }

                    if ("pdfbug" in hashParams) {
                        _app_options.AppOptions.set("pdfBug", true);

                        _app_options.AppOptions.set("fontExtraProperties", true);

                        const enabled = hashParams.pdfbug.split(",");
                        waitOn.push(loadAndEnablePDFBug(enabled));
                    }

                    return Promise.all(waitOn).catch(reason => {
                        console.error(`_parseHashParameters: "${reason.message}".`);
                    });
                },

                async _initializeL10n() {
                    this.l10n = this.externalServices.createL10n(null);
                    const dir = await this.l10n.getDirection();
                    document.getElementsByTagName("html")[0].dir = dir;
                },

                async _initializeViewerComponents() {
                    const appConfig = this.appConfig;
                    const eventBus = appConfig.eventBus || new _ui_utils.EventBus({
                        isInAutomation: this.externalServices.isInAutomation
                    });
                    this.eventBus = eventBus;
                    this.overlayManager = new _overlay_manager.OverlayManager();
                    const pdfRenderingQueue = new _pdf_rendering_queue.PDFRenderingQueue();
                    pdfRenderingQueue.onIdle = this.cleanup.bind(this);
                    this.pdfRenderingQueue = pdfRenderingQueue;
                    const pdfLinkService = new _pdf_link_service.PDFLinkService({
                        eventBus,
                        externalLinkTarget: _app_options.AppOptions.get("externalLinkTarget"),
                        externalLinkRel: _app_options.AppOptions.get("externalLinkRel"),
                        ignoreDestinationZoom: _app_options.AppOptions.get("ignoreDestinationZoom")
                    });
                    this.pdfLinkService = pdfLinkService;
                    const downloadManager = this.externalServices.createDownloadManager({
                        disableCreateObjectURL: _app_options.AppOptions.get("disableCreateObjectURL")
                    });
                    this.downloadManager = downloadManager;
                    const findController = new _pdf_find_controller.PDFFindController({
                        linkService: pdfLinkService,
                        eventBus
                    });
                    this.findController = findController;
                    const container = appConfig.mainContainer;
                    const viewer = appConfig.viewerContainer;
                    this.pdfViewer = new _pdf_viewer.PDFViewer({
                        container,
                        viewer,
                        eventBus,
                        renderingQueue: pdfRenderingQueue,
                        linkService: pdfLinkService,
                        downloadManager,
                        findController,
                        renderer: _app_options.AppOptions.get("renderer"),
                        enableWebGL: _app_options.AppOptions.get("enableWebGL"),
                        l10n: this.l10n,
                        textLayerMode: _app_options.AppOptions.get("textLayerMode"),
                        imageResourcesPath: _app_options.AppOptions.get("imageResourcesPath"),
                        renderInteractiveForms: _app_options.AppOptions.get("renderInteractiveForms"),
                        enablePrintAutoRotate: _app_options.AppOptions.get("enablePrintAutoRotate"),
                        useOnlyCssZoom: _app_options.AppOptions.get("useOnlyCssZoom"),
                        maxCanvasPixels: _app_options.AppOptions.get("maxCanvasPixels")
                    });
                    pdfRenderingQueue.setViewer(this.pdfViewer);
                    pdfLinkService.setViewer(this.pdfViewer);
                    this.pdfThumbnailViewer = new _pdf_thumbnail_viewer.PDFThumbnailViewer({
                        container: appConfig.sidebar.thumbnailView,
                        renderingQueue: pdfRenderingQueue,
                        linkService: pdfLinkService,
                        l10n: this.l10n
                    });
                    pdfRenderingQueue.setThumbnailViewer(this.pdfThumbnailViewer);
                    this.pdfHistory = new _pdf_history.PDFHistory({
                        linkService: pdfLinkService,
                        eventBus
                    });
                    pdfLinkService.setHistory(this.pdfHistory);

                    if (!this.supportsIntegratedFind) {
                        this.findBar = new _pdf_find_bar.PDFFindBar(appConfig.findBar, eventBus, this.l10n);
                    }

                    this.pdfDocumentProperties = new _pdf_document_properties.PDFDocumentProperties(appConfig.documentProperties, this.overlayManager, eventBus, this.l10n);
                    this.pdfCursorTools = new _pdf_cursor_tools.PDFCursorTools({
                        container,
                        eventBus,
                        cursorToolOnLoad: _app_options.AppOptions.get("cursorToolOnLoad")
                    });
                    this.toolbar = new _toolbar.Toolbar(appConfig.toolbar, eventBus, this.l10n);
                    this.secondaryToolbar = new _secondary_toolbar.SecondaryToolbar(appConfig.secondaryToolbar, container, eventBus);

                    if (this.supportsFullscreen) {
                        this.pdfPresentationMode = new _pdf_presentation_mode.PDFPresentationMode({
                            container,
                            pdfViewer: this.pdfViewer,
                            eventBus,
                            contextMenuItems: appConfig.fullscreen
                        });
                    }

                    this.passwordPrompt = new _password_prompt.PasswordPrompt(appConfig.passwordOverlay, this.overlayManager, this.l10n);
                    this.pdfOutlineViewer = new _pdf_outline_viewer.PDFOutlineViewer({
                        container: appConfig.sidebar.outlineView,
                        eventBus,
                        linkService: pdfLinkService
                    });
                    this.pdfAttachmentViewer = new _pdf_attachment_viewer.PDFAttachmentViewer({
                        container: appConfig.sidebar.attachmentsView,
                        eventBus,
                        downloadManager
                    });
                    this.pdfSidebar = new _pdf_sidebar.PDFSidebar({
                        elements: appConfig.sidebar,
                        pdfViewer: this.pdfViewer,
                        pdfThumbnailViewer: this.pdfThumbnailViewer,
                        eventBus,
                        l10n: this.l10n
                    });
                    this.pdfSidebar.onToggled = this.forceRendering.bind(this);
                    this.pdfSidebarResizer = new _pdf_sidebar_resizer.PDFSidebarResizer(appConfig.sidebarResizer, eventBus, this.l10n);
                },

                run(config) {
                    this.initialize(config).then(webViewerInitialized);
                },

                get initialized() {
                    return this._initializedCapability.settled;
                },

                get initializedPromise() {
                    return this._initializedCapability.promise;
                },

                zoomIn(ticks) {
                    if (this.pdfViewer.isInPresentationMode) {
                        return;
                    }

                    let newScale = this.pdfViewer.currentScale;

                    do {
                        newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
                        newScale = Math.ceil(newScale * 10) / 10;
                        newScale = Math.min(_ui_utils.MAX_SCALE, newScale);
                    } while (--ticks > 0 && newScale < _ui_utils.MAX_SCALE);

                    this.pdfViewer.currentScaleValue = newScale;
                },

                zoomOut(ticks) {
                    if (this.pdfViewer.isInPresentationMode) {
                        return;
                    }

                    let newScale = this.pdfViewer.currentScale;

                    do {
                        newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
                        newScale = Math.floor(newScale * 10) / 10;
                        newScale = Math.max(_ui_utils.MIN_SCALE, newScale);
                    } while (--ticks > 0 && newScale > _ui_utils.MIN_SCALE);

                    this.pdfViewer.currentScaleValue = newScale;
                },

                zoomReset() {
                    if (this.pdfViewer.isInPresentationMode) {
                        return;
                    }

                    this.pdfViewer.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE;
                },

                get pagesCount() {
                    return this.pdfDocument ? this.pdfDocument.numPages : 0;
                },

                get page() {
                    return this.pdfViewer.currentPageNumber;
                },

                set page(val) {
                    this.pdfViewer.currentPageNumber = val;
                },

                get printing() {
                    return !!this.printService;
                },

                get supportsPrinting() {
                    return PDFPrintServiceFactory.instance.supportsPrinting;
                },

                get supportsFullscreen() {
                    let support;
                    support = document.fullscreenEnabled === true || document.mozFullScreenEnabled === true;
                    return (0, _pdfjsLib.shadow)(this, "supportsFullscreen", support);
                },

                get supportsIntegratedFind() {
                    return this.externalServices.supportsIntegratedFind;
                },

                get supportsDocumentFonts() {
                    return this.externalServices.supportsDocumentFonts;
                },

                get loadingBar() {
                    const bar = new _ui_utils.ProgressBar("#loadingBar");
                    return (0, _pdfjsLib.shadow)(this, "loadingBar", bar);
                },

                get supportedMouseWheelZoomModifierKeys() {
                    return this.externalServices.supportedMouseWheelZoomModifierKeys;
                },

                initPassiveLoading() {
                    this.externalServices.initPassiveLoading({
                        onOpenWithTransport(url, length, transport) {
                            PDFViewerApplication.open(url, {
                                length,
                                range: transport
                            });
                        },

                        onOpenWithData(data) {
                            PDFViewerApplication.open(data);
                        },

                        onOpenWithURL(url, length, originalUrl) {
                            let file = url,
                                args = null;

                            if (length !== undefined) {
                                args = {
                                    length
                                };
                            }

                            if (originalUrl !== undefined) {
                                file = {
                                    url,
                                    originalUrl
                                };
                            }

                            PDFViewerApplication.open(file, args);
                        },

                        onError(err) {
                            PDFViewerApplication.l10n.get("loading_error", null, "An error occurred while loading the PDF.").then(msg => {
                                PDFViewerApplication.error(msg, err);
                            });
                        },

                        onProgress(loaded, total) {
                            PDFViewerApplication.progress(loaded / total);
                        }

                    });
                },

                setTitleUsingUrl(url = "") {
                    this.url = url;
                    this.baseUrl = url.split("#")[0];
                    let title = (0, _ui_utils.getPDFFileNameFromURL)(url, "");

                    if (!title) {
                        try {
                            title = decodeURIComponent((0, _pdfjsLib.getFilenameFromUrl)(url)) || url;
                        } catch (ex) {
                            title = url;
                        }
                    }

                    this.setTitle(title);
                },

                setTitle(title) {
                    if (this.isViewerEmbedded) {
                        return;
                    }

                    document.title = title;
                },

                async close() {
                    const errorWrapper = this.appConfig.errorWrapper.container;
                    errorWrapper.setAttribute("hidden", "true");

                    if (!this.pdfLoadingTask) {
                        return undefined;
                    }

                    const promise = this.pdfLoadingTask.destroy();
                    this.pdfLoadingTask = null;

                    if (this.pdfDocument) {
                        this.pdfDocument = null;
                        this.pdfThumbnailViewer.setDocument(null);
                        this.pdfViewer.setDocument(null);
                        this.pdfLinkService.setDocument(null);
                        this.pdfDocumentProperties.setDocument(null);
                    }

                    webViewerResetPermissions();
                    this.store = null;
                    this.isInitialViewSet = false;
                    this.downloadComplete = false;
                    this.url = "";
                    this.baseUrl = "";
                    this.contentDispositionFilename = null;
                    this.pdfSidebar.reset();
                    this.pdfOutlineViewer.reset();
                    this.pdfAttachmentViewer.reset();

                    if (this.pdfHistory) {
                        this.pdfHistory.reset();
                    }

                    if (this.findBar) {
                        this.findBar.reset();
                    }

                    this.toolbar.reset();
                    this.secondaryToolbar.reset();

                    if (typeof PDFBug !== "undefined") {
                        PDFBug.cleanup();
                    }

                    return promise;
                },

                async open(file, args) {
                    if (this.pdfLoadingTask) {
                        await this.close();
                    }

                    const workerParameters = _app_options.AppOptions.getAll(_app_options.OptionKind.WORKER);

                    for (const key in workerParameters) {
                        _pdfjsLib.GlobalWorkerOptions[key] = workerParameters[key];
                    }

                    const parameters = Object.create(null);

                    if (typeof file === "string") {
                        this.setTitleUsingUrl(file);
                        parameters.url = file;
                    } else if (file && "byteLength" in file) {
                        parameters.data = file;
                    } else if (file.url && file.originalUrl) {
                        this.setTitleUsingUrl(file.originalUrl);
                        parameters.url = file.url;
                    }

                    const apiParameters = _app_options.AppOptions.getAll(_app_options.OptionKind.API);

                    for (const key in apiParameters) {
                        let value = apiParameters[key];

                        if (key === "docBaseUrl" && !value) {
                            value = this.baseUrl;
                        }

                        parameters[key] = value;
                    }

                    if (args) {
                        for (const key in args) {
                            const value = args[key];

                            if (key === "length") {
                                this.pdfDocumentProperties.setFileSize(value);
                            }

                            parameters[key] = value;
                        }
                    }

                    const loadingTask = (0, _pdfjsLib.getDocument)(parameters);
                    this.pdfLoadingTask = loadingTask;

                    loadingTask.onPassword = (updateCallback, reason) => {
                        this.pdfLinkService.externalLinkEnabled = false;
                        this.passwordPrompt.setUpdateCallback(updateCallback, reason);
                        this.passwordPrompt.open();
                    };

                    loadingTask.onProgress = ({
                                                  loaded,
                                                  total
                                              }) => {
                        this.progress(loaded / total);
                    };

                    loadingTask.onUnsupportedFeature = this.fallback.bind(this);
                    return loadingTask.promise.then(pdfDocument => {
                        this.load(pdfDocument);
                    }, exception => {
                        if (loadingTask !== this.pdfLoadingTask) {
                            return undefined;
                        }

                        const message = exception && exception.message;
                        let loadingErrorMessage;

                        if (exception instanceof _pdfjsLib.InvalidPDFException) {
                            loadingErrorMessage = this.l10n.get("invalid_file_error", null, "Invalid or corrupted PDF file.");
                        } else if (exception instanceof _pdfjsLib.MissingPDFException) {
                            loadingErrorMessage = this.l10n.get("missing_file_error", null, "Missing PDF file.");
                        } else if (exception instanceof _pdfjsLib.UnexpectedResponseException) {
                            loadingErrorMessage = this.l10n.get("unexpected_response_error", null, "Unexpected server response.");
                        } else {
                            loadingErrorMessage = this.l10n.get("loading_error", null, "An error occurred while loading the PDF.");
                        }

                        return loadingErrorMessage.then(msg => {
                            this.error(msg, {
                                message
                            });
                            throw exception;
                        });
                    });
                },

                download() {
                    function downloadByUrl() {
                        downloadManager.downloadUrl(url, filename);
                    }

                    const url = this.baseUrl;
                    const filename = this.contentDispositionFilename || (0, _ui_utils.getPDFFileNameFromURL)(this.url);
                    const downloadManager = this.downloadManager;

                    downloadManager.onerror = err => {
                        this.error(`PDF failed to download: ${err}`);
                    };

                    if (!this.pdfDocument || !this.downloadComplete) {
                        downloadByUrl();
                        return;
                    }

                    this.pdfDocument.getData().then(function (data) {
                        const blob = new Blob([data], {
                            type: "application/pdf"
                        });
                        downloadManager.download(blob, url, filename);
                    }).catch(downloadByUrl);
                },

                fallback(featureId) {
                    if (this._delayedFallbackFeatureIds.length >= 1 && this._hasInteracted) {
                        featureId = this._delayedFallbackFeatureIds[0];
                        this._delayedFallbackFeatureIds = [];
                    }

                    if (this.fellback) {
                        return;
                    }

                    this.fellback = true;
                    this.externalServices.fallback({
                        featureId,
                        url: this.baseUrl
                    }, function response(download) {
                        if (!download) {
                            return;
                        }

                        PDFViewerApplication.download();
                    });
                },

                error(message, moreInfo) {
                    const moreInfoText = [this.l10n.get("error_version_info", {
                        version: _pdfjsLib.version || "?",
                        build: _pdfjsLib.build || "?"
                    }, "PDF.js v{{version}} (build: {{build}})")];

                    if (moreInfo) {
                        moreInfoText.push(this.l10n.get("error_message", {
                            message: moreInfo.message
                        }, "Message: {{message}}"));

                        if (moreInfo.stack) {
                            moreInfoText.push(this.l10n.get("error_stack", {
                                stack: moreInfo.stack
                            }, "Stack: {{stack}}"));
                        } else {
                            if (moreInfo.filename) {
                                moreInfoText.push(this.l10n.get("error_file", {
                                    file: moreInfo.filename
                                }, "File: {{file}}"));
                            }

                            if (moreInfo.lineNumber) {
                                moreInfoText.push(this.l10n.get("error_line", {
                                    line: moreInfo.lineNumber
                                }, "Line: {{line}}"));
                            }
                        }
                    }

                    Promise.all(moreInfoText).then(parts => {
                        console.error(message + "\n" + parts.join("\n"));
                    });
                    this.fallback();
                },

                progress(level) {
                    if (this.downloadComplete) {
                        return;
                    }

                    const percent = Math.round(level * 100);

                    if (percent > this.loadingBar.percent || isNaN(percent)) {
                        this.loadingBar.percent = percent;
                        const disableAutoFetch = this.pdfDocument ? this.pdfDocument.loadingParams.disableAutoFetch : _app_options.AppOptions.get("disableAutoFetch");

                        if (disableAutoFetch && percent) {
                            if (this.disableAutoFetchLoadingBarTimeout) {
                                clearTimeout(this.disableAutoFetchLoadingBarTimeout);
                                this.disableAutoFetchLoadingBarTimeout = null;
                            }

                            this.loadingBar.show();
                            this.disableAutoFetchLoadingBarTimeout = setTimeout(() => {
                                this.loadingBar.hide();
                                this.disableAutoFetchLoadingBarTimeout = null;
                            }, DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT);
                        }
                    }
                },

                load(pdfDocument) {
                    this.pdfDocument = pdfDocument;
                    pdfDocument.getDownloadInfo().then(() => {
                        this.downloadComplete = true;
                        this.loadingBar.hide();
                        firstPagePromise.then(() => {
                            this.eventBus.dispatch("documentloaded", {
                                source: this
                            });
                        });
                    });
                    const pageLayoutPromise = pdfDocument.getPageLayout().catch(function () {});
                    const pageModePromise = pdfDocument.getPageMode().catch(function () {});
                    const openActionPromise = pdfDocument.getOpenAction().catch(function () {});
                    this.toolbar.setPagesCount(pdfDocument.numPages, false);
                    this.secondaryToolbar.setPagesCount(pdfDocument.numPages);
                    let baseDocumentUrl;
                    baseDocumentUrl = this.baseUrl;
                    this.pdfLinkService.setDocument(pdfDocument, baseDocumentUrl);
                    this.pdfDocumentProperties.setDocument(pdfDocument, this.url);
                    const pdfViewer = this.pdfViewer;
                    pdfViewer.setDocument(pdfDocument);
                    const {
                        firstPagePromise,
                        onePageRendered,
                        pagesPromise
                    } = pdfViewer;
                    const pdfThumbnailViewer = this.pdfThumbnailViewer;
                    pdfThumbnailViewer.setDocument(pdfDocument);
                    const storedPromise = (this.store = new _view_history.ViewHistory(pdfDocument.fingerprint)).getMultiple({
                        page: null,
                        zoom: _ui_utils.DEFAULT_SCALE_VALUE,
                        scrollLeft: "0",
                        scrollTop: "0",
                        rotation: null,
                        sidebarView: _pdf_sidebar.SidebarView.UNKNOWN,
                        scrollMode: _ui_utils.ScrollMode.UNKNOWN,
                        spreadMode: _ui_utils.SpreadMode.UNKNOWN
                    }).catch(() => {
                        return Object.create(null);
                    });
                    firstPagePromise.then(pdfPage => {
                        this.loadingBar.setWidth(this.appConfig.viewerContainer);
                        Promise.all([_ui_utils.animationStarted, storedPromise, pageLayoutPromise, pageModePromise, openActionPromise]).then(async ([timeStamp, stored, pageLayout, pageMode, openAction]) => {
                            const viewOnLoad = _app_options.AppOptions.get("viewOnLoad");

                            this._initializePdfHistory({
                                fingerprint: pdfDocument.fingerprint,
                                viewOnLoad,
                                initialDest: openAction && openAction.dest
                            });

                            const initialBookmark = this.initialBookmark;

                            const zoom = _app_options.AppOptions.get("defaultZoomValue");

                            let hash = zoom ? `zoom=${zoom}` : null;
                            let rotation = null;

                            let sidebarView = _app_options.AppOptions.get("sidebarViewOnLoad");

                            let scrollMode = _app_options.AppOptions.get("scrollModeOnLoad");

                            let spreadMode = _app_options.AppOptions.get("spreadModeOnLoad");

                            if (stored.page && viewOnLoad !== ViewOnLoad.INITIAL) {
                                hash = `page=${stored.page}&zoom=${zoom || stored.zoom},` + `${stored.scrollLeft},${stored.scrollTop}`;
                                rotation = parseInt(stored.rotation, 10);

                                if (sidebarView === _pdf_sidebar.SidebarView.UNKNOWN) {
                                    sidebarView = stored.sidebarView | 0;
                                }

                                if (scrollMode === _ui_utils.ScrollMode.UNKNOWN) {
                                    scrollMode = stored.scrollMode | 0;
                                }

                                if (spreadMode === _ui_utils.SpreadMode.UNKNOWN) {
                                    spreadMode = stored.spreadMode | 0;
                                }
                            }

                            if (pageMode && sidebarView === _pdf_sidebar.SidebarView.UNKNOWN) {
                                sidebarView = apiPageModeToSidebarView(pageMode);
                            }

                            if (pageLayout && spreadMode === _ui_utils.SpreadMode.UNKNOWN) {
                                spreadMode = apiPageLayoutToSpreadMode(pageLayout);
                            }

                            this.setInitialView(hash, {
                                rotation,
                                sidebarView,
                                scrollMode,
                                spreadMode
                            });
                            this.eventBus.dispatch("documentinit", {
                                source: this
                            });

                            if (!this.isViewerEmbedded) {
                                pdfViewer.focus();
                            }

                            this._initializePermissions(pdfDocument);

                            await Promise.race([pagesPromise, new Promise(resolve => {
                                setTimeout(resolve, FORCE_PAGES_LOADED_TIMEOUT);
                            })]);

                            if (!initialBookmark && !hash) {
                                return;
                            }

                            if (pdfViewer.hasEqualPageSizes) {
                                return;
                            }

                            this.initialBookmark = initialBookmark;
                            pdfViewer.currentScaleValue = pdfViewer.currentScaleValue;
                            this.setInitialView(hash);
                        }).catch(() => {
                            this.setInitialView();
                        }).then(function () {
                            pdfViewer.update();
                        });
                    });
                    pagesPromise.then(() => {
                        this._initializeAutoPrint(pdfDocument, openActionPromise);
                    });
                    onePageRendered.then(() => {
                        pdfDocument.getOutline().then(outline => {
                            this.pdfOutlineViewer.render({
                                outline
                            });
                        });
                        pdfDocument.getAttachments().then(attachments => {
                            this.pdfAttachmentViewer.render({
                                attachments
                            });
                        });
                    });

                    this._initializePageLabels(pdfDocument);

                    this._initializeMetadata(pdfDocument);
                },

                async _initializeAutoPrint(pdfDocument, openActionPromise) {
                    const [openAction, javaScript] = await Promise.all([openActionPromise, pdfDocument.getJavaScript()]);

                    if (pdfDocument !== this.pdfDocument) {
                        return;
                    }

                    let triggerAutoPrint = false;

                    if (openAction && openAction.action === "Print") {
                        triggerAutoPrint = true;
                    }

                    if (javaScript) {
                        javaScript.some(js => {
                            if (!js) {
                                return false;
                            }

                            console.warn("Warning: JavaScript is not supported");

                            this._delayedFallbackFeatureIds.push(_pdfjsLib.UNSUPPORTED_FEATURES.javaScript);

                            return true;
                        });

                        if (!triggerAutoPrint) {
                            for (const js of javaScript) {
                                if (js && _ui_utils.AutoPrintRegExp.test(js)) {
                                    triggerAutoPrint = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (!this.supportsPrinting) {
                        return;
                    }

                    if (triggerAutoPrint) {
                        setTimeout(function () {
                            window.print();
                        });
                    }
                },

                async _initializeMetadata(pdfDocument) {
                    const {
                        info,
                        metadata,
                        contentDispositionFilename
                    } = await pdfDocument.getMetadata();

                    if (pdfDocument !== this.pdfDocument) {
                        return;
                    }

                    this.documentInfo = info;
                    this.metadata = metadata;
                    this.contentDispositionFilename = contentDispositionFilename;
                    console.log(`PDF ${pdfDocument.fingerprint} [${info.PDFFormatVersion} ` + `${(info.Producer || "-").trim()} / ${(info.Creator || "-").trim()}] ` + `(PDF.js: ${_pdfjsLib.version || "-"}` + `${this.pdfViewer.enableWebGL ? " [WebGL]" : ""})`);
                    let pdfTitle;
                    const infoTitle = info && info.Title;

                    if (infoTitle) {
                        pdfTitle = infoTitle;
                    }

                    const metadataTitle = metadata && metadata.get("dc:title");

                    if (metadataTitle) {
                        if (metadataTitle !== "Untitled" && !/[\uFFF0-\uFFFF]/g.test(metadataTitle)) {
                            pdfTitle = metadataTitle;
                        }
                    }

                    if (pdfTitle) {
                        this.setTitle(`${pdfTitle} - ${contentDispositionFilename || document.title}`);
                    } else if (contentDispositionFilename) {
                        this.setTitle(contentDispositionFilename);
                    }

                    if (info.IsAcroFormPresent) {
                        console.warn("Warning: AcroForm/XFA is not supported");

                        this._delayedFallbackFeatureIds.push(_pdfjsLib.UNSUPPORTED_FEATURES.forms);
                    }

                    let versionId = "other";
                    const KNOWN_VERSIONS = ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0", "2.1", "2.2", "2.3"];

                    if (KNOWN_VERSIONS.includes(info.PDFFormatVersion)) {
                        versionId = `v${info.PDFFormatVersion.replace(".", "_")}`;
                    }

                    let generatorId = "other";
                    const KNOWN_GENERATORS = ["acrobat distiller", "acrobat pdfwriter", "adobe livecycle", "adobe pdf library", "adobe photoshop", "ghostscript", "tcpdf", "cairo", "dvipdfm", "dvips", "pdftex", "pdfkit", "itext", "prince", "quarkxpress", "mac os x", "microsoft", "openoffice", "oracle", "luradocument", "pdf-xchange", "antenna house", "aspose.cells", "fpdf"];

                    if (info.Producer) {
                        const producer = info.Producer.toLowerCase();
                        KNOWN_GENERATORS.some(function (generator) {
                            if (!producer.includes(generator)) {
                                return false;
                            }

                            generatorId = generator.replace(/[ .\-]/g, "_");
                            return true;
                        });
                    }

                    let formType = null;

                    if (info.IsAcroFormPresent) {
                        formType = info.IsXFAPresent ? "xfa" : "acroform";
                    }

                    this.externalServices.reportTelemetry({
                        type: "documentInfo",
                        version: versionId,
                        generator: generatorId,
                        formType
                    });
                },

                async _initializePageLabels(pdfDocument) {
                    const labels = await pdfDocument.getPageLabels();

                    if (pdfDocument !== this.pdfDocument) {
                        return;
                    }

                    if (!labels || _app_options.AppOptions.get("disablePageLabels")) {
                        return;
                    }

                    const numLabels = labels.length;

                    if (numLabels !== this.pagesCount) {
                        console.error("The number of Page Labels does not match the number of pages in the document.");
                        return;
                    }

                    let i = 0;

                    while (i < numLabels && labels[i] === (i + 1).toString()) {
                        i++;
                    }

                    if (i === numLabels) {
                        return;
                    }

                    const {
                        pdfViewer,
                        pdfThumbnailViewer,
                        toolbar
                    } = this;
                    pdfViewer.setPageLabels(labels);
                    pdfThumbnailViewer.setPageLabels(labels);
                    toolbar.setPagesCount(numLabels, true);
                    toolbar.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel);
                },

                _initializePdfHistory({
                                          fingerprint,
                                          viewOnLoad,
                                          initialDest = null
                                      }) {
                    if (this.isViewerEmbedded || _app_options.AppOptions.get("disableHistory")) {
                        return;
                    }

                    this.pdfHistory.initialize({
                        fingerprint,
                        resetHistory: viewOnLoad === ViewOnLoad.INITIAL,
                        updateUrl: _app_options.AppOptions.get("historyUpdateUrl")
                    });

                    if (this.pdfHistory.initialBookmark) {
                        this.initialBookmark = this.pdfHistory.initialBookmark;
                        this.initialRotation = this.pdfHistory.initialRotation;
                    }

                    if (initialDest && !this.initialBookmark && viewOnLoad === ViewOnLoad.UNKNOWN) {
                        this.initialBookmark = JSON.stringify(initialDest);
                        this.pdfHistory.push({
                            explicitDest: initialDest,
                            pageNumber: null
                        });
                    }
                },

                async _initializePermissions(pdfDocument) {
                    const permissions = await pdfDocument.getPermissions();

                    if (pdfDocument !== this.pdfDocument) {
                        return;
                    }

                    if (!permissions || !_app_options.AppOptions.get("enablePermissions")) {
                        return;
                    }

                    if (!permissions.includes(_pdfjsLib.PermissionFlag.COPY)) {
                        this.appConfig.viewerContainer.classList.add(ENABLE_PERMISSIONS_CLASS);
                    }
                },

                setInitialView(storedHash, {
                    rotation,
                    sidebarView,
                    scrollMode,
                    spreadMode
                } = {}) {
                    const setRotation = angle => {
                        if ((0, _ui_utils.isValidRotation)(angle)) {
                            this.pdfViewer.pagesRotation = angle;
                        }
                    };

                    const setViewerModes = (scroll, spread) => {
                        if ((0, _ui_utils.isValidScrollMode)(scroll)) {
                            this.pdfViewer.scrollMode = scroll;
                        }

                        if ((0, _ui_utils.isValidSpreadMode)(spread)) {
                            this.pdfViewer.spreadMode = spread;
                        }
                    };

                    this.isInitialViewSet = true;
                    this.pdfSidebar.setInitialView(sidebarView);
                    setViewerModes(scrollMode, spreadMode);

                    if (this.initialBookmark) {
                        setRotation(this.initialRotation);
                        delete this.initialRotation;
                        this.pdfLinkService.setHash(this.initialBookmark);
                        this.initialBookmark = null;
                    } else if (storedHash) {
                        setRotation(rotation);
                        this.pdfLinkService.setHash(storedHash);
                    }

                    this.toolbar.setPageNumber(this.pdfViewer.currentPageNumber, this.pdfViewer.currentPageLabel);
                    this.secondaryToolbar.setPageNumber(this.pdfViewer.currentPageNumber);

                    if (!this.pdfViewer.currentScaleValue) {
                        this.pdfViewer.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE;
                    }
                },

                cleanup() {
                    if (!this.pdfDocument) {
                        return;
                    }

                    this.pdfViewer.cleanup();
                    this.pdfThumbnailViewer.cleanup();

                    if (this.pdfViewer.renderer !== _ui_utils.RendererType.SVG) {
                        this.pdfDocument.cleanup();
                    }
                },

                forceRendering() {
                    this.pdfRenderingQueue.printing = this.printing;
                    this.pdfRenderingQueue.isThumbnailViewEnabled = this.pdfSidebar.isThumbnailViewVisible;
                    this.pdfRenderingQueue.renderHighestPriority();
                },

                beforePrint() {
                    if (this.printService) {
                        return;
                    }

                    if (!this.supportsPrinting) {
                        this.l10n.get("printing_not_supported", null, "Warning: Printing is not fully supported by this browser.").then(printMessage => {
                            this.error(printMessage);
                        });
                        return;
                    }

                    if (!this.pdfViewer.pageViewsReady) {
                        this.l10n.get("printing_not_ready", null, "Warning: The PDF is not fully loaded for printing.").then(notReadyMessage => {
                            window.alert(notReadyMessage);
                        });
                        return;
                    }

                    const pagesOverview = this.pdfViewer.getPagesOverview();
                    const printContainer = this.appConfig.printContainer;
                    const printService = PDFPrintServiceFactory.instance.createPrintService(this.pdfDocument, pagesOverview, printContainer, this.l10n);
                    this.printService = printService;
                    this.forceRendering();
                    printService.layout();
                    this.externalServices.reportTelemetry({
                        type: "print"
                    });
                },

                afterPrint() {
                    if (this.printService) {
                        this.printService.destroy();
                        this.printService = null;
                    }

                    this.forceRendering();
                },

                rotatePages(delta) {
                    if (!this.pdfDocument) {
                        return;
                    }

                    const newRotation = (this.pdfViewer.pagesRotation + 360 + delta) % 360;
                    this.pdfViewer.pagesRotation = newRotation;
                },

                requestPresentationMode() {
                    if (!this.pdfPresentationMode) {
                        return;
                    }

                    this.pdfPresentationMode.request();
                },

                bindEvents() {
                    const {
                        eventBus,
                        _boundEvents
                    } = this;
                    _boundEvents.beforePrint = this.beforePrint.bind(this);
                    _boundEvents.afterPrint = this.afterPrint.bind(this);

                    eventBus._on("resize", webViewerResize);

                    eventBus._on("hashchange", webViewerHashchange);

                    eventBus._on("beforeprint", _boundEvents.beforePrint);

                    eventBus._on("afterprint", _boundEvents.afterPrint);

                    eventBus._on("pagerendered", webViewerPageRendered);

                    eventBus._on("updateviewarea", webViewerUpdateViewarea);

                    eventBus._on("pagechanging", webViewerPageChanging);

                    eventBus._on("scalechanging", webViewerScaleChanging);

                    eventBus._on("rotationchanging", webViewerRotationChanging);

                    eventBus._on("sidebarviewchanged", webViewerSidebarViewChanged);

                    eventBus._on("pagemode", webViewerPageMode);

                    eventBus._on("namedaction", webViewerNamedAction);

                    eventBus._on("presentationmodechanged", webViewerPresentationModeChanged);

                    eventBus._on("presentationmode", webViewerPresentationMode);

                    eventBus._on("print", webViewerPrint);

                    eventBus._on("download", webViewerDownload);

                    eventBus._on("firstpage", webViewerFirstPage);

                    eventBus._on("lastpage", webViewerLastPage);

                    eventBus._on("nextpage", webViewerNextPage);

                    eventBus._on("previouspage", webViewerPreviousPage);

                    eventBus._on("zoomin", webViewerZoomIn);

                    eventBus._on("zoomout", webViewerZoomOut);

                    eventBus._on("zoomreset", webViewerZoomReset);

                    eventBus._on("pagenumberchanged", webViewerPageNumberChanged);

                    eventBus._on("scalechanged", webViewerScaleChanged);

                    eventBus._on("rotatecw", webViewerRotateCw);

                    eventBus._on("rotateccw", webViewerRotateCcw);

                    eventBus._on("switchscrollmode", webViewerSwitchScrollMode);

                    eventBus._on("scrollmodechanged", webViewerScrollModeChanged);

                    eventBus._on("switchspreadmode", webViewerSwitchSpreadMode);

                    eventBus._on("spreadmodechanged", webViewerSpreadModeChanged);

                    eventBus._on("documentproperties", webViewerDocumentProperties);

                    eventBus._on("find", webViewerFind);

                    eventBus._on("findfromurlhash", webViewerFindFromUrlHash);

                    eventBus._on("updatefindmatchescount", webViewerUpdateFindMatchesCount);

                    eventBus._on("updatefindcontrolstate", webViewerUpdateFindControlState);
                },

                bindWindowEvents() {
                    const {
                        eventBus,
                        _boundEvents
                    } = this;

                    _boundEvents.windowResize = () => {
                        eventBus.dispatch("resize", {
                            source: window
                        });
                    };

                    _boundEvents.windowHashChange = () => {
                        eventBus.dispatch("hashchange", {
                            source: window,
                            hash: document.location.hash.substring(1)
                        });
                    };

                    _boundEvents.windowBeforePrint = () => {
                        eventBus.dispatch("beforeprint", {
                            source: window
                        });
                    };

                    _boundEvents.windowAfterPrint = () => {
                        eventBus.dispatch("afterprint", {
                            source: window
                        });
                    };

                    window.addEventListener("visibilitychange", webViewerVisibilityChange);
                    window.addEventListener("wheel", webViewerWheel, {
                        passive: false
                    });
                    window.addEventListener("click", webViewerClick);
                    window.addEventListener("keydown", webViewerKeyDown);
                    window.addEventListener("keyup", webViewerKeyUp);
                    window.addEventListener("resize", _boundEvents.windowResize);
                    window.addEventListener("hashchange", _boundEvents.windowHashChange);
                    window.addEventListener("beforeprint", _boundEvents.windowBeforePrint);
                    window.addEventListener("afterprint", _boundEvents.windowAfterPrint);
                },

                unbindEvents() {
                    const {
                        eventBus,
                        _boundEvents
                    } = this;

                    eventBus._off("resize", webViewerResize);

                    eventBus._off("hashchange", webViewerHashchange);

                    eventBus._off("beforeprint", _boundEvents.beforePrint);

                    eventBus._off("afterprint", _boundEvents.afterPrint);

                    eventBus._off("pagerendered", webViewerPageRendered);

                    eventBus._off("updateviewarea", webViewerUpdateViewarea);

                    eventBus._off("pagechanging", webViewerPageChanging);

                    eventBus._off("scalechanging", webViewerScaleChanging);

                    eventBus._off("rotationchanging", webViewerRotationChanging);

                    eventBus._off("sidebarviewchanged", webViewerSidebarViewChanged);

                    eventBus._off("pagemode", webViewerPageMode);

                    eventBus._off("namedaction", webViewerNamedAction);

                    eventBus._off("presentationmodechanged", webViewerPresentationModeChanged);

                    eventBus._off("presentationmode", webViewerPresentationMode);

                    eventBus._off("print", webViewerPrint);

                    eventBus._off("download", webViewerDownload);

                    eventBus._off("firstpage", webViewerFirstPage);

                    eventBus._off("lastpage", webViewerLastPage);

                    eventBus._off("nextpage", webViewerNextPage);

                    eventBus._off("previouspage", webViewerPreviousPage);

                    eventBus._off("zoomin", webViewerZoomIn);

                    eventBus._off("zoomout", webViewerZoomOut);

                    eventBus._off("zoomreset", webViewerZoomReset);

                    eventBus._off("pagenumberchanged", webViewerPageNumberChanged);

                    eventBus._off("scalechanged", webViewerScaleChanged);

                    eventBus._off("rotatecw", webViewerRotateCw);

                    eventBus._off("rotateccw", webViewerRotateCcw);

                    eventBus._off("switchscrollmode", webViewerSwitchScrollMode);

                    eventBus._off("scrollmodechanged", webViewerScrollModeChanged);

                    eventBus._off("switchspreadmode", webViewerSwitchSpreadMode);

                    eventBus._off("spreadmodechanged", webViewerSpreadModeChanged);

                    eventBus._off("documentproperties", webViewerDocumentProperties);

                    eventBus._off("find", webViewerFind);

                    eventBus._off("findfromurlhash", webViewerFindFromUrlHash);

                    eventBus._off("updatefindmatchescount", webViewerUpdateFindMatchesCount);

                    eventBus._off("updatefindcontrolstate", webViewerUpdateFindControlState);

                    _boundEvents.beforePrint = null;
                    _boundEvents.afterPrint = null;
                },

                unbindWindowEvents() {
                    const {
                        _boundEvents
                    } = this;
                    window.removeEventListener("visibilitychange", webViewerVisibilityChange);
                    window.removeEventListener("wheel", webViewerWheel, {
                        passive: false
                    });
                    window.removeEventListener("click", webViewerClick);
                    window.removeEventListener("keydown", webViewerKeyDown);
                    window.removeEventListener("keyup", webViewerKeyUp);
                    window.removeEventListener("resize", _boundEvents.windowResize);
                    window.removeEventListener("hashchange", _boundEvents.windowHashChange);
                    window.removeEventListener("beforeprint", _boundEvents.windowBeforePrint);
                    window.removeEventListener("afterprint", _boundEvents.windowAfterPrint);
                    _boundEvents.windowResize = null;
                    _boundEvents.windowHashChange = null;
                    _boundEvents.windowBeforePrint = null;
                    _boundEvents.windowAfterPrint = null;
                }

            };
            exports.PDFViewerApplication = PDFViewerApplication;
            let validateFileURL;
            ;

            async function loadFakeWorker() {
                if (!_pdfjsLib.GlobalWorkerOptions.workerSrc) {
                    _pdfjsLib.GlobalWorkerOptions.workerSrc = _app_options.AppOptions.get("workerSrc");
                }

                return (0, _pdfjsLib.loadScript)(_pdfjsLib.PDFWorker.getWorkerSrc());
            }

            function loadAndEnablePDFBug(enabledTabs) {
                const appConfig = PDFViewerApplication.appConfig;
                return (0, _pdfjsLib.loadScript)(appConfig.debuggerScriptPath).then(function () {
                    PDFBug.enable(enabledTabs);
                    PDFBug.init({
                        OPS: _pdfjsLib.OPS
                    }, appConfig.mainContainer);
                });
            }

            function webViewerInitialized() {
                const appConfig = PDFViewerApplication.appConfig;
                let file;
                file = window.location.href;
                appConfig.toolbar.openFile.setAttribute("hidden", "true");
                appConfig.secondaryToolbar.openFileButton.setAttribute("hidden", "true");

                if (!PDFViewerApplication.supportsDocumentFonts) {
                    _app_options.AppOptions.set("disableFontFace", true);

                    PDFViewerApplication.l10n.get("web_fonts_disabled", null, "Web fonts are disabled: unable to use embedded PDF fonts.").then(msg => {
                        console.warn(msg);
                    });
                }

                if (!PDFViewerApplication.supportsPrinting) {
                    appConfig.toolbar.print.classList.add("hidden");
                    appConfig.secondaryToolbar.printButton.classList.add("hidden");
                }

                if (!PDFViewerApplication.supportsFullscreen) {
                    appConfig.toolbar.presentationModeButton.classList.add("hidden");
                    appConfig.secondaryToolbar.presentationModeButton.classList.add("hidden");
                }

                if (PDFViewerApplication.supportsIntegratedFind) {
                    appConfig.toolbar.viewFind.classList.add("hidden");
                }

                appConfig.mainContainer.addEventListener("transitionend", function (evt) {
                    if (evt.target === this) {
                        PDFViewerApplication.eventBus.dispatch("resize", {
                            source: this
                        });
                    }
                }, true);

                try {
                    webViewerOpenFileViaURL(file);
                } catch (reason) {
                    PDFViewerApplication.l10n.get("loading_error", null, "An error occurred while loading the PDF.").then(msg => {
                        PDFViewerApplication.error(msg, reason);
                    });
                }
            }

            let webViewerOpenFileViaURL;
            {
                webViewerOpenFileViaURL = function (file) {
                    PDFViewerApplication.setTitleUsingUrl(file);
                    PDFViewerApplication.initPassiveLoading();
                };
            }

            function webViewerResetPermissions() {
                const {
                    appConfig
                } = PDFViewerApplication;

                if (!appConfig) {
                    return;
                }

                appConfig.viewerContainer.classList.remove(ENABLE_PERMISSIONS_CLASS);
            }

            function webViewerPageRendered(evt) {
                const pageNumber = evt.pageNumber;
                const pageIndex = pageNumber - 1;
                const pageView = PDFViewerApplication.pdfViewer.getPageView(pageIndex);

                if (pageNumber === PDFViewerApplication.page) {
                    PDFViewerApplication.toolbar.updateLoadingIndicatorState(false);
                }

                if (!pageView) {
                    return;
                }

                if (PDFViewerApplication.pdfSidebar.isThumbnailViewVisible) {
                    const thumbnailView = PDFViewerApplication.pdfThumbnailViewer.getThumbnail(pageIndex);
                    thumbnailView.setImage(pageView);
                }

                if (typeof Stats !== "undefined" && Stats.enabled && pageView.stats) {
                    Stats.add(pageNumber, pageView.stats);
                }

                if (pageView.error) {
                    PDFViewerApplication.l10n.get("rendering_error", null, "An error occurred while rendering the page.").then(msg => {
                        PDFViewerApplication.error(msg, pageView.error);
                    });
                }

                PDFViewerApplication.externalServices.reportTelemetry({
                    type: "pageInfo",
                    timestamp: evt.timestamp
                });
                PDFViewerApplication.pdfDocument.getStats().then(function (stats) {
                    PDFViewerApplication.externalServices.reportTelemetry({
                        type: "documentStats",
                        stats
                    });
                });
            }

            function webViewerPageMode({
                                           mode
                                       }) {
                let view;

                switch (mode) {
                    case "thumbs":
                        view = _pdf_sidebar.SidebarView.THUMBS;
                        break;

                    case "bookmarks":
                    case "outline":
                        view = _pdf_sidebar.SidebarView.OUTLINE;
                        break;

                    case "attachments":
                        view = _pdf_sidebar.SidebarView.ATTACHMENTS;
                        break;

                    case "none":
                        view = _pdf_sidebar.SidebarView.NONE;
                        break;

                    default:
                        console.error('Invalid "pagemode" hash parameter: ' + mode);
                        return;
                }

                PDFViewerApplication.pdfSidebar.switchView(view, true);
            }

            function webViewerNamedAction(evt) {
                const action = evt.action;

                switch (action) {
                    case "GoToPage":
                        PDFViewerApplication.appConfig.toolbar.pageNumber.select();
                        break;

                    case "Find":
                        if (!PDFViewerApplication.supportsIntegratedFind) {
                            PDFViewerApplication.findBar.toggle();
                        }

                        break;
                }
            }

            function webViewerPresentationModeChanged({
                                                          active,
                                                          switchInProgress
                                                      }) {
                let state = _ui_utils.PresentationModeState.NORMAL;

                if (switchInProgress) {
                    state = _ui_utils.PresentationModeState.CHANGING;
                } else if (active) {
                    state = _ui_utils.PresentationModeState.FULLSCREEN;
                }

                PDFViewerApplication.pdfViewer.presentationModeState = state;
            }

            function webViewerSidebarViewChanged(evt) {
                PDFViewerApplication.pdfRenderingQueue.isThumbnailViewEnabled = PDFViewerApplication.pdfSidebar.isThumbnailViewVisible;
                const store = PDFViewerApplication.store;

                if (store && PDFViewerApplication.isInitialViewSet) {
                    store.set("sidebarView", evt.view).catch(function () {});
                }
            }

            function webViewerUpdateViewarea(evt) {
                const location = evt.location,
                    store = PDFViewerApplication.store;

                if (store && PDFViewerApplication.isInitialViewSet) {
                    store.setMultiple({
                        page: location.pageNumber,
                        zoom: location.scale,
                        scrollLeft: location.left,
                        scrollTop: location.top,
                        rotation: location.rotation
                    }).catch(function () {});
                }

                const href = PDFViewerApplication.pdfLinkService.getAnchorUrl(location.pdfOpenParams);
                PDFViewerApplication.appConfig.toolbar.viewBookmark.href = href;
                PDFViewerApplication.appConfig.secondaryToolbar.viewBookmarkButton.href = href;
                const currentPage = PDFViewerApplication.pdfViewer.getPageView(PDFViewerApplication.page - 1);
                const loading = currentPage.renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED;
                PDFViewerApplication.toolbar.updateLoadingIndicatorState(loading);
            }

            function webViewerScrollModeChanged(evt) {
                const store = PDFViewerApplication.store;

                if (store && PDFViewerApplication.isInitialViewSet) {
                    store.set("scrollMode", evt.mode).catch(function () {});
                }
            }

            function webViewerSpreadModeChanged(evt) {
                const store = PDFViewerApplication.store;

                if (store && PDFViewerApplication.isInitialViewSet) {
                    store.set("spreadMode", evt.mode).catch(function () {});
                }
            }

            function webViewerResize() {
                const {
                    pdfDocument,
                    pdfViewer
                } = PDFViewerApplication;

                if (!pdfDocument) {
                    return;
                }

                const currentScaleValue = pdfViewer.currentScaleValue;

                if (currentScaleValue === "auto" || currentScaleValue === "page-fit" || currentScaleValue === "page-width") {
                    pdfViewer.currentScaleValue = currentScaleValue;
                }

                pdfViewer.update();
            }

            function webViewerHashchange(evt) {
                const hash = evt.hash;

                if (!hash) {
                    return;
                }

                if (!PDFViewerApplication.isInitialViewSet) {
                    PDFViewerApplication.initialBookmark = hash;
                } else if (!PDFViewerApplication.pdfHistory.popStateInProgress) {
                    PDFViewerApplication.pdfLinkService.setHash(hash);
                }
            }

            let webViewerFileInputChange, webViewerOpenFile;
            ;

            function webViewerPresentationMode() {
                PDFViewerApplication.requestPresentationMode();
            }

            function webViewerPrint() {
                window.print();
            }

            function webViewerDownload() {
                PDFViewerApplication.download();
            }

            function webViewerFirstPage() {
                if (PDFViewerApplication.pdfDocument) {
                    PDFViewerApplication.page = 1;
                }
            }

            function webViewerLastPage() {
                if (PDFViewerApplication.pdfDocument) {
                    PDFViewerApplication.page = PDFViewerApplication.pagesCount;
                }
            }

            function webViewerNextPage() {
                console.log('nextPagehaha');
                PDFViewerApplication.page++;
            }

            function webViewerPreviousPage() {
                console.log('previousPagehaha');
                PDFViewerApplication.page--;
            }

            function webViewerZoomIn() {
                console.log('ZoomInehaha');
                PDFViewerApplication.zoomIn();
            }

            function webViewerZoomOut() {
                console.log('Zoomouthaha')
                PDFViewerApplication.zoomOut();
            }

            function webViewerZoomReset() {
                PDFViewerApplication.zoomReset();
            }

            function webViewerPageNumberChanged(evt) {
                console.log(evt);

                const pdfViewer = PDFViewerApplication.pdfViewer;

                if (evt.value !== "") {
                    pdfViewer.currentPageLabel = evt.value;
                }

                if (evt.value !== pdfViewer.currentPageNumber.toString() && evt.value !== pdfViewer.currentPageLabel) {
                    PDFViewerApplication.toolbar.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel);
                }
            }

            function webViewerScaleChanged(evt) {
                PDFViewerApplication.pdfViewer.currentScaleValue = evt.value;
            }

            function webViewerRotateCw() {
                PDFViewerApplication.rotatePages(90);
            }

            function webViewerRotateCcw() {
                PDFViewerApplication.rotatePages(-90);
            }

            function webViewerSwitchScrollMode(evt) {
                PDFViewerApplication.pdfViewer.scrollMode = evt.mode;
            }

            function webViewerSwitchSpreadMode(evt) {
                PDFViewerApplication.pdfViewer.spreadMode = evt.mode;
            }

            function webViewerDocumentProperties() {
                PDFViewerApplication.pdfDocumentProperties.open();
            }

            function webViewerFind(evt) {
                PDFViewerApplication.findController.executeCommand("find" + evt.type, {
                    query: evt.query,
                    phraseSearch: evt.phraseSearch,
                    caseSensitive: evt.caseSensitive,
                    entireWord: evt.entireWord,
                    highlightAll: evt.highlightAll,
                    findPrevious: evt.findPrevious
                });
            }

            function webViewerFindFromUrlHash(evt) {
                PDFViewerApplication.findController.executeCommand("find", {
                    query: evt.query,
                    phraseSearch: evt.phraseSearch,
                    caseSensitive: false,
                    entireWord: false,
                    highlightAll: true,
                    findPrevious: false
                });
            }

            function webViewerUpdateFindMatchesCount({
                                                         matchesCount
                                                     }) {
                if (PDFViewerApplication.supportsIntegratedFind) {
                    PDFViewerApplication.externalServices.updateFindMatchesCount(matchesCount);
                } else {
                    PDFViewerApplication.findBar.updateResultsCount(matchesCount);
                }
            }

            function webViewerUpdateFindControlState({
                                                         state,
                                                         previous,
                                                         matchesCount
                                                     }) {
                if (PDFViewerApplication.supportsIntegratedFind) {
                    PDFViewerApplication.externalServices.updateFindControlState({
                        result: state,
                        findPrevious: previous,
                        matchesCount
                    });
                } else {
                    PDFViewerApplication.findBar.updateUIState(state, previous, matchesCount);
                }
            }

            function webViewerScaleChanging(evt) {
                PDFViewerApplication.toolbar.setPageScale(evt.presetValue, evt.scale);
                PDFViewerApplication.pdfViewer.update();
            }

            function webViewerRotationChanging(evt) {
                PDFViewerApplication.pdfThumbnailViewer.pagesRotation = evt.pagesRotation;
                PDFViewerApplication.forceRendering();
                PDFViewerApplication.pdfViewer.currentPageNumber = evt.pageNumber;
            }

            function webViewerPageChanging(evt) {
                const page = evt.pageNumber;
                PDFViewerApplication.toolbar.setPageNumber(page, evt.pageLabel || null);
                PDFViewerApplication.secondaryToolbar.setPageNumber(page);

                if (PDFViewerApplication.pdfSidebar.isThumbnailViewVisible) {
                    PDFViewerApplication.pdfThumbnailViewer.scrollThumbnailIntoView(page);
                }

                if (typeof Stats !== "undefined" && Stats.enabled) {
                    const pageView = PDFViewerApplication.pdfViewer.getPageView(page - 1);

                    if (pageView && pageView.stats) {
                        Stats.add(page, pageView.stats);
                    }
                }
            }

            function webViewerVisibilityChange(evt) {
                if (document.visibilityState === "visible") {
                    setZoomDisabledTimeout();
                }
            }

            let zoomDisabledTimeout = null;

            function setZoomDisabledTimeout() {
                if (zoomDisabledTimeout) {
                    clearTimeout(zoomDisabledTimeout);
                }

                zoomDisabledTimeout = setTimeout(function () {
                    zoomDisabledTimeout = null;
                }, WHEEL_ZOOM_DISABLED_TIMEOUT);
            }

            function webViewerWheel(evt) {
                const {
                    pdfViewer,
                    supportedMouseWheelZoomModifierKeys
                } = PDFViewerApplication;

                if (pdfViewer.isInPresentationMode) {
                    return;
                }

                if (evt.ctrlKey && supportedMouseWheelZoomModifierKeys.ctrlKey || evt.metaKey && supportedMouseWheelZoomModifierKeys.metaKey) {
                    evt.preventDefault();

                    if (zoomDisabledTimeout || document.visibilityState === "hidden") {
                        return;
                    }

                    const previousScale = pdfViewer.currentScale;
                    const delta = (0, _ui_utils.normalizeWheelEventDelta)(evt);
                    const MOUSE_WHEEL_DELTA_PER_PAGE_SCALE = 3.0;
                    const ticks = delta * MOUSE_WHEEL_DELTA_PER_PAGE_SCALE;

                    if (ticks < 0) {
                        PDFViewerApplication.zoomOut(-ticks);
                    } else {
                        PDFViewerApplication.zoomIn(ticks);
                    }

                    const currentScale = pdfViewer.currentScale;

                    if (previousScale !== currentScale) {
                        const scaleCorrectionFactor = currentScale / previousScale - 1;
                        const rect = pdfViewer.container.getBoundingClientRect();
                        const dx = evt.clientX - rect.left;
                        const dy = evt.clientY - rect.top;
                        pdfViewer.container.scrollLeft += dx * scaleCorrectionFactor;
                        pdfViewer.container.scrollTop += dy * scaleCorrectionFactor;
                    }
                } else {
                    setZoomDisabledTimeout();
                }
            }

            function webViewerClick(evt) {
                PDFViewerApplication._hasInteracted = true;

                if (PDFViewerApplication._delayedFallbackFeatureIds.length >= 1 && PDFViewerApplication.pdfViewer.containsElement(evt.target)) {
                    PDFViewerApplication.fallback();
                }

                if (!PDFViewerApplication.secondaryToolbar.isOpen) {
                    return;
                }

                const appConfig = PDFViewerApplication.appConfig;

                if (PDFViewerApplication.pdfViewer.containsElement(evt.target) || appConfig.toolbar.container.contains(evt.target) && evt.target !== appConfig.secondaryToolbar.toggleButton) {
                    PDFViewerApplication.secondaryToolbar.close();
                }
            }

            function webViewerKeyUp(evt) {
                if (evt.keyCode === 9) {
                    PDFViewerApplication._hasInteracted = true;

                    if (PDFViewerApplication._delayedFallbackFeatureIds.length >= 1) {
                        PDFViewerApplication.fallback();
                    }
                }
            }

            function webViewerKeyDown(evt) {
                if (PDFViewerApplication.overlayManager.active) {
                    return;
                }

                let handled = false,
                    ensureViewerFocused = false;
                const cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0);
                const pdfViewer = PDFViewerApplication.pdfViewer;
                const isViewerInPresentationMode = pdfViewer && pdfViewer.isInPresentationMode;

                if (cmd === 1 || cmd === 8 || cmd === 5 || cmd === 12) {
                    switch (evt.keyCode) {
                        case 70:
                            if (!PDFViewerApplication.supportsIntegratedFind) {
                                PDFViewerApplication.findBar.open();
                                handled = true;
                            }

                            break;

                        case 71:
                            if (!PDFViewerApplication.supportsIntegratedFind) {
                                const findState = PDFViewerApplication.findController.state;

                                if (findState) {
                                    PDFViewerApplication.findController.executeCommand("findagain", {
                                        query: findState.query,
                                        phraseSearch: findState.phraseSearch,
                                        caseSensitive: findState.caseSensitive,
                                        entireWord: findState.entireWord,
                                        highlightAll: findState.highlightAll,
                                        findPrevious: cmd === 5 || cmd === 12
                                    });
                                }

                                handled = true;
                            }

                            break;

                        case 61:
                        case 107:
                        case 187:
                        case 171:
                            if (!isViewerInPresentationMode) {
                                PDFViewerApplication.zoomIn();
                            }

                            handled = true;
                            break;

                        case 173:
                        case 109:
                        case 189:
                            if (!isViewerInPresentationMode) {
                                PDFViewerApplication.zoomOut();
                            }

                            handled = true;
                            break;

                        case 48:
                        case 96:
                            if (!isViewerInPresentationMode) {
                                setTimeout(function () {
                                    PDFViewerApplication.zoomReset();
                                });
                                handled = false;
                            }

                            break;

                        case 38:
                            if (isViewerInPresentationMode || PDFViewerApplication.page > 1) {
                                PDFViewerApplication.page = 1;
                                handled = true;
                                ensureViewerFocused = true;
                            }

                            break;

                        case 40:
                            if (isViewerInPresentationMode || PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                                PDFViewerApplication.page = PDFViewerApplication.pagesCount;
                                handled = true;
                                ensureViewerFocused = true;
                            }

                            break;
                    }
                }

                if (cmd === 3 || cmd === 10) {
                    switch (evt.keyCode) {
                        case 80:
                            PDFViewerApplication.requestPresentationMode();
                            handled = true;
                            break;

                        case 71:
                            PDFViewerApplication.appConfig.toolbar.pageNumber.select();
                            handled = true;
                            break;
                    }
                }

                if (handled) {
                    if (ensureViewerFocused && !isViewerInPresentationMode) {
                        pdfViewer.focus();
                    }

                    evt.preventDefault();
                    return;
                }

                const curElement = document.activeElement || document.querySelector(":focus");
                const curElementTagName = curElement && curElement.tagName.toUpperCase();

                if (curElementTagName === "INPUT" || curElementTagName === "TEXTAREA" || curElementTagName === "SELECT" || curElement && curElement.isContentEditable) {
                    if (evt.keyCode !== 27) {
                        return;
                    }
                }

                if (cmd === 0) {
                    let turnPage = 0,
                        turnOnlyIfPageFit = false;

                    switch (evt.keyCode) {
                        case 38:
                        case 33:
                            if (pdfViewer.isVerticalScrollbarEnabled) {
                                turnOnlyIfPageFit = true;
                            }

                            turnPage = -1;
                            break;

                        case 8:
                            if (!isViewerInPresentationMode) {
                                turnOnlyIfPageFit = true;
                            }

                            turnPage = -1;
                            break;

                        case 37:
                            if (pdfViewer.isHorizontalScrollbarEnabled) {
                                turnOnlyIfPageFit = true;
                            }

                        case 75:
                        case 80:
                            turnPage = -1;
                            break;

                        case 27:
                            if (PDFViewerApplication.secondaryToolbar.isOpen) {
                                PDFViewerApplication.secondaryToolbar.close();
                                handled = true;
                            }

                            if (!PDFViewerApplication.supportsIntegratedFind && PDFViewerApplication.findBar.opened) {
                                PDFViewerApplication.findBar.close();
                                handled = true;
                            }

                            break;

                        case 40:
                        case 34:
                            if (pdfViewer.isVerticalScrollbarEnabled) {
                                turnOnlyIfPageFit = true;
                            }

                            turnPage = 1;
                            break;

                        case 13:
                        case 32:
                            if (!isViewerInPresentationMode) {
                                turnOnlyIfPageFit = true;
                            }

                            turnPage = 1;
                            break;

                        case 39:
                            if (pdfViewer.isHorizontalScrollbarEnabled) {
                                turnOnlyIfPageFit = true;
                            }

                        case 74:
                        case 78:
                            turnPage = 1;
                            break;

                        case 36:
                            if (isViewerInPresentationMode || PDFViewerApplication.page > 1) {
                                PDFViewerApplication.page = 1;
                                handled = true;
                                ensureViewerFocused = true;
                            }

                            break;

                        case 35:
                            if (isViewerInPresentationMode || PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                                PDFViewerApplication.page = PDFViewerApplication.pagesCount;
                                handled = true;
                                ensureViewerFocused = true;
                            }

                            break;

                        case 83:
                            PDFViewerApplication.pdfCursorTools.switchTool(_pdf_cursor_tools.CursorTool.SELECT);
                            break;

                        case 72:
                            PDFViewerApplication.pdfCursorTools.switchTool(_pdf_cursor_tools.CursorTool.HAND);
                            break;

                        case 82:
                            PDFViewerApplication.rotatePages(90);
                            break;

                        case 115:
                            PDFViewerApplication.pdfSidebar.toggle();
                            break;
                    }

                    if (turnPage !== 0 && (!turnOnlyIfPageFit || pdfViewer.currentScaleValue === "page-fit")) {
                        if (turnPage > 0) {
                            if (PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                                PDFViewerApplication.page++;
                            }
                        } else {
                            if (PDFViewerApplication.page > 1) {
                                PDFViewerApplication.page--;
                            }
                        }

                        handled = true;
                    }
                }

                if (cmd === 4) {
                    switch (evt.keyCode) {
                        case 13:
                        case 32:
                            if (!isViewerInPresentationMode && pdfViewer.currentScaleValue !== "page-fit") {
                                break;
                            }

                            if (PDFViewerApplication.page > 1) {
                                PDFViewerApplication.page--;
                            }

                            handled = true;
                            break;

                        case 82:
                            PDFViewerApplication.rotatePages(-90);
                            break;
                    }
                }

                if (!handled && !isViewerInPresentationMode) {
                    if (evt.keyCode >= 33 && evt.keyCode <= 40 || evt.keyCode === 32 && curElementTagName !== "BUTTON") {
                        ensureViewerFocused = true;
                    }
                }

                if (ensureViewerFocused && !pdfViewer.containsElement(curElement)) {
                    pdfViewer.focus();
                }

                if (handled) {
                    evt.preventDefault();
                }
            }

            function apiPageLayoutToSpreadMode(layout) {
                switch (layout) {
                    case "SinglePage":
                    case "OneColumn":
                        return _ui_utils.SpreadMode.NONE;

                    case "TwoColumnLeft":
                    case "TwoPageLeft":
                        return _ui_utils.SpreadMode.ODD;

                    case "TwoColumnRight":
                    case "TwoPageRight":
                        return _ui_utils.SpreadMode.EVEN;
                }

                return _ui_utils.SpreadMode.NONE;
            }

            function apiPageModeToSidebarView(mode) {
                switch (mode) {
                    case "UseNone":
                        return _pdf_sidebar.SidebarView.NONE;

                    case "UseThumbs":
                        return _pdf_sidebar.SidebarView.THUMBS;

                    case "UseOutlines":
                        return _pdf_sidebar.SidebarView.OUTLINE;

                    case "UseAttachments":
                        return _pdf_sidebar.SidebarView.ATTACHMENTS;

                    case "UseOC":
                }

                return _pdf_sidebar.SidebarView.NONE;
            }

            const PDFPrintServiceFactory = {
                instance: {
                    supportsPrinting: false,

                    createPrintService() {
                        throw new Error("Not implemented: createPrintService");
                    }

                }
            };
            exports.PDFPrintServiceFactory = PDFPrintServiceFactory;

            /***/ }),
        /* 2 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.isValidRotation = isValidRotation;
            exports.isValidScrollMode = isValidScrollMode;
            exports.isValidSpreadMode = isValidSpreadMode;
            exports.isPortraitOrientation = isPortraitOrientation;
            exports.clamp = clamp;
            exports.getPDFFileNameFromURL = getPDFFileNameFromURL;
            exports.noContextMenuHandler = noContextMenuHandler;
            exports.parseQueryString = parseQueryString;
            exports.backtrackBeforeAllVisibleElements = backtrackBeforeAllVisibleElements;
            exports.getVisibleElements = getVisibleElements;
            exports.roundToDivide = roundToDivide;
            exports.getPageSizeInches = getPageSizeInches;
            exports.approximateFraction = approximateFraction;
            exports.getOutputScale = getOutputScale;
            exports.scrollIntoView = scrollIntoView;
            exports.watchScroll = watchScroll;
            exports.binarySearchFirstItem = binarySearchFirstItem;
            exports.normalizeWheelEventDelta = normalizeWheelEventDelta;
            exports.waitOnEventOrTimeout = waitOnEventOrTimeout;
            exports.moveToEndOfArray = moveToEndOfArray;
            exports.WaitOnType = exports.animationStarted = exports.ProgressBar = exports.EventBus = exports.NullL10n = exports.SpreadMode = exports.ScrollMode = exports.TextLayerMode = exports.RendererType = exports.PresentationModeState = exports.VERTICAL_PADDING = exports.SCROLLBAR_PADDING = exports.MAX_AUTO_SCALE = exports.UNKNOWN_SCALE = exports.MAX_SCALE = exports.MIN_SCALE = exports.DEFAULT_SCALE = exports.DEFAULT_SCALE_VALUE = exports.CSS_UNITS = exports.AutoPrintRegExp = void 0;
            const CSS_UNITS = 96.0 / 72.0;
            exports.CSS_UNITS = CSS_UNITS;
            const DEFAULT_SCALE_VALUE = "auto";
            exports.DEFAULT_SCALE_VALUE = DEFAULT_SCALE_VALUE;
            const DEFAULT_SCALE = 1.0;
            exports.DEFAULT_SCALE = DEFAULT_SCALE;
            const MIN_SCALE = 0.1;
            exports.MIN_SCALE = MIN_SCALE;
            const MAX_SCALE = 10.0;
            exports.MAX_SCALE = MAX_SCALE;
            const UNKNOWN_SCALE = 0;
            exports.UNKNOWN_SCALE = UNKNOWN_SCALE;
            const MAX_AUTO_SCALE = 1.25;
            exports.MAX_AUTO_SCALE = MAX_AUTO_SCALE;
            const SCROLLBAR_PADDING = 40;
            exports.SCROLLBAR_PADDING = SCROLLBAR_PADDING;
            const VERTICAL_PADDING = 5;
            exports.VERTICAL_PADDING = VERTICAL_PADDING;
            const PresentationModeState = {
                UNKNOWN: 0,
                NORMAL: 1,
                CHANGING: 2,
                FULLSCREEN: 3
            };
            exports.PresentationModeState = PresentationModeState;
            const RendererType = {
                CANVAS: "canvas",
                SVG: "svg"
            };
            exports.RendererType = RendererType;
            const TextLayerMode = {
                DISABLE: 0,
                ENABLE: 1,
                ENABLE_ENHANCE: 2
            };
            exports.TextLayerMode = TextLayerMode;
            const ScrollMode = {
                UNKNOWN: -1,
                VERTICAL: 0,
                HORIZONTAL: 1,
                WRAPPED: 2
            };
            exports.ScrollMode = ScrollMode;
            const SpreadMode = {
                UNKNOWN: -1,
                NONE: 0,
                ODD: 1,
                EVEN: 2
            };
            exports.SpreadMode = SpreadMode;
            const AutoPrintRegExp = /\bprint\s*\(/;
            exports.AutoPrintRegExp = AutoPrintRegExp;

            function formatL10nValue(text, args) {
                if (!args) {
                    return text;
                }

                return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (all, name) => {
                    return name in args ? args[name] : "{{" + name + "}}";
                });
            }

            const NullL10n = {
                async getLanguage() {
                    return "en-us";
                },

                async getDirection() {
                    return "ltr";
                },

                async get(property, args, fallback) {
                    return formatL10nValue(fallback, args);
                },

                async translate(element) {}

            };
            exports.NullL10n = NullL10n;

            function getOutputScale(ctx) {
                const devicePixelRatio = window.devicePixelRatio || 1;
                const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
                const pixelRatio = devicePixelRatio / backingStoreRatio;
                return {
                    sx: pixelRatio,
                    sy: pixelRatio,
                    scaled: pixelRatio !== 1
                };
            }

            function scrollIntoView(element, spot, skipOverflowHiddenElements = false) {
                let parent = element.offsetParent;

                if (!parent) {
                    console.error("offsetParent is not set -- cannot scroll");
                    return;
                }

                let offsetY = element.offsetTop + element.clientTop;
                let offsetX = element.offsetLeft + element.clientLeft;

                while (parent.clientHeight === parent.scrollHeight && parent.clientWidth === parent.scrollWidth || skipOverflowHiddenElements && getComputedStyle(parent).overflow === "hidden") {
                    if (parent.dataset._scaleY) {
                        offsetY /= parent.dataset._scaleY;
                        offsetX /= parent.dataset._scaleX;
                    }

                    offsetY += parent.offsetTop;
                    offsetX += parent.offsetLeft;
                    parent = parent.offsetParent;

                    if (!parent) {
                        return;
                    }
                }

                if (spot) {
                    if (spot.top !== undefined) {
                        offsetY += spot.top;
                    }

                    if (spot.left !== undefined) {
                        offsetX += spot.left;
                        parent.scrollLeft = offsetX;
                    }
                }

                parent.scrollTop = offsetY;
            }

            function watchScroll(viewAreaElement, callback) {
                const debounceScroll = function (evt) {
                    if (rAF) {
                        return;
                    }

                    rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
                        rAF = null;
                        const currentX = viewAreaElement.scrollLeft;
                        const lastX = state.lastX;

                        if (currentX !== lastX) {
                            state.right = currentX > lastX;
                        }

                        state.lastX = currentX;
                        const currentY = viewAreaElement.scrollTop;
                        const lastY = state.lastY;

                        if (currentY !== lastY) {
                            state.down = currentY > lastY;
                        }

                        state.lastY = currentY;
                        callback(state);
                    });
                };

                const state = {
                    right: true,
                    down: true,
                    lastX: viewAreaElement.scrollLeft,
                    lastY: viewAreaElement.scrollTop,
                    _eventHandler: debounceScroll
                };
                let rAF = null;
                viewAreaElement.addEventListener("scroll", debounceScroll, true);
                return state;
            }

            function parseQueryString(query) {
                const parts = query.split("&");
                const params = Object.create(null);

                for (let i = 0, ii = parts.length; i < ii; ++i) {
                    const param = parts[i].split("=");
                    const key = param[0].toLowerCase();
                    const value = param.length > 1 ? param[1] : null;
                    params[decodeURIComponent(key)] = decodeURIComponent(value);
                }

                return params;
            }

            function binarySearchFirstItem(items, condition) {
                let minIndex = 0;
                let maxIndex = items.length - 1;

                if (maxIndex < 0 || !condition(items[maxIndex])) {
                    return items.length;
                }

                if (condition(items[minIndex])) {
                    return minIndex;
                }

                while (minIndex < maxIndex) {
                    const currentIndex = minIndex + maxIndex >> 1;
                    const currentItem = items[currentIndex];

                    if (condition(currentItem)) {
                        maxIndex = currentIndex;
                    } else {
                        minIndex = currentIndex + 1;
                    }
                }

                return minIndex;
            }

            function approximateFraction(x) {
                if (Math.floor(x) === x) {
                    return [x, 1];
                }

                const xinv = 1 / x;
                const limit = 8;

                if (xinv > limit) {
                    return [1, limit];
                } else if (Math.floor(xinv) === xinv) {
                    return [1, xinv];
                }

                const x_ = x > 1 ? xinv : x;
                let a = 0,
                    b = 1,
                    c = 1,
                    d = 1;

                while (true) {
                    const p = a + c,
                        q = b + d;

                    if (q > limit) {
                        break;
                    }

                    if (x_ <= p / q) {
                        c = p;
                        d = q;
                    } else {
                        a = p;
                        b = q;
                    }
                }

                let result;

                if (x_ - a / b < c / d - x_) {
                    result = x_ === x ? [a, b] : [b, a];
                } else {
                    result = x_ === x ? [c, d] : [d, c];
                }

                return result;
            }

            function roundToDivide(x, div) {
                const r = x % div;
                return r === 0 ? x : Math.round(x - r + div);
            }

            function getPageSizeInches({
                                           view,
                                           userUnit,
                                           rotate
                                       }) {
                const [x1, y1, x2, y2] = view;
                const changeOrientation = rotate % 180 !== 0;
                const width = (x2 - x1) / 72 * userUnit;
                const height = (y2 - y1) / 72 * userUnit;
                return {
                    width: changeOrientation ? height : width,
                    height: changeOrientation ? width : height
                };
            }

            function backtrackBeforeAllVisibleElements(index, views, top) {
                if (index < 2) {
                    return index;
                }

                let elt = views[index].div;
                let pageTop = elt.offsetTop + elt.clientTop;

                if (pageTop >= top) {
                    elt = views[index - 1].div;
                    pageTop = elt.offsetTop + elt.clientTop;
                }

                for (let i = index - 2; i >= 0; --i) {
                    elt = views[i].div;

                    if (elt.offsetTop + elt.clientTop + elt.clientHeight <= pageTop) {
                        break;
                    }

                    index = i;
                }

                return index;
            }

            function getVisibleElements(scrollEl, views, sortByVisibility = false, horizontal = false) {
                const top = scrollEl.scrollTop,
                    bottom = top + scrollEl.clientHeight;
                const left = scrollEl.scrollLeft,
                    right = left + scrollEl.clientWidth;

                function isElementBottomAfterViewTop(view) {
                    const element = view.div;
                    const elementBottom = element.offsetTop + element.clientTop + element.clientHeight;
                    return elementBottom > top;
                }

                function isElementRightAfterViewLeft(view) {
                    const element = view.div;
                    const elementRight = element.offsetLeft + element.clientLeft + element.clientWidth;
                    return elementRight > left;
                }

                const visible = [],
                    numViews = views.length;
                let firstVisibleElementInd = numViews === 0 ? 0 : binarySearchFirstItem(views, horizontal ? isElementRightAfterViewLeft : isElementBottomAfterViewTop);

                if (firstVisibleElementInd > 0 && firstVisibleElementInd < numViews && !horizontal) {
                    firstVisibleElementInd = backtrackBeforeAllVisibleElements(firstVisibleElementInd, views, top);
                }

                let lastEdge = horizontal ? right : -1;

                for (let i = firstVisibleElementInd; i < numViews; i++) {
                    const view = views[i],
                        element = view.div;
                    const currentWidth = element.offsetLeft + element.clientLeft;
                    const currentHeight = element.offsetTop + element.clientTop;
                    const viewWidth = element.clientWidth,
                        viewHeight = element.clientHeight;
                    const viewRight = currentWidth + viewWidth;
                    const viewBottom = currentHeight + viewHeight;

                    if (lastEdge === -1) {
                        if (viewBottom >= bottom) {
                            lastEdge = viewBottom;
                        }
                    } else if ((horizontal ? currentWidth : currentHeight) > lastEdge) {
                        break;
                    }

                    if (viewBottom <= top || currentHeight >= bottom || viewRight <= left || currentWidth >= right) {
                        continue;
                    }

                    const hiddenHeight = Math.max(0, top - currentHeight) + Math.max(0, viewBottom - bottom);
                    const hiddenWidth = Math.max(0, left - currentWidth) + Math.max(0, viewRight - right);
                    const percent = (viewHeight - hiddenHeight) * (viewWidth - hiddenWidth) * 100 / viewHeight / viewWidth | 0;
                    visible.push({
                        id: view.id,
                        x: currentWidth,
                        y: currentHeight,
                        view,
                        percent
                    });
                }

                const first = visible[0],
                    last = visible[visible.length - 1];

                if (sortByVisibility) {
                    visible.sort(function (a, b) {
                        const pc = a.percent - b.percent;

                        if (Math.abs(pc) > 0.001) {
                            return -pc;
                        }

                        return a.id - b.id;
                    });
                }

                return {
                    first,
                    last,
                    views: visible
                };
            }

            function noContextMenuHandler(evt) {
                evt.preventDefault();
            }

            function isDataSchema(url) {
                let i = 0;
                const ii = url.length;

                while (i < ii && url[i].trim() === "") {
                    i++;
                }

                return url.substring(i, i + 5).toLowerCase() === "data:";
            }

            function getPDFFileNameFromURL(url, defaultFilename = "document.pdf") {
                if (typeof url !== "string") {
                    return defaultFilename;
                }

                if (isDataSchema(url)) {
                    console.warn("getPDFFileNameFromURL: " + 'ignoring "data:" URL for performance reasons.');
                    return defaultFilename;
                }

                const reURI = /^(?:(?:[^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
                const reFilename = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
                const splitURI = reURI.exec(url);
                let suggestedFilename = reFilename.exec(splitURI[1]) || reFilename.exec(splitURI[2]) || reFilename.exec(splitURI[3]);

                if (suggestedFilename) {
                    suggestedFilename = suggestedFilename[0];

                    if (suggestedFilename.includes("%")) {
                        try {
                            suggestedFilename = reFilename.exec(decodeURIComponent(suggestedFilename))[0];
                        } catch (ex) {}
                    }
                }

                return suggestedFilename || defaultFilename;
            }

            function normalizeWheelEventDelta(evt) {
                let delta = Math.sqrt(evt.deltaX * evt.deltaX + evt.deltaY * evt.deltaY);
                const angle = Math.atan2(evt.deltaY, evt.deltaX);

                if (-0.25 * Math.PI < angle && angle < 0.75 * Math.PI) {
                    delta = -delta;
                }

                const MOUSE_DOM_DELTA_PIXEL_MODE = 0;
                const MOUSE_DOM_DELTA_LINE_MODE = 1;
                const MOUSE_PIXELS_PER_LINE = 30;
                const MOUSE_LINES_PER_PAGE = 30;

                if (evt.deltaMode === MOUSE_DOM_DELTA_PIXEL_MODE) {
                    delta /= MOUSE_PIXELS_PER_LINE * MOUSE_LINES_PER_PAGE;
                } else if (evt.deltaMode === MOUSE_DOM_DELTA_LINE_MODE) {
                    delta /= MOUSE_LINES_PER_PAGE;
                }

                return delta;
            }

            function isValidRotation(angle) {
                return Number.isInteger(angle) && angle % 90 === 0;
            }

            function isValidScrollMode(mode) {
                return Number.isInteger(mode) && Object.values(ScrollMode).includes(mode) && mode !== ScrollMode.UNKNOWN;
            }

            function isValidSpreadMode(mode) {
                return Number.isInteger(mode) && Object.values(SpreadMode).includes(mode) && mode !== SpreadMode.UNKNOWN;
            }

            function isPortraitOrientation(size) {
                return size.width <= size.height;
            }

            const WaitOnType = {
                EVENT: "event",
                TIMEOUT: "timeout"
            };
            exports.WaitOnType = WaitOnType;

            function waitOnEventOrTimeout({
                                              target,
                                              name,
                                              delay = 0
                                          }) {
                return new Promise(function (resolve, reject) {
                    if (typeof target !== "object" || !(name && typeof name === "string") || !(Number.isInteger(delay) && delay >= 0)) {
                        throw new Error("waitOnEventOrTimeout - invalid parameters.");
                    }

                    function handler(type) {
                        if (target instanceof EventBus) {
                            target._off(name, eventHandler);
                        } else {
                            target.removeEventListener(name, eventHandler);
                        }

                        if (timeout) {
                            clearTimeout(timeout);
                        }

                        resolve(type);
                    }

                    const eventHandler = handler.bind(null, WaitOnType.EVENT);

                    if (target instanceof EventBus) {
                        target._on(name, eventHandler);
                    } else {
                        target.addEventListener(name, eventHandler);
                    }

                    const timeoutHandler = handler.bind(null, WaitOnType.TIMEOUT);
                    const timeout = setTimeout(timeoutHandler, delay);
                });
            }

            const animationStarted = new Promise(function (resolve) {
                window.requestAnimationFrame(resolve);
            });
            exports.animationStarted = animationStarted;

            function dispatchDOMEvent(eventName, args = null) {
                const details = Object.create(null);

                if (args && args.length > 0) {
                    const obj = args[0];

                    for (const key in obj) {
                        const value = obj[key];

                        if (key === "source") {
                            if (value === window || value === document) {
                                return;
                            }

                            continue;
                        }

                        details[key] = value;
                    }
                }

                const event = document.createEvent("CustomEvent");
                event.initCustomEvent(eventName, true, true, details);
                document.dispatchEvent(event);
            }

            class EventBus {
                constructor(options) {
                    this._listeners = Object.create(null);
                    this._isInAutomation = (options && options.isInAutomation) === true;
                }

                on(eventName, listener) {
                    this._on(eventName, listener, {
                        external: true
                    });
                }

                off(eventName, listener) {
                    this._off(eventName, listener, {
                        external: true
                    });
                }

                dispatch(eventName) {
                    const eventListeners = this._listeners[eventName];

                    if (!eventListeners || eventListeners.length === 0) {
                        if (this._isInAutomation) {
                            const args = Array.prototype.slice.call(arguments, 1);
                            dispatchDOMEvent(eventName, args);
                        }

                        return;
                    }

                    const args = Array.prototype.slice.call(arguments, 1);
                    let externalListeners;
                    eventListeners.slice(0).forEach(function ({
                                                                  listener,
                                                                  external
                                                              }) {
                        if (external) {
                            if (!externalListeners) {
                                externalListeners = [];
                            }

                            externalListeners.push(listener);
                            return;
                        }

                        listener.apply(null, args);
                    });

                    if (externalListeners) {
                        externalListeners.forEach(function (listener) {
                            listener.apply(null, args);
                        });
                        externalListeners = null;
                    }

                    if (this._isInAutomation) {
                        dispatchDOMEvent(eventName, args);
                    }
                }

                _on(eventName, listener, options = null) {
                    let eventListeners = this._listeners[eventName];

                    if (!eventListeners) {
                        this._listeners[eventName] = eventListeners = [];
                    }

                    eventListeners.push({
                        listener,
                        external: (options && options.external) === true
                    });
                }

                _off(eventName, listener, options = null) {
                    const eventListeners = this._listeners[eventName];

                    if (!eventListeners) {
                        return;
                    }

                    for (let i = 0, ii = eventListeners.length; i < ii; i++) {
                        if (eventListeners[i].listener === listener) {
                            eventListeners.splice(i, 1);
                            return;
                        }
                    }
                }

            }

            exports.EventBus = EventBus;

            function clamp(v, min, max) {
                return Math.min(Math.max(v, min), max);
            }

            class ProgressBar {
                constructor(id, {
                    height,
                    width,
                    units
                } = {}) {
                    this.visible = true;
                    this.div = document.querySelector(id + " .progress");
                    this.bar = this.div.parentNode;
                    this.height = height || 100;
                    this.width = width || 100;
                    this.units = units || "%";
                    this.div.style.height = this.height + this.units;
                    this.percent = 0;
                }

                _updateBar() {
                    if (this._indeterminate) {
                        this.div.classList.add("indeterminate");
                        this.div.style.width = this.width + this.units;
                        return;
                    }

                    this.div.classList.remove("indeterminate");
                    const progressSize = this.width * this._percent / 100;
                    this.div.style.width = progressSize + this.units;
                }

                get percent() {
                    return this._percent;
                }

                set percent(val) {
                    this._indeterminate = isNaN(val);
                    this._percent = clamp(val, 0, 100);

                    this._updateBar();
                }

                setWidth(viewer) {
                    if (!viewer) {
                        return;
                    }

                    const container = viewer.parentNode;
                    const scrollbarWidth = container.offsetWidth - viewer.offsetWidth;

                    if (scrollbarWidth > 0) {
                        this.bar.style.width = `calc(100% - ${scrollbarWidth}px)`;
                    }
                }

                hide() {
                    if (!this.visible) {
                        return;
                    }

                    this.visible = false;
                    this.bar.classList.add("hidden");
                    document.body.classList.remove("loadingInProgress");
                }

                show() {
                    if (this.visible) {
                        return;
                    }

                    this.visible = true;
                    document.body.classList.add("loadingInProgress");
                    this.bar.classList.remove("hidden");
                }

            }

            exports.ProgressBar = ProgressBar;

            function moveToEndOfArray(arr, condition) {
                const moved = [],
                    len = arr.length;
                let write = 0;

                for (let read = 0; read < len; ++read) {
                    if (condition(arr[read])) {
                        moved.push(arr[read]);
                    } else {
                        arr[write] = arr[read];
                        ++write;
                    }
                }

                for (let read = 0; write < len; ++read, ++write) {
                    arr[write] = moved[read];
                }
            }

            /***/ }),
        /* 5 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.viewerCompatibilityParams = void 0;
            const compatibilityParams = Object.create(null);
            ;
            const viewerCompatibilityParams = Object.freeze(compatibilityParams);
            exports.viewerCompatibilityParams = viewerCompatibilityParams;

            /***/ }),
        /* 9 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.PDFSidebar = exports.SidebarView = void 0;

            var _ui_utils = __webpack_require__(2);

            var _pdf_rendering_queue = __webpack_require__(8);

            const UI_NOTIFICATION_CLASS = "pdfSidebarNotification";
            const SidebarView = {
                UNKNOWN: -1,
                NONE: 0,
                THUMBS: 1,
                OUTLINE: 2,
                ATTACHMENTS: 3,
                LAYERS: 4
            };
            exports.SidebarView = SidebarView;

            class PDFSidebar {
                constructor({
                                elements,
                                pdfViewer,
                                pdfThumbnailViewer,
                                eventBus,
                                l10n = _ui_utils.NullL10n,
                                disableNotification = false
                            }) {
                    this.isOpen = false;
                    this.active = SidebarView.THUMBS;
                    this.isInitialViewSet = false;
                    this.onToggled = null;
                    this.pdfViewer = pdfViewer;
                    this.pdfThumbnailViewer = pdfThumbnailViewer;
                    this.outerContainer = elements.outerContainer;
                    this.viewerContainer = elements.viewerContainer;
                    this.toggleButton = elements.toggleButton;
                    this.thumbnailButton = elements.thumbnailButton;
                    this.outlineButton = elements.outlineButton;
                    this.attachmentsButton = elements.attachmentsButton;
                    this.thumbnailView = elements.thumbnailView;
                    this.outlineView = elements.outlineView;
                    this.attachmentsView = elements.attachmentsView;
                    this.eventBus = eventBus;
                    this.l10n = l10n;
                    this._disableNotification = disableNotification;

                    this._addEventListeners();
                }

                reset() {
                    this.isInitialViewSet = false;

                    this._hideUINotification(null);

                    this.switchView(SidebarView.THUMBS);
                    this.outlineButton.disabled = false;
                    this.attachmentsButton.disabled = false;
                }

                get visibleView() {
                    return this.isOpen ? this.active : SidebarView.NONE;
                }

                get isThumbnailViewVisible() {
                    return this.isOpen && this.active === SidebarView.THUMBS;
                }

                get isOutlineViewVisible() {
                    return this.isOpen && this.active === SidebarView.OUTLINE;
                }

                get isAttachmentsViewVisible() {
                    return this.isOpen && this.active === SidebarView.ATTACHMENTS;
                }

                setInitialView(view = SidebarView.NONE) {
                    if (this.isInitialViewSet) {
                        return;
                    }

                    this.isInitialViewSet = true;

                    if (view === SidebarView.NONE || view === SidebarView.UNKNOWN) {
                        this._dispatchEvent();

                        return;
                    }

                    if (!this._switchView(view, true)) {
                        this._dispatchEvent();
                    }
                }

                switchView(view, forceOpen = false) {
                    this._switchView(view, forceOpen);
                }

                _switchView(view, forceOpen = false) {
                    const isViewChanged = view !== this.active;
                    let shouldForceRendering = false;

                    switch (view) {
                        case SidebarView.NONE:
                            if (this.isOpen) {
                                this.close();
                                return true;
                            }

                            return false;

                        case SidebarView.THUMBS:
                            if (this.isOpen && isViewChanged) {
                                shouldForceRendering = true;
                            }

                            break;

                        case SidebarView.OUTLINE:
                            if (this.outlineButton.disabled) {
                                return false;
                            }

                            break;

                        case SidebarView.ATTACHMENTS:
                            if (this.attachmentsButton.disabled) {
                                return false;
                            }

                            break;

                        default:
                            console.error(`PDFSidebar._switchView: "${view}" is not a valid view.`);
                            return false;
                    }

                    this.active = view;
                    this.thumbnailButton.classList.toggle("toggled", view === SidebarView.THUMBS);
                    this.outlineButton.classList.toggle("toggled", view === SidebarView.OUTLINE);
                    this.attachmentsButton.classList.toggle("toggled", view === SidebarView.ATTACHMENTS);
                    this.thumbnailView.classList.toggle("hidden", view !== SidebarView.THUMBS);
                    this.outlineView.classList.toggle("hidden", view !== SidebarView.OUTLINE);
                    this.attachmentsView.classList.toggle("hidden", view !== SidebarView.ATTACHMENTS);

                    if (forceOpen && !this.isOpen) {
                        this.open();
                        return true;
                    }

                    if (shouldForceRendering) {
                        this._updateThumbnailViewer();

                        this._forceRendering();
                    }

                    if (isViewChanged) {
                        this._dispatchEvent();
                    }

                    this._hideUINotification(this.active);

                    return isViewChanged;
                }

                open() {
                    if (this.isOpen) {
                        return;
                    }

                    this.isOpen = true;
                    this.toggleButton.classList.add("toggled");
                    this.outerContainer.classList.add("sidebarMoving", "sidebarOpen");

                    if (this.active === SidebarView.THUMBS) {
                        this._updateThumbnailViewer();
                    }

                    this._forceRendering();

                    this._dispatchEvent();

                    this._hideUINotification(this.active);
                }

                close() {
                    if (!this.isOpen) {
                        return;
                    }

                    this.isOpen = false;
                    this.toggleButton.classList.remove("toggled");
                    this.outerContainer.classList.add("sidebarMoving");
                    this.outerContainer.classList.remove("sidebarOpen");

                    this._forceRendering();

                    this._dispatchEvent();
                }

                toggle() {
                    if (this.isOpen) {
                        this.close();
                    } else {
                        this.open();
                    }
                }

                _dispatchEvent() {
                    this.eventBus.dispatch("sidebarviewchanged", {
                        source: this,
                        view: this.visibleView
                    });
                }

                _forceRendering() {
                    if (this.onToggled) {
                        this.onToggled();
                    } else {
                        this.pdfViewer.forceRendering();
                        this.pdfThumbnailViewer.forceRendering();
                    }
                }

                _updateThumbnailViewer() {
                    const {
                        pdfViewer,
                        pdfThumbnailViewer
                    } = this;
                    const pagesCount = pdfViewer.pagesCount;

                    for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
                        const pageView = pdfViewer.getPageView(pageIndex);

                        if (pageView && pageView.renderingState === _pdf_rendering_queue.RenderingStates.FINISHED) {
                            const thumbnailView = pdfThumbnailViewer.getThumbnail(pageIndex);
                            thumbnailView.setImage(pageView);
                        }
                    }

                    pdfThumbnailViewer.scrollThumbnailIntoView(pdfViewer.currentPageNumber);
                }

                _showUINotification(view) {
                    if (this._disableNotification) {
                        return;
                    }

                    this.l10n.get("toggle_sidebar_notification.title", null, "Toggle Sidebar (document contains outline/attachments)").then(msg => {
                        this.toggleButton.title = msg;
                    });

                    if (!this.isOpen) {
                        this.toggleButton.classList.add(UI_NOTIFICATION_CLASS);
                    } else if (view === this.active) {
                        return;
                    }

                    switch (view) {
                        case SidebarView.OUTLINE:
                            this.outlineButton.classList.add(UI_NOTIFICATION_CLASS);
                            break;

                        case SidebarView.ATTACHMENTS:
                            this.attachmentsButton.classList.add(UI_NOTIFICATION_CLASS);
                            break;
                    }
                }

                _hideUINotification(view) {
                    if (this._disableNotification) {
                        return;
                    }

                    const removeNotification = sidebarView => {
                        switch (sidebarView) {
                            case SidebarView.OUTLINE:
                                this.outlineButton.classList.remove(UI_NOTIFICATION_CLASS);
                                break;

                            case SidebarView.ATTACHMENTS:
                                this.attachmentsButton.classList.remove(UI_NOTIFICATION_CLASS);
                                break;
                        }
                    };

                    if (!this.isOpen && view !== null) {
                        return;
                    }

                    this.toggleButton.classList.remove(UI_NOTIFICATION_CLASS);

                    if (view !== null) {
                        removeNotification(view);
                        return;
                    }

                    for (view in SidebarView) {
                        removeNotification(SidebarView[view]);
                    }

                    this.l10n.get("toggle_sidebar.title", null, "Toggle Sidebar").then(msg => {
                        this.toggleButton.title = msg;
                    });
                }

                _addEventListeners() {
                    this.viewerContainer.addEventListener("transitionend", evt => {
                        if (evt.target === this.viewerContainer) {
                            this.outerContainer.classList.remove("sidebarMoving");
                        }
                    });
                    this.toggleButton.addEventListener("click", () => {
                        this.toggle();
                    });
                    this.thumbnailButton.addEventListener("click", () => {
                        this.switchView(SidebarView.THUMBS);
                    });
                    this.outlineButton.addEventListener("click", () => {
                        this.switchView(SidebarView.OUTLINE);
                    });
                    this.outlineButton.addEventListener("dblclick", () => {
                        this.eventBus.dispatch("toggleoutlinetree", {
                            source: this
                        });
                    });
                    this.attachmentsButton.addEventListener("click", () => {
                        this.switchView(SidebarView.ATTACHMENTS);
                    });

                    this.eventBus._on("outlineloaded", evt => {
                        const outlineCount = evt.outlineCount;
                        this.outlineButton.disabled = !outlineCount;

                        if (outlineCount) {
                            this._showUINotification(SidebarView.OUTLINE);
                        } else if (this.active === SidebarView.OUTLINE) {
                            this.switchView(SidebarView.THUMBS);
                        }
                    });

                    this.eventBus._on("attachmentsloaded", evt => {
                        if (evt.attachmentsCount) {
                            this.attachmentsButton.disabled = false;

                            this._showUINotification(SidebarView.ATTACHMENTS);

                            return;
                        }

                        Promise.resolve().then(() => {
                            if (this.attachmentsView.hasChildNodes()) {
                                return;
                            }

                            this.attachmentsButton.disabled = true;

                            if (this.active === SidebarView.ATTACHMENTS) {
                                this.switchView(SidebarView.THUMBS);
                            }
                        });
                    });

                    this.eventBus._on("presentationmodechanged", evt => {
                        if (!evt.active && !evt.switchInProgress && this.isThumbnailViewVisible) {
                            this._updateThumbnailViewer();
                        }
                    });
                }

            }

            exports.PDFSidebar = PDFSidebar;

            /***/ }),
        /* 17 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.isDestHashesEqual = isDestHashesEqual;
            exports.isDestArraysEqual = isDestArraysEqual;
            exports.PDFHistory = void 0;

            var _ui_utils = __webpack_require__(2);

            const HASH_CHANGE_TIMEOUT = 1000;
            const POSITION_UPDATED_THRESHOLD = 50;
            const UPDATE_VIEWAREA_TIMEOUT = 1000;

            function getCurrentHash() {
                return document.location.hash;
            }

            class PDFHistory {
                constructor({
                                linkService,
                                eventBus
                            }) {
                    this.linkService = linkService;
                    this.eventBus = eventBus;
                    this._initialized = false;
                    this._fingerprint = "";
                    this.reset();
                    this._boundEvents = null;
                    this._isViewerInPresentationMode = false;

                    this.eventBus._on("presentationmodechanged", evt => {
                        this._isViewerInPresentationMode = evt.active || evt.switchInProgress;
                    });

                    this.eventBus._on("pagesinit", () => {
                        this._isPagesLoaded = false;

                        const onPagesLoaded = evt => {
                            this.eventBus._off("pagesloaded", onPagesLoaded);

                            this._isPagesLoaded = !!evt.pagesCount;
                        };

                        this.eventBus._on("pagesloaded", onPagesLoaded);
                    });
                }

                initialize({
                               fingerprint,
                               resetHistory = false,
                               updateUrl = false
                           }) {
                    if (!fingerprint || typeof fingerprint !== "string") {
                        console.error('PDFHistory.initialize: The "fingerprint" must be a non-empty string.');
                        return;
                    }

                    if (this._initialized) {
                        this.reset();
                    }

                    const reInitialized = this._fingerprint !== "" && this._fingerprint !== fingerprint;
                    this._fingerprint = fingerprint;
                    this._updateUrl = updateUrl === true;
                    this._initialized = true;

                    this._bindEvents();

                    const state = window.history.state;
                    this._popStateInProgress = false;
                    this._blockHashChange = 0;
                    this._currentHash = getCurrentHash();
                    this._numPositionUpdates = 0;
                    this._uid = this._maxUid = 0;
                    this._destination = null;
                    this._position = null;

                    if (!this._isValidState(state, true) || resetHistory) {
                        const {
                            hash,
                            page,
                            rotation
                        } = this._parseCurrentHash(true);

                        if (!hash || reInitialized || resetHistory) {
                            this._pushOrReplaceState(null, true);

                            return;
                        }

                        this._pushOrReplaceState({
                            hash,
                            page,
                            rotation
                        }, true);

                        return;
                    }

                    const destination = state.destination;

                    this._updateInternalState(destination, state.uid, true);

                    if (this._uid > this._maxUid) {
                        this._maxUid = this._uid;
                    }

                    if (destination.rotation !== undefined) {
                        this._initialRotation = destination.rotation;
                    }

                    if (destination.dest) {
                        this._initialBookmark = JSON.stringify(destination.dest);
                        this._destination.page = null;
                    } else if (destination.hash) {
                        this._initialBookmark = destination.hash;
                    } else if (destination.page) {
                        this._initialBookmark = `page=${destination.page}`;
                    }
                }

                reset() {
                    if (this._initialized) {
                        this._pageHide();

                        this._initialized = false;

                        this._unbindEvents();
                    }

                    if (this._updateViewareaTimeout) {
                        clearTimeout(this._updateViewareaTimeout);
                        this._updateViewareaTimeout = null;
                    }

                    this._initialBookmark = null;
                    this._initialRotation = null;
                }

                push({
                         namedDest = null,
                         explicitDest,
                         pageNumber
                     }) {
                    if (!this._initialized) {
                        return;
                    }

                    if (namedDest && typeof namedDest !== "string") {
                        console.error("PDFHistory.push: " + `"${namedDest}" is not a valid namedDest parameter.`);
                        return;
                    } else if (!Array.isArray(explicitDest)) {
                        console.error("PDFHistory.push: " + `"${explicitDest}" is not a valid explicitDest parameter.`);
                        return;
                    } else if (!(Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= this.linkService.pagesCount)) {
                        if (pageNumber !== null || this._destination) {
                            console.error("PDFHistory.push: " + `"${pageNumber}" is not a valid pageNumber parameter.`);
                            return;
                        }
                    }

                    const hash = namedDest || JSON.stringify(explicitDest);

                    if (!hash) {
                        return;
                    }

                    let forceReplace = false;

                    if (this._destination && (isDestHashesEqual(this._destination.hash, hash) || isDestArraysEqual(this._destination.dest, explicitDest))) {
                        if (this._destination.page) {
                            return;
                        }

                        forceReplace = true;
                    }

                    if (this._popStateInProgress && !forceReplace) {
                        return;
                    }

                    this._pushOrReplaceState({
                        dest: explicitDest,
                        hash,
                        page: pageNumber,
                        rotation: this.linkService.rotation
                    }, forceReplace);

                    if (!this._popStateInProgress) {
                        this._popStateInProgress = true;
                        Promise.resolve().then(() => {
                            this._popStateInProgress = false;
                        });
                    }
                }

                pushCurrentPosition() {
                    if (!this._initialized || this._popStateInProgress) {
                        return;
                    }

                    this._tryPushCurrentPosition();
                }

                back() {
                    if (!this._initialized || this._popStateInProgress) {
                        return;
                    }

                    const state = window.history.state;

                    if (this._isValidState(state) && state.uid > 0) {
                        window.history.back();
                    }
                }

                forward() {
                    if (!this._initialized || this._popStateInProgress) {
                        return;
                    }

                    const state = window.history.state;

                    if (this._isValidState(state) && state.uid < this._maxUid) {
                        window.history.forward();
                    }
                }

                get popStateInProgress() {
                    return this._initialized && (this._popStateInProgress || this._blockHashChange > 0);
                }

                get initialBookmark() {
                    return this._initialized ? this._initialBookmark : null;
                }

                get initialRotation() {
                    return this._initialized ? this._initialRotation : null;
                }

                _pushOrReplaceState(destination, forceReplace = false) {
                    const shouldReplace = forceReplace || !this._destination;
                    const newState = {
                        fingerprint: this._fingerprint,
                        uid: shouldReplace ? this._uid : this._uid + 1,
                        destination
                    };

                    this._updateInternalState(destination, newState.uid);

                    let newUrl;

                    if (this._updateUrl && destination && destination.hash) {
                        const baseUrl = document.location.href.split("#")[0];

                        if (!baseUrl.startsWith("file://")) {
                            newUrl = `${baseUrl}#${destination.hash}`;
                        }
                    }

                    if (shouldReplace) {
                        window.history.replaceState(newState, "", newUrl);
                    } else {
                        this._maxUid = this._uid;
                        window.history.pushState(newState, "", newUrl);
                    }
                }

                _tryPushCurrentPosition(temporary = false) {
                    if (!this._position) {
                        return;
                    }

                    let position = this._position;

                    if (temporary) {
                        position = Object.assign(Object.create(null), this._position);
                        position.temporary = true;
                    }

                    if (!this._destination) {
                        this._pushOrReplaceState(position);

                        return;
                    }

                    if (this._destination.temporary) {
                        this._pushOrReplaceState(position, true);

                        return;
                    }

                    if (this._destination.hash === position.hash) {
                        return;
                    }

                    if (!this._destination.page && (POSITION_UPDATED_THRESHOLD <= 0 || this._numPositionUpdates <= POSITION_UPDATED_THRESHOLD)) {
                        return;
                    }

                    let forceReplace = false;

                    if (this._destination.page >= position.first && this._destination.page <= position.page) {
                        if (this._destination.dest || !this._destination.first) {
                            return;
                        }

                        forceReplace = true;
                    }

                    this._pushOrReplaceState(position, forceReplace);
                }

                _isValidState(state, checkReload = false) {
                    if (!state) {
                        return false;
                    }

                    if (state.fingerprint !== this._fingerprint) {
                        if (checkReload) {
                            if (typeof state.fingerprint !== "string" || state.fingerprint.length !== this._fingerprint.length) {
                                return false;
                            }

                            const [perfEntry] = performance.getEntriesByType("navigation");

                            if (!perfEntry || perfEntry.type !== "reload") {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }

                    if (!Number.isInteger(state.uid) || state.uid < 0) {
                        return false;
                    }

                    if (state.destination === null || typeof state.destination !== "object") {
                        return false;
                    }

                    return true;
                }

                _updateInternalState(destination, uid, removeTemporary = false) {
                    if (this._updateViewareaTimeout) {
                        clearTimeout(this._updateViewareaTimeout);
                        this._updateViewareaTimeout = null;
                    }

                    if (removeTemporary && destination && destination.temporary) {
                        delete destination.temporary;
                    }

                    this._destination = destination;
                    this._uid = uid;
                    this._numPositionUpdates = 0;
                }

                _parseCurrentHash(checkNameddest = false) {
                    const hash = unescape(getCurrentHash()).substring(1);
                    const params = (0, _ui_utils.parseQueryString)(hash);
                    const nameddest = params.nameddest || "";
                    let page = params.page | 0;

                    if (!(Number.isInteger(page) && page > 0 && page <= this.linkService.pagesCount) || checkNameddest && nameddest.length > 0) {
                        page = null;
                    }

                    return {
                        hash,
                        page,
                        rotation: this.linkService.rotation
                    };
                }

                _updateViewarea({
                                    location
                                }) {
                    if (this._updateViewareaTimeout) {
                        clearTimeout(this._updateViewareaTimeout);
                        this._updateViewareaTimeout = null;
                    }

                    this._position = {
                        hash: this._isViewerInPresentationMode ? `page=${location.pageNumber}` : location.pdfOpenParams.substring(1),
                        page: this.linkService.page,
                        first: location.pageNumber,
                        rotation: location.rotation
                    };

                    if (this._popStateInProgress) {
                        return;
                    }

                    if (POSITION_UPDATED_THRESHOLD > 0 && this._isPagesLoaded && this._destination && !this._destination.page) {
                        this._numPositionUpdates++;
                    }

                    if (UPDATE_VIEWAREA_TIMEOUT > 0) {
                        this._updateViewareaTimeout = setTimeout(() => {
                            if (!this._popStateInProgress) {
                                this._tryPushCurrentPosition(true);
                            }

                            this._updateViewareaTimeout = null;
                        }, UPDATE_VIEWAREA_TIMEOUT);
                    }
                }

                _popState({
                              state
                          }) {
                    const newHash = getCurrentHash(),
                        hashChanged = this._currentHash !== newHash;
                    this._currentHash = newHash;

                    if (!state) {
                        this._uid++;

                        const {
                            hash,
                            page,
                            rotation
                        } = this._parseCurrentHash();

                        this._pushOrReplaceState({
                            hash,
                            page,
                            rotation
                        }, true);

                        return;
                    }

                    if (!this._isValidState(state)) {
                        return;
                    }

                    this._popStateInProgress = true;

                    if (hashChanged) {
                        this._blockHashChange++;
                        (0, _ui_utils.waitOnEventOrTimeout)({
                            target: window,
                            name: "hashchange",
                            delay: HASH_CHANGE_TIMEOUT
                        }).then(() => {
                            this._blockHashChange--;
                        });
                    }

                    const destination = state.destination;

                    this._updateInternalState(destination, state.uid, true);

                    if (this._uid > this._maxUid) {
                        this._maxUid = this._uid;
                    }

                    if ((0, _ui_utils.isValidRotation)(destination.rotation)) {
                        this.linkService.rotation = destination.rotation;
                    }

                    if (destination.dest) {
                        this.linkService.navigateTo(destination.dest);
                    } else if (destination.hash) {
                        this.linkService.setHash(destination.hash);
                    } else if (destination.page) {
                        this.linkService.page = destination.page;
                    }

                    Promise.resolve().then(() => {
                        this._popStateInProgress = false;
                    });
                }

                _pageHide() {
                    if (!this._destination || this._destination.temporary) {
                        this._tryPushCurrentPosition();
                    }
                }

                _bindEvents() {
                    if (this._boundEvents) {
                        return;
                    }

                    this._boundEvents = {
                        updateViewarea: this._updateViewarea.bind(this),
                        popState: this._popState.bind(this),
                        pageHide: this._pageHide.bind(this)
                    };

                    this.eventBus._on("updateviewarea", this._boundEvents.updateViewarea);

                    window.addEventListener("popstate", this._boundEvents.popState);
                    window.addEventListener("pagehide", this._boundEvents.pageHide);
                }

                _unbindEvents() {
                    if (!this._boundEvents) {
                        return;
                    }

                    this.eventBus._off("updateviewarea", this._boundEvents.updateViewarea);

                    window.removeEventListener("popstate", this._boundEvents.popState);
                    window.removeEventListener("pagehide", this._boundEvents.pageHide);
                    this._boundEvents = null;
                }

            }

            exports.PDFHistory = PDFHistory;

            function isDestHashesEqual(destHash, pushHash) {
                if (typeof destHash !== "string" || typeof pushHash !== "string") {
                    return false;
                }

                if (destHash === pushHash) {
                    return true;
                }

                const {
                    nameddest
                } = (0, _ui_utils.parseQueryString)(destHash);

                if (nameddest === pushHash) {
                    return true;
                }

                return false;
            }

            function isDestArraysEqual(firstDest, secondDest) {
                function isEntryEqual(first, second) {
                    if (typeof first !== typeof second) {
                        return false;
                    }

                    if (Array.isArray(first) || Array.isArray(second)) {
                        return false;
                    }

                    if (first !== null && typeof first === "object" && second !== null) {
                        if (Object.keys(first).length !== Object.keys(second).length) {
                            return false;
                        }

                        for (const key in first) {
                            if (!isEntryEqual(first[key], second[key])) {
                                return false;
                            }
                        }

                        return true;
                    }

                    return first === second || Number.isNaN(first) && Number.isNaN(second);
                }

                if (!(Array.isArray(firstDest) && Array.isArray(secondDest))) {
                    return false;
                }

                if (firstDest.length !== secondDest.length) {
                    return false;
                }

                for (let i = 0, ii = firstDest.length; i < ii; i++) {
                    if (!isEntryEqual(firstDest[i], secondDest[i])) {
                        return false;
                    }
                }

                return true;
            }

            /***/ }),
        /* 23 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.PDFThumbnailView = void 0;

            var _pdfjsLib = __webpack_require__(4);

            var _ui_utils = __webpack_require__(2);

            var _pdf_rendering_queue = __webpack_require__(8);

            const MAX_NUM_SCALING_STEPS = 3;
            const THUMBNAIL_CANVAS_BORDER_WIDTH = 1;
            const THUMBNAIL_WIDTH = 98;

            const TempImageFactory = function TempImageFactoryClosure() {
                let tempCanvasCache = null;
                return {
                    getCanvas(width, height) {
                        let tempCanvas = tempCanvasCache;

                        if (!tempCanvas) {
                            tempCanvas = document.createElement("canvas");
                            tempCanvasCache = tempCanvas;
                        }

                        tempCanvas.width = width;
                        tempCanvas.height = height;
                        tempCanvas.mozOpaque = true;
                        const ctx = tempCanvas.getContext("2d", {
                            alpha: false
                        });
                        ctx.save();
                        ctx.fillStyle = "rgb(255, 255, 255)";
                        ctx.fillRect(0, 0, width, height);
                        ctx.restore();
                        return tempCanvas;
                    },

                    destroyCanvas() {
                        const tempCanvas = tempCanvasCache;

                        if (tempCanvas) {
                            tempCanvas.width = 0;
                            tempCanvas.height = 0;
                        }

                        tempCanvasCache = null;
                    }

                };
            }();

            class PDFThumbnailView {
                constructor({
                                container,
                                id,
                                defaultViewport,
                                linkService,
                                renderingQueue,
                                disableCanvasToImageConversion = false,
                                l10n = _ui_utils.NullL10n
                            }) {
                    this.id = id;
                    this.renderingId = "thumbnail" + id;
                    this.pageLabel = null;
                    this.pdfPage = null;
                    this.rotation = 0;
                    this.viewport = defaultViewport;
                    this.pdfPageRotate = defaultViewport.rotation;
                    this.linkService = linkService;
                    this.renderingQueue = renderingQueue;
                    this.renderTask = null;
                    this.renderingState = _pdf_rendering_queue.RenderingStates.INITIAL;
                    this.resume = null;
                    this.disableCanvasToImageConversion = disableCanvasToImageConversion;
                    this.pageWidth = this.viewport.width;
                    this.pageHeight = this.viewport.height;
                    this.pageRatio = this.pageWidth / this.pageHeight;
                    this.canvasWidth = THUMBNAIL_WIDTH;
                    this.canvasHeight = this.canvasWidth / this.pageRatio | 0;
                    this.scale = this.canvasWidth / this.pageWidth;
                    this.l10n = l10n;
                    const anchor = document.createElement("a");
                    anchor.href = linkService.getAnchorUrl("#page=" + id);

                    this._thumbPageTitle.then(msg => {
                        anchor.title = msg;
                    });

                    anchor.onclick = function () {
                        linkService.page = id;
                        return false;
                    };

                    this.anchor = anchor;
                    const div = document.createElement("div");
                    div.className = "thumbnail";
                    div.setAttribute("data-page-number", this.id);
                    this.div = div;
                    const ring = document.createElement("div");
                    ring.className = "thumbnailSelectionRing";
                    const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
                    ring.style.width = this.canvasWidth + borderAdjustment + "px";
                    ring.style.height = this.canvasHeight + borderAdjustment + "px";
                    this.ring = ring;
                    div.appendChild(ring);
                    anchor.appendChild(div);
                    container.appendChild(anchor);
                }

                setPdfPage(pdfPage) {
                    this.pdfPage = pdfPage;
                    this.pdfPageRotate = pdfPage.rotate;
                    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = pdfPage.getViewport({
                        scale: 1,
                        rotation: totalRotation
                    });
                    this.reset();
                }

                reset() {
                    this.cancelRendering();
                    this.renderingState = _pdf_rendering_queue.RenderingStates.INITIAL;
                    this.pageWidth = this.viewport.width;
                    this.pageHeight = this.viewport.height;
                    this.pageRatio = this.pageWidth / this.pageHeight;
                    this.canvasHeight = this.canvasWidth / this.pageRatio | 0;
                    this.scale = this.canvasWidth / this.pageWidth;
                    this.div.removeAttribute("data-loaded");
                    const ring = this.ring;
                    const childNodes = ring.childNodes;

                    for (let i = childNodes.length - 1; i >= 0; i--) {
                        ring.removeChild(childNodes[i]);
                    }

                    const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
                    ring.style.width = this.canvasWidth + borderAdjustment + "px";
                    ring.style.height = this.canvasHeight + borderAdjustment + "px";

                    if (this.canvas) {
                        this.canvas.width = 0;
                        this.canvas.height = 0;
                        delete this.canvas;
                    }

                    if (this.image) {
                        this.image.removeAttribute("src");
                        delete this.image;
                    }
                }

                update(rotation) {
                    if (typeof rotation !== "undefined") {
                        this.rotation = rotation;
                    }

                    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = this.viewport.clone({
                        scale: 1,
                        rotation: totalRotation
                    });
                    this.reset();
                }

                cancelRendering() {
                    if (this.renderTask) {
                        this.renderTask.cancel();
                        this.renderTask = null;
                    }

                    this.resume = null;
                }

                _getPageDrawContext(noCtxScale = false) {
                    const canvas = document.createElement("canvas");
                    this.canvas = canvas;
                    canvas.mozOpaque = true;
                    const ctx = canvas.getContext("2d", {
                        alpha: false
                    });
                    const outputScale = (0, _ui_utils.getOutputScale)(ctx);
                    canvas.width = this.canvasWidth * outputScale.sx | 0;
                    canvas.height = this.canvasHeight * outputScale.sy | 0;
                    canvas.style.width = this.canvasWidth + "px";
                    canvas.style.height = this.canvasHeight + "px";

                    if (!noCtxScale && outputScale.scaled) {
                        ctx.scale(outputScale.sx, outputScale.sy);
                    }

                    return ctx;
                }

                _convertCanvasToImage() {
                    if (!this.canvas) {
                        return;
                    }

                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED) {
                        return;
                    }

                    const className = "thumbnailImage";

                    if (this.disableCanvasToImageConversion) {
                        this.canvas.className = className;

                        this._thumbPageCanvas.then(msg => {
                            this.canvas.setAttribute("aria-label", msg);
                        });

                        this.div.setAttribute("data-loaded", true);
                        this.ring.appendChild(this.canvas);
                        return;
                    }

                    const image = document.createElement("img");
                    image.className = className;

                    this._thumbPageCanvas.then(msg => {
                        image.setAttribute("aria-label", msg);
                    });

                    image.style.width = this.canvasWidth + "px";
                    image.style.height = this.canvasHeight + "px";
                    image.src = this.canvas.toDataURL();
                    this.image = image;
                    this.div.setAttribute("data-loaded", true);
                    this.ring.appendChild(image);
                    this.canvas.width = 0;
                    this.canvas.height = 0;
                    delete this.canvas;
                }

                draw() {
                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.INITIAL) {
                        console.error("Must be in new state before drawing");
                        return Promise.resolve(undefined);
                    }

                    const {
                        pdfPage
                    } = this;

                    if (!pdfPage) {
                        this.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;
                        return Promise.reject(new Error("pdfPage is not loaded"));
                    }

                    this.renderingState = _pdf_rendering_queue.RenderingStates.RUNNING;
                    const renderCapability = (0, _pdfjsLib.createPromiseCapability)();

                    const finishRenderTask = error => {
                        if (renderTask === this.renderTask) {
                            this.renderTask = null;
                        }

                        if (error instanceof _pdfjsLib.RenderingCancelledException) {
                            renderCapability.resolve(undefined);
                            return;
                        }

                        this.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;

                        this._convertCanvasToImage();

                        if (!error) {
                            renderCapability.resolve(undefined);
                        } else {
                            renderCapability.reject(error);
                        }
                    };

                    const ctx = this._getPageDrawContext();

                    const drawViewport = this.viewport.clone({
                        scale: this.scale
                    });

                    const renderContinueCallback = cont => {
                        if (!this.renderingQueue.isHighestPriority(this)) {
                            this.renderingState = _pdf_rendering_queue.RenderingStates.PAUSED;

                            this.resume = () => {
                                this.renderingState = _pdf_rendering_queue.RenderingStates.RUNNING;
                                cont();
                            };

                            return;
                        }

                        cont();
                    };

                    const renderContext = {
                        canvasContext: ctx,
                        viewport: drawViewport
                    };
                    const renderTask = this.renderTask = pdfPage.render(renderContext);
                    renderTask.onContinue = renderContinueCallback;
                    renderTask.promise.then(function () {
                        finishRenderTask(null);
                    }, function (error) {
                        finishRenderTask(error);
                    });
                    return renderCapability.promise;
                }

                setImage(pageView) {
                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.INITIAL) {
                        return;
                    }

                    const img = pageView.canvas;

                    if (!img) {
                        return;
                    }

                    if (!this.pdfPage) {
                        this.setPdfPage(pageView.pdfPage);
                    }

                    this.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;

                    const ctx = this._getPageDrawContext(true);

                    const canvas = ctx.canvas;

                    if (img.width <= 2 * canvas.width) {
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

                        this._convertCanvasToImage();

                        return;
                    }

                    let reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS;
                    let reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS;
                    const reducedImage = TempImageFactory.getCanvas(reducedWidth, reducedHeight);
                    const reducedImageCtx = reducedImage.getContext("2d");

                    while (reducedWidth > img.width || reducedHeight > img.height) {
                        reducedWidth >>= 1;
                        reducedHeight >>= 1;
                    }

                    reducedImageCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, reducedWidth, reducedHeight);

                    while (reducedWidth > 2 * canvas.width) {
                        reducedImageCtx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, reducedWidth >> 1, reducedHeight >> 1);
                        reducedWidth >>= 1;
                        reducedHeight >>= 1;
                    }

                    ctx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, canvas.width, canvas.height);

                    this._convertCanvasToImage();
                }

                get _thumbPageTitle() {
                    return this.l10n.get("thumb_page_title", {
                        page: this.pageLabel !== null ? this.pageLabel : this.id
                    }, "Page {{page}}");
                }

                get _thumbPageCanvas() {
                    return this.l10n.get("thumb_page_canvas", {
                        page: this.pageLabel !== null ? this.pageLabel : this.id
                    }, "Thumbnail of Page {{page}}");
                }

                setPageLabel(label) {
                    this.pageLabel = typeof label === "string" ? label : null;

                    this._thumbPageTitle.then(msg => {
                        this.anchor.title = msg;
                    });

                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED) {
                        return;
                    }

                    this._thumbPageCanvas.then(msg => {
                        if (this.image) {
                            this.image.setAttribute("aria-label", msg);
                        } else if (this.disableCanvasToImageConversion && this.canvas) {
                            this.canvas.setAttribute("aria-label", msg);
                        }
                    });
                }

                static cleanup() {
                    TempImageFactory.destroyCanvas();
                }

            }

            exports.PDFThumbnailView = PDFThumbnailView;

            /***/ }),
        /* 25 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.BaseViewer = void 0;

            var _ui_utils = __webpack_require__(2);

            var _pdf_rendering_queue = __webpack_require__(8);

            var _annotation_layer_builder = __webpack_require__(26);

            var _pdfjsLib = __webpack_require__(4);

            var _pdf_page_view = __webpack_require__(27);

            var _pdf_link_service = __webpack_require__(18);

            var _text_layer_builder = __webpack_require__(28);

            const DEFAULT_CACHE_SIZE = 10;

            function PDFPageViewBuffer(size) {
                const data = [];

                this.push = function (view) {
                    const i = data.indexOf(view);

                    if (i >= 0) {
                        data.splice(i, 1);
                    }

                    data.push(view);

                    if (data.length > size) {
                        data.shift().destroy();
                    }
                };

                this.resize = function (newSize, pagesToKeep) {
                    size = newSize;

                    if (pagesToKeep) {
                        const pageIdsToKeep = new Set();

                        for (let i = 0, iMax = pagesToKeep.length; i < iMax; ++i) {
                            pageIdsToKeep.add(pagesToKeep[i].id);
                        }

                        (0, _ui_utils.moveToEndOfArray)(data, function (page) {
                            return pageIdsToKeep.has(page.id);
                        });
                    }

                    while (data.length > size) {
                        data.shift().destroy();
                    }
                };
            }

            function isSameScale(oldScale, newScale) {
                if (newScale === oldScale) {
                    return true;
                }

                if (Math.abs(newScale - oldScale) < 1e-15) {
                    return true;
                }

                return false;
            }

            class BaseViewer {
                constructor(options) {
                    if (this.constructor === BaseViewer) {
                        throw new Error("Cannot initialize BaseViewer.");
                    }

                    this._name = this.constructor.name;
                    this.container = options.container;
                    this.viewer = options.viewer || options.container.firstElementChild;
                    this.eventBus = options.eventBus;
                    this.linkService = options.linkService || new _pdf_link_service.SimpleLinkService();
                    this.downloadManager = options.downloadManager || null;
                    this.findController = options.findController || null;
                    this.removePageBorders = options.removePageBorders || false;
                    this.textLayerMode = Number.isInteger(options.textLayerMode) ? options.textLayerMode : _ui_utils.TextLayerMode.ENABLE;
                    this.imageResourcesPath = options.imageResourcesPath || "";
                    this.renderInteractiveForms = options.renderInteractiveForms || false;
                    this.enablePrintAutoRotate = options.enablePrintAutoRotate || false;
                    this.renderer = options.renderer || _ui_utils.RendererType.CANVAS;
                    this.enableWebGL = options.enableWebGL || false;
                    this.useOnlyCssZoom = options.useOnlyCssZoom || false;
                    this.maxCanvasPixels = options.maxCanvasPixels;
                    this.l10n = options.l10n || _ui_utils.NullL10n;
                    this.defaultRenderingQueue = !options.renderingQueue;

                    if (this.defaultRenderingQueue) {
                        this.renderingQueue = new _pdf_rendering_queue.PDFRenderingQueue();
                        this.renderingQueue.setViewer(this);
                    } else {
                        this.renderingQueue = options.renderingQueue;
                    }

                    this.scroll = (0, _ui_utils.watchScroll)(this.container, this._scrollUpdate.bind(this));
                    this.presentationModeState = _ui_utils.PresentationModeState.UNKNOWN;
                    this._onBeforeDraw = this._onAfterDraw = null;

                    this._resetView();

                    if (this.removePageBorders) {
                        this.viewer.classList.add("removePageBorders");
                    }

                    Promise.resolve().then(() => {
                        this.eventBus.dispatch("baseviewerinit", {
                            source: this
                        });
                    });
                }

                get pagesCount() {
                    return this._pages.length;
                }

                getPageView(index) {
                    return this._pages[index];
                }

                get pageViewsReady() {
                    if (!this._pagesCapability.settled) {
                        return false;
                    }

                    return this._pages.every(function (pageView) {
                        return pageView && pageView.pdfPage;
                    });
                }

                get currentPageNumber() {
                    return this._currentPageNumber;
                }

                set currentPageNumber(val) {
                    if (!Number.isInteger(val)) {
                        throw new Error("Invalid page number.");
                    }

                    if (!this.pdfDocument) {
                        return;
                    }

                    if (!this._setCurrentPageNumber(val, true)) {
                        console.error(`${this._name}.currentPageNumber: "${val}" is not a valid page.`);
                    }
                }

                _setCurrentPageNumber(val, resetCurrentPageView = false) {
                    if (this._currentPageNumber === val) {
                        if (resetCurrentPageView) {
                            this._resetCurrentPageView();
                        }

                        return true;
                    }

                    if (!(0 < val && val <= this.pagesCount)) {
                        return false;
                    }

                    this._currentPageNumber = val;
                    this.eventBus.dispatch("pagechanging", {
                        source: this,
                        pageNumber: val,
                        pageLabel: this._pageLabels && this._pageLabels[val - 1]
                    });

                    if (resetCurrentPageView) {
                        this._resetCurrentPageView();
                    }

                    return true;
                }

                get currentPageLabel() {
                    return this._pageLabels && this._pageLabels[this._currentPageNumber - 1];
                }

                set currentPageLabel(val) {
                    if (!this.pdfDocument) {
                        return;
                    }

                    let page = val | 0;

                    if (this._pageLabels) {
                        const i = this._pageLabels.indexOf(val);

                        if (i >= 0) {
                            page = i + 1;
                        }
                    }

                    if (!this._setCurrentPageNumber(page, true)) {
                        console.error(`${this._name}.currentPageLabel: "${val}" is not a valid page.`);
                    }
                }

                get currentScale() {
                    return this._currentScale !== _ui_utils.UNKNOWN_SCALE ? this._currentScale : _ui_utils.DEFAULT_SCALE;
                }

                set currentScale(val) {
                    if (isNaN(val)) {
                        throw new Error("Invalid numeric scale.");
                    }

                    if (!this.pdfDocument) {
                        return;
                    }

                    this._setScale(val, false);
                }

                get currentScaleValue() {
                    return this._currentScaleValue;
                }

                set currentScaleValue(val) {
                    if (!this.pdfDocument) {
                        return;
                    }

                    this._setScale(val, false);
                }

                get pagesRotation() {
                    return this._pagesRotation;
                }

                set pagesRotation(rotation) {
                    if (!(0, _ui_utils.isValidRotation)(rotation)) {
                        throw new Error("Invalid pages rotation angle.");
                    }

                    if (!this.pdfDocument) {
                        return;
                    }

                    if (this._pagesRotation === rotation) {
                        return;
                    }

                    this._pagesRotation = rotation;
                    const pageNumber = this._currentPageNumber;

                    for (let i = 0, ii = this._pages.length; i < ii; i++) {
                        const pageView = this._pages[i];
                        pageView.update(pageView.scale, rotation);
                    }

                    if (this._currentScaleValue) {
                        this._setScale(this._currentScaleValue, true);
                    }

                    this.eventBus.dispatch("rotationchanging", {
                        source: this,
                        pagesRotation: rotation,
                        pageNumber
                    });

                    if (this.defaultRenderingQueue) {
                        this.update();
                    }
                }

                get firstPagePromise() {
                    return this.pdfDocument ? this._firstPageCapability.promise : null;
                }

                get onePageRendered() {
                    return this.pdfDocument ? this._onePageRenderedCapability.promise : null;
                }

                get pagesPromise() {
                    return this.pdfDocument ? this._pagesCapability.promise : null;
                }

                get _viewerElement() {
                    throw new Error("Not implemented: _viewerElement");
                }

                _onePageRenderedOrForceFetch() {
                    if (!this.container.offsetParent || this._getVisiblePages().views.length === 0) {
                        return Promise.resolve();
                    }

                    return this._onePageRenderedCapability.promise;
                }

                setDocument(pdfDocument) {
                    if (this.pdfDocument) {
                        this._cancelRendering();

                        this._resetView();

                        if (this.findController) {
                            this.findController.setDocument(null);
                        }
                    }

                    this.pdfDocument = pdfDocument;

                    if (!pdfDocument) {
                        return;
                    }

                    const pagesCount = pdfDocument.numPages;
                    const firstPagePromise = pdfDocument.getPage(1);

                    this._pagesCapability.promise.then(() => {
                        this.eventBus.dispatch("pagesloaded", {
                            source: this,
                            pagesCount
                        });
                    });

                    this._onBeforeDraw = evt => {
                        const pageView = this._pages[evt.pageNumber - 1];

                        if (!pageView) {
                            return;
                        }

                        this._buffer.push(pageView);
                    };

                    this.eventBus._on("pagerender", this._onBeforeDraw);

                    this._onAfterDraw = evt => {
                        if (evt.cssTransform || this._onePageRenderedCapability.settled) {
                            return;
                        }

                        this._onePageRenderedCapability.resolve();

                        this.eventBus._off("pagerendered", this._onAfterDraw);

                        this._onAfterDraw = null;
                    };

                    this.eventBus._on("pagerendered", this._onAfterDraw);

                    firstPagePromise.then(firstPdfPage => {
                        this._firstPageCapability.resolve(firstPdfPage);

                        const scale = this.currentScale;
                        const viewport = firstPdfPage.getViewport({
                            scale: scale * _ui_utils.CSS_UNITS
                        });
                        const textLayerFactory = this.textLayerMode !== _ui_utils.TextLayerMode.DISABLE ? this : null;

                        for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
                            const pageView = new _pdf_page_view.PDFPageView({
                                container: this._viewerElement,
                                eventBus: this.eventBus,
                                id: pageNum,
                                scale,
                                defaultViewport: viewport.clone(),
                                renderingQueue: this.renderingQueue,
                                textLayerFactory,
                                textLayerMode: this.textLayerMode,
                                annotationLayerFactory: this,
                                imageResourcesPath: this.imageResourcesPath,
                                renderInteractiveForms: this.renderInteractiveForms,
                                renderer: this.renderer,
                                enableWebGL: this.enableWebGL,
                                useOnlyCssZoom: this.useOnlyCssZoom,
                                maxCanvasPixels: this.maxCanvasPixels,
                                l10n: this.l10n
                            });

                            this._pages.push(pageView);
                        }

                        const firstPageView = this._pages[0];

                        if (firstPageView) {
                            firstPageView.setPdfPage(firstPdfPage);
                            this.linkService.cachePageRef(1, firstPdfPage.ref);
                        }

                        if (this._spreadMode !== _ui_utils.SpreadMode.NONE) {
                            this._updateSpreadMode();
                        }

                        this._onePageRenderedOrForceFetch().then(() => {
                            if (this.findController) {
                                this.findController.setDocument(pdfDocument);
                            }

                            if (pdfDocument.loadingParams.disableAutoFetch || pagesCount > 7500) {
                                this._pagesCapability.resolve();

                                return;
                            }

                            let getPagesLeft = pagesCount - 1;

                            if (getPagesLeft <= 0) {
                                this._pagesCapability.resolve();

                                return;
                            }

                            for (let pageNum = 2; pageNum <= pagesCount; ++pageNum) {
                                pdfDocument.getPage(pageNum).then(pdfPage => {
                                    const pageView = this._pages[pageNum - 1];

                                    if (!pageView.pdfPage) {
                                        pageView.setPdfPage(pdfPage);
                                    }

                                    this.linkService.cachePageRef(pageNum, pdfPage.ref);

                                    if (--getPagesLeft === 0) {
                                        this._pagesCapability.resolve();
                                    }
                                }, reason => {
                                    console.error(`Unable to get page ${pageNum} to initialize viewer`, reason);

                                    if (--getPagesLeft === 0) {
                                        this._pagesCapability.resolve();
                                    }
                                });
                            }
                        });

                        this.eventBus.dispatch("pagesinit", {
                            source: this
                        });

                        if (this.defaultRenderingQueue) {
                            this.update();
                        }
                    }).catch(reason => {
                        console.error("Unable to initialize viewer", reason);
                    });
                }

                setPageLabels(labels) {
                    if (!this.pdfDocument) {
                        return;
                    }

                    if (!labels) {
                        this._pageLabels = null;
                    } else if (!(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)) {
                        this._pageLabels = null;
                        console.error(`${this._name}.setPageLabels: Invalid page labels.`);
                    } else {
                        this._pageLabels = labels;
                    }

                    for (let i = 0, ii = this._pages.length; i < ii; i++) {
                        const pageView = this._pages[i];
                        const label = this._pageLabels && this._pageLabels[i];
                        pageView.setPageLabel(label);
                    }
                }

                _resetView() {
                    this._pages = [];
                    this._currentPageNumber = 1;
                    this._currentScale = _ui_utils.UNKNOWN_SCALE;
                    this._currentScaleValue = null;
                    this._pageLabels = null;
                    this._buffer = new PDFPageViewBuffer(DEFAULT_CACHE_SIZE);
                    this._location = null;
                    this._pagesRotation = 0;
                    this._pagesRequests = new WeakMap();
                    this._firstPageCapability = (0, _pdfjsLib.createPromiseCapability)();
                    this._onePageRenderedCapability = (0, _pdfjsLib.createPromiseCapability)();
                    this._pagesCapability = (0, _pdfjsLib.createPromiseCapability)();
                    this._scrollMode = _ui_utils.ScrollMode.VERTICAL;
                    this._spreadMode = _ui_utils.SpreadMode.NONE;

                    if (this._onBeforeDraw) {
                        this.eventBus._off("pagerender", this._onBeforeDraw);

                        this._onBeforeDraw = null;
                    }

                    if (this._onAfterDraw) {
                        this.eventBus._off("pagerendered", this._onAfterDraw);

                        this._onAfterDraw = null;
                    }

                    this.viewer.textContent = "";

                    this._updateScrollMode();
                }

                _scrollUpdate() {
                    if (this.pagesCount === 0) {
                        return;
                    }

                    this.update();
                }

                _scrollIntoView({
                                    pageDiv,
                                    pageSpot = null,
                                    pageNumber = null
                                }) {
                    (0, _ui_utils.scrollIntoView)(pageDiv, pageSpot);
                }

                _setScaleUpdatePages(newScale, newValue, noScroll = false, preset = false) {
                    this._currentScaleValue = newValue.toString();

                    if (isSameScale(this._currentScale, newScale)) {
                        if (preset) {
                            this.eventBus.dispatch("scalechanging", {
                                source: this,
                                scale: newScale,
                                presetValue: newValue
                            });
                        }

                        return;
                    }

                    for (let i = 0, ii = this._pages.length; i < ii; i++) {
                        this._pages[i].update(newScale);
                    }

                    this._currentScale = newScale;

                    if (!noScroll) {
                        let page = this._currentPageNumber,
                            dest;

                        if (this._location && !(this.isInPresentationMode || this.isChangingPresentationMode)) {
                            page = this._location.pageNumber;
                            dest = [null, {
                                name: "XYZ"
                            }, this._location.left, this._location.top, null];
                        }

                        this.scrollPageIntoView({
                            pageNumber: page,
                            destArray: dest,
                            allowNegativeOffset: true
                        });
                    }

                    this.eventBus.dispatch("scalechanging", {
                        source: this,
                        scale: newScale,
                        presetValue: preset ? newValue : undefined
                    });

                    if (this.defaultRenderingQueue) {
                        this.update();
                    }
                }

                _setScale(value, noScroll = false) {
                    let scale = parseFloat(value);

                    if (scale > 0) {
                        this._setScaleUpdatePages(scale, value, noScroll, false);
                    } else {
                        const currentPage = this._pages[this._currentPageNumber - 1];

                        if (!currentPage) {
                            return;
                        }

                        const noPadding = this.isInPresentationMode || this.removePageBorders;
                        let hPadding = noPadding ? 0 : _ui_utils.SCROLLBAR_PADDING;
                        let vPadding = noPadding ? 0 : _ui_utils.VERTICAL_PADDING;

                        if (!noPadding && this._isScrollModeHorizontal) {
                            [hPadding, vPadding] = [vPadding, hPadding];
                        }

                        const pageWidthScale = (this.container.clientWidth - hPadding) / currentPage.width * currentPage.scale;
                        const pageHeightScale = (this.container.clientHeight - vPadding) / currentPage.height * currentPage.scale;

                        switch (value) {
                            case "page-actual":
                                scale = 1;
                                break;

                            case "page-width":
                                scale = pageWidthScale;
                                break;

                            case "page-height":
                                scale = pageHeightScale;
                                break;

                            case "page-fit":
                                scale = Math.min(pageWidthScale, pageHeightScale);
                                break;

                            case "auto":
                                const horizontalScale = (0, _ui_utils.isPortraitOrientation)(currentPage) ? pageWidthScale : Math.min(pageHeightScale, pageWidthScale);
                                scale = Math.min(_ui_utils.MAX_AUTO_SCALE, horizontalScale);
                                break;

                            default:
                                console.error(`${this._name}._setScale: "${value}" is an unknown zoom value.`);
                                return;
                        }

                        this._setScaleUpdatePages(scale, value, noScroll, true);
                    }
                }

                _resetCurrentPageView() {
                    if (this.isInPresentationMode) {
                        this._setScale(this._currentScaleValue, true);
                    }

                    const pageView = this._pages[this._currentPageNumber - 1];

                    this._scrollIntoView({
                        pageDiv: pageView.div
                    });
                }

                scrollPageIntoView({
                                       pageNumber,
                                       destArray = null,
                                       allowNegativeOffset = false,
                                       ignoreDestinationZoom = false
                                   }) {
                    if (!this.pdfDocument) {
                        return;
                    }

                    const pageView = Number.isInteger(pageNumber) && this._pages[pageNumber - 1];

                    if (!pageView) {
                        console.error(`${this._name}.scrollPageIntoView: ` + `"${pageNumber}" is not a valid pageNumber parameter.`);
                        return;
                    }

                    if (this.isInPresentationMode || !destArray) {
                        this._setCurrentPageNumber(pageNumber, true);

                        return;
                    }

                    let x = 0,
                        y = 0;
                    let width = 0,
                        height = 0,
                        widthScale,
                        heightScale;
                    const changeOrientation = pageView.rotation % 180 !== 0;
                    const pageWidth = (changeOrientation ? pageView.height : pageView.width) / pageView.scale / _ui_utils.CSS_UNITS;
                    const pageHeight = (changeOrientation ? pageView.width : pageView.height) / pageView.scale / _ui_utils.CSS_UNITS;
                    let scale = 0;

                    switch (destArray[1].name) {
                        case "XYZ":
                            x = destArray[2];
                            y = destArray[3];
                            scale = destArray[4];
                            x = x !== null ? x : 0;
                            y = y !== null ? y : pageHeight;
                            break;

                        case "Fit":
                        case "FitB":
                            scale = "page-fit";
                            break;

                        case "FitH":
                        case "FitBH":
                            y = destArray[2];
                            scale = "page-width";

                            if (y === null && this._location) {
                                x = this._location.left;
                                y = this._location.top;
                            }

                            break;

                        case "FitV":
                        case "FitBV":
                            x = destArray[2];
                            width = pageWidth;
                            height = pageHeight;
                            scale = "page-height";
                            break;

                        case "FitR":
                            x = destArray[2];
                            y = destArray[3];
                            width = destArray[4] - x;
                            height = destArray[5] - y;
                            const hPadding = this.removePageBorders ? 0 : _ui_utils.SCROLLBAR_PADDING;
                            const vPadding = this.removePageBorders ? 0 : _ui_utils.VERTICAL_PADDING;
                            widthScale = (this.container.clientWidth - hPadding) / width / _ui_utils.CSS_UNITS;
                            heightScale = (this.container.clientHeight - vPadding) / height / _ui_utils.CSS_UNITS;
                            scale = Math.min(Math.abs(widthScale), Math.abs(heightScale));
                            break;

                        default:
                            console.error(`${this._name}.scrollPageIntoView: ` + `"${destArray[1].name}" is not a valid destination type.`);
                            return;
                    }

                    if (!ignoreDestinationZoom) {
                        if (scale && scale !== this._currentScale) {
                            this.currentScaleValue = scale;
                        } else if (this._currentScale === _ui_utils.UNKNOWN_SCALE) {
                            this.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE;
                        }
                    }

                    if (scale === "page-fit" && !destArray[4]) {
                        this._scrollIntoView({
                            pageDiv: pageView.div,
                            pageNumber
                        });

                        return;
                    }

                    const boundingRect = [pageView.viewport.convertToViewportPoint(x, y), pageView.viewport.convertToViewportPoint(x + width, y + height)];
                    let left = Math.min(boundingRect[0][0], boundingRect[1][0]);
                    let top = Math.min(boundingRect[0][1], boundingRect[1][1]);

                    if (!allowNegativeOffset) {
                        left = Math.max(left, 0);
                        top = Math.max(top, 0);
                    }

                    this._scrollIntoView({
                        pageDiv: pageView.div,
                        pageSpot: {
                            left,
                            top
                        },
                        pageNumber
                    });
                }

                _updateLocation(firstPage) {
                    const currentScale = this._currentScale;
                    const currentScaleValue = this._currentScaleValue;
                    const normalizedScaleValue = parseFloat(currentScaleValue) === currentScale ? Math.round(currentScale * 10000) / 100 : currentScaleValue;
                    const pageNumber = firstPage.id;
                    let pdfOpenParams = "#page=" + pageNumber;
                    pdfOpenParams += "&zoom=" + normalizedScaleValue;
                    const currentPageView = this._pages[pageNumber - 1];
                    const container = this.container;
                    const topLeft = currentPageView.getPagePoint(container.scrollLeft - firstPage.x, container.scrollTop - firstPage.y);
                    const intLeft = Math.round(topLeft[0]);
                    const intTop = Math.round(topLeft[1]);
                    pdfOpenParams += "," + intLeft + "," + intTop;
                    this._location = {
                        pageNumber,
                        scale: normalizedScaleValue,
                        top: intTop,
                        left: intLeft,
                        rotation: this._pagesRotation,
                        pdfOpenParams
                    };
                }

                _updateHelper(visiblePages) {
                    throw new Error("Not implemented: _updateHelper");
                }

                update() {
                    const visible = this._getVisiblePages();

                    const visiblePages = visible.views,
                        numVisiblePages = visiblePages.length;

                    if (numVisiblePages === 0) {
                        return;
                    }

                    const newCacheSize = Math.max(DEFAULT_CACHE_SIZE, 2 * numVisiblePages + 1);

                    this._buffer.resize(newCacheSize, visiblePages);

                    this.renderingQueue.renderHighestPriority(visible);

                    this._updateHelper(visiblePages);

                    this._updateLocation(visible.first);

                    this.eventBus.dispatch("updateviewarea", {
                        source: this,
                        location: this._location
                    });
                }

                containsElement(element) {
                    return this.container.contains(element);
                }

                focus() {
                    this.container.focus();
                }

                get _isScrollModeHorizontal() {
                    return this.isInPresentationMode ? false : this._scrollMode === _ui_utils.ScrollMode.HORIZONTAL;
                }

                get isInPresentationMode() {
                    return this.presentationModeState === _ui_utils.PresentationModeState.FULLSCREEN;
                }

                get isChangingPresentationMode() {
                    return this.presentationModeState === _ui_utils.PresentationModeState.CHANGING;
                }

                get isHorizontalScrollbarEnabled() {
                    return this.isInPresentationMode ? false : this.container.scrollWidth > this.container.clientWidth;
                }

                get isVerticalScrollbarEnabled() {
                    return this.isInPresentationMode ? false : this.container.scrollHeight > this.container.clientHeight;
                }

                _getCurrentVisiblePage() {
                    if (!this.pagesCount) {
                        return {
                            views: []
                        };
                    }

                    const pageView = this._pages[this._currentPageNumber - 1];
                    const element = pageView.div;
                    const view = {
                        id: pageView.id,
                        x: element.offsetLeft + element.clientLeft,
                        y: element.offsetTop + element.clientTop,
                        view: pageView
                    };
                    return {
                        first: view,
                        last: view,
                        views: [view]
                    };
                }

                _getVisiblePages() {
                    return (0, _ui_utils.getVisibleElements)(this.container, this._pages, true, this._isScrollModeHorizontal);
                }

                isPageVisible(pageNumber) {
                    if (!this.pdfDocument) {
                        return false;
                    }

                    if (pageNumber < 1 || pageNumber > this.pagesCount) {
                        console.error(`${this._name}.isPageVisible: "${pageNumber}" is out of bounds.`);
                        return false;
                    }

                    return this._getVisiblePages().views.some(function (view) {
                        return view.id === pageNumber;
                    });
                }

                cleanup() {
                    for (let i = 0, ii = this._pages.length; i < ii; i++) {
                        if (this._pages[i] && this._pages[i].renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED) {
                            this._pages[i].reset();
                        }
                    }
                }

                _cancelRendering() {
                    for (let i = 0, ii = this._pages.length; i < ii; i++) {
                        if (this._pages[i]) {
                            this._pages[i].cancelRendering();
                        }
                    }
                }

                _ensurePdfPageLoaded(pageView) {
                    if (pageView.pdfPage) {
                        return Promise.resolve(pageView.pdfPage);
                    }

                    if (this._pagesRequests.has(pageView)) {
                        return this._pagesRequests.get(pageView);
                    }

                    const promise = this.pdfDocument.getPage(pageView.id).then(pdfPage => {
                        if (!pageView.pdfPage) {
                            pageView.setPdfPage(pdfPage);
                        }

                        this._pagesRequests.delete(pageView);

                        return pdfPage;
                    }).catch(reason => {
                        console.error("Unable to get page for page view", reason);

                        this._pagesRequests.delete(pageView);
                    });

                    this._pagesRequests.set(pageView, promise);

                    return promise;
                }

                forceRendering(currentlyVisiblePages) {
                    const visiblePages = currentlyVisiblePages || this._getVisiblePages();

                    const scrollAhead = this._isScrollModeHorizontal ? this.scroll.right : this.scroll.down;
                    const pageView = this.renderingQueue.getHighestPriority(visiblePages, this._pages, scrollAhead);

                    if (pageView) {
                        this._ensurePdfPageLoaded(pageView).then(() => {
                            this.renderingQueue.renderView(pageView);
                        });

                        return true;
                    }

                    return false;
                }

                createTextLayerBuilder(textLayerDiv, pageIndex, viewport, enhanceTextSelection = false, eventBus) {
                    return new _text_layer_builder.TextLayerBuilder({
                        textLayerDiv,
                        eventBus,
                        pageIndex,
                        viewport,
                        findController: this.isInPresentationMode ? null : this.findController,
                        enhanceTextSelection: this.isInPresentationMode ? false : enhanceTextSelection
                    });
                }

                createAnnotationLayerBuilder(pageDiv, pdfPage, imageResourcesPath = "", renderInteractiveForms = false, l10n = _ui_utils.NullL10n) {
                    return new _annotation_layer_builder.AnnotationLayerBuilder({
                        pageDiv,
                        pdfPage,
                        imageResourcesPath,
                        renderInteractiveForms,
                        linkService: this.linkService,
                        downloadManager: this.downloadManager,
                        l10n
                    });
                }

                get hasEqualPageSizes() {
                    const firstPageView = this._pages[0];

                    for (let i = 1, ii = this._pages.length; i < ii; ++i) {
                        const pageView = this._pages[i];

                        if (pageView.width !== firstPageView.width || pageView.height !== firstPageView.height) {
                            return false;
                        }
                    }

                    return true;
                }

                getPagesOverview() {
                    const pagesOverview = this._pages.map(function (pageView) {
                        const viewport = pageView.pdfPage.getViewport({
                            scale: 1
                        });
                        return {
                            width: viewport.width,
                            height: viewport.height,
                            rotation: viewport.rotation
                        };
                    });

                    if (!this.enablePrintAutoRotate) {
                        return pagesOverview;
                    }

                    const isFirstPagePortrait = (0, _ui_utils.isPortraitOrientation)(pagesOverview[0]);
                    return pagesOverview.map(function (size) {
                        if (isFirstPagePortrait === (0, _ui_utils.isPortraitOrientation)(size)) {
                            return size;
                        }

                        return {
                            width: size.height,
                            height: size.width,
                            rotation: (size.rotation + 90) % 360
                        };
                    });
                }

                get scrollMode() {
                    return this._scrollMode;
                }

                set scrollMode(mode) {
                    if (this._scrollMode === mode) {
                        return;
                    }

                    if (!(0, _ui_utils.isValidScrollMode)(mode)) {
                        throw new Error(`Invalid scroll mode: ${mode}`);
                    }

                    this._scrollMode = mode;
                    this.eventBus.dispatch("scrollmodechanged", {
                        source: this,
                        mode
                    });

                    this._updateScrollMode(this._currentPageNumber);
                }

                _updateScrollMode(pageNumber = null) {
                    const scrollMode = this._scrollMode,
                        viewer = this.viewer;
                    viewer.classList.toggle("scrollHorizontal", scrollMode === _ui_utils.ScrollMode.HORIZONTAL);
                    viewer.classList.toggle("scrollWrapped", scrollMode === _ui_utils.ScrollMode.WRAPPED);

                    if (!this.pdfDocument || !pageNumber) {
                        return;
                    }

                    if (this._currentScaleValue && isNaN(this._currentScaleValue)) {
                        this._setScale(this._currentScaleValue, true);
                    }

                    this._setCurrentPageNumber(pageNumber, true);

                    this.update();
                }

                get spreadMode() {
                    return this._spreadMode;
                }

                set spreadMode(mode) {
                    if (this._spreadMode === mode) {
                        return;
                    }

                    if (!(0, _ui_utils.isValidSpreadMode)(mode)) {
                        throw new Error(`Invalid spread mode: ${mode}`);
                    }

                    this._spreadMode = mode;
                    this.eventBus.dispatch("spreadmodechanged", {
                        source: this,
                        mode
                    });

                    this._updateSpreadMode(this._currentPageNumber);
                }

                _updateSpreadMode(pageNumber = null) {
                    if (!this.pdfDocument) {
                        return;
                    }

                    const viewer = this.viewer,
                        pages = this._pages;
                    viewer.textContent = "";

                    if (this._spreadMode === _ui_utils.SpreadMode.NONE) {
                        for (let i = 0, iMax = pages.length; i < iMax; ++i) {
                            viewer.appendChild(pages[i].div);
                        }
                    } else {
                        const parity = this._spreadMode - 1;
                        let spread = null;

                        for (let i = 0, iMax = pages.length; i < iMax; ++i) {
                            if (spread === null) {
                                spread = document.createElement("div");
                                spread.className = "spread";
                                viewer.appendChild(spread);
                            } else if (i % 2 === parity) {
                                spread = spread.cloneNode(false);
                                viewer.appendChild(spread);
                            }

                            spread.appendChild(pages[i].div);
                        }
                    }

                    if (!pageNumber) {
                        return;
                    }

                    this._setCurrentPageNumber(pageNumber, true);

                    this.update();
                }

            }

            exports.BaseViewer = BaseViewer;

            /***/ }),
        /* 31 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.Toolbar = void 0;

            var _ui_utils = __webpack_require__(2);

            const PAGE_NUMBER_LOADING_INDICATOR = "visiblePageIsLoading";
            const SCALE_SELECT_CONTAINER_WIDTH = 140;
            const SCALE_SELECT_WIDTH = 162;

            class Toolbar {
                constructor(options, eventBus, l10n = _ui_utils.NullL10n) {
                    this.toolbar = options.container;
                    this.eventBus = eventBus;
                    this.l10n = l10n;
                    this.buttons = [{
                        element: options.previous,
                        eventName: "previouspage"
                    }, {
                        element: options.next,
                        eventName: "nextpage"
                    }, {
                        element: options.zoomIn,
                        eventName: "zoomin"
                    }, {
                        element: options.zoomOut,
                        eventName: "zoomout"
                    }, {
                        element: options.openFile,
                        eventName: "openfile"
                    }, {
                        element: options.print,
                        eventName: "print"
                    }, {
                        element: options.presentationModeButton,
                        eventName: "presentationmode"
                    }, {
                        element: options.download,
                        eventName: "download"
                    }, {
                        element: options.viewBookmark,
                        eventName: null
                    }];
                    this.items = {
                        numPages: options.numPages,
                        pageNumber: options.pageNumber,
                        scaleSelectContainer: options.scaleSelectContainer,
                        scaleSelect: options.scaleSelect,
                        customScaleOption: options.customScaleOption,
                        previous: options.previous,
                        next: options.next,
                        zoomIn: options.zoomIn,
                        zoomOut: options.zoomOut
                    };
                    this._wasLocalized = false;
                    this.reset();

                    this._bindListeners();
                }

                setPageNumber(pageNumber, pageLabel) {
                    this.pageNumber = pageNumber;
                    this.pageLabel = pageLabel;

                    this._updateUIState(false);
                }

                setPagesCount(pagesCount, hasPageLabels) {
                    this.pagesCount = pagesCount;
                    this.hasPageLabels = hasPageLabels;

                    this._updateUIState(true);
                }

                setPageScale(pageScaleValue, pageScale) {
                    this.pageScaleValue = (pageScaleValue || pageScale).toString();
                    this.pageScale = pageScale;

                    this._updateUIState(false);
                }

                reset() {
                    this.pageNumber = 0;
                    this.pageLabel = null;
                    this.hasPageLabels = false;
                    this.pagesCount = 0;
                    this.pageScaleValue = _ui_utils.DEFAULT_SCALE_VALUE;
                    this.pageScale = _ui_utils.DEFAULT_SCALE;

                    this._updateUIState(true);

                    this.updateLoadingIndicatorState();
                }

                _bindListeners() {
                    const {
                        pageNumber,
                        scaleSelect
                    } = this.items;
                    const self = this;

                    for (const {
                        element,
                        eventName
                    } of this.buttons) {
                        element.addEventListener("click", evt => {
                            if (eventName !== null) {
                                this.eventBus.dispatch(eventName, {
                                    source: this
                                });
                            }
                        });
                    }

                    pageNumber.addEventListener("click", function () {
                        this.select();
                    });
                    pageNumber.addEventListener("change", function () {
                        self.eventBus.dispatch("pagenumberchanged", {
                            source: self,
                            value: this.value
                        });
                    });
                    scaleSelect.addEventListener("change", function () {
                        if (this.value === "custom") {
                            return;
                        }

                        self.eventBus.dispatch("scalechanged", {
                            source: self,
                            value: this.value
                        });
                    });
                    scaleSelect.oncontextmenu = _ui_utils.noContextMenuHandler;

                    this.eventBus._on("localized", () => {
                        this._wasLocalized = true;

                        this._adjustScaleWidth();

                        this._updateUIState(true);
                    });
                }

                _updateUIState(resetNumPages = false) {
                    if (!this._wasLocalized) {
                        return;
                    }

                    const {
                        pageNumber,
                        pagesCount,
                        pageScaleValue,
                        pageScale,
                        items
                    } = this;

                    if (resetNumPages) {
                        if (this.hasPageLabels) {
                            items.pageNumber.type = "text";
                        } else {
                            items.pageNumber.type = "number";
                            this.l10n.get("of_pages", {
                                pagesCount
                            }, "of {{pagesCount}}").then(msg => {
                                items.numPages.textContent = msg;
                            });
                        }

                        items.pageNumber.max = pagesCount;
                    }

                    if (this.hasPageLabels) {
                        items.pageNumber.value = this.pageLabel;
                        this.l10n.get("page_of_pages", {
                            pageNumber,
                            pagesCount
                        }, "({{pageNumber}} of {{pagesCount}})").then(msg => {
                            items.numPages.textContent = msg;
                        });
                    } else {
                        items.pageNumber.value = pageNumber;
                    }

                    items.previous.disabled = pageNumber <= 1;
                    items.next.disabled = pageNumber >= pagesCount;
                    items.zoomOut.disabled = pageScale <= _ui_utils.MIN_SCALE;
                    items.zoomIn.disabled = pageScale >= _ui_utils.MAX_SCALE;
                    const customScale = Math.round(pageScale * 10000) / 100;
                    this.l10n.get("page_scale_percent", {
                        scale: customScale
                    }, "{{scale}}%").then(msg => {
                        let predefinedValueFound = false;

                        for (const option of items.scaleSelect.options) {
                            if (option.value !== pageScaleValue) {
                                option.selected = false;
                                continue;
                            }

                            option.selected = true;
                            predefinedValueFound = true;
                        }

                        if (!predefinedValueFound) {
                            items.customScaleOption.textContent = msg;
                            items.customScaleOption.selected = true;
                        }
                    });
                }

                updateLoadingIndicatorState(loading = false) {
                    const pageNumberInput = this.items.pageNumber;
                    pageNumberInput.classList.toggle(PAGE_NUMBER_LOADING_INDICATOR, loading);
                }

                async _adjustScaleWidth() {
                    const {
                        items,
                        l10n
                    } = this;
                    const predefinedValuesPromise = Promise.all([l10n.get("page_scale_auto", null, "Automatic Zoom"), l10n.get("page_scale_actual", null, "Actual Size"), l10n.get("page_scale_fit", null, "Page Fit"), l10n.get("page_scale_width", null, "Page Width")]);
                    let canvas = document.createElement("canvas");
                    canvas.mozOpaque = true;
                    let ctx = canvas.getContext("2d", {
                        alpha: false
                    });
                    await _ui_utils.animationStarted;
                    const {
                        fontSize,
                        fontFamily
                    } = getComputedStyle(items.scaleSelect);
                    ctx.font = `${fontSize} ${fontFamily}`;
                    let maxWidth = 0;

                    for (const predefinedValue of await predefinedValuesPromise) {
                        const {
                            width
                        } = ctx.measureText(predefinedValue);

                        if (width > maxWidth) {
                            maxWidth = width;
                        }
                    }

                    const overflow = SCALE_SELECT_WIDTH - SCALE_SELECT_CONTAINER_WIDTH;
                    maxWidth += 1.5 * overflow;

                    if (maxWidth > SCALE_SELECT_CONTAINER_WIDTH) {
                        items.scaleSelect.style.width = `${maxWidth + overflow}px`;
                        items.scaleSelectContainer.style.width = `${maxWidth}px`;
                    }

                    canvas.width = 0;
                    canvas.height = 0;
                    canvas = ctx = null;
                }

            }

            exports.Toolbar = Toolbar;

            /***/ }),
        /* 32 */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.ViewHistory = void 0;
            const DEFAULT_VIEW_HISTORY_CACHE_SIZE = 20;

            class ViewHistory {
                constructor(fingerprint, cacheSize = DEFAULT_VIEW_HISTORY_CACHE_SIZE) {
                    this.fingerprint = fingerprint;
                    this.cacheSize = cacheSize;
                    this._initializedPromise = this._readFromStorage().then(databaseStr => {
                        const database = JSON.parse(databaseStr || "{}");
                        let index = -1;

                        if (!Array.isArray(database.files)) {
                            database.files = [];
                        } else {
                            while (database.files.length >= this.cacheSize) {
                                database.files.shift();
                            }

                            for (let i = 0, ii = database.files.length; i < ii; i++) {
                                const branch = database.files[i];

                                if (branch.fingerprint === this.fingerprint) {
                                    index = i;
                                    break;
                                }
                            }
                        }

                        if (index === -1) {
                            index = database.files.push({
                                fingerprint: this.fingerprint
                            }) - 1;
                        }

                        this.file = database.files[index];
                        this.database = database;
                    });
                }

                async _writeToStorage() {
                    const databaseStr = JSON.stringify(this.database);
                    sessionStorage.setItem("pdfjs.history", databaseStr);
                }

                async _readFromStorage() {
                    return sessionStorage.getItem("pdfjs.history");
                }

                async set(name, val) {
                    await this._initializedPromise;
                    this.file[name] = val;
                    return this._writeToStorage();
                }

                async setMultiple(properties) {
                    await this._initializedPromise;

                    for (const name in properties) {
                        this.file[name] = properties[name];
                    }

                    return this._writeToStorage();
                }

                async get(name, defaultValue) {
                    await this._initializedPromise;
                    const val = this.file[name];
                    return val !== undefined ? val : defaultValue;
                }

                async getMultiple(properties) {
                    await this._initializedPromise;
                    const values = Object.create(null);

                    for (const name in properties) {
                        const val = this.file[name];
                        values[name] = val !== undefined ? val : properties[name];
                    }

                    return values;
                }

            }

            exports.ViewHistory = ViewHistory;

            /***/ }),
        /******/ ]);
