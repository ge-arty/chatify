import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className='  relative flex gap-2 p-2 mx-2'>
      <div
        className={`absolute top-2 bottom-2 bg-cyan-500/20 rounded-lg transition-all duration-300 ease-out ${
          activeTab === "chats"
            ? "left-2 right-[calc(50%+4px)]"
            : "left-[calc(50%+4px)] right-2"
        }`}
      />

      <button
        onClick={() => setActiveTab("chats")}
        className={`cursor-pointer relative z-10 flex-1 py-2 rounded-lg font-medium transition-colors duration-300 ${
          activeTab === "chats"
            ? "text-cyan-400"
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`cursor-pointer relative z-10 flex-1 py-2 rounded-lg font-medium transition-colors duration-300 ${
          activeTab === "contacts"
            ? "text-cyan-400"
            : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
