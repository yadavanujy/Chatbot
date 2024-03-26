const chatInput=document.querySelector(".chat-input textarea");
const sendChat=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".closeBtn");

let userMessage;
const API_KEY="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";
const inputInItHeight = chatInput.scrollHeight;

const createChatLi=(message,className)=>{
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>` :`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse =(incomingChatLi) =>{
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messageElement= incomingChatLi.querySelector("p");
    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages:[{role:"user",content: userMessage}]
        })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) =>{
        messageElement.classList.add("error");
        messageElement.textContent = "Oops ! Something went wrong , Please try again";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () =>{ 
    userMessage=chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value ="";
    chatInput.style.height=`${inputInItHeight}px`;

    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(()=>{
        const incomingChatLi=createChatLi("Thinking.....","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

// Adjusting the height of the text area based on its content
chatInput.addEventListener("input",() => {
    chatInput.style.height=`${inputInItHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown",(e) => {
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth >800){
        e.preventDefault();
        handleChat();
    }
});
chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
sendChat.addEventListener("click",handleChat);