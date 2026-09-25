const BASE=(import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/v1').replace(/\/$/,'')
async function request(path:string, options:RequestInit={}){
 const token=localStorage.getItem('doctor_access_token'); const headers=new Headers(options.headers); headers.set('Content-Type','application/json'); if(token) headers.set('Authorization',`Bearer ${token}`)
 const r=await fetch(BASE+path,{...options,headers}); const t=await r.text(); let d:any={}; try{d=t?JSON.parse(t):{}}catch{d={message:t}}
 if(!r.ok) throw new Error(d.message||`Request failed (${r.status})`); return d
}
export const api={
 login:(email:string,password:string)=>request('/doctor/login',{method:'POST',body:JSON.stringify({email,password})}),
 register:(data:any)=>request('/doctor/register',{method:'POST',body:JSON.stringify(data)}),
 profile:()=>request('/doctor/profile'),
 appointments:()=>request('/doctor/appointments'),
 patients:()=>request('/doctor/patients'),
 updateProfile:(data:any)=>request('/doctor/profile',{method:'PUT',body:JSON.stringify(data)}),
 appointmentStatus:(id:string,status:string)=>request(`/doctor/appointments/${encodeURIComponent(id)}/status`,{method:'PATCH',body:JSON.stringify({status})})
}