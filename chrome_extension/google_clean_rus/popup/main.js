document.addEventListener("click",   function (e) {
	if (e.target.classList.contains("ListBtn")) {
		function ChangeDesc(item) {
			console.log('URLS: ', item.name)
			if (typeof item.name != 'undefined'){
				if (item.name.split(",").length > 0) {
					document.querySelector('.list-urls').innerHTML = "<b>Links in list:</b><br> <ul><li>" + item.name.split(',').join("</li><li>") + "</li></ul>"
				}
				else {
					document.querySelector('.list-urls').innerHTML = "<b>Links in list:</b><br> List is empty"
				}

			}

		}

		chrome.storage.local.get(['name'], function (result) {
			ChangeDesc(result);
		});

	}

	let url_val;
	if (e.target.classList.contains("SubmitBtn")) {
		if (e.target.id === "currentSubmit") {
			url_val = document.getElementById('CurrentURLText').value;
		} else if (e.target.id === "manualSubmit") {
			url_val = document.getElementById('url_input').value;
		}

		if (!url_val.includes(".")) {
			if (e.target.id === "currentSubmit") {
				document.querySelector('.CurrentStatus').innerHTML = "Status: Please enter correct URL"
			} else if (e.target.id === "manualSubmit") {
				document.querySelector('.ManualStatus').innerHTML = "Status: Please enter correct URL"
			}
			return
		} else if (url_val.includes("http://") || url_val.includes("https://")) {
			url_val = url_val.replace(/(^\w+:|^)\/\//, '');
		}
		url_val = url_val.split("/")[0]

		var del_url;

		function onError(error) {
			console.log(error);
		}

		if (e.target.id === "currentSubmit") {
			document.querySelector('.CurrentStatus').innerHTML = "Status: Link successfully added"
		} else if (e.target.id === "manualSubmit") {
			document.querySelector('.ManualStatus').innerHTML = "Status: Link successfully added"
		}


		function ListAppend(item) {
			if (typeof item.name == 'undefined') {
				item.name = "vk.com"
			}
			let URLArray = item.name.split(",");
			URLArray.push(url_val);
			var URLSet = new Set(URLArray);
			URLArray = Array.from(URLSet);
			console.log(URLArray);
			chrome.storage.local.set({
				name: URLArray.join(',')
			});
			document.querySelector('.list-urls').innerHTML = "<b>Links in list:</b><br> <ul><li>" + URLArray.join("</li><li>") + "</li></ul>"

			return URLArray
		}

		chrome.storage.local.get(["name"], function (result) {
			ListAppend(result);
		});


	}

	if (e.target.classList.contains("DeleteBtn")) {
		if (e.target.id === "currentDelete") {
			url_val = document.getElementById('CurrentURLText').value;
		} else if (e.target.id === "manualDelete") {
			url_val = document.getElementById('url_input').value;
		}

		if (!url_val.includes(".")) {
			if (e.target.id === "currentSubmit") {
				document.querySelector('.CurrentStatus').innerHTML = "Status: Please enter correct URL"
			} else if (e.target.id === "manualSubmit") {
				document.querySelector('.ManualStatus').innerHTML = "Status: Please enter correct URL"
			}
			return
		} else if (url_val.includes("http://") || url_val.includes("https://")) {
			url_val = url_val.replace(/(^\w+:|^)\/\//, '');
		}
		url_val = url_val.split("/")[0]

		if (e.target.id === "currentDelete") {
			document.querySelector('.CurrentStatus').innerHTML = "Status: Link successfully deleted"
		} else if (e.target.id === "manualDelete") {
			document.querySelector('.ManualStatus').innerHTML = "Status: Link successfully deleted"
		}

		function ListPop(item) {
			if (typeof item.name == 'undefined') {
				item.name = "vk.com"
			}

			let URLArray = item.name.split(",");
			var DelIndex = URLArray.indexOf(url_val);
			console.log(DelIndex);
			console.log(URLArray)
			if (DelIndex !== -1) {
				URLArray.splice(DelIndex, 1);
			}
			var URLSet = new Set(URLArray);
			URLArray = Array.from(URLSet);
			if (URLArray.includes('')) {
				URLArray.splice(URLArray.indexOf(''), 1)
				URLArray.push("...")
			}
			console.log(URLArray);
			chrome.storage.local.set({
				name: URLArray.join(',')
			});
			if (URLArray.length > 0) {
				document.querySelector('.list-urls').innerHTML = "<b>Links in list:</b><br> <ul><li>" + URLArray.join("</li><li>") + "</li></ul>"
			}
			return URLArray

		}

		chrome.storage.local.get(["name"], function (result) {
			ListPop(result)
		});


	}

	let SwitchState;
	if (e.target.classList.contains("StateSwitch")) {
		SwitchState = document.getElementById('switch').checked;
		console.log('SwitchState: ' + SwitchState)
		chrome.storage.local.set({WorkState: SwitchState});
	}

});


function CheckDisp(item) {
	if (typeof item == 'undefined') {
		item.WorkState = true;
		chrome.storage.local.set({WorkState: true});
	}
	const checkboxStorageState = item.WorkState;
	const check = document.getElementById("switch");
	let currentState = false;

	if(checkboxStorageState) {
		currentState = checkboxStorageState;
		check.checked = currentState;
	}
	else if (!checkboxStorageState) {
		currentState = checkboxStorageState;
		check.checked = currentState;
	}


}

chrome.storage.local.get(['WorkState'], function (result) {
	CheckDisp(result);
})

chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
	let tab = tabs[0]; // Safe to assume there will only be one result
	document.getElementById('CurrentURLText').innerHTML = tab.url;
	console.log(tab.url);
});
