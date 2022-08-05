/* For the development, if you see red border on the 
Google page - you have to know: the developer forgot to turn it off. */
//document.body.style.border = "5px solid red";

const config = {
    childList: true,
    subtree: true
};
const regex = /<a.*?>[^<]*<\/a>/;

function gotItem(node, item) {
    if (typeof item.name == 'undefined') {
        item.name = "vk.com";
        browser.storage.local.set({name: "vk.com"});
    }
        DelArray = item.name.split(',');
    const check = (URL) => node.origin.includes(URL);
    if (DelArray.some(check)) {
        console.log("List del: " + node);
        node.parentElement.parentElement.parentElement.remove();
    }
}
function onError(error) {
    console.log(error)
}
/* Traverse 'rootNode' and its descendants and modify '<a>' tags */
function deleteNodes(rootNode) {
    const nodes = [rootNode];
    while (nodes.length > 0) {
        const node = nodes.shift();
        if (node.tagName === "A") {
        	browser.storage.local.get("name").then(gotItem.bind(null, node), onError);

        	if (node.origin.slice(-4).includes(".ru") || node.origin.slice(-9).includes("xn--p1ai")) {
				console.log(node);
		        /* Delete <div> element with russian href origin */
		        node.parentElement.parentElement.parentElement.remove()
            }
            else if (node.href.includes("site:") && node.href.includes(".ru")) {
                node.parentElement.parentElement.parentElement.remove()
            }
        } else {
            /* If the current node has children, queue them for further
             * processing, ignoring any '<script>' tags. */
            [].slice.call(node.children).forEach(function(childNode) {
                if (childNode.tagName !== "SCRIPT") {
                    nodes.push(childNode);
                }
            });
        }
    }
}

/* Observer1: Looks for 'div.search' */
var observer1 = new MutationObserver(function(mutations) {
    mutations.some(function(mutation) {
        if (mutation.addedNodes && (mutation.addedNodes.length > 0)) {
            const node = mutation.target.querySelector("div#search");
            if (node) {
                observer1.disconnect();
                observer2.observe(node, config);

                if (regex.test(node.innerHTML)) {
                    deleteNodes(node);
                }
                return true;
            }
        }
    });
});

/* Observer2: Listens for '<a>' elements insertion */
var observer2 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes) {
            [].slice.call(mutation.addedNodes).forEach(function(node) {
                if (regex.test(node.outerHTML)) {
                    deleteNodes(node);
                }
            });
        }
    });
});

function CheckStart(item) {
    if (typeof item.WorkState == 'undefined') {
        item.WorkState = true;
        browser.storage.local.set({WorkState: true});
    }
    if (item.WorkState) {
        console.log("Google derussification");
        observer1.observe(document.body, config);
    }
}

/* Start observing 'body' for 'div#search' */


browser.storage.local.get('WorkState').then(CheckStart)

