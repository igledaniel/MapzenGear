var SAAgent, SASocket;
var CHANNELID = 104;
var ProviderAppName = "GearProvider";

function get_instruction(json) {
	var html = "";
	html += "<img class=\"direction\" src=\"images/ic_route_wh_" + json.instruction + ".png\" width=\"116\" height=\"116\">";
	html += "<div class=\"distance underline\">" + json.distance + "</div>";
	html += "<div class=\"text\">" + json.street + "</div>";
	return html;
}

function set_navigation(json) {
	var nav = document.getElementById('navigation');
	nav.innerHTML = get_instruction(json);
}

function onerror(err) {
	alert(err);
}

function onreceive(channelId, data) {
	var json = $.parseJSON(data);
	if (json.connected) {
		alert("Connected to device");
	}
	else {
		set_navigation(json);
	}
}

var agentCallback = {
	onconnect : function(socket) {
		SASocket = socket;
		SASocket.setDataReceiveListener(onreceive);
		SASocket.sendData(CHANNELID, "{\"connected\" : true}");
	},
	onerror : onerror
};

var peerAgentFindCallback = {
	onpeeragentfound : function(peerAgent) {
		try {
			if (peerAgent.appName == ProviderAppName) {
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);
			}
			else {
				alert("Not expected app!! : " + peerAgent.appName);
			}
		}
		catch(err) {
			alert(err);
		}
	},
	onerror : onerror
};

function onsuccess(agents) {
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];
			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		}
		else {
			alert("Not found SAAgent!!");
		}
	}
	catch(err) {
		alert(err);
	}
}

function connect() {
	if (SASocket) {
		alert('Already connected!');
        return false;
    }
	try {
		webapis.sa.requestSAAgent(onsuccess, onerror);
	}
	catch(err) {
		alert(err);
	}
}

window.onload = function () {
	connect();
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });    
};
