(window["webpackJsonpreactivesearch-interactive"]=window["webpackJsonpreactivesearch-interactive"]||[]).push([[0],{114:function(e,t,a){},91:function(e,t,a){e.exports=a(92)},92:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(61),s=a.n(r),c=a(8),i=a(62),o=a.n(i),m=(a(114),c.e.ResultListWrapper),u=o.a.create({baseURL:"http://localhost:3000",json:!0});var d=document.getElementById("root");s.a.render(l.a.createElement((function(){return l.a.createElement(c.d,{app:"shakes",url:"http://localhost:9200/",theme:{typography:{fontFamily:'"Lato", "Open Sans", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif'}},transformRequest:function(e){return u({method:"post",url:"/emitlogs",data:JSON.stringify(e),headers:{"Content-Type":"application/json"}}),e}},l.a.createElement("div",{className:"fek-searching"},l.a.createElement("div",{className:"searchbar"},l.a.createElement(c.a,{componentId:"search",dataField:["text_entry"],fuzziness:0,highlight:!0,highlightField:["text_entry"],placeholder:"Search ETD",title:"FEK Searching System",react:{and:["text_entry"]},renderNoSuggestion:function(){return l.a.createElement("div",null,"No suggestions found")}})),l.a.createElement("div",{className:"container"},l.a.createElement("div",null,l.a.createElement(c.c,{componentId:"filter_play_name",title:"play_name",dataField:"play_name",size:100,className:"filter"}),l.a.createElement(c.b,{componentId:"filter_speech_number",dataField:"speech_number",size:100,title:"speech_number",className:"filter"})),l.a.createElement("div",null,l.a.createElement(c.g,{showClearAll:!0,clearAllLabel:"Clear filters"}),l.a.createElement(c.e,{componentId:"List",dataField:"text_entry",pagination:!0,className:"result",size:5,loader:"Loading Results..",react:{and:["filter_play_name","filter_speech_number","search"]},render:function(e){var t=e.data;return l.a.createElement(m,null,t.map((function(e){return l.a.createElement(c.f,{key:e._id},l.a.createElement(c.f.Content,null,l.a.createElement(c.f.Title,null,l.a.createElement("div",{className:"book-title",dangerouslySetInnerHTML:{__html:e.play_name}})),l.a.createElement(c.f.Description,null,l.a.createElement("div",{className:"flex column justify-space-between"},l.a.createElement("div",null,l.a.createElement("div",null,"by"," ",l.a.createElement("span",{className:"authors-list"},e.speaker))),l.a.createElement("div",{className:"book-text",dangerouslySetInnerHTML:{__html:e.text_entry}})))))})))}})))))}),null),d)}},[[91,1,2]]]);
//# sourceMappingURL=main.e230e0fd.chunk.js.map