(this.webpackJsonpalgovizui=this.webpackJsonpalgovizui||[]).push([[1],{175:function(e,t,n){},188:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(20),o=n.n(r),c=(n(70),n(9)),l=n(10),s=n(40),u=n(37),h=(n(48),{infer:[],log:[]}),m=n(190),d=n(58),f=n(6),p=n(21),g=function(e){return Object(f.isNullOrUndefined)(e.object.ptrValue)?i.a.createElement("div",{className:e.object.modifiedAtStep===e.executionStepIndex?"highlightedLine":""},(Object(f.isNullOrUndefined)(e.name)?"":e.name+": ")+e.object.toString()):i.a.createElement("div",{className:e.object.modifiedAtStep===e.executionStepIndex?"highlightedLine":""},Object(f.isNullOrUndefined)(e.name)?"":e.name+": ",i.a.createElement("a",{href:"#",onClick:function(){null!==e.onClick&&e.onClick(e.object.ptrValue)}},0===e.object.ptrValue?"None":-1===e.object.ptrValue?"Tuple":e.highlightedPtr===e.object.ptrValue?i.a.createElement(i.a.Fragment,null,"Show"," ",i.a.createElement(p.d,null)):"Show"))},v=function(e){var t=[];e.frame.args.forEach((function(n,a,r){t.push(i.a.createElement(g,{highlightedPtr:e.highlightedPtr,name:a,object:n,onClick:e.onVmObjectClick,executionStepIndex:e.vmEngine.executionStepIndex}))})),e.frame.locals.forEach((function(n,a,r){t.push(i.a.createElement(g,{highlightedPtr:e.highlightedPtr,name:a,object:n,onClick:e.onVmObjectClick,executionStepIndex:e.vmEngine.executionStepIndex}))}));var n=null;return Object(f.isNullOrUndefined)(e.frame.returnVal)||(n=i.a.createElement("div",null,i.a.createElement(g,{highlightedPtr:e.highlightedPtr,name:"Return",object:e.frame.returnVal,onClick:e.onVmObjectClick,executionStepIndex:e.vmEngine.executionStepIndex}),")")),i.a.createElement("div",null,i.a.createElement("div",null,e.frame.methodName+"()"),i.a.createElement("div",null,t),n)},b=function(e){return i.a.createElement(m.a,null,e.vmEngine.stack.frames.map((function(t){return i.a.createElement(d.a,null,i.a.createElement(v,{highlightedPtr:e.highlightedPtr,frame:t,onVmObjectClick:e.onVmObjectClick,vmEngine:e.vmEngine}))})))},E=n(63),x=function(){function e(){Object(c.a)(this,e),this.boolValue=void 0,this.numberValue=void 0,this.ptrValue=void 0,this.stringValue=void 0,this.modifiedAtStep=void 0}return Object(l.a)(e,[{key:"toString",value:function(){return Object(f.isNullOrUndefined)(this.boolValue)?Object(f.isNullOrUndefined)(this.numberValue)?Object(f.isNullOrUndefined)(this.ptrValue)?Object(f.isNullOrUndefined)(this.stringValue)?"null":'"'+this.stringValue+'"':"#"+this.ptrValue:""+this.numberValue:""+this.boolValue}}],[{key:"fromBool",value:function(t){var n=new e;return n.boolValue=t,n}},{key:"fromNumber",value:function(t){var n=new e;return n.numberValue=t,n}},{key:"fromPtr",value:function(t){var n=new e;return n.ptrValue=t,n}},{key:"fromString",value:function(t){var n=new e;return n.stringValue=t,n}},{key:"fromVal",value:function(t){var n=t[0],a=t[1];return n?e.fromPtr(a):null==a||void 0==a?new e:"string"==typeof a?e.fromString(a):"number"==typeof a?e.fromNumber(a):"boolean"==typeof a?e.fromBool(a):new e}}]),e}(),j=function(){function e(t,n){Object(c.a)(this,e),this.methodName=void 0,this.args=new Map,this.locals=new Map,this.returnVal=void 0,this.methodName=t,this.args=n}return Object(l.a)(e,[{key:"getVariable",value:function(e){return this.locals.has(e)?this.locals.get(e):this.args.has(e)?this.args.get(e):null}}]),e}(),O=function(){function e(){Object(c.a)(this,e),this.frames=[]}return Object(l.a)(e,[{key:"pushFrame",value:function(e){this.frames.push(e)}},{key:"markFrameReturn",value:function(e){this.getTopFrame().returnVal=e}},{key:"popFrame",value:function(){this.frames.pop()}},{key:"getTopFrame",value:function(){return this.frames[this.frames.length-1]}}]),e}(),k=function e(t,n){Object(c.a)(this,e),this.type=void 0,this.ptr=void 0,this.listObject=void 0,this.mapObject=void 0,this.type=n,this.ptr=t},S=function(){function e(){Object(c.a)(this,e),this.storage=void 0,this.namedReferences=void 0,this.storage=new Map,this.namedReferences=new Set}return Object(l.a)(e,[{key:"updateNamedReferences",value:function(e){var t=this;this.namedReferences=new Set,e.frames.forEach((function(e){e.args.forEach((function(e){null!==e.ptrValue&&t.namedReferences.add(e.ptrValue)})),e.locals.forEach((function(e){null!==e.ptrValue&&t.namedReferences.add(e.ptrValue)}))}))}}]),e}(),y=function(){function e(t){Object(c.a)(this,e),this.stack=void 0,this.heap=void 0,this.programTrace=void 0,this.programInfer=void 0,this.executionStepIndex=-1,this.executionLineNumber=-1,this.programTrace=t.log,this.programInfer=t.infer,this.stack=new O,this.heap=new S}return Object(l.a)(e,[{key:"nextStep",value:function(){this.nextStepInternal()}},{key:"isAboutToEnterFunction",value:function(){return!(this.executionStepIndex<=0)&&(this.executionStepIndex+1<this.programTrace.length&&"pushFrame"===this.programTrace[this.executionStepIndex+1].op)}},{key:"nextAndSkipFunction",value:function(){if(this.isAboutToEnterFunction())for(var e=0,t=!1;!(this.executionStepIndex>=this.programTrace.length)&&("pushFrame"===this.programTrace[this.executionStepIndex].op?e++:"popFrame"===this.programTrace[this.executionStepIndex].op&&(e--,t=!0),this.nextStepInternal(),0!==e||!t););}},{key:"executeStep",value:function(e){var t=this;if("line"==e.op)this.executionLineNumber=e.info;else if("pushFrame"==e.op){var n=new Map(Object.entries(e.info.locals)),a=new Map;n.forEach((function(e,t,n){a.set(t,x.fromVal(e))}));var i=new j(e.info.function,a);this.stack.pushFrame(i),this.executionLineNumber=e.info.line}else if("newLocal"==e.op||"updateLocal"==e.op){var r=x.fromVal(e.info[1]);r.modifiedAtStep=this.executionStepIndex,this.stack.getTopFrame().locals.set(e.info[0],r)}else if("return"==e.op)this.executionLineNumber=-1,this.stack.getTopFrame().returnVal=x.fromVal(e.info),this.stack.getTopFrame().returnVal.modifiedAtStep=this.executionStepIndex;else if("popFrame"==e.op)this.executionLineNumber=-1,this.stack.popFrame();else if("new"==e.op){var o=e.info[0],c=new k(o,"");if(Array.isArray(e.info[1])){var l=e.info[1];c.listObject=l.map((function(e){return x.fromVal(e)})),c.type="list"}else c.type=e.info[1].type,c.mapObject=new Map,Object.entries(e.info[1].members).forEach((function(e){var t=Object(E.a)(e,2),n=t[0],a=t[1];c.mapObject.set(n,x.fromVal(a))}));this.heap.storage.set(o,c)}else if("modifyPos"==e.op){var s=e.info[0],u=e.info[1],h=e.info[2],m=this.heap.storage.get(s),d=x.fromVal(h);d.modifiedAtStep=this.executionStepIndex,u>=m.listObject.length?m.listObject.push(d):m.listObject[u]=d}else if("modifyKey"==e.op||"addKey"==e.op){var f=e.info[0],p=e.info[1],g=e.info[2],v=this.heap.storage.get(f),b=x.fromVal(g);b.modifiedAtStep=this.executionStepIndex,v.mapObject.set(p,b)}else"delete"==e.op?this.heap.storage.delete(e.info):"batch"==e.op&&e.info.forEach((function(e){return t.executeStep(e)}))}},{key:"nextStepInternal",value:function(){if(this.executionStepIndex++,this.executionStepIndex>=this.programTrace.length)return!1;var e=this.programTrace[this.executionStepIndex];return this.executeStep(e),this.heap.updateNamedReferences(this.stack),!0}},{key:"prevStep",value:function(){var e=this.executionStepIndex-1;this.reset();for(var t=0;t<e;t++)this.nextStep()}},{key:"reset",value:function(){this.executionLineNumber=-1,this.executionStepIndex=-1,this.stack=new O}},{key:"getMemberPointerAnnotationsFor",value:function(e){var t=this.heap.storage.get(e);return this.programInfer.filter((function(e){return"memberPointer"===e.type&&e.data.className===t.type})).map((function(e){return e.data}))}},{key:"getArrayIndexAnnotationsFor",value:function(e){var t=this,n=this.stack.getTopFrame(),a=[];return n.locals.forEach((function(i,r){t.programInfer.forEach((function(t){if("arrayIndex"===t.type){var o=t.data;o.funcName===n.methodName&&o.var===r&&n.getVariable(o.array).ptrValue===e&&a.push({indexVarName:r,indexVarValue:i.numberValue,indexDimension:o.index})}}))})),a}}]),e}(),V=n(192),N=n(193),w=n(194),I=n(199),F=n(197),T=n(61),A=n(198),P=n(200),L=n(195),U=n(196),C=n(45),R=n.n(C),D=n(62),M=n(64),W=n(191),B=n(201),_=(n(174),n(175),n(176)),z=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).visjsDomRef=void 0,a.graph=void 0,a.options=void 0,a.visjsDomRef=i.a.createRef(),a.options={layout:{hierarchical:{direction:"UD",sortMethod:"directed"}}},a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.graph=new _.Network(this.visjsDomRef.current,this.props.data,this.options)}},{key:"render",value:function(){return Object(f.isNullOrUndefined)(this.visjsDomRef.current)||(console.log("render"),console.log(this.props.data),this.graph=new _.Network(this.visjsDomRef.current,this.props.data,this.options),Object(f.isNullOrUndefined)(this.props.data.nodes.get(this.props.highlightedPtr))||this.props.data.nodes.update([{id:this.props.highlightedPtr,color:{background:"#AAFFAA"}}])),i.a.createElement("div",{className:"heap-graph",ref:this.visjsDomRef})}}],[{key:"getLabelFor",value:function(e,t){var n=[];return e.mapObject.forEach((function(e,a){t.find((function(e){return e.member===a}))||n.push("".concat(a,": ").concat(e.toString()))})),n.length>0?n.join("\n"):"..."}},{key:"createUI",value:function(e,t){var a=e.heap,r=[],o=[],c=new Set;a.storage.forEach((function(t,a){var i=e.getMemberPointerAnnotationsFor(a);console.log("annotations"),console.log(i),i.length>0&&(c.add(a),r.push({id:a,label:n.getLabelFor(t,i)}),i.forEach((function(e){t.mapObject.has(e.member)&&0!==t.mapObject.get(e.member).ptrValue&&o.push({from:a,to:t.mapObject.get(e.member).ptrValue,arrows:"to"})})))}));var l={nodes:new _.DataSet(r),edges:new _.DataSet(o)};return console.log("fdata"),console.log(l),{consumed:c,ui:i.a.createElement(n,{data:l,vmEngine:e,highlightedPtr:t})}}}]),n}(i.a.Component),H=function(){function e(){Object(c.a)(this,e)}return Object(l.a)(e,null,[{key:"is",value:function(e,t){return!Object(f.isNullOrUndefined)(e.listObject)&&e.listObject.every((function(e){return Object(f.isNullOrUndefined)(e.ptrValue)}))}},{key:"getUI",value:function(e,t){var n=t.getArrayIndexAnnotationsFor(e.ptr),a=e.listObject,r=i.a.createElement(W.a,{bordered:!0,size:"sm"},i.a.createElement("thead",null,i.a.createElement("tr",null,a.map((function(e,t){var a=n.filter((function(e){return e.indexVarValue===t&&0===e.indexDimension})).map((function(e){return e.indexVarName})),r=a.length>0?"("+a.join(", ")+")":"";return i.a.createElement("th",{className:"w-25"},"".concat(t," ").concat(r))})))),i.a.createElement("tbody",null,i.a.createElement("tr",null,a.map((function(e){return i.a.createElement("td",null,i.a.createElement(g,{object:e,executionStepIndex:t.executionStepIndex}))})))));return{consumed:new Set,ui:r}}}]),e}(),K=function(){function e(){Object(c.a)(this,e)}return Object(l.a)(e,null,[{key:"is",value:function(e,t){return!Object(f.isNullOrUndefined)(e.listObject)&&e.listObject.every((function(e){return!(Object(f.isNullOrUndefined)(e.ptrValue)||!t.heap.storage.has(e.ptrValue))&&H.is(t.heap.storage.get(e.ptrValue),t)}))}},{key:"getUI",value:function(e,t){var n=e.listObject,a=Math.max.apply(Math,Object(M.a)(n.map((function(e){return t.heap.storage.get(e.ptrValue).listObject.length})))),r=t.getArrayIndexAnnotationsFor(e.ptr),o=i.a.createElement(W.a,{bordered:!0,size:"sm"},i.a.createElement("thead",null,i.a.createElement("tr",null,i.a.createElement("th",{className:"w-25"},"#"),Array.from({length:a}).map((function(e,t){var n=r.filter((function(e){return e.indexVarValue===t&&1===e.indexDimension})).map((function(e){return e.indexVarName})),a=n.length>0?"("+n.join(", ")+")":"";return i.a.createElement("th",{className:"w-25"},"".concat(t," ").concat(a))})))),i.a.createElement("tbody",null,n.map((function(e,n){return function(e,n){return i.a.createElement("tr",null,i.a.createElement("th",null,function(){var t=r.filter((function(t){return t.indexVarValue===e&&0===t.indexDimension})).map((function(e){return e.indexVarName})),n=t.length>0?"("+t.join(", ")+")":"";return"".concat(e," ").concat(n)}()),n.listObject.map((function(e){return i.a.createElement("td",null,i.a.createElement(g,{object:e,executionStepIndex:t.executionStepIndex}))})))}(n,t.heap.storage.get(e.ptrValue))})))),c=new Set;return n.forEach((function(e){return c.add(e.ptrValue)})),{consumed:c,ui:o}}}]),e}(),J=function(){function e(){Object(c.a)(this,e)}return Object(l.a)(e,null,[{key:"is",value:function(e,t){return!Object(f.isNullOrUndefined)(e.mapObject)&&"dict"===e.type}},{key:"getUI",value:function(e,t,n){var a=e.mapObject,r=i.a.createElement(W.a,{bordered:!0,size:"sm"},i.a.createElement("thead",null,i.a.createElement("tr",null,i.a.createElement("th",null,"Key"),i.a.createElement("th",null,"Value"))),i.a.createElement("tbody",null,function(){var e=[];return a.forEach((function(a,r){e.push(i.a.createElement("tr",null,i.a.createElement("td",null,r),i.a.createElement("td",null,i.a.createElement(g,{object:a,executionStepIndex:t.executionStepIndex,onClick:n}))))})),e}()));return{consumed:new Set,ui:r}}}]),e}(),G=function(e){var t=e.vmEngine.heap,n=new Set,a=[],r=function(t,r){var o,c,l,s=(o=r,c=e.vmEngine,l=e.onVmObjectClick,H.is(o,c)?H.getUI(o,c):K.is(o,c)?K.getUI(o,c):J.is(o,c)?J.getUI(o,c,l):{consumed:new Set,ui:i.a.createElement("div",null,"Not Supported")});s.consumed.forEach((function(e){return n.add(e)})),a.push(i.a.createElement(B.a,null,i.a.createElement(B.a.Body,{className:e.highlightedPtr===t?"highlightedBackground":null},s.ui)))},o=z.createUI(e.vmEngine,e.highlightedPtr);return o.consumed.forEach((function(e){return n.add(e)})),o.consumed.size>0&&a.push(i.a.createElement(B.a,null,i.a.createElement(B.a.Body,null,o.ui))),t.namedReferences.forEach((function(e){t.storage.has(e)&&!n.has(e)&&(n.add(e),r(e,t.storage.get(e)))})),t.storage.forEach((function(e,t){n.has(t)||r(t,e)})),i.a.createElement("div",null,a)},$=n(59),q=n.n($),Q=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).vmEngine=void 0,a.state=void 0,a.monaco=void 0,a.decorations=void 0,a.vmEngine=new y(h),a.state={lineNumber:-1,highlightedPtr:0,isEditing:!0,isWaiting:!1,code:'\n\ndef fillMatrix(m):\n    """\n    index: m[i][j]\n    """\n    for i in range(len(m)):\n        for j in range(len(m[0])):\n            m[i][j] = i+j\n\ndef fibonacci(n):\n    if n == 0 or n == 1:\n        return 1\n    ans = 0\n    ans += fibonacci(n-1)\n    ans += fibonacci(n-2)\n    return ans\n\nclass TreeNode:\n    """\n    pointers: left, right\n    """\n    def __init__(self):\n        self.data = 0\n        self.left = None\n        self.right = None\n\nclass ListNode:\n    """\n    pointers: next\n    """\n    def __init__(self):\n        self.data = 0\n        self.next = None\n\ndef constructList():\n    head = ListNode()\n    head.data = 1\n\n    cur = head\n    for i in range (2, 5):\n        cur.next = ListNode()\n        cur.next.data = i\n        cur = cur.next\n    return head\n\ndef constructTree():\n    a = TreeNode()\n    b = TreeNode()\n    c = TreeNode()\n    a.data = 1\n    b.data = 2\n    c.data = 3\n    a.left = b\n    a.right = c\n    a.data += 1\n\ndef reverseList(head):\n    if head.next is None:\n        return (head, head)\n    newHead, newTail = reverseList(head.next)\n    newTail.next = head\n    head.next = None\n    return newHead, head\n\ndef main():\n    # constructTree()\n    # testMap = {1: 100, 2: 200}\n    m = [[0,0,0], [0,0,0], [0,0,0]]\n    fillMatrix(m)\n    # fibonacci(4)\n\n    l = constructList()\n    newHead, newTail = reverseList(l)\n    return 0\n\n\n\n',trace:h},a.decorations=[],a}return Object(l.a)(n,[{key:"render",value:function(){var e=this,t=function(t){e.setState({highlightedPtr:t})},n=i.a.createElement(b,{highlightedPtr:this.state.highlightedPtr,vmEngine:this.vmEngine,onVmObjectClick:t}),a=i.a.createElement(G,{vmEngine:this.vmEngine,highlightedPtr:this.state.highlightedPtr,onVmObjectClick:t}),r=function(t){1===t?e.vmEngine.nextStep():-1===t?e.vmEngine.prevStep():10===t&&e.vmEngine.nextAndSkipFunction();var n=e.vmEngine.executionLineNumber,a=[];n>0&&(e.monaco.revealLineInCenter(n),a=[{range:new D.a(n,1,n,1),options:{isWholeLine:!0,className:"highlightedLine"}}]),e.decorations=e.monaco.deltaDecorations(e.decorations,a),e.setState({lineNumber:e.vmEngine.executionLineNumber})},o=this.state.isEditing||this.state.isWaiting||Object(f.isNullOrUndefined)(this.state.trace.error)||!("runtime"!==this.state.trace.error.type||this.vmEngine.executionStepIndex>=this.vmEngine.programTrace.length)?null:i.a.createElement(I.a,{style:{marginTop:"15px"},key:"error",variant:"danger"},this.state.trace.error.msg),c=i.a.createElement(i.a.Fragment,null,i.a.createElement(R.a,{height:"70vh",language:"python",value:this.state.code,theme:this.state.isEditing?"dark":"light",editorDidMount:function(t,n){e.monaco=n},options:{readOnly:!this.state.isEditing}}),i.a.createElement(F.a,{className:"padded-container"},i.a.createElement(F.a.Row,{className:"align-items-center"},i.a.createElement(T.a,{xs:"auto"},!1===e.state.isEditing&&0==e.state.isWaiting?i.a.createElement(V.a,null,i.a.createElement(N.a,{onClick:function(){r(-1)}},i.a.createElement(p.b,null),"Previous"),i.a.createElement(N.a,{onClick:function(){r(1)}},i.a.createElement(p.c,null),"Next"),i.a.createElement(N.a,{onClick:function(){r(10)},disabled:!e.vmEngine.isAboutToEnterFunction()},i.a.createElement(p.a,null)," Step Over Function")):!0===e.state.isWaiting?i.a.createElement(w.a,{animation:"border"}):i.a.createElement(i.a.Fragment,null)),i.a.createElement(T.a,{xs:"auto"},this.state.isEditing?i.a.createElement(N.a,{onClick:function(){var t=e.monaco.getValue();e.setState({isEditing:!1,isWaiting:!0,code:t,trace:[]}),q.a.post("/trace").send({code:t}).then((function(t){!1!==e.state.isWaiting&&(200!==t.status?alert(t.status):(e.vmEngine=new y(t.body),e.setState({trace:t.body,isWaiting:!1})))}))}},"Run"):i.a.createElement(N.a,{onClick:function(){e.decorations=e.monaco.deltaDecorations(e.decorations,[]),e.setState({isEditing:!0,isWaiting:!1})}},"Edit")))),o);return i.a.createElement(i.a.Fragment,null,i.a.createElement(A.a,{bg:"dark",variant:"dark"},i.a.createElement(A.a.Brand,{href:"/"},"Gnutella"),i.a.createElement(P.a,{className:"mr-auto",navbar:!0})),i.a.createElement("div",{className:"padded-container"},i.a.createElement(L.a,{fluid:!0},i.a.createElement(U.a,null,i.a.createElement(T.a,{xs:"5"},c),i.a.createElement(T.a,{xs:"2"},this.state.isEditing||this.state.isWaiting?i.a.createElement(i.a.Fragment,null):n),i.a.createElement(T.a,null,this.state.isEditing||this.state.isWaiting?i.a.createElement(i.a.Fragment,null):a)))))}}]),n}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(187);o.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(Q,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},48:function(e,t,n){},65:function(e,t,n){e.exports=n(188)},70:function(e,t,n){}},[[65,2,3]]]);
//# sourceMappingURL=main.dea393ee.chunk.js.map