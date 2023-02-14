function syntaxHighlight(json) {
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  }
  
  const prettyPrint = (inspectEl,...objs) => {
    //const inspectEl = document.querySelector("#inspect");
    inspectEl && (inspectEl.innerHTML = "");
    objs.forEach((obj) => {
      const ele = document.createElement("pre");
      const prettyJSON = syntaxHighlight(JSON.stringify(obj, null, 4));
      ele.innerHTML = prettyJSON;
      inspectEl?.appendChild(ele);
    });
  
    /*  const prettyJSON = syntaxHighlight(JSON.stringify(obj, null, 4)) ;
    console.log("pretty",prettyJSON)
    inspetEl.innerHTML=`${prettyJSON}`; */
  };
  
  export default prettyPrint;
  