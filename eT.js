//License
//Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
//http://creativecommons.org/licenses/by-sa/3.0/
// Elastic Transfer
// elastic.transfer@gmail.com
//V0.3.9 - 30/04/2014

var http = require('http')
  , https = require('https')
  , express = require('express')
  , events = require('events')
  , net = require('net')
  , util = require('util')
  , path = require('path')
  , program = require('commander')
  , localtunnel = require('localtunnel');

var optimist = require('optimist');
var nodemailer = require('nodemailer-noiconv');
var fs = require('fs');
var os=require('os');


var Imap = require('imap'),
   inspect = require('util').inspect;


var request = require('request');
var prompt = require('prompt');
var open = require('open');


var imap_server = "imap.gmail.com";
var imap_port = true; // true = 993, false = 143
var choose_mailbox = "INBOX";
var smtp_server = 'smtp.gmail.com';
var smtp_port =  587;

var publicport = 61949;
var my_host_UUID;
var  address = [];
var  emailuid = [];
var  get_mh = [];
var paddress;

var service = 'http://localhost:'+ publicport + '/gui'

program
  .option('--yourEmailAddress  [yourEmailAddress]', 'yourEmailAddress')
  .option('--yourEmailUsername [yourEmailUsername]', 'yourEmailUsername')
  .option('--yourEmailPassword [yourEmailPassword]', 'yourEmailPassword')
  .parse(process.argv);

var getip = function(callback) {

var ifaces=os.networkInterfaces();
for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
       if (details.address!='127.0.0.1') {

      address.push(details.address);

      ++alias;
     }
    }
  });
}

}



var tweet  = function(message,sub,from,to, callback) {

if (to == '0')
{
to = from;
}

nodemailer.send_mail(
    // e-mail options
    {
        sender: from,
        to:to,
        subject:'etjs:' + sub,
       // html: '',
        body:message
    },
    // callback function
    function(error, success){
        console.log('Message ' + success ? 'sent' : 'failed');
    }
);

}

/*newcode*/

var ic  = function(email,user,pass,imap_port, callback) {

	var imap = new Imap({
	user: user,
	password: pass,
	host: imap_server,
	port: 993,
	tls: true,
	tlsOptions: { rejectUnauthorized: false }
	});

	function openInbox(cb) {
		imap.openBox(choose_mailbox, true, cb);
	}

	imap.once('ready', function() {
	
		openInbox(function(err, box) {
			if (err) throw err;
		
			imap.on('mail', function(numNewMsgs){
                          
		             console.log('numNewMsgs #%d', numNewMsgs);
                             
				console.log('box.messages.total #%d', box.messages.total);


                                var nM = box.messages.total-numNewMsgs+1;

                                 console.log('nM #%d', nM);

				var f = imap.seq.fetch(nM + ':' + box.messages.total , { bodies: ['HEADER.FIELDS (SUBJECT)', 'TEXT'] });

				f.on('message', function(msg, seqno) {

					console.log('Message #%d', seqno);				
					var prefix = '(#' + seqno + ') ';
					var title = '';
					var body = '';
		  
					
		  
					msg.on('body', function(stream, info) {
			
						if (info.which === 'TEXT')
							console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
					
						var buffer = '', count = 0;
						
						
						stream.on('data', function(chunk) {
							count += chunk.length;
							buffer += chunk.toString('utf8');
							if (info.which === 'TEXT')
								console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
						});
						stream.once('end', function() {
							if (info.which !== 'TEXT'){
								console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
								title = Imap.parseHeader(buffer).subject;
							}else{
								console.log(prefix + 'Body [%s] Finished --> [%s]', inspect(info.which), inspect(buffer));
								body = buffer;
							}
						});
					});

					msg.once('attributes', function(attrs) {
						console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
					});

					
					msg.once('end', function() {
					
						console.log(prefix + 'Finished ');
						
						if (title == 'etjs:mh'){
							var dd = body.toString().split('etjsbody:'); //etjsbody
							
								//tweet('etjsbody:'+ 'http://' + address[0] + ':' + publicport + ',' + 'http://'+ address[1] + ':' + publicport + ',' + paddress, 'host',email,0, function(){});
							tweet('etjsbody:'+ 'http://' + address[0] + ':' + publicport + ',' + paddress, 'host',email,0, function(){});
						}

						if (title == 'etjs:host') {
							var ddd = body.toString().split('etjsbody:'); //etjsbody
							get_mh.push(ddd[1]);
						}

						if (title.toString().indexOf('etjs:elf') != -1  ) {
							var ddddd = body.toString().split('etjsbody:'); //etjsbody	      
							var outname_and_path1 = ddddd[1].split('-:');	      
							fs.createWriteStream(__dirname + '/eTshare/elfs/mdata/' + outname_and_path1[0]+ '.elf.txt').write(ddddd[1]);
						}

						if (title.toString().indexOf('etjs:elsize') != -1  ) {
							var dddd = body.toString().split('etjsbody:'); //etjsbody	      
							var outname_and_path = dddd[1].split('-:');
							fs.createWriteStream(__dirname + '/eTshare/elfs/mdata/' + outname_and_path[0]+ '.elfsize.txt').write(outname_and_path[1]);
						}
					});
				});

				f.once('error', function(err) {
					console.log('Fetch error: ' + err);
				});

				f.once('end', function() {
					console.log('Done fetching new message!');          
				});
			});
		});
	});

	imap.once('error', function(err) {
		console.log(err);
	});

	imap.once('end', function() {
		console.log('client on END');
		ic(email,user,pass,imap_port, function(){});
	});

	imap.connect();
};


