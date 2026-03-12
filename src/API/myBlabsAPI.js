export const myBlabsPromise =(fb_uid)=>{
    return fetch(`http://localhost:3000/blabs/${fb_uid}`).then(res=>res.json())
}