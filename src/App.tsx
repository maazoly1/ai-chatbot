import ChatBot from 'react-chatbotify';
import closeIcon from '@/assets/closeIcon.png';
import chatIcon from '@/assets/chatIcon.png';
import useGeminiAi from '@/hooks/useGeminiAi';

const stylingOptions = {
  theme: { 
    embedded: false,
  },
  chatHistory: { storageKey: "example_real_time_stream" }, botBubble: { simStream: true }, 
  tooltip: {
    mode: "CLOSE",
    text: "Talk to me! 😊",
  },
  chatButtonStyle: {
    fontSize: '0.5rem',
    backgroundSize: '50%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 50%',
    backgroundImage: `url(${chatIcon})`,
  },
  chatInput: {
    allowNewline: true,
    showCharacterCount: true,
    characterLimit: 144,
  },
  header: { 
    title: 'Ai ChatBot', closeChatIcon: closeIcon,
  }
}

function App() {
  // Ai ChatBot
  const { flow } = useGeminiAi();

  return (
      <ChatBot 
        options={stylingOptions}
        flow={flow} 
      />
  )
}

export default App