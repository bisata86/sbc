var ss = 'cane'
var key = 'im86!'
var hidden = CryptoJS.AES.encrypt(ss, key).toString()
var a = ['a','b','c','d','e','f','g','h','i','l','m','n'];
a = [];
var b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!';
//var b = 'im!86';

for (var i = b.length - 1; i >= 0; i--) {
   a.push(b[i])
}
var base = JSON.parse(JSON.stringify(a))
var limit = 1000000;
var strlimit = 10;
var sols = [];

/*for (var i = 0; i < a.length; i++) {
   var u = dc(hidden,a[i])
   if(u==ss) {
      console.log(a[i],u)
      alert('fine')
   }
}*/
var done = false;
while (a.length<limit && !done) {
   step()
}


function step() {
   var p = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
   var nrFails = 0;
   while(p.length>strlimit || a.indexOf(p)!=-1) {
      var item1 = a[Math.floor(Math.random()*a.length)];
      var item2 = base[Math.floor(Math.random()*base.length)];
      p = item1+item2;
      nrFails++;
   }
   //if(Number.isInteger(a.length*100/limit))
   console.log(a.length*100/limit+' % / '+nrFails+' / '+p)  


   a.push(p)
   var u = dc(hidden,p)
   if(u==ss) {
   //if(p==key) {
      console.log(p)
      sols.push(u+' '+p)
      done = true;
   }
   /*if(u) {
      if(u.length>3)
         
   }*/
   if(a.length==limit) {
      console.log('fail')
   }
}

function dc(t,s) {
       var r = "";
        try {
           r = CryptoJS.AES.decrypt(t, s).toString(CryptoJS.enc.Utf8);
        } catch(e) {
           r = ""
        }
        return r;
  }

