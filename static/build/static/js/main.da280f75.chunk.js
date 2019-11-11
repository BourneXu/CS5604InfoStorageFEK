(window["webpackJsonpreactivesearch-interactive"]=window["webpackJsonpreactivesearch-interactive"]||[]).push([[0],{106:function(e,t,a){e.exports=a(107)},107:function(e,t,a){"use strict";a.r(t);var n=a(72),l=a(73),i=a(84),r=a(74),s=a(85),o=a(0),c=a.n(o),m=a(75),u=a.n(m),d=a(36),p=a.n(d),b=a(7),_=a(76),h=a.n(_),f=(a(130),a(28)),y=a.n(f),v=b.f.ResultListWrapper;y.a.set({elasticsearch:"http://2001.0468.0c80.6102.0001.7015.3fbb.aa59.ip6.name:9200/",base_uri:"http://2001.0468.0c80.6102.0001.7015.bf2d.eb25.ip6.name:3000"});var g=h.a.create({baseURL:y.a.get("base_uri"),json:!0}),E=function(e){function t(){return Object(n.a)(this,t),Object(i.a)(this,Object(r.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(l.a)(t,[{key:"dateQuery",value:function(e){var t=null;return e&&(t=[{range:{date_from:{gte:p()(e.start).format("YYYYMMDD")}}},{range:{date_to:{lte:p()(e.end).format("YYYYMMDD")}}}]),t?{query:{bool:{must:t}}}:null}},{key:"render",value:function(){return c.a.createElement(b.e,{app:"tobacco3",url:y.a.get("elasticsearch"),theme:{typography:{fontFamily:'"Lato", "Open Sans", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif'}},transformRequest:function(e){var t=e.body.split("\n"),a=JSON.parse(t[0]),n=JSON.parse(t[1]);return"search"===a.preference&&n.query.bool.must[0].bool.must[0].bool.should[0].multi_match.query.length<3?{}:(g({method:"post",url:"/emitlogs",data:JSON.stringify(e),headers:{"Content-Type":"application/json"}}),e)}},c.a.createElement("div",{className:"fek-searching"},c.a.createElement("div",{className:"searchbar"},c.a.createElement(b.a,{componentId:"search",dataField:["Brands","Witness_Name","Person_Mentioned","Organization_Mentioned","Title","Topic"],fuzziness:0,highlight:!0,highlightField:["Brands","Witness_Name","Person_Mentioned","Organization_Mentioned","Title"],placeholder:"Search Tobacco",title:"Search for Tobacco",react:{and:["Brands","Witness_Name","Person_Mentioned","Organization_Mentioned","Title"],or:["Topic"]}})),c.a.createElement("div",{className:"container"},c.a.createElement("div",null,c.a.createElement(b.d,{componentId:"filter_Document_Type",title:"Document_Type",dataField:"Document_Type",size:100,className:"filter"}),c.a.createElement(b.d,{componentId:"filter_availablility",dataField:"availablility",size:100,title:"availablility",className:"filter"}),c.a.createElement(b.c,{componentId:"filter_availablilitystatus",dataField:"availablilitystatus",size:100,title:"availablilitystatus",className:"filter"}),c.a.createElement(b.b,{componentId:"filter_Document_Date",dataField:"Document_Date",title:"Document_Date",customQuery:this.dateQuery,initialMonth:new Date("2019-10-01")})),c.a.createElement("div",null,c.a.createElement(b.h,{showClearAll:!0,clearAllLabel:"Clear filters"}),c.a.createElement(b.f,{componentId:"List",dataField:"Title",pagination:!0,className:"result",size:5,loader:"Loading Results..",react:{and:["filter_Document_Type","filter_availablility","filter_availablilitystatus","filter_Brands","search"]},render:function(e){var t=e.data;return c.a.createElement(v,null,t.map((function(e){return c.a.createElement(b.g,{key:e._id},c.a.createElement(b.g.Content,null,c.a.createElement(b.g.Title,null,c.a.createElement("div",{className:"book-title",dangerouslySetInnerHTML:{__html:e.Title}})),c.a.createElement(b.g.Description,null,c.a.createElement("div",{className:"flex column justify-space-between"},c.a.createElement("div",null,c.a.createElement("div",null,"by"," ",c.a.createElement("div",{className:"authors-list",dangerouslySetInnerHTML:{__html:e.Witness_Name}}))),c.a.createElement("span",{className:"pub-year"},"Pub: ",e.Document_Date),c.a.createElement("div",{className:"book-text",dangerouslySetInnerHTML:{__html:e.Case}}),c.a.createElement("div",{className:"book-text",dangerouslySetInnerHTML:{__html:e.Organization_Mentioned}})))))})))}})))))}}]),t}(o.Component),N=document.getElementById("root");u.a.render(c.a.createElement(E,null),N)},130:function(e,t,a){}},[[106,1,2]]]);
//# sourceMappingURL=main.da280f75.chunk.js.map