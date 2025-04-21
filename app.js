document.addEventListener("DOMContentLoaded",()=>{
  userLogin()



})





function userLogin(){
    isLogin=JSON.parse(localStorage.getItem("isLogin"))
    if(!isLogin){
        window.location.href = "/login/signUp/quiz-form-login.html";
    }else{
        console.log(`user login`)
    }
}