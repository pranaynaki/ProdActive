chrome.browserAction.onClicked.addListener(function(tab)
{
    var newURL = "http://www.youtube.com/watch?v=oHg5SJYRHA0";
    var currentTab = tab.url;
    alert(Date.now());
    chrome.tabs.create({ url: newURL });
});

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
  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://40.74.232.157', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-type", "application/json");
  
  xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          // Request finished. Do processing here.

      }
  }
  
  let returnString = xhr.send({"domain" : domain}); 
  //alert(returnString);
  // xhr.send('string'); 
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var url = tab.url;
  if (url !== undefined && changeInfo.status == "complete") {
    let domain = extractRootDomain(tab.url)
    postHelper(domain);
}
}); 

chrome.tabs.onActivated.addListener(function(activeInfo) {
 // how to fetch tab url using activeInfo.tabid
 chrome.tabs.get(activeInfo.tabId, function(tab){
    //alert(extractRootDomain(tab.url));
    let domain = extractRootDomain(tab.url)
    postHelper(domain);
 });
});
