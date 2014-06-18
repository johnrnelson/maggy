//Include code from other places to help us do specific tasks...
var http = require('http');

var url = require('url');
var fs = require('fs');
var path = require('path');

var ApplicationCode = require('./ApplicationCode/Station')

GLOBAL.ApplicationData = null;
try {
//Now we setup our configuration stuff. Keep it clean, simple, and most of all... NOT BORING!!!
    ApplicationData = JSON.parse(fs.readFileSync('MAGGY.json', 'utf8'));


//Before we do anything.. load up our HTML and keep it in memeory. We don't want to read and write
//files too much because the network traffic and small size of the html we actually have.. AND HTML SUCKS!!!!
//ApplicationCode.ReadHTMLAllAtOnece();

// Configure our HTTP server to respond to network requests...
    var server = http.createServer(MaggyService);



// Listen on port 8000, IP defaults to 127.0.0.1 or localhost...
    // server.listen(ApplicationData.server.port, ApplicationData.server.host);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");




// Put a friendly message on the terminal
    console.log("Server running at http://127.0.0.1:8000/");

} catch (ERROR) {
    console.log("Error reading the application configuration file!!!!!!!!!\r\n\r\n ****************************************************** ");
    console.log('Error Type:' + ERROR.type + '\t' + ERROR.message);
//    console.log(ERROR.stack);
    console.log("\r\n ****************************************************** \r\n\r\n");
//    throw("Error reading config file...")
}

function MaggyService(Request, Response) {
    var url_parts = url.parse(Request.url, true);
    var query = url_parts.query;
    var pathname = url_parts.pathname;
    var headders = Request.headers;


    switch (headders.station_type) {

        case "desk":
            var clientResponsePostBody = "";
            Request.setEncoding('utf8');

            Request.on('data', function (data) {
                clientResponsePostBody += data;
            });
            Request.on('end', function () {

                Response.writeHead(200, {
                    "Content-Type": "application/json"
                });

                var clientResponseData = JSON.parse(clientResponsePostBody);
//                var actualStation;
//                request["socket"]["remoteAddress"]

                var actualStation = ApplicationData.stations[query.id];




                if (query.id == 'manager') {
                    var response2managers_request = ManagerProcessor(clientResponseData);
                    GLOBAL.managercheckdate = new Date();

//                    var updates_since_last_checked = ApplicationCode.Stations.GetUpdates(actualStation.udate);
//                    actualStation.udate = new Date().toISOString();
//                    Response.end(JSON.stringify(updates_since_last_checked));
                    Response.end(response2managers_request);
                } else {
//                    var actualStation = ApplicationCode.Stations.Lookup(Request.connection.remoteAddress);
                    actualStation.status = clientResponseData.status;
                    actualStation.udate = new Date().toISOString();

                    actualStation.notify = "Status changed as of " + new Date();
                    Response.end(JSON.stringify(actualStation));
                }


//
//                if (clientResponseData.id == 'manager') {
//
//                    Response.end(JSON.stringify(ApplicationCode.Stations.STATIONS));
//
//
//                } else {
//                    if (!actualStation.displayid) {
//                        actualStation.id = clientResponseData.id;
//                    }
//                    actualStation.status = clientResponseData.status;
//                    Response.end(JSON.stringify(actualStation));
//
//                }


            });
            break;


        default: //if all else fails then we fall back on this bad boy...
            switch (pathname) {
                case "/manager":
                    pathname = '/manager.html';
//                    Response.writeHead(200, {
//                        "Content-Type": "text/html"
//                    });
//
//                    Response.end(ApplicationCode.Stations.HTMLManager);

                    break;
                case "/station":
                    pathname = '/station.html';
//                    Response.writeHead(200, {
//                        "Content-Type": "text/html"
//                    });
//
//                    Response.end(ApplicationCode.Stations.HTMLStation);

                    break;
                default:
                    if ((pathname == '') | (pathname == '/')) {
                        pathname = 'HTML/index.html'
                    }


                    break;

            }

var path2file = path.join(__dirname, pathname);
            fs.readFile(path2file, 'utf8', function (err, data) {
//                if ('HTML' + path == 'HTML/maggy.appcache'){
//                    fuck=GetFileTypeByFilePath(path);
//                    grrr=3;
//                }

                if (err) {
                    console.log(path2file)
                    Response.writeHead(200, {
                        "Content-Type": "text/html"
                    });

                    Response.end('ERROR READING FILE');
                } else {
                    Response.writeHead(200, {
                        "Content-Type": GetFileTypeByFilePath(pathname)
                    });

                    Response.end(data);
                }
            });
            break;
    }
}

