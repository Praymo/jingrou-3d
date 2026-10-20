import {reports,fileSize} from "./report-catalog.js?v=20261020-update2";

// Add compact reading actions to the existing research summaries as well.
for(const [id,report] of Object.entries(reports)){
  const article=report.anchor&&document.getElementById(report.anchor);
  if(!article)continue;
  const row=document.createElement("div");row.className="report-inline-actions";
  row.innerHTML=`<a class="report-read" data-report-link href="report.html?id=${id}"><span data-lang="zh">阅读完整报告 ↗</span><span data-lang="en">Read full report ↗</span></a><a class="report-download" href="${report.file}" download="${report.title.zh}.pdf"><span data-lang="zh">下载 PDF ↓</span><span data-lang="en">Download PDF ↓</span></a><span class="report-inline-meta">PDF · ${report.pages}<span data-lang="zh"> 页</span><span data-lang="en"> pages</span> · ${fileSize(report.bytes)}</span>`;
  (article.querySelector(":scope > div")||article).append(row);
}

function syncLanguage(){
  const lang=document.body.dataset.activeLang||"zh";
  document.querySelectorAll("[data-report-link]").forEach(link=>{
    const url=new URL(link.href,location.href);
    if(lang==="en")url.searchParams.set("lang","en");else url.searchParams.delete("lang");
    link.href=url.href;
  });
}
new MutationObserver(syncLanguage).observe(document.body,{attributes:true,attributeFilter:["data-active-lang"]});
syncLanguage();
