/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.1.0
build: nightly
*/
YUI.add("widget-base",function(B){var G=B.Lang,U=B.Node,E=B.ClassNameManager,b=E.getClassName,s,V=B.cached(function(L){return L.substring(0,1).toUpperCase()+L.substring(1);}),l="content",w="visible",r="hidden",d="disabled",h="focused",D="width",f="height",t="boundingBox",a="contentBox",K="parentNode",O="ownerDocument",m="offsetHeight",c="auto",J="srcNode",p="body",o="tabIndex",T="id",I="render",q="rendered",P="destroyed",A="strings",Q="<div></div>",e="Change",R="loading",k="_uiSet",j="",n=function(){},M=/(\w+):(\w+)/,Z="$2",X=true,u=false,W,N={},F=[w,d,f,D,h],i=B.UA.webkit,S=B.UA.ie,v="contentUpdate",g={},H={};function C(Y){this._strs={};this._cssPrefix=this.constructor.CSS_PREFIX||b(this.constructor.NAME.toLowerCase());C.superclass.constructor.apply(this,arguments);var x=this.get(I),L;if(x){if(x!==X){L=x;}this.render(L);}}C.NAME="widget";W=C.UI_SRC="ui";C.ATTRS=N;N[T]={valueFn:"_guid",writeOnce:X};N[q]={value:u,readOnly:X};N[t]={value:null,setter:"_setBB",writeOnce:X};N[a]={valueFn:"_defaultCB",setter:"_setCB",writeOnce:X};N[o]={value:null,validator:"_validTabIndex"};N[h]={value:u,readOnly:X};N[d]={value:u};N[w]={value:X};N[f]={value:j};N[D]={value:j};N[A]={value:{},setter:"_strSetter",getter:"_strGetter"};N[I]={value:u,writeOnce:X};C.CSS_PREFIX=b(C.NAME.toLowerCase());C.getClassName=function(){return b.apply(E,[C.CSS_PREFIX].concat(B.Array(arguments),true));};s=C.getClassName;C.getByNode=function(L){var x,Y=s();L=U.one(L);if(L){L=L.ancestor("."+Y,true);if(L){x=H[B.stamp(L,X)];}}return x||null;};B.extend(C,B.Base,{getClassName:function(){return b.apply(E,[this._cssPrefix].concat(B.Array(arguments),true));},getSkinName:function(){var L=this.get(a)||this.get(t),x=new RegExp("\\b"+b("skin")+"-(\\S+)"),Y;if(L){L.ancestor(function(y){Y=y.get("className").match(x);return Y;});}return(Y)?Y[1]:null;},initializer:function(L){H[B.stamp(this.get(t))]=this;this.publish(v,{preventable:u});if(this._applyParser){this._applyParser(L);}},destructor:function(){var L=this.get(t),x=B.stamp(L,X),Y=B.stamp(this,X);if(x in H){delete H[x];}B.each(g,function(y){if(y.instances[Y]){delete y.instances[Y];if(B.Object.size(y.instances)===0){y.handle.detach();}}});this._unbindUI(L);L.remove(X);},render:function(L){if(!this.get(P)&&!this.get(q)){this.publish(I,{queuable:u,fireOnce:X,defaultTargetOnly:X,defaultFn:this._defRenderFn});this.fire(I,{parentNode:(L)?U.one(L):null});}return this;},_defRenderFn:function(L){this._parentNode=L.parentNode;this.renderer();this._set(q,X);this._removeLoadingClassNames();},renderer:function(){this._renderUI();this.renderUI();this._bindUI();this.bindUI();this._syncUI();this.syncUI();},bindUI:n,renderUI:n,syncUI:n,hide:function(){return this.set(w,u);},show:function(){return this.set(w,X);},focus:function(){return this._set(h,X);},blur:function(){return this._set(h,u);},enable:function(){return this.set(d,u);},disable:function(){return this.set(d,X);},_uiSizeCB:function(x){var z=this.get(t),Y=this.get(a),L=s("tmp","forcesize"),y=this._bbs,AA=S&&S<7;if(y){Y.toggleClass(s(l,"expanded"),x);}else{if(x){if(AA){z.addClass(L);}Y.set(m,z.get(m));if(AA){z.removeClass(L);}}else{Y.setStyle(f,j);}}},_renderBox:function(L){var Y=this.get(a),x=this.get(t),AA=this.get(J),y=this.DEF_PARENT_NODE,z=(AA&&AA.get(O))||x.get(O)||Y.get(O);if(AA&&!AA.compareTo(Y)&&!Y.inDoc(z)){AA.replace(Y);}if(!x.compareTo(Y.get(K))&&!x.compareTo(Y)){if(Y.inDoc(z)){Y.replace(x);}x.appendChild(Y);}L=L||(y&&U.one(y));if(L){L.appendChild(x);}else{if(!x.inDoc(z)){U.one(p).insert(x,0);}}this._bbs=!(S&&S<8&&z.compatMode!="BackCompat");},_setBB:function(L){return this._setBox(this.get(T),L,this.BOUNDING_TEMPLATE);},_setCB:function(L){return(this.CONTENT_TEMPLATE===null)?this.get(t):this._setBox(null,L,this.CONTENT_TEMPLATE);},_defaultCB:function(L){return this.get(J)||null;},_setBox:function(x,Y,L){Y=U.one(Y)||U.create(L);if(!Y.get(T)){Y.set(T,x||B.guid());}return Y;},_renderUI:function(){this._renderBoxClassNames();this._renderBox(this._parentNode);},_renderBoxClassNames:function(){var y=this._getClasses(),L,Y=this.get(t),x;Y.addClass(s());for(x=y.length-3;x>=0;x--){L=y[x];Y.addClass(L.CSS_PREFIX||b(L.NAME.toLowerCase()));}this.get(a).addClass(this.getClassName(l));},_removeLoadingClassNames:function(){var Y=this.get(t),L=this.get(a);Y.removeClass(s(R));Y.removeClass(this.getClassName(R));L.removeClass(s(R));L.removeClass(this.getClassName(R));},_bindUI:function(){this._bindAttrUI(this._BIND_UI_ATTRS);this._bindDOM();},_unbindUI:function(L){this._unbindDOM(L);},_bindDOM:function(){var L=this.get(t).get(O);this._hDocFocus=L.on("focus",this._onDocFocus,this);if(i){this._hDocMouseDown=L.on("mousedown",this._onDocMouseDown,this);}},_unbindDOM:function(L){if(this._hDocFocus){this._hDocFocus.detach();}if(i&&this._hDocMouseDown){this._hDocMouseDown.detach();}},_syncUI:function(){this._syncAttrUI(this._SYNC_UI_ATTRS);},_uiSetHeight:function(L){this._uiSetDim(f,L);this._uiSizeCB((L!==j&&L!==c));},_uiSetWidth:function(L){this._uiSetDim(D,L);},_uiSetDim:function(L,Y){this.get(t).setStyle(L,G.isNumber(Y)?Y+this.DEF_UNIT:Y);},_uiSetVisible:function(L){this.get(t).toggleClass(this.getClassName(r),!L);},_uiSetDisabled:function(L){this.get(t).toggleClass(this.getClassName(d),L);},_uiSetFocused:function(x,Y){var L=this.get(t);L.toggleClass(this.getClassName(h),x);if(Y!==W){if(x){L.focus();}else{L.blur();}}},_uiSetTabIndex:function(Y){var L=this.get(t);if(G.isNumber(Y)){L.set(o,Y);}else{L.removeAttribute(o);}},_onDocMouseDown:function(L){if(this._hasDOMFocus){this._onDocFocus(L);}},_onDocFocus:function(Y){var L=this.get(t).contains(Y.target);this._hasDOMFocus=L;this._set(h,L,{src:W});},toString:function(){return this.constructor.NAME+"["+this.get(T)+"]";},DEF_UNIT:"px",DEF_PARENT_NODE:null,CONTENT_TEMPLATE:Q,BOUNDING_TEMPLATE:Q,_guid:function(){return B.guid();},_validTabIndex:function(L){return(G.isNumber(L)||G.isNull(L));},_bindAttrUI:function(Y){var x,L=Y.length;for(x=0;x<L;x++){this.after(Y[x]+e,this._setAttrUI);}},_syncAttrUI:function(x){var y,Y=x.length,L;
for(y=0;y<Y;y++){L=x[y];this[k+V(L)](this.get(L));}},_setAttrUI:function(L){this[k+V(L.attrName)](L.newVal,L.src);},_strSetter:function(L){return B.merge(this.get(A),L);},getString:function(L){return this.get(A)[L];},getStrings:function(){return this.get(A);},_BIND_UI_ATTRS:F,_SYNC_UI_ATTRS:F.concat(o),UI_EVENTS:B.Node.DOM_EVENTS,_getUIEventNode:function(){return this.get(t);},_createUIEvent:function(x){var AA=this._getUIEventNode(),L=AA.get(K),Y=(B.stamp(L)+x),z=g[Y],y;if(!z){y=L.delegate(x,function(AB){var AC=C.getByNode(this);AC.fire(AB.type,{domEvent:AB});},"."+s());g[Y]=z={instances:{},handle:y};}z.instances[B.stamp(this)]=1;},_getUIEvent:function(Y){if(G.isString(Y)){var x=Y.replace(M,Z),L;if(this.UI_EVENTS[x]){L=x;}return L;}},_initUIEvent:function(Y){var x=this._getUIEvent(Y),L=this._uiEvtsInitQueue||{};if(x&&!L[x]){this._uiEvtsInitQueue=L[x]=1;this.after(I,function(){this._createUIEvent(x);delete this._uiEvtsInitQueue[x];});}},on:function(L){this._initUIEvent(L);return C.superclass.on.apply(this,arguments);},after:function(L){this._initUIEvent(L);return C.superclass.after.apply(this,arguments);},publish:function(Y,L){var x=this._getUIEvent(Y);if(x&&L&&L.defaultFn){this._initUIEvent(x);}return C.superclass.publish.apply(this,arguments);}});B.Widget=C;},"3.1.0",{requires:["attribute","event-focus","base","node","classnamemanager","intl"]});