import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  console.log("ChatPage rendered");
  const { logout } = useAuthStore();

  return (
    <div className='relative w-full max-w-6xl h-[700px]'>
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
          {/* <ProfileHeader />
          <ActiveTabSwitch /> */}

          <div className='flex-1 overflow-y-auto p-4 space-y-2'>
            {/* {activeTab === "chats" ? <ChatsList /> : <ContactList />} */}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
          {/* {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />} */}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default ChatPage;
