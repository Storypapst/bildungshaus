export type Source = { title: string; url: string }
export type Problem = { id: string; title: string; metric: string; metricLabel: string; summary: string; detail: string; evidenceStatus: string; sources: Source[]; relatedPaper: string }
export type Content = {
 title:string; subtitle:string; origin:{name:string;role:string;description:string}; thesis:{title:string;body:string};
 nodes:Problem[]; relations:{source:string;target:string;label:string;kind:string}[];
 approach:{title:string;body:string}[]; modules:{id:string;title:string;body:string}[];
 pilot:{title:string;steps:{title:string;body:string}[];successCriteria:string[]};
 economics:{title:string;body:string;scenario:Record<string,unknown>};
 team:{name:string;role:string;status:string}[]; ask:{title:string;body:string};
 papers:{id:string;title:string;slug:string;summary:string;path:string}[];
}
export type Document = { id:string; title:string; body:string; filename:string }
declare global { interface Window { ScrollCraft: { mount:(root:Element)=>{layout:()=>void}; instances: unknown[] } } }
