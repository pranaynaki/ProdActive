var lastDomain = "";
var timer = null;
var mode = "none";
var blacklist = [];
var waitTime = 0;

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

function extractRootDomain(url) {
  var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain 
  if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 1].length == 2 && splitArr[arrLen - 1].length == 2) {
          //this is using a ccTLD
          domain = splitArr[arrLen - 3] + '.' + domain;
      }
  }
  return domain;
}

function postHelper(domain) {
  // don't send post req if same domain was switched to
  if(domain === lastDomain) return;
  lastDomain = domain;
  //alert(domain);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://40.74.232.157/website-change', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/json");

  // xhr.addEventListener("load", function () {
  //   alert(xhr.status);
  // });

  /* xhr.onreadystatechange = function() {//Call a function when the state changes.
    console.log(xhr.status);
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          // Request finished. Do processing here.
          alert(xhr.responseText);
          // alert(lastDomain);

      } else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 0) {
        alert(xhr.responseText + " wrong status " + xhr.status);
      }
      //alert("hi there");
  } */
  
  xhr.send(JSON.stringify({"domain" : domain})); 
  
  // xhr.send('string'); 
}

function domainCheck(domain) {
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", 'http://40.74.232.157/blacklist');

    xhr.onreadystatechange = function () {
        if (this. readyState == 4 && this.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            console.log(obj);
            mode = obj.mode;
            blacklist = obj.domains;
            waitTime = obj.page_time;
        }
        if (blacklist.indexOf(domain) != -1) {
            if(mode == "warn") {
                timer = null;
                alert("You should not be on " + domain);
            }
            if(mode == "block") {
                chrome.tabs.insertCSS({code: "body{ opacity: 0;}"});
            }
        }
    }

    xhr.send();
    console.log("Getting Server Data!");

    if(waitTime != 0 && timer === null) {
        timer = window.setTimeout(() => {
            alert("You've been here too long!");
            timer = null;
        }, waitTime*1000);
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var url = tab.url;
    if (url !== undefined && changeInfo.status == "complete") {
        let domain = extractRootDomain(tab.url);
        postHelper(domain);
        domainCheck(domain);
    }
}); 

chrome.tabs.onActivated.addListener(function(activeInfo) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, function(tab){
        //alert(extractRootDomain(tab.url));
        let domain = extractRootDomain(tab.url);
        postHelper(domain);
        domainCheck(domain);
    });
});
