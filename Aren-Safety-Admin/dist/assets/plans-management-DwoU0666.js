import{p as z,u as C,r as T,M as k,j as e,X as n,C as u,c as m,S as B,T as D,R as j,n as i,i as h,x as w,y as $,F as E,h as F,z as N,A as g,E as y,s as U,d as r}from"./index-CjjjGFlL.js";import{M as c,f as l,c as O}from"./mock-plans-3gp78QvI.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],o=z("check",_),K=r.div`
  margin-bottom: 24px;
`,L=r.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
`,R=r.p`
  color: ${({theme:t})=>t.colors[t.mode].textSecondary};
  margin: 0 0 16px 0;
  font-size: 14px;
`,Y=r(j)`
  margin-bottom: 24px;
`,H=r(m)`
  height: 100%;
  ${({$isPopular:t})=>t&&`
    border: 2px solid #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  `}

  .ant-card-head {
    background: ${({$isPopular:t})=>t?"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)":"transparent"};
    color: ${({$isPopular:t})=>t?"white":"inherit"};
  }
`,W=r.div`
  font-size: 32px;
  font-weight: 700;
  margin: 16px 0;
`,q=r.div`
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 16px;
`,X=r.div`
  margin-top: 16px;
`,d=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  opacity: ${({$enabled:t})=>t?1:.4};
`,G=r.div`
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 8px;
`;function Z(){const{t}=C(),[a,p]=T.useState(!1),f=c.map(s=>({planId:s.id,planName:s.name,count:k.filter(x=>x.planTier===s.tier).length})),b=["employeeManagement","observationTracking","warningsAndFines","correctiveActions","trainingModule","basicAnalytics","advancedAnalytics","heatmapAnalytics","dataExport","bulkImport","apiAccess","customBranding","customDomain","prioritySupport"],A={employeeManagement:"Employee Management",observationTracking:"Observation Tracking",departmentManagement:"Department Management",projectCodeManagement:"Project Code Management",warningsAndFines:"Warnings & Fines",correctiveActions:"Corrective Actions",trainingModule:"Training Module",basicAnalytics:"Basic Analytics",advancedAnalytics:"Advanced Analytics",heatmapAnalytics:"Heatmap Analytics",dataExport:"Data Export",bulkImport:"Bulk Import",apiAccess:"API Access",customBranding:"Custom Branding",customDomain:"Custom Domain",multiUserAccess:"Multi-User Access",roleBasedAccess:"Role-Based Access",emailSupport:"Email Support",prioritySupport:"Priority Support",dedicatedAccountManager:"Dedicated Account Manager"},P=[{title:t("superAdmin.plans.table.feature","Feature"),dataIndex:"feature",key:"feature",width:250,fixed:"left"},...c.map(s=>({title:s.displayName.en,key:s.id,align:"center",render:(x,M)=>{const I=M.feature;return s.features[I]?e.jsx(o,{size:20,color:"#10b981"}):e.jsx(n,{size:20,color:"#ef4444"})}}))],v=b.map(s=>({key:s,feature:A[s]})),S=()=>{U.success(t("superAdmin.plans.saveSuccess","Plans updated successfully")),p(!1)};return e.jsxs("div",{children:[e.jsxs(K,{children:[e.jsx(L,{children:t("superAdmin.plans.title","Plans & Pricing")}),e.jsx(R,{children:t("superAdmin.plans.description","Manage subscription plans, features, and pricing tiers")})]}),e.jsx(Y,{gutter:16,children:f.map(s=>e.jsx(u,{xs:24,sm:8,children:e.jsx(m,{children:e.jsx(B,{title:`${s.planName} Plan Tenants`,value:s.count,prefix:e.jsx(D,{size:20})})})},s.planId))}),e.jsx(j,{gutter:16,style:{marginBottom:24},children:c.map(s=>e.jsx(u,{xs:24,md:8,children:e.jsxs(H,{$isPopular:s.isPopular,title:e.jsxs("div",{children:[s.isPopular&&e.jsx(G,{children:"Most Popular"}),e.jsx("div",{children:s.displayName.en})]}),extra:e.jsx($,{color:s.tier==="enterprise"?"purple":s.tier==="pro"?"blue":"default",children:s.tier.toUpperCase()}),children:[e.jsx(W,{children:s.monthlyPrice===0?"Free":e.jsxs(e.Fragment,{children:[l(s.monthlyPrice),e.jsx("span",{style:{fontSize:16,fontWeight:400},children:"/mo"})]})}),s.monthlyPrice>0&&e.jsxs(q,{children:["or ",l(s.yearlyPrice),"/year (",O(s),"% off)"]}),e.jsx("div",{style:{fontSize:14,marginBottom:16},children:s.description.en}),e.jsxs(i,{column:1,size:"small",children:[e.jsx(i.Item,{label:"Users",children:s.limits.maxUsers===-1?"Unlimited":s.limits.maxUsers}),e.jsx(i.Item,{label:"Observations",children:s.limits.maxObservations===-1?"Unlimited":s.limits.maxObservations}),e.jsxs(i.Item,{label:"Storage",children:[s.limits.maxStorageMB,"MB"]}),e.jsxs(i.Item,{label:"Trial Days",children:[s.trialDays," days"]})]}),e.jsxs(X,{children:[e.jsx("strong",{children:"Key Features:"}),e.jsxs(d,{$enabled:s.features.advancedAnalytics,children:[s.features.advancedAnalytics?e.jsx(o,{size:16,color:"#10b981"}):e.jsx(n,{size:16,color:"#ef4444"}),"Advanced Analytics"]}),e.jsxs(d,{$enabled:s.features.customBranding,children:[s.features.customBranding?e.jsx(o,{size:16,color:"#10b981"}):e.jsx(n,{size:16,color:"#ef4444"}),"Custom Branding"]}),e.jsxs(d,{$enabled:s.features.apiAccess,children:[s.features.apiAccess?e.jsx(o,{size:16,color:"#10b981"}):e.jsx(n,{size:16,color:"#ef4444"}),"API Access"]}),e.jsxs(d,{$enabled:s.features.prioritySupport,children:[s.features.prioritySupport?e.jsx(o,{size:16,color:"#10b981"}):e.jsx(n,{size:16,color:"#ef4444"}),"Priority Support"]})]}),a&&e.jsx(h,{type:"dashed",block:!0,icon:e.jsx(w,{size:16}),style:{marginTop:16},children:t("superAdmin.plans.editPlan","Edit Plan")})]})},s.id))}),e.jsx(m,{title:t("superAdmin.plans.comparison","Feature Comparison"),extra:e.jsxs(F,{children:[e.jsxs("span",{children:[t("superAdmin.plans.editMode","Edit Mode"),":"]}),e.jsx(N,{checked:a,onChange:p}),a&&e.jsx(h,{type:"primary",onClick:S,children:t("common.save","Save Changes")})]}),children:e.jsx(E,{columns:P,dataSource:v,pagination:!1,scroll:{x:800},size:"small"})}),e.jsx(m,{style:{marginTop:24},title:t("superAdmin.plans.advanced","Advanced Settings"),children:e.jsx(g,{children:c.map(s=>e.jsx(g.Panel,{header:`${s.displayName.en} - Advanced Settings`,children:e.jsxs(i,{column:2,bordered:!0,size:"small",children:[e.jsx(i.Item,{label:"Plan ID",children:s.id}),e.jsx(i.Item,{label:"Tier",children:s.tier}),e.jsx(i.Item,{label:"Monthly Price",children:a?e.jsx(y,{value:s.monthlyPrice,prefix:"$",suffix:"/100",style:{width:"100%"}}):l(s.monthlyPrice)}),e.jsx(i.Item,{label:"Yearly Price",children:a?e.jsx(y,{value:s.yearlyPrice,prefix:"$",suffix:"/100",style:{width:"100%"}}):l(s.yearlyPrice)}),e.jsx(i.Item,{label:"Stripe Monthly ID",children:s.stripeMonthlyPriceId||"N/A"}),e.jsx(i.Item,{label:"Stripe Yearly ID",children:s.stripeYearlyPriceId||"N/A"})]})},s.id))})})]})}export{Z as default};
