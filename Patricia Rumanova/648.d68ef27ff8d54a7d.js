"use strict";(self.webpackChunkprumanova=self.webpackChunkprumanova||[]).push([[648],{7648:(y,m,c)=>{c.r(m),c.d(m,{GalleryPageModule:()=>T});var e=c(8274),d=c(6601),g=c(6895),p=c(442);let h=(()=>{class o{constructor(t){this.el=t,this.seconds="1"}ngOnInit(){this.el.nativeElement.classList.add("init-fade")}ngOnChanges(){if(!this.seconds)return;const t=this.el.nativeElement;t.style.setProperty("--fade-time",this.seconds+"s"),requestAnimationFrame(i=>{t.classList.add("fade"),requestAnimationFrame(n=>{t.classList.add("fading")})})}}return o.\u0275fac=function(t){return new(t||o)(e.Y36(e.SBq))},o.\u0275dir=e.lG2({type:o,selectors:[["","iji-fade",""]],inputs:{seconds:["iji-fade","seconds"]},features:[e.TTD]}),o})();const u=["container"];function f(o,a){if(1&o){const t=e.EpF();e.TgZ(0,"img",6),e.NdJ("click",function(){e.CHM(t);const n=e.oxw();return e.KtG(n.toggleAutoScroll())}),e.qZA()}if(2&o){const t=e.oxw();e.Q6J("title",t.showFilmstrip?t.isAutoScroll?"pause":"scroll":"lights, camera...")}}function _(o,a){if(1&o){const t=e.EpF();e.TgZ(0,"iji-poster",7),e.NdJ("click",function(){e.CHM(t);const n=e.oxw();return e.KtG(n.openImage(n.mainImage))}),e.qZA()}if(2&o){const t=e.oxw();e.Q6J("img",t.mainImage.src||t.ERR_IMG)}}function x(o,a){if(1&o){const t=e.EpF();e.TgZ(0,"img",8),e.NdJ("load",function(n){const s=e.CHM(t).$implicit,l=e.oxw();return e.KtG(l.onImageLoad(n,s))})("click",function(n){const s=e.CHM(t).$implicit,l=e.oxw();return l.toggleAutoScroll(!1),l.showMainImage(s),e.KtG(n.stopPropagation())})("error",function(n){const s=e.CHM(t).$implicit,l=e.oxw();return e.KtG(l.onImageLoadError(n,s))}),e.qZA()}if(2&o){const t=a.$implicit,i=e.oxw();e.Q6J("src",t.src||i.ERR_IMG,e.LSH)}}let C=(()=>{class o{constructor(t){this.imageService=t,this.scrollDirection=1,this.AUTOSCROLL_TICK=20,this.AUTOSCROLL_DELTA=1,this.ERR_IMG="assets/img/joan_rivers.jpg"}ngOnInit(){this.images=this.imageService.images}ngAfterViewInit(){}onImageLoadError(t,i){t.target.wasImageLoadError=!0,t.target.src="assets/img/joan_rivers.jpg"}url(t){return t.includes("data:image")?t.substring(0,30):t}onImageLoad(t,i){const n=i.url,r=i.src;if(n.includes("assets/img")||r.includes("data:image")||t.target.wasImageLoadError||sessionStorage.getItem(n))n.includes("assets/img")&&r.includes("data:image");else{const l=this.toBase64(t.target,200,200);sessionStorage.setItem(n,l)}}toBase64(t,i,n){const r=document.createElement("CANVAS"),s=r.getContext("2d");return s?(r.height=n,r.width=i,s.drawImage(t,0,0),r.toDataURL()):(console.warn("ERROR GETTING CONTEXT!!!"),"")}showMainImage(t){this.mainImage?.url!==t.url?this.mainImage=t:this.toggleAutoScroll()}openImage(t){const i=t.url.replace("=w220-h209-p-k-nu-iv1","");window.open(i,"_blank")}toggleAutoScroll(t){if(!this.showFilmstrip)return this.showFilmstrip=!0,void setTimeout(i=>{this.toggleAutoScroll(t)},3700);if(this.isAutoScroll=t??!this.isAutoScroll,this.autoscrollTimer&&(clearTimeout(this.autoscrollTimer),this.autoscrollTimer=0),this.isAutoScroll){const i=this.container.nativeElement;this.maxScroll=i.clientWidth+i.scrollLeft-5,this.autoscrollTimer=setInterval(()=>{let n;1===this.scrollDirection?(n=i.scrollLeft+this.AUTOSCROLL_DELTA,n>this.maxScroll&&(this.scrollDirection=-1)):(n=i.scrollLeft-this.AUTOSCROLL_DELTA,n<0&&(n=0,this.scrollDirection=1,this.maxScroll=i.clientWidth+i.scrollLeft-5)),i.scrollLeft=n},this.AUTOSCROLL_TICK)}}}return o.\u0275fac=function(t){return new(t||o)(e.Y36(d.A))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-gallery"]],viewQuery:function(t,i){if(1&t&&e.Gf(u,5),2&t){let n;e.iGM(n=e.CRH())&&(i.container=n.first)}},decls:6,vars:5,consts:[["src","assets/img/camz.png","class","largeCursor camera",3,"title","click",4,"ngIf"],["size","small",3,"img","click",4,"ngIf"],[1,"filmstrip",3,"iji-fade","hidden","click"],[1,"cont"],["container",""],["class","largeCursor","crossOrigin","anonymous",3,"src","load","click","error",4,"ngFor","ngForOf"],["src","assets/img/camz.png",1,"largeCursor","camera",3,"title","click"],["size","small",3,"img","click"],["crossOrigin","anonymous",1,"largeCursor",3,"src","load","click","error"]],template:function(t,i){1&t&&(e.YNc(0,f,1,1,"img",0),e.YNc(1,_,1,1,"iji-poster",1),e.TgZ(2,"div",2),e.NdJ("click",function(){return i.toggleAutoScroll()}),e.TgZ(3,"div",3,4),e.YNc(5,x,1,1,"img",5),e.qZA()()),2&t&&(e.Q6J("ngIf",!i.mainImage),e.xp6(1),e.Q6J("ngIf",i.mainImage),e.xp6(1),e.Q6J("iji-fade",i.showFilmstrip?"3":"")("hidden",!i.showFilmstrip),e.xp6(3),e.Q6J("ngForOf",i.images))},dependencies:[g.sg,g.O5,p.d,h],styles:["div.main[_ngcontent-%COMP%]{height:calc(90vh - 170px);text-align:center;line-height:calc(90vh - 210px)}div.main[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{max-width:80%;vertical-align:middle;z-index:2}img.camera[_ngcontent-%COMP%]{position:absolute;top:27vh;width:37vw;left:calc(37vw - 25px);opacity:.4;filter:sepia(1)}@media (max-width: 371px){img.camera[_ngcontent-%COMP%]{width:43%}}p[_ngcontent-%COMP%]{text-align:center;position:relative;top:70px}div.filmstrip[_ngcontent-%COMP%]{position:fixed;bottom:27px;left:0;z-index:1}div.filmstrip[_ngcontent-%COMP%] > div.cont[_ngcontent-%COMP%]{background-image:url(/assets/img/filmstrip.png);background-repeat:repeat-x;background-size:200vw 170px;background-attachment:local;height:184px;width:100vw;overflow-x:scroll;overflow-y:hidden;white-space:nowrap;position:relative;top:15px;-ms-overflow-style:none;scrollbar-width:none}div.filmstrip[_ngcontent-%COMP%] > div.cont[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}div.filmstrip[_ngcontent-%COMP%] > div.cont[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{width:80px;padding:23px 37px;border-radius:37px;vertical-align:middle}@media (max-width: 700px){div.filmstrip[_ngcontent-%COMP%] > div.cont[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{padding:23px 27px}}@media (max-width: 540px){div.filmstrip[_ngcontent-%COMP%] > div.cont[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{padding:23px 17px}}@media (max-width: 370px){div.filmstrip[_ngcontent-%COMP%] > div.cont[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{padding:23px 4px}}"]}),o})();var v=c(5431),w=c(5642),O=c(2223);const P=[{path:"",component:C}];let T=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[g.ez,w.K,O.G,v.Bz.forChild(P)]}),o})()}}]);