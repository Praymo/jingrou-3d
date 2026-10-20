import {reports,fileSize} from "./report-catalog.js";

const params=new URLSearchParams(location.search);
const id=params.get("id");
const report=Object.hasOwn(reports,id)?reports[id]:null;
const lang=params.get("lang")==="en"?"en":"zh";
const english=lang==="en";
const $=selector=>document.querySelector(selector);
const status=$("#reader-status");
const stage=$("#document-stage");
const paper=$("#paper");
const input=$("#page-number");
const zoom=$("#zoom");
const previous=$("#previous-page");
const next=$("#next-page");
const text=(zh,en)=>english?en:zh;
document.documentElement.lang=english?"en":"zh-CN";
$("#back-link").textContent=text("← 返回研究页","← Back to research");

if(!report){
  document.body.dataset.readerState="error";
  $("#report-title").textContent=text("未找到这份报告","Report not found");
  status.textContent=text("请返回研究页，选择一份已发布的报告。","Return to the research page and choose an available report.");
  stage.hidden=true;
}else{
  $("#report-title").textContent=report.title[lang];
  document.title=report.title[lang]+text(" | 报告阅读"," | Reading Room");
  $("#report-category").textContent=report.category[lang];
  $("#report-meta").textContent=`${report.date.replaceAll("-",".")}  ·  ${report.pages} ${text("页","pages")}  ·  PDF  ·  ${fileSize(report.bytes)}`;
  $("#report-note").textContent=report.note[lang];
  $("#back-link").href="research.html#"+(report.anchor||"reports");
  const download=$("#download-pdf");download.href=report.file;download.download=report.title.zh+".pdf";download.hidden=false;download.textContent=text("下载 PDF ↓","Download PDF ↓");
  const native=$("#native-pdf");native.href=report.file;native.hidden=false;native.textContent=report.original?text("打开原始 PDF ↗","Open original PDF ↗"):text("打开公开版 PDF ↗","Open public PDF ↗");
  previous.setAttribute("aria-label",text("上一页","Previous page"));next.setAttribute("aria-label",text("下一页","Next page"));
  $("#page-label").textContent=text("页码","Page");input.setAttribute("aria-label",text("页码","Page number"));
  $("#zoom-label").textContent=text("缩放","Zoom");zoom.setAttribute("aria-label",text("缩放","Zoom"));zoom.options[0].textContent=text("适合宽度","Fit width");
  $("#reader-tip").textContent=text("可用 ← / → 翻页；也可输入页码。需要保存或使用其他阅读器，请下载 PDF。","Use ← / → or enter a page number. Download the PDF to save it or use another reader.");
  let pdf=null,pageNumber=1,token=0,task=null,resizeTimer;
  function controls(){previous.disabled=!pdf||pageNumber<=1;next.disabled=!pdf||pageNumber>=pdf.numPages;input.disabled=!pdf;zoom.disabled=!pdf;input.value=pageNumber;}
  async function render(){
    const current=++token;
    task?.cancel();task=null;
    document.body.dataset.readerState="loading";
    status.textContent=text(`正在显示第 ${pageNumber} 页…`,`Rendering page ${pageNumber}…`);
    controls();
    try{
      const page=await pdf.getPage(pageNumber);
      if(current!==token)return;
      const base=page.getViewport({scale:1});
      const padding=parseFloat(getComputedStyle(stage).paddingLeft)*2;
      const scale=zoom.value==="fit"?Math.min(1.55,(stage.clientWidth-padding)/base.width):Number(zoom.value);
      const viewport=page.getViewport({scale:Math.max(.25,scale)});
      const dpi=Math.min(devicePixelRatio||1,2,Math.sqrt(12000000/(viewport.width*viewport.height)));
      const canvas=document.createElement("canvas");
      canvas.width=Math.round(viewport.width*dpi);canvas.height=Math.round(viewport.height*dpi);
      canvas.style.width=viewport.width+"px";canvas.style.height=viewport.height+"px";
      canvas.setAttribute("role","img");canvas.setAttribute("aria-label",report.title[lang]+text(`，第 ${pageNumber} 页`,` — page ${pageNumber}`));
      paper.replaceChildren(canvas);
      task=page.render({canvasContext:canvas.getContext("2d"),viewport,transform:[dpi,0,0,dpi,0,0]});
      await task.promise;
      if(current!==token)return;
      task=null;document.body.dataset.readerState="ready";
      status.textContent=text(`第 ${pageNumber} / ${pdf.numPages} 页`,`Page ${pageNumber} of ${pdf.numPages}`);
      history.replaceState(null,"",`#page=${pageNumber}`);
    }catch(error){
      if(current!==token||error.name==="RenderingCancelledException")return;
      console.warn("PDF page preview:",error.name,error.message);
      document.body.dataset.readerState="error";
      status.textContent=text("这一页暂时无法预览。可以重试翻页，或用上方链接打开、下载 PDF。","This page could not be rendered. Try another page, or open/download the PDF above.");
    }
  }
  function goTo(value){if(!pdf)return;const parsed=Math.round(Number(value));if(!Number.isFinite(parsed)){controls();return;}pageNumber=Math.max(1,Math.min(pdf.numPages,parsed));render();}
  previous.addEventListener("click",()=>goTo(pageNumber-1));next.addEventListener("click",()=>goTo(pageNumber+1));
  input.addEventListener("change",()=>goTo(input.value));
  input.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();input.blur();}});
  zoom.addEventListener("change",()=>pdf&&render());
  window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(pdf&&zoom.value==="fit")render();},180);});
  document.addEventListener("keydown",event=>{
    if(event.target.closest("input,select,textarea,[contenteditable]")||event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();goTo(pageNumber+(event.key==="ArrowRight"?1:-1));}
  });
  try{
    status.textContent=text("正在载入报告…","Loading report…");
    const lib=await import("./vendor/pdfjs/pdf.mjs");
    lib.GlobalWorkerOptions.workerSrc=new URL("./vendor/pdfjs/pdf.worker.mjs",import.meta.url).href;
    pdf=await lib.getDocument({url:report.file,cMapUrl:"vendor/pdfjs/cmaps/",cMapPacked:true,standardFontDataUrl:"vendor/pdfjs/standard_fonts/",wasmUrl:"vendor/pdfjs/wasm/",iccUrl:"vendor/pdfjs/iccs/",isEvalSupported:false}).promise;
    $("#page-total").textContent=pdf.numPages;input.max=pdf.numPages;
    const initial=/^#page=(\d+)$/.exec(location.hash);
    goTo(initial?initial[1]:1);
  }catch(error){
    console.warn("PDF reader:",error.name,error.message);
    document.body.dataset.readerState="error";
    status.textContent=text("在线阅读器暂时不可用。请用上方链接直接打开或下载报告。","The online reader is unavailable. Open or download the PDF using the links above.");
  }
}
