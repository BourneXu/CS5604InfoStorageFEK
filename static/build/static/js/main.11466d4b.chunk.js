(window["webpackJsonpreactivesearch-interactive"]=window["webpackJsonpreactivesearch-interactive"]||[]).push([[0],{121:function(e,t,a){},97:function(e,t,a){e.exports=a(98)},98:function(e,t,a){"use strict";a.r(t);var r=a(61),n=a(62),o=a(73),i=a(63),c=a(74),l=a(0),s=a.n(l),m=a(64),u=a.n(m),d=a(30),b=a.n(d),h=a(8),p=a(65),g=a.n(p),v=(a(121),a(19)),y=a.n(v),f=h.d.ResultListWrapper;y.a.set({elasticsearch:"http://localhost:9200/",base_uri:"http://0.0.0.0:3000"});var E=g.a.create({baseURL:y.a.get("base_uri"),json:!0}),_=["degree-level","contributor-department","contributor-author","contributor-committeechair","contributor-committeecochair","contributor-committeemember","date-available","date-issued","degree-name","description-abstract","Author Email","subject-none","title-none","type-none"],N=function(e){function t(){return Object(r.a)(this,t),Object(o.a)(this,Object(i.a)(t).apply(this,arguments))}return Object(c.a)(t,e),Object(n.a)(t,[{key:"dateQuery",value:function(e){var t=null;return e&&(t=[{range:{Document_Date:{gte:b()(e.start).format("YYYY-MM-DD"),lte:b()(e.end).format("YYYY-MM-DD")}}}]),t?{query:{bool:{must:t}}}:null}},{key:"render",value:function(){return s.a.createElement(h.c,{app:"etd_metadata",url:y.a.get("elasticsearch"),theme:{typography:{fontFamily:'"Lato", "Open Sans", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif'}},transformRequest:function(e){var t=e.body.split("\n"),a=document.getElementById("search-downshift-input").value.split(":");console.log("The length of the split is "+a.length),_=a.length>1?["title-none"]:["degree-level","contributor-department","contributor-author","contributor-committeechair","contributor-committeecochair","contributor-committeemember","date-available","date-issued","degree-name","description-abstract","Author Email","subject-none","title-none","type-none"];var r=JSON.parse(t[0]),n=JSON.parse(t[1]);return console.log("The body_query is: "+t[1]),"search"===r.preference&&n.query.bool.must[0].bool.must[0].bool.should[0].multi_match.query.length<3?null:(E({method:"post",url:"/emitlogs",data:JSON.stringify(e),headers:{"Content-Type":"application/json"}}),e)}},s.a.createElement("div",{className:"fek-searching"},s.a.createElement("div",{className:"searchbar"},s.a.createElement(h.a,{componentId:"search",dataField:["degree-level","contributor-department","contributor-author","contributor-committeechair","contributor-committeecochair","contributor-committeemember","date-available","date-issued","degree-name","description-abstract","Author Email","subject-none","title-none","type-none"],customQuery:function(e,t){return{query:{multi_match:{query:e,fields:_}}}},fuzziness:0,highlight:!0,highlightField:["degree-level","contributor-department","contributor-author","contributor-committeechair","contributor-committeecochair","contributor-committeemember","date-available","date-issued","degree-name","description-abstract","Author Email","subject-none","title-none","type-none"],placeholder:"Search ETD",title:"Search for ETD",react:{and:["degree-level","contributor-department","contributor-author","contributor-committeechair","contributor-committeecochair","contributor-committeemember","date-available","date-issued","degree-name","description-abstract","Author Email","subject-none","type-none"],or:["title-none"]}})),s.a.createElement("div",{className:"container"},s.a.createElement("div",null,s.a.createElement(h.b,{componentId:"filter_type-none",title:"type-none",dataField:"type-none",size:100,className:"filter"}),s.a.createElement(h.b,{componentId:"filter_degree-level",dataField:"degree-level",size:100,title:"degree-level",className:"filter"})),s.a.createElement("div",null,s.a.createElement(h.f,{showClearAll:!0,clearAllLabel:"Clear filters"}),s.a.createElement(h.d,{componentId:"List",dataField:"Title",pagination:!0,className:"result",size:5,loader:"Loading Results..",react:{and:["filter_type-none","filter_degree-level","search"]},render:function(e){var t=e.data;return s.a.createElement(f,null,t.map((function(e){return s.a.createElement(h.e,{key:e._id},s.a.createElement(h.e.Content,null,s.a.createElement(h.e.Title,null,s.a.createElement("div",{className:"book-title",dangerouslySetInnerHTML:{__html:'<a href="#">\n'+e["title-none"]+"</a>"}})),s.a.createElement(h.e.Description,null,s.a.createElement("div",{className:"flex column justify-space-between"},s.a.createElement("div",null,s.a.createElement("div",null,"by"," ",s.a.createElement("div",{className:"authors-list",dangerouslySetInnerHTML:{__html:e["contributor-author"]+", "+e["contributor-committeechair"]+", "+e["contributor-committeecochair"]+", "+e["contributor-committeemember"]}}))),s.a.createElement("span",{className:"pub-year"},"Pub: ",e["date-issued"]),s.a.createElement("div",{className:"book-text",dangerouslySetInnerHTML:{__html:e["description-abstract"]}}),s.a.createElement("div",{className:"book-text",dangerouslySetInnerHTML:{__html:e["subject-none"]}})))))})))}})))))}}]),t}(l.Component),j=document.getElementById("root");u.a.render(s.a.createElement(N,null),j)}},[[97,1,2]]]);
//# sourceMappingURL=main.11466d4b.chunk.js.map