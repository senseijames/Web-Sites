"use strict";(self.webpackChunkprumanova=self.webpackChunkprumanova||[]).push([[789],{6789:(H,l,a)=>{a.r(l),a.d(l,{HomePageModule:()=>j});var f=a(9576),g=a(4004),h=a(7579),d=a(6063);class u extends h.x{constructor(i=1/0,e=1/0,t=d.l){super(),this._bufferSize=i,this._windowTime=e,this._timestampProvider=t,this._buffer=[],this._infiniteTimeWindow=!0,this._infiniteTimeWindow=e===1/0,this._bufferSize=Math.max(1,i),this._windowTime=Math.max(1,e)}next(i){const{isStopped:e,_buffer:t,_infiniteTimeWindow:s,_timestampProvider:r,_windowTime:m}=this;e||(t.push(i),!s&&t.push(r.now()+m)),this._trimBuffer(),super.next(i)}_subscribe(i){this._throwIfClosed(),this._trimBuffer();const e=this._innerSubscribe(i),{_infiniteTimeWindow:t,_buffer:s}=this,r=s.slice();for(let m=0;m<r.length&&!i.closed;m+=t?1:2)i.next(r[m]);return this._checkFinalizedStatuses(i),e}_trimBuffer(){const{_bufferSize:i,_timestampProvider:e,_buffer:t,_infiniteTimeWindow:s}=this,r=(s?1:2)*i;if(i<1/0&&r<t.length&&t.splice(0,t.length-r),!s){const m=e.now();let p=0;for(let c=1;c<t.length&&t[c]<=m;c+=2)p=c;p&&t.splice(0,p+1)}}}var x=a(3099),o=a(8274),C=a(6601);let y=(()=>{class n{constructor(){this.mode="fade",this.change=new o.vpe}ngOnChanges(e){this.poster&&(this.currImage=this.poster)}onClick(){"test"===this.mode?this.currImage=this.getNextImage():this.next()}getNextImage(){const t=(this.images.indexOf(this.currImage)+1)%this.images.length;return this.images[t]}next(){if(this.isFading)return;const e=this.getNextImage();this.nextImage=e,this.isFading=!0,setTimeout(t=>{this.currImage=e,this.nextImage=null,this.isFading=!1},1e3)}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=o.Xpm({type:n,selectors:[["iji-xfade"]],inputs:{poster:"poster",images:"images",mode:"mode"},outputs:{change:"change"},features:[o.TTD],decls:3,vars:6,consts:[[1,"current","largeCursor",3,"src","click"],[1,"next",3,"src"]],template:function(e,t){1&e&&(o.TgZ(0,"div")(1,"img",0),o.NdJ("click",function(){return t.onClick()}),o.qZA(),o._UZ(2,"img",1),o.qZA()),2&e&&(o.xp6(1),o.ekj("fadeout",t.isFading),o.Q6J("src",t.currImage,o.LSH),o.xp6(1),o.ekj("fadein",t.isFading),o.Q6J("src",t.nextImage,o.LSH))},styles:[".iji-fx[_ngcontent-%COMP%]{position:absolute;width:100%;left:0;opacity:0;color:#ffff9b;animation-duration:2s}.iji-fx.glow[_ngcontent-%COMP%]{animation-name:glow}.iji-fx.flare[_ngcontent-%COMP%]{animation-duration:3s;opacity:1;clip:rect(-30px,130px,219px,120px);animation-name:flare}@keyframes flare{0%{clip:rect(-30px,130px,219px,120px)}70%{clip:rect(-30px,var(--flare-pos2),219px,var(--flare-pos))}90%{clip:rect(-30px,var(--flare-pos2),219px,var(--flare-pos))}to{clip:rect(-30px,var(--flare-endpos2),219px,var(--flare-endpos))}}@keyframes glow{0%{opacity:0}40%{opacity:1}63%{opacity:1}to{opacity:0}}div[_ngcontent-%COMP%]{height:77vh;position:relative}div[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:100%;max-width:100%;width:auto;height:auto;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;border-radius:7px}div[_ngcontent-%COMP%]   img.current[_ngcontent-%COMP%]{opacity:1}div[_ngcontent-%COMP%]   img.next[_ngcontent-%COMP%]{opacity:0}div[_ngcontent-%COMP%]   img.fadeout[_ngcontent-%COMP%]{opacity:0;transition:opacity 1s}div[_ngcontent-%COMP%]   img.fadein[_ngcontent-%COMP%]{opacity:1;transition:opacity 1s}"]}),n})(),P=(()=>{class n{constructor(e,t){this.breakpointObserver=e,this.imageService=t,this.isHandset$=this.breakpointObserver.observe(f.u3.Handset).pipe((0,g.U)(s=>s.matches),function v(n,i,e){let t,s=!1;return n&&"object"==typeof n?({bufferSize:t=1/0,windowTime:i=1/0,refCount:s=!1,scheduler:e}=n):t=n??1/0,(0,x.B)({connector:()=>new u(t,i,e),resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:s})}()),this.album=t.images.map(s=>s.src),this.posterImage=this.album[0]}}return n.\u0275fac=function(e){return new(e||n)(o.Y36(f.Yg),o.Y36(C.A))},n.\u0275cmp=o.Xpm({type:n,selectors:[["app-home"]],decls:1,vars:2,consts:[[3,"poster","images"]],template:function(e,t){1&e&&o._UZ(0,"iji-xfade",0),2&e&&o.Q6J("poster",t.posterImage)("images",t.album)},dependencies:[y],encapsulation:2}),n})();var I=a(5431),M=a(6895),O=a(5642),T=a(2223);const b=[{path:"",component:P}];let j=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=o.oAB({type:n}),n.\u0275inj=o.cJS({imports:[M.ez,I.Bz.forChild(b),O.K,T.G]}),n})()}}]);