import { createContext, useState } from "react";
import runChat, { runChatWithOptionalImage } from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [prevPrompts, setPrevPrompts] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")
    const [sentImage, setSentImage] = useState(null);

    // Crisis detection function
    const checkForCrisis = (prompt) => {
        const crisisKeywords = [
            'suicide', 'kill myself', 'end my life', 'want to die', 
            'want to end it', 'no will to live', 'want to disappear',
            'better off dead', 'suicidal', 'end everything'
        ];
        
        const urgentKeywords = [
            'help me', 'emergency', 'can\'t take it', 'save me',
            'helpless', 'hopeless', 'nothing matters', 'crying help'
        ];
        
        const promptLower = prompt.toLowerCase();
        
        if (crisisKeywords.some(word => promptLower.includes(word))) {
            return "CRISIS_ALERT";
        }
        if (urgentKeywords.some(word => promptLower.includes(word))) {
            return "URGENT_SUPPORT";
        }
        return null;
    };

    function delayPara(index, nextWord) {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index);
    }

    const onSent = async (prompt, imageFile = null) => {
        let finalPrompt = prompt !== undefined ? prompt : input;
    
        // Card-specific prompts ko optimize karo
        if (finalPrompt.includes("exam stress") || finalPrompt.includes("exam anxiety")) {
            finalPrompt = "Provide specific techniques for managing exam stress and test anxiety. Include study strategies, relaxation techniques during exams, and mindset tips. Focus on practical actionable advice.";
        } 
        else if (finalPrompt.includes("calm my anxiety") || finalPrompt.includes("reduce anxiety")) {
            finalPrompt = "Provide immediate anxiety relief techniques and calming exercises. Include breathing techniques, grounding exercises, and quick coping strategies for anxiety attacks.";
        } 
        else if (finalPrompt.includes("mental wellness routine")) {
            finalPrompt = "Suggest a comprehensive daily mental wellness routine including morning, afternoon and evening practices for mental health. Include specific activities and their benefits.";
        } 
        else if (finalPrompt.includes("self-care activities")) {
            finalPrompt = "Recommend specific self-care activities that can be done today. Include both quick 5-minute activities and longer self-care practices with step-by-step guidance.";
        }
        // Crisis check first - before anything else
        const crisisStatus = checkForCrisis(finalPrompt);
        if (crisisStatus === "CRISIS_ALERT") {
            const crisisResponse = `
                <div class="crisis-alert">
                    <h3>🚨 Immediate Support Needed</h3>
                    <p>I'm really concerned about what you're saying. Please know that your life is precious and help is available right now:</p>
                    <div class="emergency-contacts">
                        <p><b>• Vandrevala Foundation:</b> 1860-2662-345 (24/7)</p>
                        <p><b>• iCall:</b> 9152987821 (10AM-8PM)</p>
                        <p><b>• Kiran Helpline:</b> 1800-599-0019 (24/7)</p>
                        <p><b>• Emergency:</b> 112 or 1098 (Childline)</p>
                    </div>
                    <p>Please reach out to these resources immediately. You don't have to go through this alone.</p>
                </div>
            `;
            
            // Add user message to history
            const userMessage = {
                type: 'user',
                text: prompt !== undefined ? prompt : input,
                image: imageFile ? URL.createObjectURL(imageFile) : null,
                timestamp: new Date().toLocaleTimeString()
            };
            
            // Add AI response to history
            const aiResponse = {
                type: 'ai',
                text: crisisResponse,
                timestamp: new Date().toLocaleTimeString()
            };
            
            setPrevPrompts(prev => [...prev, userMessage, aiResponse]);
            setResultData(crisisResponse);
            setLoading(false);
            setShowResult(true);
            return;
        }
        
        if (crisisStatus === "URGENT_SUPPORT") {
            const urgentResponse = `
                <div class="urgent-support">
                    <h3>💙 I'm Here for You</h3>
                    <p>It sounds like you're going through a really tough time. Please consider reaching out to these resources:</p>
                    <div class="support-contacts">
                        <p><b>• Vandrevala Foundation:</b> 1860-2662-345</p>
                        <p><b>• YourDOST:</b> Available on app</p>
                        <p><b>• TalktoAngel:</b> Online counseling</p>
                    </div>
                    <p>Remember, it's okay to ask for help. I'm here to listen too.</p>
                </div>
            `;
            
            // Add user message to history
            const userMessage = {
                type: 'user',
                text: prompt !== undefined ? prompt : input,
                image: imageFile ? URL.createObjectURL(imageFile) : null,
                timestamp: new Date().toLocaleTimeString()
            };
            
            // Add AI response to history
            const aiResponse = {
                type: 'ai',
                text: urgentResponse,
                timestamp: new Date().toLocaleTimeString()
            };
            
            setPrevPrompts(prev => [...prev, userMessage, aiResponse]);
            setResultData(urgentResponse);
            setLoading(false);
            setShowResult(true);
            return;
        }

        // Normal processing for non-crisis messages
        setResultData("")
        setLoading(true)
        setShowResult(true)

        setRecentPrompt(prompt !== undefined ? prompt : input);
        
        setRecentPrompt({
            text: prompt !== undefined ? prompt : input,
            image: imageFile ? URL.createObjectURL(imageFile) : null
        });
        // Add user message to history
        const userMessage = {
            type: 'user',
            text: prompt !== undefined ? prompt : input,
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            timestamp: new Date().toLocaleTimeString()
        };
        setPrevPrompts(prev => [...prev, userMessage]);
        
        let response;
        try {
            const conversationHistory = prevPrompts.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            if (prompt !== undefined ? prompt : input) {
                setInput(finalPrompt, conversationHistory);
                
            }
            
            let response;
            if (prompt !== undefined) {
                response = await runChatWithOptionalImage(finalPrompt, imageFile, conversationHistory);
            }
            else {
                response = await runChatWithOptionalImage(finalPrompt, imageFile, conversationHistory);
            }

            // Add AI response to history
            const aiResponse = {
                type: 'ai',
                text: response,
                timestamp: new Date().toLocaleTimeString()
            };
            setPrevPrompts(prev => [...prev, aiResponse]);

            let responseArray = response.split('**');
            let newArray = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newArray += responseArray[i]
                }
                else {
                    newArray += "<b>" + responseArray[i] + "</b>"
                }
            }
            responseArray = newArray.split('*').join("</br>").split(" ");
            for (let i = 0; i < responseArray.length; i++) {
                const nextWord = responseArray[i];
                delayPara(i, nextWord + " ")
            }
        } catch (error) {
            console.error("Error:", error);
            const errorResponse = "Sorry, there was an error processing your request. Please try again.";
            
            // Add error response to history
            const aiResponse = {
                type: 'ai',
                text: errorResponse,
                timestamp: new Date().toLocaleTimeString()
            };
            setPrevPrompts(prev => [...prev, aiResponse]);
            
            setResultData(errorResponse);
        }
        
        setLoading(false);
        setInput("")
        setSentImage(null);
    }

    const newChat = async () => {
        setLoading(false);
        setShowResult(false);
        setPrevPrompts([]); // Clear conversation history
        setSentImage(null);
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        sentImage,
        setSentImage
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;