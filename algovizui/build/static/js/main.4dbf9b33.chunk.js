(this.webpackJsonpalgovizui=this.webpackJsonpalgovizui||[]).push([[1],{200:function(e,t,n){},217:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(24),o=n.n(i),c=(n(95),n(14)),l=n(15),s=n(51),u=n(48),d=(n(61),{infer:[],log:[]}),m=n(222),h=n(71),f=n(7),p=n(28),g=function(e){return Object(f.isNullOrUndefined)(e.object.ptrValue)?r.a.createElement("div",{className:e.object.modifiedAtStep===e.executionStepIndex?"highlightedLine":""},(Object(f.isNullOrUndefined)(e.name)?"":e.name+": ")+e.object.toString()):r.a.createElement("div",{className:e.object.modifiedAtStep===e.executionStepIndex?"highlightedLine":""},Object(f.isNullOrUndefined)(e.name)?"":e.name+": ",r.a.createElement("a",{href:"#",onClick:function(){null!==e.onClick&&e.onClick(e.object.ptrValue)}},0===e.object.ptrValue?"None":-1===e.object.ptrValue?"Tuple":e.highlightedPtr===e.object.ptrValue?r.a.createElement(r.a.Fragment,null,"Show"," ",r.a.createElement(p.d,null)):"Show"))},v=function(e){var t=[];e.frame.args.forEach((function(n,a,i){t.push(r.a.createElement(g,{highlightedPtr:e.highlightedPtr,name:a,object:n,onClick:e.onVmObjectClick,executionStepIndex:e.vmEngine.executionStepIndex}))})),e.frame.locals.forEach((function(n,a,i){t.push(r.a.createElement(g,{highlightedPtr:e.highlightedPtr,name:a,object:n,onClick:e.onVmObjectClick,executionStepIndex:e.vmEngine.executionStepIndex}))}));var n=null;return Object(f.isNullOrUndefined)(e.frame.returnVal)||(n=r.a.createElement("div",null,r.a.createElement(g,{highlightedPtr:e.highlightedPtr,name:"Return",object:e.frame.returnVal,onClick:e.onVmObjectClick,executionStepIndex:e.vmEngine.executionStepIndex}),")")),r.a.createElement("div",null,r.a.createElement("div",null,e.frame.methodName+"()"),r.a.createElement("div",null,t),n)},b=function(e){return r.a.createElement(m.a,null,e.vmEngine.stack.frames.map((function(t){return r.a.createElement(h.a,null,r.a.createElement(v,{highlightedPtr:e.highlightedPtr,frame:t,onVmObjectClick:e.onVmObjectClick,vmEngine:e.vmEngine}))})))},E=n(86),x=function(){function e(){Object(c.a)(this,e),this.boolValue=void 0,this.numberValue=void 0,this.ptrValue=void 0,this.stringValue=void 0,this.modifiedAtStep=void 0}return Object(l.a)(e,[{key:"toString",value:function(){return Object(f.isNullOrUndefined)(this.boolValue)?Object(f.isNullOrUndefined)(this.numberValue)?Object(f.isNullOrUndefined)(this.ptrValue)?Object(f.isNullOrUndefined)(this.stringValue)?"null":'"'+this.stringValue+'"':"#"+this.ptrValue:""+this.numberValue:""+this.boolValue}}],[{key:"fromBool",value:function(t){var n=new e;return n.boolValue=t,n}},{key:"fromNumber",value:function(t){var n=new e;return n.numberValue=t,n}},{key:"fromPtr",value:function(t){var n=new e;return n.ptrValue=t,n}},{key:"fromString",value:function(t){var n=new e;return n.stringValue=t,n}},{key:"fromVal",value:function(t){var n=t[0],a=t[1];return n?e.fromPtr(a):null==a||void 0==a?new e:"string"==typeof a?e.fromString(a):"number"==typeof a?e.fromNumber(a):"boolean"==typeof a?e.fromBool(a):new e}}]),e}(),j=function(){function e(t,n){Object(c.a)(this,e),this.methodName=void 0,this.args=new Map,this.locals=new Map,this.returnVal=void 0,this.methodName=t,this.args=n}return Object(l.a)(e,[{key:"getVariable",value:function(e){return this.locals.has(e)?this.locals.get(e):this.args.has(e)?this.args.get(e):null}},{key:"getAllVariables",value:function(){var e=new Map;return this.args.forEach((function(t,n){return e.set(n,t)})),this.locals.forEach((function(t,n){return e.set(n,t)})),e}}]),e}(),O=function(){function e(){Object(c.a)(this,e),this.frames=[]}return Object(l.a)(e,[{key:"pushFrame",value:function(e){this.frames.push(e)}},{key:"markFrameReturn",value:function(e){this.getTopFrame().returnVal=e}},{key:"popFrame",value:function(){this.frames.pop()}},{key:"getTopFrame",value:function(){return this.frames[this.frames.length-1]}}]),e}(),k=function e(t,n){Object(c.a)(this,e),this.type=void 0,this.ptr=void 0,this.listObject=void 0,this.mapObject=void 0,this.type=n,this.ptr=t},S=function(){function e(){Object(c.a)(this,e),this.storage=void 0,this.namedReferences=void 0,this.storage=new Map,this.namedReferences=new Set}return Object(l.a)(e,[{key:"updateNamedReferences",value:function(e){var t=this;this.namedReferences=new Set,e.frames.forEach((function(e){e.args.forEach((function(e){null!==e.ptrValue&&t.namedReferences.add(e.ptrValue)})),e.locals.forEach((function(e){null!==e.ptrValue&&t.namedReferences.add(e.ptrValue)}))}))}}]),e}(),V=function(){function e(t){Object(c.a)(this,e),this.stack=void 0,this.heap=void 0,this.programTrace=void 0,this.programInfer=void 0,this.executionStepIndex=-1,this.executionLineNumber=-1,this.programTrace=t.log,this.programInfer=t.infer,this.stack=new O,this.heap=new S}return Object(l.a)(e,[{key:"getTopFrameNamedReferencesMap",value:function(){var e=new Map;return Object(f.isNullOrUndefined)(this.stack.getTopFrame())||this.stack.getTopFrame().getAllVariables().forEach((function(t,n){Object(f.isNullOrUndefined)(t.ptrValue)||(e.has(t.ptrValue)||e.set(t.ptrValue,[]),e.get(t.ptrValue).push(n))})),e}},{key:"nextStep",value:function(){this.nextStepInternal()}},{key:"isAboutToEnterFunction",value:function(){return!(this.executionStepIndex<=0)&&(this.executionStepIndex+1<this.programTrace.length&&"pushFrame"===this.programTrace[this.executionStepIndex+1].op)}},{key:"nextAndSkipFunction",value:function(){if(this.isAboutToEnterFunction())for(var e=0,t=!1;!(this.executionStepIndex>=this.programTrace.length)&&("pushFrame"===this.programTrace[this.executionStepIndex].op?e++:"popFrame"===this.programTrace[this.executionStepIndex].op&&(e--,t=!0),this.nextStepInternal(),0!==e||!t););}},{key:"executeStep",value:function(e){var t=this;if("line"==e.op)this.executionLineNumber=e.info;else if("pushFrame"==e.op){var n=new Map(Object.entries(e.info.locals)),a=new Map;n.forEach((function(e,t,n){a.set(t,x.fromVal(e))}));var r=new j(e.info.function,a);this.stack.pushFrame(r),this.executionLineNumber=e.info.line}else if("newLocal"==e.op||"updateLocal"==e.op){var i=x.fromVal(e.info[1]);i.modifiedAtStep=this.executionStepIndex,this.stack.getTopFrame().locals.set(e.info[0],i)}else if("return"==e.op)this.stack.getTopFrame().returnVal=x.fromVal(e.info),this.stack.getTopFrame().returnVal.modifiedAtStep=this.executionStepIndex;else if("popFrame"==e.op)this.stack.popFrame();else if("new"==e.op){var o=e.info[0],c=new k(o,"");if(Array.isArray(e.info[1])){var l=e.info[1];c.listObject=l.map((function(e){return x.fromVal(e)})),c.type="list"}else c.type=e.info[1].type,c.mapObject=new Map,Object.entries(e.info[1].members).forEach((function(e){var t=Object(E.a)(e,2),n=t[0],a=t[1];c.mapObject.set(n,x.fromVal(a))}));this.heap.storage.set(o,c)}else if("modifyPos"==e.op){var s=e.info[0],u=e.info[1],d=e.info[2],m=this.heap.storage.get(s),h=x.fromVal(d);h.modifiedAtStep=this.executionStepIndex,u>=m.listObject.length?m.listObject.push(h):m.listObject[u]=h}else if("modifyKey"==e.op||"addKey"==e.op){var f=e.info[0],p=e.info[1],g=e.info[2],v=this.heap.storage.get(f),b=x.fromVal(g);b.modifiedAtStep=this.executionStepIndex,v.mapObject.set(p,b)}else"delete"==e.op?this.heap.storage.delete(e.info):"batch"==e.op&&e.info.forEach((function(e){return t.executeStep(e)}))}},{key:"nextStepInternal",value:function(){if(this.executionStepIndex++,this.executionStepIndex>=this.programTrace.length)return!1;var e=this.programTrace[this.executionStepIndex];return this.executeStep(e),this.heap.updateNamedReferences(this.stack),!0}},{key:"prevStep",value:function(){var e=this.executionStepIndex-1;this.reset();for(var t=0;t<e;t++)this.nextStep()}},{key:"reset",value:function(){this.executionLineNumber=-1,this.executionStepIndex=-1,this.stack=new O}},{key:"getMemberPointerAnnotationsFor",value:function(e){var t=this.heap.storage.get(e);return this.programInfer.filter((function(e){return"memberPointer"===e.type&&e.data.className===t.type})).map((function(e){return e.data}))}},{key:"getArrayIndexAnnotationsFor",value:function(e){var t=this,n=this.stack.getTopFrame(),a=[];return n.locals.forEach((function(r,i){t.programInfer.forEach((function(t){if("arrayIndex"===t.type){var o=t.data;o.funcName===n.methodName&&o.var===i&&n.getVariable(o.array).ptrValue===e&&a.push({indexVarName:i,indexVarValue:r.numberValue,indexDimension:o.index})}}))})),a}}]),e}(),y=n(231),N=n(224),w=n(229),I=n(225),F=n(226),T=n(82),L=n(227),A=n(232),P=n(230),U=n(83),C=n(228),R=n(56),M=n.n(R),D=n(84),W=n(87),B=n(223),_=n(233),z=(n(199),n(200),n(201)),H=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).visjsDomRef=void 0,a.graph=void 0,a.options=void 0,a.visjsDomRef=r.a.createRef(),a.options={layout:{hierarchical:{direction:"UD",sortMethod:"directed"}}},a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.graph=new z.Network(this.visjsDomRef.current,this.props.data,this.options)}},{key:"render",value:function(){return Object(f.isNullOrUndefined)(this.visjsDomRef.current)||(this.graph=new z.Network(this.visjsDomRef.current,this.props.data,this.options),Object(f.isNullOrUndefined)(this.props.data.nodes.get(this.props.highlightedPtr))||this.props.data.nodes.update([{id:this.props.highlightedPtr,color:{background:"#AAFFAA"}}])),r.a.createElement("div",{className:"heap-graph",ref:this.visjsDomRef})}}],[{key:"getLabelFor",value:function(e,t,n){var a=[];return e.mapObject.forEach((function(e,n){t.find((function(e){return e.member===n}))||a.push("*".concat(n,": ").concat(e.toString(),"*"))})),(a.length>0?a.join("\n"):"*...*")+(n.length>0?"\n("+n.join(", ")+")":"")}},{key:"createUI",value:function(e,t){var a=e.heap,i=[],o=[],c=new Set,l=e.getTopFrameNamedReferencesMap();a.storage.forEach((function(t,a){var r,s=e.getMemberPointerAnnotationsFor(a);s.length>0&&(c.add(a),i.push({id:a,label:n.getLabelFor(t,s,null!==(r=l.get(a))&&void 0!==r?r:[]),color:{background:"#d9e6eb"},shape:"box",font:{multi:"md"}}),s.forEach((function(e){t.mapObject.has(e.member)&&0!==t.mapObject.get(e.member).ptrValue&&o.push({from:a,to:t.mapObject.get(e.member).ptrValue,arrows:"to",label:e.member})})))}));var s={nodes:new z.DataSet(i),edges:new z.DataSet(o)};return{consumed:c,ui:r.a.createElement(n,{data:s,vmEngine:e,highlightedPtr:t})}}}]),n}(r.a.Component),K=function(){function e(){Object(c.a)(this,e)}return Object(l.a)(e,null,[{key:"is",value:function(e,t){return!Object(f.isNullOrUndefined)(e.listObject)&&e.listObject.every((function(e){return Object(f.isNullOrUndefined)(e.ptrValue)}))}},{key:"getUI",value:function(e,t){var n=t.getArrayIndexAnnotationsFor(e.ptr),a=e.listObject,i=r.a.createElement(B.a,{bordered:!0,size:"sm"},r.a.createElement("thead",null,r.a.createElement("tr",null,a.map((function(e,t){var a=n.filter((function(e){return e.indexVarValue===t&&0===e.indexDimension})).map((function(e){return e.indexVarName})),i=a.length>0?"("+a.join(", ")+")":"";return r.a.createElement("th",{className:"w-25"},"".concat(t," ").concat(i))})))),r.a.createElement("tbody",null,r.a.createElement("tr",null,a.map((function(e){return r.a.createElement("td",null,r.a.createElement(g,{object:e,executionStepIndex:t.executionStepIndex}))})))));return{consumed:new Set,ui:i}}}]),e}(),J=function(){function e(){Object(c.a)(this,e)}return Object(l.a)(e,null,[{key:"is",value:function(e,t){return!Object(f.isNullOrUndefined)(e.listObject)&&e.listObject.every((function(e){return!(Object(f.isNullOrUndefined)(e.ptrValue)||!t.heap.storage.has(e.ptrValue))&&K.is(t.heap.storage.get(e.ptrValue),t)}))}},{key:"getUI",value:function(e,t){var n=e.listObject,a=Math.max.apply(Math,Object(W.a)(n.map((function(e){return t.heap.storage.get(e.ptrValue).listObject.length})))),i=t.getArrayIndexAnnotationsFor(e.ptr),o=r.a.createElement(B.a,{bordered:!0,size:"sm"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{className:"w-25"},"#"),Array.from({length:a}).map((function(e,t){var n=i.filter((function(e){return e.indexVarValue===t&&1===e.indexDimension})).map((function(e){return e.indexVarName})),a=n.length>0?"("+n.join(", ")+")":"";return r.a.createElement("th",{className:"w-25"},"".concat(t," ").concat(a))})))),r.a.createElement("tbody",null,n.map((function(e,n){return function(e,n){return r.a.createElement("tr",null,r.a.createElement("th",null,function(){var t=i.filter((function(t){return t.indexVarValue===e&&0===t.indexDimension})).map((function(e){return e.indexVarName})),n=t.length>0?"("+t.join(", ")+")":"";return"".concat(e," ").concat(n)}()),n.listObject.map((function(e){return r.a.createElement("td",null,r.a.createElement(g,{object:e,executionStepIndex:t.executionStepIndex}))})))}(n,t.heap.storage.get(e.ptrValue))})))),c=new Set;return n.forEach((function(e){return c.add(e.ptrValue)})),{consumed:c,ui:o}}}]),e}(),G=function(){function e(){Object(c.a)(this,e)}return Object(l.a)(e,null,[{key:"is",value:function(e,t){return!Object(f.isNullOrUndefined)(e.mapObject)&&"dict"===e.type}},{key:"getUI",value:function(e,t,n){var a=e.mapObject,i=r.a.createElement(B.a,{bordered:!0,size:"sm"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Key"),r.a.createElement("th",null,"Value"))),r.a.createElement("tbody",null,function(){var e=[];return a.forEach((function(a,i){e.push(r.a.createElement("tr",null,r.a.createElement("td",null,i),r.a.createElement("td",null,r.a.createElement(g,{object:a,executionStepIndex:t.executionStepIndex,onClick:n}))))})),e}()));return{consumed:new Set,ui:i}}}]),e}(),$=function(e){var t=e.vmEngine.heap,n=new Set,a=[],i=function(t,i){var o,c,l,s=(o=i,c=e.vmEngine,l=e.onVmObjectClick,K.is(o,c)?K.getUI(o,c):J.is(o,c)?J.getUI(o,c):G.is(o,c)?G.getUI(o,c,l):{consumed:new Set,ui:r.a.createElement("div",null,"Not Supported")});s.consumed.forEach((function(e){return n.add(e)})),a.push(r.a.createElement(_.a,null,r.a.createElement(_.a.Body,{className:e.highlightedPtr===t?"highlightedBackground":null},s.ui)))},o=H.createUI(e.vmEngine,e.highlightedPtr);return o.consumed.forEach((function(e){return n.add(e)})),o.consumed.size>0&&a.push(r.a.createElement(_.a,null,r.a.createElement(_.a.Body,null,o.ui))),t.namedReferences.forEach((function(e){t.storage.has(e)&&!n.has(e)&&(n.add(e),i(e,t.storage.get(e)))})),t.storage.forEach((function(e,t){n.has(t)||i(t,e)})),r.a.createElement("div",null,a)},q=n(72),Q=n.n(q),X=[{route:"/programs/reverse-linked-list",name:"Reverse Linked List",code:'\nclass ListNode:\n    """\n    pointers: next\n    """\n    def __init__(self):\n        self.data = 0\n        self.next = None\n\ndef constructList():\n    head = ListNode()\n    head.data = 1\n\n    cur = head\n    for i in range (2, 5):\n        cur.next = ListNode()\n        cur.next.data = i\n        cur = cur.next\n    return head\n\ndef reverseList(head):\n    if head.next is None:\n        return (head, head)\n    newHead, newTail = reverseList(head.next)\n    head.next = None\n    newTail.next = head\n    return newHead, head\n\ndef main():\n    myList = constructList()\n    newHead, newTail = reverseList(myList)\n    return 0\n'},{route:"/programs/inorder-traversal",name:"Inorder Traversal",code:'\n\nclass TreeNode:\n    """\n    pointers: left, right\n    """\n    def __init__(self, data):\n        self.data = data\n        self.left = None\n        self.right = None\n\ndef traverseInOrder(outList, root):\n    if root.left is not None:\n        traverseInOrder(outList, root.left)\n    outList.append(root.data)\n    if root.right is not None:\n        traverseInOrder(outList, root.right)\n\ndef constructTree():\n    root = TreeNode(0)\n    root.left = TreeNode(11)\n    root.right = TreeNode(12)\n    root.left.left = TreeNode(21)\n    root.left.right = TreeNode(22)\n    return root\n\ndef main():\n    root = constructTree()\n    outList = []\n    traverseInOrder(outList, root)\n    return 0\n'},{route:"/programs/insertion-sort",name:"Insertion Sort",code:'\ndef insertionSort(v):\n    """\n    index: v[i]\n    index: v[j]\n    """\n    i = 0\n    while i < len(v) - 1:\n        j = i + 1\n        while j >= 1:\n            if v[j] < v[j-1]:\n                v[j-1], v[j] = v[j], v[j-1]\n                j -= 1\n            else:\n                break\n        i += 1\n\ndef main():\n    v = [4, 3, 2, 1]\n    insertionSort(v)\n    return 0\n'}],Y=n(73),Z=n(39),ee=n(8),te=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).vmEngine=void 0,a.state=void 0,a.monaco=void 0,a.decorations=void 0,a.vmEngine=new V(d),a.state={lineNumber:-1,highlightedPtr:0,isEditing:!0,isWaiting:!1,code:e.code,trace:d},a.decorations=[],a}return Object(l.a)(n,[{key:"render",value:function(){var e=this,t=function(t){e.setState({highlightedPtr:t})},n=r.a.createElement(b,{highlightedPtr:this.state.highlightedPtr,vmEngine:this.vmEngine,onVmObjectClick:t}),a=r.a.createElement($,{vmEngine:this.vmEngine,highlightedPtr:this.state.highlightedPtr,onVmObjectClick:t}),i=function(t){1===t?e.vmEngine.nextStep():-1===t?e.vmEngine.prevStep():10===t&&e.vmEngine.nextAndSkipFunction();var n=e.vmEngine.executionLineNumber,a=[];n>0&&(e.monaco.revealLineInCenter(n),a=[{range:new D.a(n,1,n,1),options:{isWholeLine:!0,className:"highlightedLine"}}]),e.decorations=e.monaco.deltaDecorations(e.decorations,a),e.setState({lineNumber:e.vmEngine.executionLineNumber})},o=this.state.isEditing||this.state.isWaiting||Object(f.isNullOrUndefined)(this.state.trace.error)||!("runtime"!==this.state.trace.error.type||this.vmEngine.executionStepIndex>=this.vmEngine.programTrace.length)?null:r.a.createElement(A.a,{style:{marginTop:"15px"},key:"error",variant:"danger"},this.state.trace.error.msg),c=r.a.createElement(r.a.Fragment,null,r.a.createElement(M.a,{height:"70vh",language:"python",value:this.state.code,theme:this.state.isEditing?"dark":"light",editorDidMount:function(t,n){e.monaco=n},options:{readOnly:!this.state.isEditing}}),r.a.createElement(P.a,{className:"padded-container"},r.a.createElement(P.a.Row,{className:"align-items-center"},r.a.createElement(U.a,{xs:"auto"},!1===e.state.isEditing&&0==e.state.isWaiting?r.a.createElement(F.a,null,r.a.createElement(T.a,{onClick:function(){i(-1)}},r.a.createElement(p.b,null),"Previous"),r.a.createElement(T.a,{onClick:function(){i(1)}},r.a.createElement(p.c,null),"Next"),r.a.createElement(T.a,{onClick:function(){i(10)},disabled:!e.vmEngine.isAboutToEnterFunction()},r.a.createElement(p.a,null)," Step Over Function")):!0===e.state.isWaiting?r.a.createElement(L.a,{animation:"border"}):r.a.createElement(r.a.Fragment,null)),r.a.createElement(U.a,{xs:"auto"},this.state.isEditing?r.a.createElement(T.a,{onClick:function(){var t=e.monaco.getValue();e.setState({isEditing:!1,isWaiting:!0,code:t,trace:[]}),Q.a.post("/trace").send({code:t}).then((function(t){!1!==e.state.isWaiting&&(200!==t.status?alert(t.status):(e.vmEngine=new V(t.body),e.setState({trace:t.body,isWaiting:!1})))}))}},"Run"):r.a.createElement(T.a,{onClick:function(){e.decorations=e.monaco.deltaDecorations(e.decorations,[]),e.setState({isEditing:!0,isWaiting:!1})}},"Edit")))),o);return r.a.createElement(r.a.Fragment,null,r.a.createElement(C.a,null,r.a.createElement(U.a,{xs:"5"},c),r.a.createElement(U.a,{xs:"2"},this.state.isEditing||this.state.isWaiting?r.a.createElement(r.a.Fragment,null):n),r.a.createElement(U.a,null,this.state.isEditing||this.state.isWaiting?r.a.createElement(r.a.Fragment,null):a)))}}]),n}(r.a.Component),ne=function(){return r.a.createElement(Z.BrowserRouter,{forceRefresh:!0},r.a.createElement(y.a,{bg:"dark",variant:"dark"},r.a.createElement(y.a.Brand,{href:"/"},"Gnutella"),r.a.createElement(y.a.Toggle,{"aria-controls":"basic-navbar-nav"}),r.a.createElement(y.a.Collapse,{id:"basic-navbar-nav"},r.a.createElement(N.a,{className:"mr-auto"},r.a.createElement(w.a,{title:"Sample Programs",id:"basic-nav-dropdown"},X.map((function(e){return r.a.createElement(Y.LinkContainer,{to:e.route},r.a.createElement(w.a.Item,null,e.name))}))),r.a.createElement(N.a.Link,{href:"#about"},"About")))),r.a.createElement("div",{className:"padded-container"},r.a.createElement(I.a,{fluid:!0},r.a.createElement(ee.g,null,X.map((function(e){return r.a.createElement(ee.d,{path:e.route},r.a.createElement(te,{code:e.code}))})),r.a.createElement(ee.d,{path:"/"},r.a.createElement(te,{code:X[0].code}))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(216);o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(ne,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},61:function(e,t,n){},90:function(e,t,n){e.exports=n(217)},95:function(e,t,n){}},[[90,2,3]]]);
//# sourceMappingURL=main.4dbf9b33.chunk.js.map