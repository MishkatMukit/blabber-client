export const allBlabsPromise =()=>{
    return fetch('http://localhost:3000/blabs').then(res=>res.json())
}