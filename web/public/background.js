chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ 'url': chrome.extension.getURL('index.html') }, function (tab) {
        // Tab opened.
    });
});

const dataUrl = chrome.runtime.getURL('data/data.json');
let data = [];
fetch(dataUrl).then(response => response.json()).then(json => data = json);

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    suggest(getSuggestions(text));
});

chrome.omnibox.onInputEntered.addListener(url => chrome.tabs.create({ url }));

const MAX_SUGGESTIONS = 6;

getSuggestions = (value) => {
    if (!value) return [];

    const suggestions = [];
    let count = 0;

    for (let menu of data) {
        for (let e of menu.children) {
            const nameIndex = e.name.toLowerCase().indexOf(value.toLowerCase());
            const contentIndex = e.content.toLowerCase().indexOf(value.toLowerCase());
            if (nameIndex !== -1 || contentIndex !== -1) {
                if (count < MAX_SUGGESTIONS) {
                    count++;
                    suggestions.push({
                        content: e.url,
                        description: `${e.name} - ${menu.name} - ${e.content}`,
                    });
                } else {
                    return suggestions;
                }
            }
        }
    }

    return suggestions;
}