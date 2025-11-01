(function(global) {
    'use strict';

    /**
     * AccessibilityI18n is a lightweight runtime internationalisation helper tailored for the
     * accessibility widget. It loads locale JSON files on demand, applies text/attribute updates
     * to any element decorated with `data-i18n` or `data-i18n-attr`, persists the user's selection,
     * and keeps an aria-live region up-to-date so screen readers are notified when languages change.
     */
    const STORAGE_KEY = 'stiacAccessibilityLanguage';
    const DEFAULT_LANGUAGE = 'en';
    const DEFAULT_SUPPORTED = ['en', 'it', 'fr', 'de', 'es', 'pt'];
    const localeCache = new Map();
    const listeners = new Set();

    const state = {
        supportedLanguages: DEFAULT_SUPPORTED.slice(),
        fallbackLanguage: DEFAULT_LANGUAGE,
        currentLanguage: null,
        translations: {},
        localesPath: '',
        root: null,
        liveRegion: null,
        liveRegionCandidate: null,
        onLanguageApplied: null,
        basePath: null,
        documentLocalesRoot: null
    };

    function getScriptElement() {
        if (typeof document === 'undefined') {
            return null;
        }
        if (document.currentScript) {
            return document.currentScript;
        }
        const scripts = document.querySelectorAll('script[src]');
        for (let index = scripts.length - 1; index >= 0; index -= 1) {
            const candidate = scripts[index];
            if (!candidate || typeof candidate.src !== 'string') {
                continue;
            }
            const srcName = candidate.src.split('?')[0].split('#')[0];
            if (!srcName) {
                continue;
            }
            const fileName = srcName.substring(srcName.lastIndexOf('/') + 1);
            if (fileName.includes('i18n')) {
                return candidate;
            }
        }
        return null;
    }

    function deriveBasePath() {
        if (state.basePath !== null && typeof state.basePath !== 'undefined') {
            return state.basePath;
        }
        const script = getScriptElement();
        if (!script || typeof script.src !== 'string') {
            state.basePath = '';
            return state.basePath;
        }
        const src = script.src.split('?')[0].split('#')[0];
        const slashIndex = src.lastIndexOf('/');
        if (slashIndex === -1) {
            state.basePath = '';
            return state.basePath;
        }
        state.basePath = src.substring(0, slashIndex + 1);
        return state.basePath;
    }

    function normaliseLanguage(value, supportedList) {
        if (!value || typeof value !== 'string') {
            return null;
        }
        const supported = Array.isArray(supportedList) && supportedList.length ? supportedList : state.supportedLanguages;
        const trimmed = value.trim().toLowerCase();
        if (!trimmed) {
            return null;
        }
        if (supported.includes(trimmed)) {
            return trimmed;
        }
        const delimiterIndex = trimmed.indexOf('-');
        if (delimiterIndex !== -1) {
            const base = trimmed.substring(0, delimiterIndex);
            if (supported.includes(base)) {
                return base;
            }
        }
        return null;
    }

    function detectNavigatorLanguage() {
        if (typeof navigator === 'undefined') {
            return null;
        }
        const candidates = Array.isArray(navigator.languages) && navigator.languages.length
            ? navigator.languages
            : [navigator.language || navigator.userLanguage];
        for (let index = 0; index < candidates.length; index += 1) {
            const candidate = normaliseLanguage(candidates[index]);
            if (candidate) {
                return candidate;
            }
        }
        return null;
    }

    function getStoredLanguage() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return null;
        }
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            return stored ? normaliseLanguage(stored) : null;
        } catch (error) {
            return null;
        }
    }

    function persistLanguage(language) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        try {
            window.localStorage.setItem(STORAGE_KEY, language);
        } catch (error) {
            // Ignore persistence failures (e.g. quota exceeded).
        }
    }

    function ensureTrailingSlash(value) {
        if (!value || typeof value !== 'string') {
            return '';
        }
        return value.endsWith('/') ? value : `${value}/`;
    }

    function isCrossOrigin(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        if (typeof window === 'undefined' || !window.location) {
            return false;
        }
        try {
            const resolved = new URL(url, window.location.href);
            return resolved.origin !== window.location.origin;
        } catch (error) {
            return false;
        }
    }

    function computeDocumentLocaleRoot() {
        if (typeof state.documentLocalesRoot === 'string' && state.documentLocalesRoot) {
            return state.documentLocalesRoot;
        }
        if (typeof window === 'undefined' || !window.location) {
            state.documentLocalesRoot = 'locales/';
            return state.documentLocalesRoot;
        }

        let baseHref = window.location.href;
        if (typeof document !== 'undefined') {
            const baseElement = document.querySelector('base[href]');
            if (baseElement && typeof baseElement.getAttribute === 'function') {
                const candidate = baseElement.getAttribute('href');
                if (candidate && candidate.trim()) {
                    baseHref = candidate.trim();
                }
            }
        }

        try {
            const resolvedBase = new URL(baseHref, window.location.href);
            const localesUrl = new URL('locales/', resolvedBase);
            state.documentLocalesRoot = localesUrl.href;
        } catch (error) {
            try {
                const fallbackUrl = new URL('locales/', window.location.href);
                state.documentLocalesRoot = fallbackUrl.href;
            } catch (fallbackError) {
                state.documentLocalesRoot = 'locales/';
            }
        }
        return state.documentLocalesRoot;
    }

    function computeLocaleUrl(language) {
        let rootPath = '';
        if (typeof state.localesPath === 'string' && state.localesPath.trim()) {
            rootPath = state.localesPath.trim();
        } else {
            const base = deriveBasePath();
            if (base && !isCrossOrigin(base)) {
                rootPath = `${ensureTrailingSlash(base)}locales/`;
            } else {
                rootPath = computeDocumentLocaleRoot();
            }
        }
        rootPath = ensureTrailingSlash(rootPath);
        return `${rootPath}${language}.json`;
    }

    async function fetchLocale(language) {
        if (!language) {
            return null;
        }
        if (localeCache.has(language)) {
            return localeCache.get(language);
        }
        if (typeof fetch !== 'function') {
            localeCache.set(language, null);
            return null;
        }
        const url = computeLocaleUrl(language);
        try {
            const response = await fetch(url, { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error(`Failed to load locale: ${url}`);
            }
            const data = await response.json();
            localeCache.set(language, data);
            return data;
        } catch (error) {
            if (typeof console !== 'undefined' && console && typeof console.warn === 'function') {
                console.warn('[AccessibilityI18n] Unable to load locale', language, error);
            }
            localeCache.set(language, null);
            return null;
        }
    }

    function resolveNestedValue(source, path) {
        if (!source || typeof source !== 'object' || !path) {
            return null;
        }
        return path.split('.').reduce((accumulator, segment) => {
            if (accumulator && Object.prototype.hasOwnProperty.call(accumulator, segment)) {
                return accumulator[segment];
            }
            return undefined;
        }, source);
    }

    function formatTemplate(template, params) {
        if (typeof template !== 'string') {
            return '';
        }
        const safeParams = params && typeof params === 'object' ? params : {};
        return template.replace(/\{\{\s*(.+?)\s*\}\}/g, (match, token) => {
            const key = token.trim();
            if (Object.prototype.hasOwnProperty.call(safeParams, key)) {
                return safeParams[key];
            }
            return '';
        });
    }

    function formatValue(rawValue, params) {
        if (rawValue === null || typeof rawValue === 'undefined') {
            return null;
        }
        if (typeof rawValue === 'string') {
            return formatTemplate(rawValue, params);
        }
        if (typeof rawValue === 'object') {
            const count = params && typeof params.count === 'number' ? params.count : null;
            if (count !== null) {
                const pluralForm = count === 1 ? 'one' : 'other';
                if (Object.prototype.hasOwnProperty.call(rawValue, pluralForm)) {
                    return formatTemplate(rawValue[pluralForm], params);
                }
                if (Object.prototype.hasOwnProperty.call(rawValue, 'other')) {
                    return formatTemplate(rawValue.other, params);
                }
            }
            if (Object.prototype.hasOwnProperty.call(rawValue, 'default')) {
                return formatTemplate(rawValue.default, params);
            }
        }
        return null;
    }

    function resolveMessage(translations, key, params) {
        if (!translations || typeof translations !== 'object' || !key) {
            return null;
        }
        const rawValue = resolveNestedValue(translations, key);
        return formatValue(rawValue, params);
    }

    function parseParams(element) {
        const params = {};
        if (!element || typeof element !== 'object') {
            return params;
        }
        const paramsAttribute = element.getAttribute('data-i18n-params');
        if (paramsAttribute) {
            try {
                const parsed = JSON.parse(paramsAttribute);
                if (parsed && typeof parsed === 'object') {
                    Object.assign(params, parsed);
                }
            } catch (error) {
                if (typeof console !== 'undefined' && console && typeof console.warn === 'function') {
                    console.warn('[AccessibilityI18n] Failed to parse data-i18n-params for', element, error);
                }
            }
        }
        const countAttribute = element.getAttribute('data-i18n-count');
        if (countAttribute !== null) {
            const parsedCount = Number(countAttribute);
            if (!Number.isNaN(parsedCount)) {
                params.count = parsedCount;
            }
        }
        return params;
    }

    function applyTranslations(translations, root) {
        if (!translations || typeof translations !== 'object') {
            return;
        }
        const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
        if (!scope || typeof scope.querySelectorAll !== 'function') {
            return;
        }
        // Text nodes decorated with `data-i18n` receive the resolved message as their textContent.
        const textNodes = scope.querySelectorAll('[data-i18n]');
        textNodes.forEach((element) => {
            const key = element.getAttribute('data-i18n');
            if (!key) {
                return;
            }
            const params = parseParams(element);
            const message = resolveMessage(translations, key, params);
            if (typeof message === 'string') {
                element.textContent = message;
            }
        });
        // Attribute driven translations (`data-i18n-attr="aria-label:foo"`) are applied here.
        const attributeNodes = scope.querySelectorAll('[data-i18n-attr]');
        attributeNodes.forEach((element) => {
            const attributeSpec = element.getAttribute('data-i18n-attr');
            if (!attributeSpec) {
                return;
            }
            const params = parseParams(element);
            attributeSpec.split(',').forEach((entry) => {
                const parts = entry.split(':');
                if (parts.length < 2) {
                    return;
                }
                const attributeName = parts[0].trim();
                const key = parts.slice(1).join(':').trim();
                if (!attributeName || !key) {
                    return;
                }
                const message = resolveMessage(translations, key, params);
                if (typeof message === 'string') {
                    element.setAttribute(attributeName, message);
                }
            });
        });
    }

    function updateDocumentLanguage(language) {
        if (typeof document === 'undefined' || !document.documentElement) {
            return;
        }
        document.documentElement.setAttribute('lang', language || state.fallbackLanguage);
    }

    function resolveLiveRegionOption(option) {
        if (!option) {
            return null;
        }
        if (typeof option === 'string') {
            if (typeof document !== 'undefined') {
                return document.getElementById(option) || null;
            }
            return null;
        }
        if (typeof option === 'object' && option !== null && typeof option.nodeType === 'number') {
            return option;
        }
        return null;
    }

    function ensureLiveRegion() {
        if (state.liveRegion && state.liveRegion.isConnected) {
            return state.liveRegion;
        }
        if (state.liveRegionCandidate && typeof state.liveRegionCandidate === 'string') {
            state.liveRegion = resolveLiveRegionOption(state.liveRegionCandidate);
            if (state.liveRegion && state.liveRegion.isConnected) {
                return state.liveRegion;
            }
        }
        if (typeof document === 'undefined' || !document.body) {
            return null;
        }
        // Fall back to creating a hidden polite live region when the host page does not provide one.
        const region = document.createElement('div');
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('role', 'status');
        region.style.position = 'absolute';
        region.style.width = '1px';
        region.style.height = '1px';
        region.style.margin = '-1px';
        region.style.border = '0';
        region.style.padding = '0';
        region.style.clip = 'rect(0 0 0 0)';
        region.style.clipPath = 'inset(50%)';
        region.style.overflow = 'hidden';
        region.style.whiteSpace = 'nowrap';
        region.id = 'stiac-accessibility-i18n-live';
        document.body.appendChild(region);
        state.liveRegion = region;
        return state.liveRegion;
    }

    function announceLanguageChange(language, translations) {
        const region = ensureLiveRegion();
        if (!region) {
            return;
        }
        const languageNames = translations && translations.languageNames ? translations.languageNames : {};
        const languageName = languageNames && typeof languageNames[language] === 'string'
            ? languageNames[language]
            : language;
        const template = translations
            && translations.language
            && typeof translations.language.announcement === 'string'
            ? translations.language.announcement
            : 'Language changed to {{language}}.';
        region.textContent = formatTemplate(template, { language: languageName });
    }

    function notifyListeners(payload) {
        if (typeof state.onLanguageApplied === 'function') {
            try {
                state.onLanguageApplied(payload);
            } catch (error) {
                if (typeof console !== 'undefined' && console && typeof console.error === 'function') {
                    console.error('[AccessibilityI18n] onLanguageApplied callback failed', error);
                }
            }
        }
        listeners.forEach((listener) => {
            try {
                listener(payload);
            } catch (error) {
                if (typeof console !== 'undefined' && console && typeof console.error === 'function') {
                    console.error('[AccessibilityI18n] listener callback failed', error);
                }
            }
        });
    }

    async function setLanguage(requestedLanguage, options = {}) {
        const { root = null, announce = true, notify = true } = options;
        if (root && typeof root.querySelectorAll === 'function') {
            state.root = root;
        }
        let target = normaliseLanguage(requestedLanguage) || state.fallbackLanguage;
        if (!state.supportedLanguages.includes(target)) {
            target = state.fallbackLanguage;
        }
        let translations = await fetchLocale(target);
        let activeLanguage = target;
        if (!translations && target !== state.fallbackLanguage) {
            translations = await fetchLocale(state.fallbackLanguage);
            activeLanguage = state.fallbackLanguage;
        }
        if (!translations) {
            translations = {};
        }
        state.currentLanguage = activeLanguage;
        state.translations = translations;
        const scope = root || state.root || (typeof document !== 'undefined' ? document : null);
        if (scope) {
            applyTranslations(translations, scope);
        }
        updateDocumentLanguage(activeLanguage);
        persistLanguage(activeLanguage);
        const payload = { language: activeLanguage, translations };
        if (notify) {
            notifyListeners(payload);
        }
        if (announce) {
            announceLanguageChange(activeLanguage, translations);
        }
        return payload;
    }

    function getCurrentLanguage() {
        return state.currentLanguage;
    }

    function getSupportedLanguages() {
        return state.supportedLanguages.slice();
    }

    function getTranslations() {
        return state.translations;
    }

    function resolve(key, params) {
        return resolveMessage(state.translations, key, params);
    }

    function subscribe(listener) {
        if (typeof listener !== 'function') {
            return function unsubscribe() {};
        }
        listeners.add(listener);
        return function unsubscribe() {
            listeners.delete(listener);
        };
    }

    async function init(options = {}) {
        state.basePath = null;
        state.documentLocalesRoot = null;
        state.localesPath = '';
        const supported = Array.isArray(options.supportedLanguages) && options.supportedLanguages.length
            ? options.supportedLanguages.map((language) => language.toLowerCase())
            : DEFAULT_SUPPORTED.slice();
        state.supportedLanguages = Array.from(new Set(supported));
        const fallback = normaliseLanguage(options.fallbackLanguage) || DEFAULT_LANGUAGE;
        state.fallbackLanguage = state.supportedLanguages.includes(fallback) ? fallback : DEFAULT_LANGUAGE;
        if (typeof options.localesPath === 'string' && options.localesPath.trim()) {
            state.localesPath = options.localesPath.trim();
        }
        state.root = options.root && typeof options.root.querySelectorAll === 'function'
            ? options.root
            : (typeof document !== 'undefined' ? document : null);
        state.liveRegionCandidate = options.liveRegion || null;
        state.liveRegion = resolveLiveRegionOption(options.liveRegion);
        state.onLanguageApplied = typeof options.onLanguageApplied === 'function' ? options.onLanguageApplied : null;

        const initialCandidates = [
            normaliseLanguage(options.initialLanguage),
            getStoredLanguage(),
            normaliseLanguage(options.defaultLanguage),
            detectNavigatorLanguage(),
            state.fallbackLanguage
        ];
        let initialLanguage = null;
        for (let index = 0; index < initialCandidates.length; index += 1) {
            const candidate = initialCandidates[index];
            if (candidate && state.supportedLanguages.includes(candidate)) {
                initialLanguage = candidate;
                break;
            }
        }
        if (!initialLanguage) {
            initialLanguage = state.fallbackLanguage;
        }
        await setLanguage(initialLanguage, { root: state.root, announce: false, notify: true });
        return { language: state.currentLanguage, translations: state.translations };
    }

    const api = {
        init,
        setLanguage,
        getCurrentLanguage,
        getSupportedLanguages,
        getTranslations,
        resolve,
        applyTranslations,
        subscribe,
        formatMessage: formatTemplate
    };

    global.AccessibilityI18n = api;
})(typeof window !== 'undefined' ? window : globalThis);
