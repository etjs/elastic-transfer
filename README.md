
What is eT?

Elastic Transfer (eT) is a platform trying to efficiently organize, manage and transfer your files. Nowdays, everyone owns or administrates more than one PCs, eT can help you build a unified computing infrastructure in order to dynamically manage and share your PCs and files.

When to use eT?

1. You are at work: and you want to, directly, transfer your files from your workstation to an other PC at home. You have not setup your firewall at home to accept incoming traffic and it does not have a public DNS name; eT will do the job!

2. You are visiting a friend: and your Boss reqeust a file ASAP. The specific file is at your PC at home: it seems that you have to go back. Do not worry, you can simple use your friends laptop in order to begin a third-party data transfer, between your PC at home and your boss's workstation.

3. You are on the road, behind fifteen firewalls, and want to share some web application you're developing locally, or just share a set of files with someone real quick; eT will do the job!

4. By using eT you can, also, build your personal Cloud: by adopting all the benefits that a cloud infrastructure can provide, but without its drawbacks. You can download or directly send your files anywhere. You do not need to pay for your Cloud storage space, you do not need to store your files at an infrastructure that you are not controlling and probably you do not trust. You can unify your distributed storage space in one virual disk and finally, you can split and distributed a file, between your PCs, based on your needs (e.g: you can split a file to three parts for performance. Each part is located at a different PC at a different place. Now you can retrieve it in parallel and achieve better transfer rates. You can also distribute the same file between your PCs for redundancy).

Our Motivation

Nowadays, world wide scientific experiments are generating datasets that are increasing exponentially in both complexity and volume, making their analysis, archival, and sharing one of the grand challenges of the 21st century. Seymour Cray once said "a supercomputer is a device for turning compute-bound problems into I/O-bound problems" which addresses the fundamental shift in bottlenecks as supercomputers gain more parallelism at exponential rates, the storage infrastructure performance is increasing at a significantly lower rate. This implies that the data management and data flow between the storage and compute resources is becoming the new bottleneck for large-scale applications. The support for data intensive computing is critical to advancing modern science as storage systems have experienced a gap between capacity and bandwidth. Exascale systems will require I/O bandwidth proportional to their computational capacity. Our goal is to create an "ad-hoc" nearby storage infrastracture capable to decide the file partition distribution schema, by taking on account a user or an application request, a domain or a Virtual Organization policy. In this way, we can form multiple instances of smaller capacity higher bandwidth storage utilities capable to respond in an ad-hoc manner. This approach, focusing on flexibility, can scale both up and down and so can provide more cost effective infrastructures for both large scale and smaller size systems as well.

Install node.js

At the following link you can find details on how to install Node.js via package manager, Wiki by joyent:

https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Install "elastic-transfer" Node.js module

At a node.js command promt, just execute :

npm install elastic-transfer

How to Run eT

At a node.js command promt, execute the following :

cd node_modules

cd elastic-transfer

node eT.js 


(depending on your system you may need to run this as a Superuser)

You will be prompted to enter :

1. Your e-mail address  (e.g: elastic.transfer@gmail.com)
2. Your e-mail username (e.g: elastic.transfer)
3. Your e-mail password (e.g: *********)

Attention !!! 

the eT module send the above info to your e-mail server directly and not to us, We are not able to obtain your e-mail credentials.

The default configuration is using the gmail SMTP and IMAP server, your are free to change e-mail server  settings by editing the eT.js file.



How to Use eT

After running: node eT.js, the eT module will automatically open a browser window, pointing at the eT GUI (http://localhost:61949/gui). You may go to the last box (Action box) and fill it with the following:

A: 'Source Host' or 'elf', elf stands for "elastic file". We are calling "elfs" the files that have been transfered between hosts by using the eT platform. eT is keeping the file metadata, such as file size and distribution schema, in this way it is easier for us to rebuild the file, search it and transfer it again and again based to our needs (e.g: http://192.168.2.2:61949, http://zeus.3x.et-js.org:443 or elf )

B: 'Destination Host' or 'comma separated Hosts', we must choose at which host we want to send our file. If we want to split and distribute the file between our PCs then we can use a comma separated destination hosts (e.g: http://192.168.2.2:61949, http://zeus.3x.et-js.org:443, http://192.168.2.5:61949)

C: 'Source File' or 'elf', we must choose which file we want to transfer (e.g: root/et_128_v3.png) we are transfering files locating in the "eTshare" folder. If the file is an "elf" with you do not need to give the full path (e.g A: elf, C:et_128_v3.png).

D: 'Output File'. The file will be transfered to the destination host with this name, just choose one, if not it will be the same with the 'Source File' (e.g: et_128_v3.png).

If you need help, in order to fill in A-D, just use the other boxes above the "Action Box"
After the data transfer you will find the 'Output File' at the folder "eTshare/elfs" at the 'Destination Host'

FAQ

eT is using port: 61949

You must accept outbound traffic to at least one port of the following: 

61949, 443

You must ensure connectivity with your IMAP and SMTP server

TIPs

After running the eT module, your host will serving content, at least, through two identifiers one public (e.g:http://zeus.3x.et-js.org:443 )  and one private (e.g: http://localhost:61949 ). Do not use the public identifier for inter-cluster or LAN communication.

License
    
      Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)

      http://creativecommons.org/licenses/by-sa/3.0/
 
Contact:

elastic.transfer AT gmail.com
