import{u as y,g as b,M as h,j as e,B as l,R as u,C as r,a as A,S as d,T,U as v,b as S,F as m,d as o,c as w}from"./index-DOxe26S7.js";import{f as z}from"./mock-plans-3gp78QvI.js";import{D as C,C as x}from"./dollar-sign-DDnyyMfx.js";const P=o.div`
  margin-bottom: 24px;
`,R=o.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
`,D=o.p`
  color: ${({theme:s})=>s.colors[s.mode].textSecondary};
  margin: 0;
  font-size: 14px;
`,i=o(w)`
  height: 100%;

  .ant-card-head-title {
    font-weight: 600;
  }
`,c=o.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({$color:s})=>`${s}15`};
  color: ${({$color:s})=>s};
  margin-bottom: 12px;
`;function U(){const{t:s}=y(),a=b(),j=[...h].sort((t,n)=>new Date(n.createdAt).getTime()-new Date(t.createdAt).getTime()).slice(0,5),p=h.filter(t=>t.isPastDue||t.status==="trial"||t.status==="suspended"),g=[{title:s("superAdmin.dashboard.tenant","Tenant"),dataIndex:"name",key:"name",render:(t,n)=>e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:t}),e.jsx("div",{style:{fontSize:12,opacity:.7},children:n.ownerEmail})]})},{title:s("superAdmin.dashboard.plan","Plan"),dataIndex:"planName",key:"plan",render:t=>e.jsx(l,{color:t==="FREE"?"default":t==="PRO"?"blue":"purple",text:t})},{title:s("superAdmin.dashboard.status","Status"),dataIndex:"status",key:"status",render:t=>{const n={active:"success",trial:"warning",past_due:"error",suspended:"default"};return e.jsx(l,{status:n[t],text:t.replace("_"," ")})}},{title:s("superAdmin.dashboard.users","Users"),dataIndex:"userCount",key:"userCount"},{title:s("superAdmin.dashboard.created","Created"),dataIndex:"createdAt",key:"createdAt",render:t=>new Date(t).toLocaleDateString()}],f=[{title:s("superAdmin.dashboard.tenant","Tenant"),dataIndex:"name",key:"name"},{title:s("superAdmin.dashboard.issue","Issue"),key:"issue",render:(t,n)=>n.isPastDue?e.jsx(l,{status:"error",text:"Payment Past Due"}):n.status==="trial"?e.jsx(l,{status:"warning",text:"Trial Ending Soon"}):n.status==="suspended"?e.jsx(l,{status:"default",text:"Suspended"}):null},{title:s("superAdmin.dashboard.action","Action"),key:"action",render:(t,n)=>e.jsx("a",{href:`/super-admin/tenants/${n.id}`,children:s("superAdmin.dashboard.view","View")})}];return e.jsxs("div",{children:[e.jsxs(P,{children:[e.jsx(R,{children:s("superAdmin.dashboard.title","Platform Dashboard")}),e.jsx(D,{children:s("superAdmin.dashboard.description","Overview of your multi-tenant platform health and metrics")})]}),e.jsxs(u,{gutter:[16,16],style:{marginBottom:24},children:[e.jsx(r,{xs:24,sm:12,lg:6,children:e.jsxs(i,{children:[e.jsx(c,{$color:"#6366f1",children:e.jsx(A,{size:24})}),e.jsx(d,{title:s("superAdmin.dashboard.totalTenants","Total Tenants"),value:a.totalTenants,suffix:e.jsxs("span",{style:{fontSize:14,color:"#10b981"},children:["+",a.newTenantsThisMonth," this month"]})})]})}),e.jsx(r,{xs:24,sm:12,lg:6,children:e.jsxs(i,{children:[e.jsx(c,{$color:"#10b981",children:e.jsx(T,{size:24})}),e.jsx(d,{title:s("superAdmin.dashboard.activeTenants","Active Tenants"),value:a.activeTenants,valueStyle:{color:"#10b981"}})]})}),e.jsx(r,{xs:24,sm:12,lg:6,children:e.jsxs(i,{children:[e.jsx(c,{$color:"#3b82f6",children:e.jsx(v,{size:24})}),e.jsx(d,{title:s("superAdmin.dashboard.totalUsers","Total Users"),value:a.totalUsers,suffix:e.jsxs("span",{style:{fontSize:14,opacity:.7},children:[a.activeUsersLast30Days," active"]})})]})}),e.jsx(r,{xs:24,sm:12,lg:6,children:e.jsxs(i,{children:[e.jsx(c,{$color:"#f59e0b",children:e.jsx(C,{size:24})}),e.jsx(d,{title:s("superAdmin.dashboard.mrr","Monthly Recurring Revenue"),value:z(a.monthlyRecurringRevenue),valueStyle:{color:"#f59e0b"}})]})})]}),e.jsxs(u,{gutter:[16,16],style:{marginBottom:24},children:[e.jsx(r,{xs:24,sm:12,lg:8,children:e.jsx(i,{children:e.jsx(d,{title:e.jsxs("span",{children:[e.jsx(S,{size:14,style:{marginRight:8}}),s("superAdmin.dashboard.trialTenants","Trial Tenants")]}),value:a.trialTenants,valueStyle:{color:"#f59e0b"}})})}),e.jsx(r,{xs:24,sm:12,lg:8,children:e.jsx(i,{children:e.jsx(d,{title:e.jsxs("span",{children:[e.jsx(x,{size:14,style:{marginRight:8}}),s("superAdmin.dashboard.paymentIssues","Payment Issues")]}),value:a.tenantsWithPaymentIssues,valueStyle:{color:"#ef4444"}})})}),e.jsx(r,{xs:24,sm:12,lg:8,children:e.jsx(i,{children:e.jsx(d,{title:e.jsxs("span",{children:[e.jsx(x,{size:14,style:{marginRight:8}}),s("superAdmin.dashboard.nearQuota","Near Quota Limits")]}),value:a.tenantsNearQuotaLimits,valueStyle:{color:"#f59e0b"}})})})]}),e.jsxs(u,{gutter:[16,16],children:[e.jsx(r,{xs:24,lg:14,children:e.jsx(i,{title:s("superAdmin.dashboard.recentTenants","Recent Tenants"),children:e.jsx(m,{columns:g,dataSource:j,rowKey:"id",pagination:!1,size:"small"})})}),e.jsx(r,{xs:24,lg:10,children:e.jsx(i,{title:e.jsxs("span",{children:[e.jsx(x,{size:16,style:{marginRight:8,color:"#f59e0b"}}),s("superAdmin.dashboard.needsAttention","Needs Attention")]}),children:e.jsx(m,{columns:f,dataSource:p,rowKey:"id",pagination:!1,size:"small"})})})]})]})}export{U as default};
