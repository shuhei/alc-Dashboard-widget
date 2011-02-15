var MIN_WIDTH = 280;
var MIN_HEIGHT = 100;

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

var frontSize = {w: window.innerWidth, h: window.innerHeight};
function saveSize() {
    frontSize.w = window.innerWidth;
    frontSize.h = window.innerHeight;
}
function loadSize() {
    window.resizeTo(frontSize.w, frontSize.h);
}
//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");
    
    saveSize();
    window.resizeTo(280, 380);
    
    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }
    
    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
    loadSize();
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}

function updateMessage(message) {
    var area = document.getElementById("content");
    area.innerHTML = message;
}

function showLoadingMessage() {
    updateMessage("loading");
}

function clearMessage() {
    updateMessage("");
}

var httpFeedRequest = null;

function keywordSearched(event)
{
    var keyword = event.target.value;
    if (keyword === "") {
        clearMessage();
        return;
    }
    
    showLoadingMessage();
    
    // Abort any pending request before starting a new one
    if (httpFeedRequest != null) {
        httpFeedRequest.abort();
        httpFeedRequest = null;
    }
    httpFeedRequest = new XMLHttpRequest();

    // Function callback when feed is loaded
    httpFeedRequest.onload = function (e)
    {
        if (httpFeedRequest.responseText) {
        var match = httpFeedRequest.responseText.match(/<div id="resultsList".*?>([\s\S]*?)<\/ul>/i);
            if (match) {
                updateMessage(match[1] + "</div>");
            } else {
                updateMessage("not found");
            }
        } else {
            updateMessage("something went wrong.");
        }

        // Request is no longer pending
        httpFeedRequest = null;
    }
    httpFeedRequest.open("GET", "http://eow.alc.co.jp/" + keyword + "/UTF-8/?ref=sa");
    httpFeedRequest.setRequestHeader("Cache-Control", "no-cache");

    // Send the request asynchronously
    httpFeedRequest.send(null);
}

// resize
// Standard widget resize code follows...

var growboxInset;
 
function mouseDown(event)
{
    document.addEventListener("mousemove", mouseMove, true);
    document.addEventListener("mouseup", mouseUp, true);
    
    growboxInset = {x:(window.innerWidth - event.x), y:(window.innerHeight - event.y)};
    
    event.stopPropagation();
    event.preventDefault();
}
 
function mouseMove(event)
{
	// checks if the reported event data is legit or not
	if((event.x == -1 ) ) { return; }
	
	var x = event.x + growboxInset.x;
    var y = event.y + growboxInset.y;
 
	if(x < MIN_WIDTH)     // an arbitrary minimum width
		x = MIN_WIDTH;

	if(y < MIN_HEIGHT)     // an arbitrary minimum height
		y = MIN_HEIGHT;
    
    window.resizeTo(x,y);
 
    event.stopPropagation();
    event.preventDefault();
}
 
function mouseUp(event)
{
    document.removeEventListener("mousemove", mouseMove, true);
    document.removeEventListener("mouseup", mouseUp, true); 
 
    event.stopPropagation();
    event.preventDefault();
}
