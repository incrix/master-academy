export const checkPublish = (id) =>{
  
    fetch("/api/admin/checkPublish", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id:id }),
      })
}