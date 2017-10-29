var lastDomain = "";

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

  xhr.onreadystatechange = function () {
    console.log(xhr.readyState);
    console.log(xhr.responseText);
  }

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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var url = tab.url;
    if (url !== undefined && changeInfo.status == "complete") {
        let domain = extractRootDomain(tab.url);
        postHelper(domain);
    }
}); 

chrome.tabs.onActivated.addListener(function(activeInfo) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, function(tab){
        //alert(extractRootDomain(tab.url));
        let domain = extractRootDomain(tab.url);
        postHelper(domain);
    });
});