function ManagerProcessor(RequestedJSON) {
    var returned_value = {};
    switch (RequestedJSON.request) {
        case "refresh":
            returned_value = ApplicationCode.Stations.GetUpdates("2011/02/01");
            break;
        case "statusupdate":
            returned_value = ApplicationCode.Stations.GetUpdates(GLOBAL.managercheckdate);
            break;
        default:
            returned_value.notify = "unknown..."
            break;
    }

    return JSON.stringify(returned_value);
}

function GetFileTypeByFilePath(FilePath) {
    var DEFAULT_MIME = 'application/octet-stream';
    var index = FilePath.lastIndexOf(".");
    var returnValue = '';

    var Known_File_Types = {
        ".appcache": "text/cache-manifest",
        ".3gp": "video/3gpp",
        ".a": "application/octet-stream",
        ".ai": "application/postscript",
        ".aif": "audio/x-aiff",
        ".aiff": "audio/x-aiff",
        ".asc": "application/pgp-signature",
        ".asf": "video/x-ms-asf",
        ".asm": "text/x-asm",
        ".asx": "video/x-ms-asf",
        ".atom": "application/atom+xml",
        ".au": "audio/basic",
        ".avi": "video/x-msvideo",
        ".bat": "application/x-msdownload",
        ".bin": "application/octet-stream",
        ".bmp": "image/bmp",
        ".bz2": "application/x-bzip2",
        ".c": "text/x-c",
        ".cab": "application/vnd.ms-cab-compressed",
        ".cc": "text/x-c",
        ".chm": "application/vnd.ms-htmlhelp",
        ".class": "application/octet-stream",
        ".com": "application/x-msdownload",
        ".conf": "text/plain",
        ".cpp": "text/x-c",
        ".crt": "application/x-x509-ca-cert",


        ".crx": "application/x-chrome-extension", //CHROME extension stuff...


        ".css": "text/css",
        ".csv": "text/csv",
        ".cxx": "text/x-c",
        ".deb": "application/x-debian-package",
        ".der": "application/x-x509-ca-cert",
        ".diff": "text/x-diff",
        ".djv": "image/vnd.djvu",
        ".djvu": "image/vnd.djvu",
        ".dll": "application/x-msdownload",
        ".dmg": "application/octet-stream",
        ".doc": "application/msword",
        ".dot": "application/msword",
        ".dtd": "application/xml-dtd",
        ".dvi": "application/x-dvi",
        ".ear": "application/java-archive",
        ".eml": "message/rfc822",
        ".eps": "application/postscript",
        ".exe": "application/x-msdownload",
        ".f": "text/x-fortran",
        ".f77": "text/x-fortran",
        ".f90": "text/x-fortran",
        ".flv": "video/x-flv",
        ".for": "text/x-fortran",
        ".gem": "application/octet-stream",
        ".gemspec": "text/x-script.ruby",
        ".gif": "image/gif",
        ".gz": "application/x-gzip",
        ".h": "text/x-c",
        ".hh": "text/x-c",
        ".htm": "text/html",
        ".html": "text/html",
        ".ico": "image/vnd.microsoft.icon",
        ".ics": "text/calendar",
        ".ifb": "text/calendar",
        ".iso": "application/octet-stream",
        ".jar": "application/java-archive",
        ".java": "text/x-java-source",
        ".jnlp": "application/x-java-jnlp-file",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".js": "application/javascript",
        ".json": "application/json",
        ".log": "text/plain",
        ".m3u": "audio/x-mpegurl",
        ".m4v": "video/mp4",
        ".man": "text/troff",
        ".mathml": "application/mathml+xml",
        ".mbox": "application/mbox",
        ".mdoc": "text/troff",
        ".me": "text/troff",
        ".mid": "audio/midi",
        ".midi": "audio/midi",
        ".mime": "message/rfc822",
        ".mml": "application/mathml+xml",
        ".mng": "video/x-mng",
        ".mov": "video/quicktime",
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".mp4v": "video/mp4",
        ".mpeg": "video/mpeg",
        ".mpg": "video/mpeg",
        ".ms": "text/troff",
        ".msi": "application/x-msdownload",
        ".odp": "application/vnd.oasis.opendocument.presentation",
        ".ods": "application/vnd.oasis.opendocument.spreadsheet",
        ".odt": "application/vnd.oasis.opendocument.text",
        ".ogg": "application/ogg",
        ".p": "text/x-pascal",
        ".pas": "text/x-pascal",
        ".pbm": "image/x-portable-bitmap",
        ".pdf": "application/pdf",
        ".pem": "application/x-x509-ca-cert",
        ".pgm": "image/x-portable-graymap",
        ".pgp": "application/pgp-encrypted",
        ".pkg": "application/octet-stream",
        ".pl": "text/x-script.perl",
        ".pm": "text/x-script.perl-module",
        ".png": "image/png",
        ".pnm": "image/x-portable-anymap",
        ".ppm": "image/x-portable-pixmap",
        ".pps": "application/vnd.ms-powerpoint",
        ".ppt": "application/vnd.ms-powerpoint",
        ".ps": "application/postscript",
        ".psd": "image/vnd.adobe.photoshop",
        ".py": "text/x-script.python",
        ".qt": "video/quicktime",
        ".ra": "audio/x-pn-realaudio",
        ".rake": "text/x-script.ruby",
        ".ram": "audio/x-pn-realaudio",
        ".rar": "application/x-rar-compressed",
        ".rb": "text/x-script.ruby",
        ".rdf": "application/rdf+xml",
        ".roff": "text/troff",
        ".rpm": "application/x-redhat-package-manager",
        ".rss": "application/rss+xml",
        ".rtf": "application/rtf",
        ".ru": "text/x-script.ruby",
        ".s": "text/x-asm",
        ".sgm": "text/sgml",
        ".sgml": "text/sgml",
        ".sh": "application/x-sh",
        ".sig": "application/pgp-signature",
        ".snd": "audio/basic",
        ".so": "application/octet-stream",
        ".svg": "image/svg+xml",
        ".svgz": "image/svg+xml",
        ".swf": "application/x-shockwave-flash",
        ".t": "text/troff",
        ".tar": "application/x-tar",
        ".tbz": "application/x-bzip-compressed-tar",
        ".tci": "application/x-topcloud",
        ".tcl": "application/x-tcl",
        ".tex": "application/x-tex",
        ".texi": "application/x-texinfo",
        ".texinfo": "application/x-texinfo",
        ".text": "text/plain",
        ".tif": "image/tiff",
        ".tiff": "image/tiff",
        ".torrent": "application/x-bittorrent",
        ".tr": "text/troff",
        ".ttf": "application/x-font-ttf",
        ".txt": "text/plain",
        ".vcf": "text/x-vcard",
        ".vcs": "text/x-vcalendar",
        ".vrml": "model/vrml",
        ".war": "application/java-archive",
        ".wav": "audio/x-wav",
        ".wma": "audio/x-ms-wma",
        ".wmv": "video/x-ms-wmv",
        ".wmx": "video/x-ms-wmx",
        ".wrl": "model/vrml",
        ".wsdl": "application/wsdl+xml",
        ".xbm": "image/x-xbitmap",
        ".xhtml": "application/xhtml+xml",
        ".xls": "application/vnd.ms-excel",
        ".xml": "application/xml",
        ".xpm": "image/x-xpixmap",
        ".xsl": "application/xml",
        ".xslt": "application/xslt+xml",
        ".yaml": "text/yaml",
        ".yml": "text/yaml",
        ".zip": "application/zip"
    };


    returnValue = Known_File_Types[FilePath.substring(index).toLowerCase()];
    if (!returnValue) {
        return DEFAULT_MIME;
    }
    else {
        return returnValue;
    }

}