/*end newcode*/



var properties = [
    {
      name: 'yourEmailAddress', //result.emailaddress
    },
    {
      name: 'yourEmailUsername',
    },
    {
      name: 'yourEmailPassword',
      hidden: true
    }
  ];



 prompt.start();

 prompt.get(properties, function (err, result) {
    if (err) { console.log('e-mail password error 1098 :: '+ err); }

nodemailer.SMTP = {
    host: smtp_server, //
    port: smtp_port, //
    use_authentication: true, // optional, false by default
    user: result.yourEmailUsername, // used only when use_authentication is true
    pass: result.yourEmailPassword // used only when use_authentication is true
}

ic(result.yourEmailAddress,result.yourEmailUsername,result.yourEmailPassword,imap_port, function(){});

getip(function(){});

var appr = express();
appr.use(express.bodyParser());
appr.configure(function(){
appr.use(express.directory(__dirname + '/eTshare'));
      appr.use(express.static(__dirname + '/eTshare'));

});

appr.get('/ic', function(req, res){

    ic(result.yourEmailAddress,result.yourEmailUsername,result.yourEmailPassword,imap_port, function(){});

    res.send('trying to reconnect to IMAP server...');
});

appr.get('/r', function(req, res){

   var snumber = req.query["snumber"];
   var ntotal = req.query["ntotal"];
    var infile = req.query["infile"];
    var outfile = req.query["outfile"];
     var elfv = req.query["elfv"];
    var outfr=outfile.replace("elfs/","");

    var stat = fs.statSync( __dirname + '/eTshare/' + infile);
    if (!stat.isFile()) return;

      var t = snumber - 1;
       var ch_size = Math.floor(stat.size/ntotal );
                   var remainder = stat.size % ntotal ;


			var start = ((ch_size)*t +1 );
			var end =  ch_size*(t+1);

			if (t == 0)
			{
			start = (ch_size)*t;
			}
			if (t == ntotal-1)
				{
			end = (ch_size*(t+1)+remainder);
			}


  var range = req.header('Range');
  if (range != null) {
    start = parseInt(range.slice(range.indexOf('bytes=')+6,
      range.indexOf('-')));
    end = parseInt(range.slice(range.indexOf('-')+1,
     range.length));
  }
  if (isNaN(end) || end == 0) end = stat.size-1;

  if (start > end) return;


  var date = new Date();

  res.writeHead(206, { // NOTE: a partial http response
    // 'Date':date.toUTCString(),
    'Connection':'close',
    // 'Cache-Control':'private',
    // 'Content-Type':'video/webm',
    // 'Content-Length':end - start,
    'Content-Range':'bytes '+start+'-'+end+'/'+stat.size,
    // 'Accept-Ranges':'bytes',
    // 'Server':'CustomStreamer/0.0.1',
    'Transfer-Encoding':'chunked'
    });

  var stream = fs.createReadStream(__dirname + '/eTshare/' + infile,
    { flags: 'r', start: start, end: end});
  stream.pipe(res);
  if (snumber == '1' && elfv != '1')
   {
    tweet('etjsbody:' + outfr + '-:' + stat.size , 'elsize:'+ outfr ,result.yourEmailAddress,0, function(){});
     }
});

appr.get('/gui', function(req, res){

      res.render('index5.ejs', {
             layout:  false
	});
});

appr.get('/mh', function(req, res){

              get_mh.length = 0;
              console.log('address after :: ' + address)
              console.log('get_mh after :: ' + get_mh)

	 tweet('etjsbody:mh','mh',result.yourEmailAddress,0,function(){});

	  res.send('please wait while we are fetching  Active Hosts');


                    	});

appr.get('/mh_result', function(req, res){

         if( get_mh == '')
 		{
           res.send('Go to STEP 1 and Click: Request "Active Hosts" or just wait... ');
		}else {
	 res.send(get_mh.toString());

	 }

	});
appr.get('/rq', function(req, res){

   var source = req.query["source"];
   var snumber = req.query["snumber"];
   var ntotal = req.query["ntotal"];
    var infile = req.query["infile"];
    var outfile = req.query["outfile"];
  var elfsize = req.query["elfsize"];



   var inelf = infile.split('/');

   if (inelf[0] == 'elfs')
      {

       var t = snumber - 1;
       var ch_size = Math.floor(elfsize/ntotal );
                   var remainder = elfsize % ntotal ;


			var start = ((ch_size)*t +1 );
			var end =  ch_size*(t+1);

			if (t == 0)
			{
			start = (ch_size)*t;
			}
			if (t == ntotal-1)
				{
			end = (ch_size*(t+1)+remainder);
			}


        var pos = parseInt(start,10);


        var drq =  source + '/r/?' + 'infile=' + infile  + '&snumber=1' + '&ntotal=1' + '&outfile=' + outfile +'&elfv=1'  ;

     fs.exists(__dirname + '/eTshare/' + outfile, function(exists) {
	 if (exists) {

     request(drq).pipe(fs.createWriteStream(__dirname + '/eTshare/' + outfile ,{'flags': 'r+', start: pos}));
    } else{

   request(drq).pipe(fs.createWriteStream(__dirname + '/eTshare/' + outfile ,{'flags': 'w+', start: pos}));
   }

 });
     } else {
    var drq =  source + '/r/?' + 'infile=' + infile  + '&snumber=' + snumber + '&ntotal=' + ntotal + '&outfile=' + outfile;


    request(drq).pipe(fs.createWriteStream(__dirname + '/eTshare/' + outfile));
      }
      res.send('just moving files ');
	});
/* make your request*/
appr.post('/hr', function(req, res){


        var source = req.body.user.source;
        var destination = req.body.user.destination;
	var infile = req.body.user.infile;
	var outfile = req.body.user.outfile;

       if (outfile == "'Output File'" || outfile == '') {
        var outf = infile.split('/');
      outfile = outf.pop()

     }

    var sources = source.split(',');
    var  destinations = destination.split(',');
    var sl = sources.length;
    var dl =  destinations.length;
    if (sources[0] == 'elf')
	{


       fs.exists(__dirname + '/eTshare/elfs/mdata/' + infile + '.elf.txt' , function(exists) {
	 if (exists) {
    fs.readFile(__dirname + '/eTshare/elfs/mdata/' + infile + '.elf.txt', 'utf8', function (err,data) {
  if (err) {
     console.log('error :: 107 ::' + err);

  }

   fs.exists(__dirname + '/eTshare/elfs/mdata/' + infile + '.elfsize.txt', function(exists) {
	 if (exists) {
    fs.readFile(__dirname + '/eTshare/elfs/mdata/' + infile + '.elfsize.txt', 'utf8', function (err,ds) {
  if (err) {
     console.log('error :: 1077 ::' + err);

  }

  var d  = data.split('-:');

   for(var i = 0; i < d[2]  ; i++) {
     var sn = i+1;
    var rq = destinations[0] + '/rq/?source=' + d[i+3]+ '&infile=elfs/'  + infile + '&outfile=transfers/'  + outfile +'&snumber=' + sn + '&ntotal=' + d[2] + '&elfsize='+ ds;

   //dest = dest + destinations[i] + ':';
    request(rq, function (error, response, body) {
  if (!error && response.statusCode == 200) {

  }
  })// end of request
}// end of for loop

});

}
 });


});

	}  else  {


	}

 });






    }else {

   var dest = '-:';

for(var i = 0; i < dl  ; i++) {
     var sn = i+1;
    var rq = destinations[i] + '/rq/?source=' + sources[0]+ '&infile='  + infile + '&outfile=elfs/'  + outfile +'&snumber=' + sn + '&ntotal=' + dl;

   dest = dest + destinations[i] + '-:';
    request(rq, function (error, response, body) {
  if (!error && response.statusCode == 200) {

  }
  })// end of request
}// end of for loop

 tweet('etjsbody:'+ outfile + '-:' + sn + '-:' + dl + dest, 'elf:'+ outfile ,result.yourEmailAddress,0, function(){});
}
res.send('the transfer just started, please go back to GUI: http://localhost:'+ publicport + '/gui');


});


appr.listen(publicport, function() {

});

localtunnel(publicport, function(err, tunnel) {
   if (err) {console.log('error :: 121 :: problem on localtunnel : ' + err);}
    tunnel.url;
    paddress=tunnel.url;
    console.log(tunnel.url);
});


open(service, function (err) {
  if (err) {console.log('error :: 120 :: please open your browser, pointing : ' + service);}
 //else { console.log('status :: running');}
  console.log('status :: running');
});


});// end of prompt

